using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using System.Threading;
using System.Threading.Tasks;
using FluentAssertions;
using Moq;
using NUnit.Framework; // Changed from Xunit
using User.Auth.Core.DTOs;
using User.Auth.Core.Entities;
using User.Auth.Core.Interfaces;
using User.Auth.Core.Services;

namespace User.Auth.Core.Tests.Services
{
    [TestFixture] // NUnit class marker
    public class PlanServiceTests
    {
        private Mock<IPlanRepository> _mockRepo;
        private PlanService _service;

        [SetUp] // NUnit equivalent of a constructor for setup
        public void SetUp()
        {
            _mockRepo = new Mock<IPlanRepository>();
            _service = new PlanService(_mockRepo.Object);
        }

        [Test] // Replaces [Fact]
        public async Task CreatePlanAsync_ShouldReturnPlanResponseDto_WhenNameIsUnique()
        {
            // Arrange
            var email = "test@example.com";

            using var doc = JsonDocument.Parse("{}");
            var dto = new PlanCreateDto("Retirement Plan", "Desc", doc.RootElement, doc.RootElement);

            _mockRepo.Setup(r => r.GetAllPlanNamesByUserAsync(email, It.IsAny<CancellationToken>()))
                     .ReturnsAsync(new List<string>());

            var savedPlan = new Plan { Id = Guid.NewGuid(), UserEmail = email, Name = "Retirement Plan" };
            
            // Fix: AddAsync returns Task<Plan>
            _mockRepo.Setup(r => r.AddAsync(It.IsAny<Plan>(), It.IsAny<CancellationToken>()))
                     .ReturnsAsync(savedPlan);

            // Act
            var result = await _service.CreatePlanAsync(email, dto);

            // Assert
            result.Should().NotBeNull();
            result.Name.Should().Be("Retirement Plan");
            _mockRepo.Verify(r => r.AddAsync(It.Is<Plan>(p => p.Name == "Retirement Plan"), It.IsAny<CancellationToken>()), Times.Once);
        }

        [Test]
        public async Task CreatePlanAsync_ShouldAppendVersion2_WhenNameAlreadyExists()
        {
            // Arrange
            var email = "test@example.com";
            var baseName = "Retirement Plan";

            using var doc = JsonDocument.Parse("{}");
            var dto = new PlanCreateDto(baseName, "Desc", doc.RootElement, doc.RootElement);

            _mockRepo.Setup(r => r.GetAllPlanNamesByUserAsync(email, It.IsAny<CancellationToken>()))
                     .ReturnsAsync(new List<string> { baseName });

            _mockRepo.Setup(r => r.AddAsync(It.IsAny<Plan>(), It.IsAny<CancellationToken>()))
                     .ReturnsAsync((Plan p, CancellationToken ct) => p);

            // Act
            var result = await _service.CreatePlanAsync(email, dto);

            // Assert
            result.Name.Should().Be("Retirement Plan (version 2)");
            _mockRepo.Verify(r => r.AddAsync(It.Is<Plan>(p => p.Name == "Retirement Plan (version 2)"), It.IsAny<CancellationToken>()), Times.Once);
        }

        [Test]
        public async Task CreatePlanAsync_ShouldAppendNextVersion_WhenMultipleVersionsExist()
        {
            // Arrange
            var email = "test@example.com";
            var baseName = "Retirement Plan";

            using var doc = JsonDocument.Parse("{}");
            var dto = new PlanCreateDto(baseName, "Desc", doc.RootElement, doc.RootElement);

            var existingNames = new List<string>
            {
                "Retirement Plan",
                "Retirement Plan (version 2)",
                "Retirement Plan (version 4)"
            };

            _mockRepo.Setup(r => r.GetAllPlanNamesByUserAsync(email, It.IsAny<CancellationToken>()))
                     .ReturnsAsync(existingNames);

            _mockRepo.Setup(r => r.AddAsync(It.IsAny<Plan>(), It.IsAny<CancellationToken>()))
                     .ReturnsAsync((Plan p, CancellationToken ct) => p);

            // Act
            var result = await _service.CreatePlanAsync(email, dto);

            // Assert
            result.Name.Should().Be("Retirement Plan (version 5)");
            _mockRepo.Verify(r => r.AddAsync(It.Is<Plan>(p => p.Name == "Retirement Plan (version 5)"), It.IsAny<CancellationToken>()), Times.Once);
        }

        [Test]
        public async Task GetUserPlansAsync_ShouldReturnEmptyList_WhenNoPlansExist()
        {
            // Arrange
            var email = "test@example.com";
            _mockRepo.Setup(r => r.GetAllByUserAsync(email, It.IsAny<CancellationToken>()))
                     .ReturnsAsync(new List<Plan>());

            // Act
            var result = await _service.GetUserPlansAsync(email);

            // Assert
            result.Should().BeEmpty();
        }

        [Test]
        public async Task GetUserPlansAsync_ShouldReturnMappedDtos_WhenPlansExist()
        {
            // Arrange
            var email = "test@example.com";
            var plan1Id = Guid.NewGuid();
            var existingPlans = new List<Plan>
            {
                new Plan { Id = plan1Id, UserEmail = email, Name = "Plan One" },
                new Plan { Id = Guid.NewGuid(), UserEmail = email, Name = "Plan Two" }
            };

            _mockRepo.Setup(r => r.GetAllByUserAsync(email, It.IsAny<CancellationToken>()))
                     .ReturnsAsync(existingPlans);

            // Act
            var result = await _service.GetUserPlansAsync(email);

            // Assert
            result.Should().HaveCount(2);
            result.First().Id.Should().Be(plan1Id);
        }

        [Test]
        public async Task GetPlanAsync_ShouldReturnMappedDto_WhenPlanExists()
        {
            // Arrange
            var email = "test@example.com";
            var planId = Guid.NewGuid();
            using var doc = JsonDocument.Parse("{\"key\":\"value\"}");

            var plan = new Plan { Id = planId, UserEmail = email, Name = "Specific Plan", Data = doc };

            _mockRepo.Setup(r => r.GetByIdAsync(planId, email, false, It.IsAny<CancellationToken>()))
                     .ReturnsAsync(plan);

            // Act
            var result = await _service.GetPlanAsync(email, planId);

            // Assert
            result.Should().NotBeNull();
            result!.Name.Should().Be("Specific Plan");
        }

        [Test]
        public async Task GetPlanAsync_ShouldReturnNull_WhenPlanDoesNotExist()
        {
            // Arrange
            var email = "test@example.com";
            var planId = Guid.NewGuid();
            _mockRepo.Setup(r => r.GetByIdAsync(planId, email, false, It.IsAny<CancellationToken>()))
                     .ReturnsAsync((Plan?)null);

            // Act
            var result = await _service.GetPlanAsync(email, planId);

            // Assert
            result.Should().BeNull();
        }

        [Test]
        public async Task UpdatePlanAsync_ShouldUpdateAllFields_WhenAllProvided()
        {
            // Arrange
            var email = "test@example.com";
            var planId = Guid.NewGuid();
            var existingPlan = new Plan { Id = planId, UserEmail = email, Name = "Old" };

            using var dataDoc = JsonDocument.Parse("{\"new\":\"data\"}");
            var updates = new PlanUpdateDto("New", "Desc", dataDoc.RootElement, dataDoc.RootElement);

            _mockRepo.Setup(r => r.GetByIdAsync(planId, email, true, It.IsAny<CancellationToken>()))
                     .ReturnsAsync(existingPlan);
            _mockRepo.Setup(r => r.UpdateAsync(It.IsAny<Plan>(), It.IsAny<CancellationToken>()))
                     .Returns(Task.CompletedTask);

            // Act
            var result = await _service.UpdatePlanAsync(email, planId, updates);

            // Assert
            result!.Name.Should().Be("New");
            _mockRepo.Verify(r => r.UpdateAsync(It.Is<Plan>(p => p.Name == "New"), It.IsAny<CancellationToken>()), Times.Once);
        }

         [Test]
        public async Task UpdatePlanAsync_ShouldUpdateOnlyName_WhenOtherFieldsAreNull()
        {
            // Arrange
            var email = "test@example.com";
            var planId = Guid.NewGuid();
            var existingPlan = new Plan 
            { 
                Id = planId, 
                UserEmail = email, 
                Name = "Original Name", 
                Description = "Keep this" 
            };

            // DTO with only a new name
            var updates = new PlanUpdateDto("Renamed Plan", null, null, null);

            _mockRepo.Setup(r => r.GetByIdAsync(planId, email, true, It.IsAny<CancellationToken>()))
                     .ReturnsAsync(existingPlan);

            // Act
            var result = await _service.UpdatePlanAsync(email, planId, updates);

            // Assert
            result!.Name.Should().Be("Renamed Plan");
            result.Description.Should().Be("Keep this"); // Verify other data stayed intact
        }

        [Test]
        public async Task UpdatePlanAsync_ShouldReturnNull_WhenPlanNotFound()
        {
            // Arrange
            var email = "test@example.com";
            var planId = Guid.NewGuid();
            var updates = new PlanUpdateDto("New Name", null, null, null);

            _mockRepo.Setup(r => r.GetByIdAsync(planId, email, true, It.IsAny<CancellationToken>()))
                     .ReturnsAsync((Plan?)null);

            // Act
            var result = await _service.UpdatePlanAsync(email, planId, updates);

            // Assert
            result.Should().BeNull();
            _mockRepo.Verify(r => r.UpdateAsync(It.IsAny<Plan>(), It.IsAny<CancellationToken>()), Times.Never);
        }

        [Test]
        public async Task UpdatePlanAsync_ShouldRefreshUpdatedAtTimestamp()
        {
            // Arrange
            var email = "test@example.com";
            var planId = Guid.NewGuid();
            var longAgo = DateTime.UtcNow.AddYears(-1);
            var existingPlan = new Plan { Id = planId, UserEmail = email, UpdatedAt = longAgo };

            _mockRepo.Setup(r => r.GetByIdAsync(planId, email, true, It.IsAny<CancellationToken>()))
                     .ReturnsAsync(existingPlan);

            // Act
            var result = await _service.UpdatePlanAsync(email, planId, new PlanUpdateDto("New", null, null, null));

            // Assert
            result!.UpdatedAt.Should().BeAfter(longAgo);
        }

        [Test]
        public async Task DeletePlanAsync_ShouldReturnTrue_WhenPlanExists()
        {
            // Arrange
            var email = "test@example.com";
            var planId = Guid.NewGuid();
            var existingPlan = new Plan { Id = planId, UserEmail = email };

            _mockRepo.Setup(r => r.GetByIdAsync(planId, email, true, It.IsAny<CancellationToken>()))
                     .ReturnsAsync(existingPlan);
            _mockRepo.Setup(r => r.DeleteAsync(It.IsAny<Plan>(), It.IsAny<CancellationToken>()))
                     .Returns(Task.CompletedTask);

            // Act
            var result = await _service.DeletePlanAsync(email, planId);

            // Assert
            result.Should().BeTrue();
            _mockRepo.Verify(r => r.DeleteAsync(existingPlan, It.IsAny<CancellationToken>()), Times.Once);
        }

        [Test]
        public async Task DeletePlanAsync_ShouldThrowException_WhenRepositoryFails()
        {
            // Arrange
            var email = "test@example.com";
            var planId = Guid.NewGuid();
            var existingPlan = new Plan { Id = planId, UserEmail = email };

            _mockRepo.Setup(r => r.GetByIdAsync(planId, email, true, It.IsAny<CancellationToken>()))
                     .ReturnsAsync(existingPlan);
            _mockRepo.Setup(r => r.DeleteAsync(existingPlan, It.IsAny<CancellationToken>()))
                     .ThrowsAsync(new Exception("Database Error"));

            // Act
            AsyncTestDelegate act = async () => await _service.DeletePlanAsync(email, planId);

            // Assert (NUnit Style)
            Assert.ThrowsAsync<Exception>(act);
        }
    }
}