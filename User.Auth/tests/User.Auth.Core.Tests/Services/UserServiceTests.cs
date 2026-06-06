using System;
using System.Threading;
using System.Threading.Tasks;
using FluentAssertions;
using Microsoft.Extensions.Configuration;
using Moq;
using NUnit.Framework;
using User.Auth.Core.DTOs;
using User.Auth.Core.Interfaces;
using User.Auth.Core.Services;

namespace User.Auth.Core.Tests.Services
{
    [TestFixture]
    public class UserServiceTests
    {
        private Mock<IUserRepository> _mockRepo = null!;
        private Mock<IConfiguration> _mockConfig = null!;
        private UserService _service = null!;

        [SetUp]
        public void SetUp()
        {
            _mockRepo = new Mock<IUserRepository>();
            _mockConfig = new Mock<IConfiguration>();

            var mockJwtSection = new Mock<IConfigurationSection>();
            mockJwtSection.Setup(s => s["SecretKey"]).Returns("SuperSecretKey123_WithEnoughLength_ToValidateSuccessfully!");
            mockJwtSection.Setup(s => s["Issuer"]).Returns("Issuer");
            mockJwtSection.Setup(s => s["Audience"]).Returns("Audience");

            _mockConfig.Setup(c => c.GetSection("JwtSettings")).Returns(mockJwtSection.Object);

            _service = new UserService(_mockRepo.Object, _mockConfig.Object);
        }

        [Test]
        public async Task SignUpAsync_ShouldThrowException_WhenEmailRegistered()
        {
            var dto = new UserAuthDto("test@example.com", "pass", "A B");
            _mockRepo.Setup(r => r.GetUserByEmailAsync(dto.Email, It.IsAny<CancellationToken>()))
                     .ReturnsAsync(new Entities.User { Email = dto.Email, Name = "A B", HashedPassword = "H" });

            var act = () => _service.SignUpAsync(dto);

            await act.Should().ThrowAsync<Exception>().WithMessage("Email already registered");
        }

        [Test]
        public async Task SignUpAsync_ShouldAddUser_WhenEmailUnique()
        {
            var dto = new UserAuthDto("test@example.com", "pass", "A B");

            _mockRepo.Setup(r => r.GetUserByEmailAsync(dto.Email, It.IsAny<CancellationToken>()))
                     .ReturnsAsync((Entities.User?)null);

            _mockRepo.Setup(r => r.AddUserAsync(It.IsAny<Entities.User>(), It.IsAny<CancellationToken>()))
                     .ReturnsAsync((Entities.User u, CancellationToken ct) => u);

            var result = await _service.SignUpAsync(dto);

            result.Should().NotBeNull();
            result.Email.Should().Be(dto.Email);
            result.Name.Should().Be("A B");
            _mockRepo.Verify(r => r.AddUserAsync(It.IsAny<Entities.User>(), It.IsAny<CancellationToken>()), Times.Once);
        }

        [Test]
        public async Task SignInAsync_ShouldReturnNull_WhenUserNotFound()
        {
            var dto = new UserAuthDto("test@example.com", "pass", null);
            _mockRepo.Setup(r => r.GetUserByEmailAsync(dto.Email, It.IsAny<CancellationToken>()))
                     .ReturnsAsync((Entities.User?)null);

            var result = await _service.SignInAsync(dto);

            result.Should().BeNull();
        }

        [Test]
        public async Task SignInAsync_ShouldReturnNull_WhenPasswordInvalid()
        {
            var dto = new UserAuthDto("test@example.com", "wrong_pass", null);
            var hashed = BCrypt.Net.BCrypt.HashPassword("correct_pass");
            _mockRepo.Setup(r => r.GetUserByEmailAsync(dto.Email, It.IsAny<CancellationToken>()))
                     .ReturnsAsync(new Entities.User { Email = dto.Email, Name = "A B", HashedPassword = hashed });

            var result = await _service.SignInAsync(dto);

            result.Should().BeNull();
        }

        [Test]
        public async Task SignInAsync_ShouldReturnTokens_WhenCredentialsCorrect()
        {
            var dto = new UserAuthDto("test@example.com", "pass", null);
            var hashed = BCrypt.Net.BCrypt.HashPassword("pass");
            _mockRepo.Setup(r => r.GetUserByEmailAsync(dto.Email, It.IsAny<CancellationToken>()))
                     .ReturnsAsync(new Entities.User { Email = dto.Email, Name = "A B", HashedPassword = hashed });

            var result = await _service.SignInAsync(dto);

            result.Should().NotBeNull();
            result!.Token.Should().NotBeEmpty();
        }

        [Test]
        public async Task GetUserProfileAsync_ShouldReturnProfile_WhenUserExists()
        {
            var email = "test@example.com";
            var profile = new UserProfileDto(email, "First Last");
            _mockRepo.Setup(r => r.GetUserProfileByEmailAsync(email, It.IsAny<CancellationToken>()))
                     .ReturnsAsync(profile);

            var result = await _service.GetUserProfileAsync(email);

            result.Should().NotBeNull();
            result.Should().BeEquivalentTo(profile);
        }

        [Test]
        public async Task GetUserProfileAsync_ShouldReturnNull_WhenUserDoesNotExist()
        {
            var email = "nonexistent@example.com";
            _mockRepo.Setup(r => r.GetUserProfileByEmailAsync(email, It.IsAny<CancellationToken>()))
                     .ReturnsAsync((UserProfileDto?)null);

            var result = await _service.GetUserProfileAsync(email);

            result.Should().BeNull();
        }

        [Test]
        public async Task UpdateUserProfileAsync_ShouldReturnNull_WhenUserDoesNotExist()
        {
            var email = "nonexistent@example.com";
            var updates = new UserUpdateDto(null, "New Name", null);

            _mockRepo.Setup(r => r.GetUserByEmailAsync(email, It.IsAny<CancellationToken>()))
                     .ReturnsAsync((Entities.User?)null);

            var result = await _service.UpdateUserProfileAsync(email, updates);

            result.Should().BeNull();
            _mockRepo.Verify(r => r.UpdateUserAsync(It.IsAny<Entities.User>(), It.IsAny<CancellationToken>()), Times.Never);
        }

        [Test]
        public async Task UpdateUserProfileAsync_ShouldHashNewPassword_WhenProvided()
        {
            var email = "test@example.com";
            var updates = new UserUpdateDto(null, null, "NewSecurePassword123!");
            var dbUser = new Entities.User
            {
                Email = email,
                Name = "A B",
                HashedPassword = "old_hash"
            };

            _mockRepo.Setup(r => r.GetUserByEmailAsync(email, It.IsAny<CancellationToken>()))
                     .ReturnsAsync(dbUser);

            await _service.UpdateUserProfileAsync(email, updates);

            dbUser.HashedPassword.Should().NotBe("old_hash");
            dbUser.HashedPassword.Should().NotBe("NewSecurePassword123!");
            BCrypt.Net.BCrypt.Verify("NewSecurePassword123!", dbUser.HashedPassword).Should().BeTrue();
        }

        [Test]
        public async Task UpdateUserProfileAsync_ShouldThrowException_WhenNewEmailIsTaken()
        {
            var oldEmail = "old@example.com";
            var takenEmail = "taken@example.com";
            var updates = new UserUpdateDto(takenEmail, null, null);

            var dbUser = new Entities.User { Email = oldEmail, Name = "A B", HashedPassword = "H" };

            _mockRepo.Setup(r => r.GetUserByEmailAsync(oldEmail, It.IsAny<CancellationToken>()))
                     .ReturnsAsync(dbUser);

            _mockRepo.Setup(r => r.GetUserByEmailAsync(takenEmail, It.IsAny<CancellationToken>()))
                     .ReturnsAsync(new Entities.User { Email = takenEmail, Name = "Other User", HashedPassword = "H2" });

            var act = () => _service.UpdateUserProfileAsync(oldEmail, updates);

            await act.Should().ThrowAsync<Exception>().WithMessage("Email already in use");
        }

        [Test]
        public async Task UpdateUserProfileAsync_ShouldCorrectlyUpdateEmail_WhenNotTaken()
        {
            var oldEmail = "old@example.com";
            var newEmail = "new@example.com";
            var updates = new UserUpdateDto(newEmail, null, null);
            var dbUser = new Entities.User { Email = oldEmail, Name = "A B", HashedPassword = "H" };

            _mockRepo.Setup(r => r.GetUserByEmailAsync(oldEmail, It.IsAny<CancellationToken>()))
                     .ReturnsAsync(dbUser);

            _mockRepo.Setup(r => r.GetUserByEmailAsync(newEmail, It.IsAny<CancellationToken>()))
                     .ReturnsAsync((Entities.User?)null);

            var result = await _service.UpdateUserProfileAsync(oldEmail, updates);

            result!.UpdatedEmail.Should().Be(newEmail);
            dbUser.Email.Should().Be(newEmail);
        }
    }
}