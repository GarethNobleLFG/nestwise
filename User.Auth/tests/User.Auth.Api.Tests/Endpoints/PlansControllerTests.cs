using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading;
using System.Threading.Tasks;
using FluentAssertions;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Moq;
using NUnit.Framework; 
using User.Auth.Api.Controllers;
using User.Auth.Core.DTOs;
using User.Auth.Core.Interfaces;
using System.Text.Json;

namespace User.Auth.Api.Tests.Endpoints
{
    [TestFixture]
    public class PlansControllerTests
    {
        private Mock<IPlanService> _mockService;
        private PlansController _controller;
        private readonly string _testEmail = "test@example.com";

        [SetUp]
        public void SetUp()
        {
            _mockService = new Mock<IPlanService>();
            _controller = new PlansController(_mockService.Object);

            // Mock the User Claims context
            var user = new ClaimsPrincipal(new ClaimsIdentity(new Claim[]
            {
                new Claim(ClaimTypes.Email, _testEmail)
            }, "mock"));

            _controller.ControllerContext = new ControllerContext
            {
                HttpContext = new DefaultHttpContext { User = user }
            };
        }

        [Test]
        public async Task CreatePlan_ShouldThrowUnauthorizedAccessException_WhenEmailClaimIsMissing()
        {
            // Arrange
            var anonymousUser = new ClaimsPrincipal(new ClaimsIdentity());
            _controller.ControllerContext.HttpContext.User = anonymousUser;
            var createDto = new PlanCreateDto("Private Plan", "Desc", default, default);

            // Act
            var act = () => _controller.CreatePlan(createDto);

            // Assert
            await act.Should().ThrowAsync<UnauthorizedAccessException>();
        }

        [Test]
        public async Task CreatePlan_ShouldHandleComplexJsonData_WhenProvided()
        {
            // Arrange: Create actual JSON elements to simulate complex plan data
            using var dataDoc = JsonDocument.Parse("{\"retirementAge\": 65, \"savings\": 100000}");
            using var profileDoc = JsonDocument.Parse("{\"riskTolerance\": \"High\"}");

            var createDto = new PlanCreateDto("Complex Data Plan", "Desc", dataDoc.RootElement, profileDoc.RootElement);
            var responseDto = new PlanResponseDto(
                Guid.NewGuid(), _testEmail, createDto.Name, createDto.Description,
                dataDoc.RootElement, profileDoc.RootElement,
                DateTime.UtcNow, DateTime.UtcNow);

            _mockService.Setup(s => s.CreatePlanAsync(_testEmail, createDto, It.IsAny<CancellationToken>()))
                        .ReturnsAsync(responseDto);

            // Act
            var result = await _controller.CreatePlan(createDto);

            // Assert
            var createdResult = result.Result as CreatedAtActionResult;
            createdResult.Should().NotBeNull();
            var value = (PlanResponseDto)createdResult!.Value!;

            // Use .Value to access the JsonElement from the Nullable wrapper
            value.Data.Should().NotBeNull();
            value.Data!.Value.GetProperty("retirementAge").GetInt32().Should().Be(65);

            value.ProfileData.Should().NotBeNull();
            value.ProfileData!.Value.GetProperty("riskTolerance").GetString().Should().Be("High");
        }

        [Test]
        public async Task CreatePlan_ShouldPropagateException_WhenServiceThrows()
        {
            // Arrange
            var createDto = new PlanCreateDto("Failing Plan", "Desc", default, default);
            _mockService.Setup(s => s.CreatePlanAsync(It.IsAny<string>(), It.IsAny<PlanCreateDto>(), It.IsAny<CancellationToken>()))
                        .ThrowsAsync(new System.Exception("Critical Failure"));

            // Act
            var act = () => _controller.CreatePlan(createDto);

            // Assert
            await act.Should().ThrowAsync<Exception>().WithMessage("Critical Failure");
        }

        [Test]
        public async Task ListPlans_ShouldReturnOk_WithPlans_WhenTheyExist()
        {
            // Arrange
            var mockPlans = new List<PlanListItemDto>
            {
                new PlanListItemDto(Guid.NewGuid(), "Plan 1"),
                new PlanListItemDto(Guid.NewGuid(), "Plan 2")
            };

            _mockService.Setup(s => s.GetUserPlansAsync(_testEmail, It.IsAny<CancellationToken>()))
                        .ReturnsAsync(mockPlans);

            // Act
            var result = await _controller.ListPlans(CancellationToken.None);

            // Assert
            var okResult = result.Result as OkObjectResult;
            okResult.Should().NotBeNull();
            var returnValue = okResult!.Value as IEnumerable<PlanListItemDto>;
            returnValue.Should().HaveCount(2);
        }

        [Test]
        public async Task ListPlans_ShouldReturnOk_WithEmptyList_WhenNoneExist()
        {
            // Arrange
            _mockService.Setup(s => s.GetUserPlansAsync(_testEmail, It.IsAny<CancellationToken>()))
                        .ReturnsAsync(new List<PlanListItemDto>());

            // Act
            var result = await _controller.ListPlans(CancellationToken.None);

            // Assert
            var okResult = result.Result as OkObjectResult;
            okResult.Should().NotBeNull();
            var returnValue = okResult!.Value as IEnumerable<PlanListItemDto>;
            returnValue.Should().BeEmpty();
        }

        [Test]
        public async Task GetPlan_ShouldReturnOk_WhenPlanExists()
        {
            // Arrange
            var planId = Guid.NewGuid();
            var responseDto = new PlanResponseDto(planId, _testEmail, "Plan", "Desc", default, default, DateTime.UtcNow, DateTime.UtcNow);

            _mockService.Setup(s => s.GetPlanAsync(_testEmail, planId, It.IsAny<CancellationToken>()))
                        .ReturnsAsync(responseDto);

            // Act
            var result = await _controller.GetPlan(planId);

            // Assert
            var okResult = result.Result as OkObjectResult;
            okResult!.StatusCode.Should().Be(200);
            okResult.Value.Should().BeEquivalentTo(responseDto);
        }

        [Test]
        public async Task GetPlan_ShouldReturnNotFound_WhenPlanDoesNotExist()
        {
            // Arrange
            var planId = Guid.NewGuid();
            _mockService.Setup(s => s.GetPlanAsync(_testEmail, planId, It.IsAny<CancellationToken>()))
                        .ReturnsAsync((PlanResponseDto?)null);

            // Act
            var result = await _controller.GetPlan(planId);

            // Assert
            var notFoundResult = result.Result as NotFoundObjectResult;
            notFoundResult.Should().NotBeNull();
            notFoundResult!.Value.Should().Be("Plan not found");
        }

        [Test]
        public async Task UpdatePlan_ShouldReturnOk_WhenUpdateSuccessful()
        {
            // Arrange
            var planId = Guid.NewGuid();
            var updateDto = new PlanUpdateDto("Updated", null, null, null);
            var responseDto = new PlanResponseDto(planId, _testEmail, "Updated", "Desc", default, default, DateTime.UtcNow, DateTime.UtcNow);

            _mockService.Setup(s => s.UpdatePlanAsync(_testEmail, planId, updateDto, It.IsAny<CancellationToken>()))
                        .ReturnsAsync(responseDto);

            // Act
            var result = await _controller.UpdatePlan(planId, updateDto);

            // Assert
            var okResult = result.Result as OkObjectResult;
            okResult.Should().NotBeNull();
            okResult!.Value.Should().BeEquivalentTo(responseDto);
        }

        [Test]
        public async Task UpdatePlan_ShouldReturnNotFound_WhenPlanMissing()
        {
            // Arrange
            var planId = Guid.NewGuid();
            var updateDto = new PlanUpdateDto("Updated", null, null, null);

            _mockService.Setup(s => s.UpdatePlanAsync(_testEmail, planId, updateDto, It.IsAny<CancellationToken>()))
                        .ReturnsAsync((PlanResponseDto?)null);

            // Act
            var result = await _controller.UpdatePlan(planId, updateDto);

            // Assert
            result.Result.Should().BeOfType<NotFoundObjectResult>();
        }

                [Test]
        public async Task UpdatePlan_ShouldThrowUnauthorizedAccessException_WhenEmailClaimIsMissing()
        {
            // Arrange
            var anonymousUser = new ClaimsPrincipal(new ClaimsIdentity());
            _controller.ControllerContext.HttpContext.User = anonymousUser;
            var updateDto = new PlanUpdateDto("Title", null, null, null);

            // Act
            var act = () => _controller.UpdatePlan(Guid.NewGuid(), updateDto);

            // Assert
            await act.Should().ThrowAsync<UnauthorizedAccessException>();
        }

        [Test]
        public async Task UpdatePlan_ShouldHandleComplexJsonUpdates_WhenProvided()
        {
            // Arrange
            var planId = Guid.NewGuid();
            using var newDataDoc = JsonDocument.Parse("{\"newField\": \"value\"}");
            
            // Only updating the Data field, others are null
            var updateDto = new PlanUpdateDto(null, null, newDataDoc.RootElement, null);
            
            var responseDto = new PlanResponseDto(
                planId, _testEmail, "Original Name", "Original Desc", 
                newDataDoc.RootElement, default, 
                DateTime.UtcNow, DateTime.UtcNow);

            _mockService.Setup(s => s.UpdatePlanAsync(_testEmail, planId, updateDto, It.IsAny<CancellationToken>()))
                        .ReturnsAsync(responseDto);

            // Act
            var result = await _controller.UpdatePlan(planId, updateDto);

            // Assert
            var okResult = result.Result as OkObjectResult;
            okResult.Should().NotBeNull();
            var value = (PlanResponseDto)okResult!.Value!;
            
            value.Data.Should().NotBeNull();
            value.Data!.Value.GetProperty("newField").GetString().Should().Be("value");
        }

        [Test]
        public async Task UpdatePlan_ShouldPropagateException_WhenServiceThrows()
        {
            // Arrange
            var planId = Guid.NewGuid();
            var updateDto = new PlanUpdateDto("Broken", null, null, null);
            _mockService.Setup(s => s.UpdatePlanAsync(It.IsAny<string>(), It.IsAny<Guid>(), It.IsAny<PlanUpdateDto>(), It.IsAny<CancellationToken>()))
                        .ThrowsAsync(new System.Exception("Database timeout"));

            // Act
            var act = () => _controller.UpdatePlan(planId, updateDto);

            // Assert
            await act.Should().ThrowAsync<Exception>().WithMessage("Database timeout");
        }

        [Test]
        public async Task DeletePlan_ShouldReturnNoContent_WhenSuccessful()
        {
            // Arrange
            var planId = Guid.NewGuid();
            _mockService.Setup(s => s.DeletePlanAsync(_testEmail, planId, It.IsAny<CancellationToken>()))
                        .ReturnsAsync(true);

            // Act
            var result = await _controller.DeletePlan(planId);

            // Assert
            result.Should().BeOfType<NoContentResult>();
        }

        [Test]
        public async Task DeletePlan_ShouldReturnNotFound_WhenPlanDoesNotExist()
        {
            // Arrange
            var planId = Guid.NewGuid();
            _mockService.Setup(s => s.DeletePlanAsync(_testEmail, planId, It.IsAny<CancellationToken>()))
                        .ReturnsAsync(false);

            // Act
            var result = await _controller.DeletePlan(planId);

            // Assert
            var notFoundResult = result as NotFoundObjectResult;
            notFoundResult.Should().NotBeNull();
            notFoundResult!.StatusCode.Should().Be(404);
        }
    }
}