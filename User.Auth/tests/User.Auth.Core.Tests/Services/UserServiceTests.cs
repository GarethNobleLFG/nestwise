using System;
using System.Threading;
using System.Threading.Tasks;
using FluentAssertions;
using Microsoft.Extensions.Configuration;
using Moq;
using NUnit.Framework; // Changed from Xunit
using User.Auth.Core.DTOs;
using User.Auth.Core.Entities;
using User.Auth.Core.Interfaces;
using User.Auth.Core.Services;

namespace User.Auth.Core.Tests.Services
{
    [TestFixture] // NUnit class marker
    public class UserServiceTests
    {
        private Mock<IUserRepository> _mockRepo;
        private Mock<IConfiguration> _mockConfig;
        private UserService _service;

        [SetUp] // NUnit equivalent of a constructor for setup
        public void SetUp()
        {
            _mockRepo = new Mock<IUserRepository>();
            _mockConfig = new Mock<IConfiguration>();

            var mockJwtSection = new Mock<IConfigurationSection>();
            mockJwtSection.Setup(s => s["SecretKey"]).Returns("SuperSecretKeyThatIsAtLeast32BytesLong!");
            mockJwtSection.Setup(s => s["Issuer"]).Returns("TestIssuer");
            mockJwtSection.Setup(s => s["Audience"]).Returns("TestAudience");
            _mockConfig.Setup(c => c.GetSection("JwtSettings")).Returns(mockJwtSection.Object);

            _service = new UserService(_mockRepo.Object, _mockConfig.Object);
        }

        [Test]
        public async Task SignUpAsync_ShouldReturnDto_WhenEmailIsUnique()
        {
            // Arrange
            var signUpDto = new UserAuthDto("newuser@example.com", "Password123!", "John", "Doe");

            _mockRepo.Setup(r => r.GetUserByEmailAsync("newuser@example.com", It.IsAny<CancellationToken>()))
                     .ReturnsAsync((Entities.User?)null);

            // NUnit/Moq fix: Return the user being added
            _mockRepo.Setup(r => r.AddUserAsync(It.IsAny<Entities.User>(), It.IsAny<CancellationToken>()))
                     .ReturnsAsync((Entities.User u, CancellationToken ct) => u);

            // Act
            var result = await _service.SignUpAsync(signUpDto);

            // Assert
            result.Should().NotBeNull();
            result.Email.Should().Be("newuser@example.com");

            _mockRepo.Verify(r => r.AddUserAsync(It.Is<Entities.User>(u =>
                u.Email == "newuser@example.com" &&
                u.FirstName == "John" &&
                u.HashedPassword != "Password123!"), It.IsAny<CancellationToken>()), Times.Once);
        }

        [Test]
        public async Task SignUpAsync_ShouldThrowException_WhenEmailAlreadyExists()
        {
            // Arrange
            var signUpDto = new UserAuthDto("existing@example.com", "Password123!", "Jane", "Doe");
            var existingUser = new Entities.User
            {
                Email = "existing@example.com",
                FirstName = "Jane",
                LastName = "Doe",
                HashedPassword = "already_hashed"
            };

            _mockRepo.Setup(r => r.GetUserByEmailAsync("existing@example.com", It.IsAny<CancellationToken>()))
                     .ReturnsAsync(existingUser);

            // Act
            AsyncTestDelegate act = async () => await _service.SignUpAsync(signUpDto);

            // Assert (NUnit Style)
            var ex = Assert.ThrowsAsync<Exception>(act);
            Assert.That(ex.Message, Is.EqualTo("Email already registered"));

            _mockRepo.Verify(r => r.AddUserAsync(It.IsAny<Entities.User>(), It.IsAny<CancellationToken>()), Times.Never);
        }

        [Test]
        public async Task SignUpAsync_ShouldHandleMissingNames_ByUsingEmptyStrings()
        {
            // Arrange
            var signUpDto = new UserAuthDto("minimal@example.com", "Password123!", null, null);

            _mockRepo.Setup(r => r.GetUserByEmailAsync("minimal@example.com", It.IsAny<CancellationToken>()))
                     .ReturnsAsync((Entities.User?)null);

            _mockRepo.Setup(r => r.AddUserAsync(It.IsAny<Entities.User>(), It.IsAny<CancellationToken>()))
                     .ReturnsAsync((Entities.User u, CancellationToken ct) => u);

            // Act
            await _service.SignUpAsync(signUpDto);

            // Assert
            _mockRepo.Verify(r => r.AddUserAsync(It.Is<Entities.User>(u =>
                u.FirstName == "" && u.LastName == ""), It.IsAny<CancellationToken>()), Times.Once);
        }

        [Test]
        public async Task SignInAsync_ShouldReturnToken_WhenCredentialsAreValid()
        {
            // Arrange
            var userDto = new UserAuthDto("test@example.com", "password123", null, null);

            var dbUser = new Entities.User
            {
                Email = "test@example.com",
                FirstName = "Test",
                LastName = "User",
                HashedPassword = BCrypt.Net.BCrypt.HashPassword("password123")
            };

            _mockRepo.Setup(r => r.GetUserByEmailAsync("test@example.com", It.IsAny<CancellationToken>()))
                     .ReturnsAsync(dbUser);

            // Act
            var result = await _service.SignInAsync(userDto);

            // Assert
            result.Should().NotBeNull();
            result!.Token.Should().NotBeEmpty();
        }

        [Test]
        [TestCase("wrong@example.com", "password123", false)]
        [TestCase("test@example.com", "wrongpassword", true)]
        public async Task SignInAsync_ShouldReturnNull_WhenCredentialsAreInvalid(string email, string password, bool userExists)
        {
            // Arrange
            var userDto = new UserAuthDto(email, password, null, null);

            Entities.User? dbUser = null;
            if (userExists)
            {
                dbUser = new Entities.User
                {
                    Email = "test@example.com",
                    FirstName = "Test",
                    LastName = "User",
                    HashedPassword = BCrypt.Net.BCrypt.HashPassword("correct_password_not_what_user_typed")
                };
            }

            // For ANY email that isn't setup, it should return null
            _mockRepo.Setup(r => r.GetUserByEmailAsync(It.IsAny<string>(), It.IsAny<CancellationToken>()))
                     .ReturnsAsync((Entities.User?)null);

            // Now specifically setup the one we want to return the user (if they exist)
            if (dbUser != null)
            {
                _mockRepo.Setup(r => r.GetUserByEmailAsync(email, It.IsAny<CancellationToken>()))
                         .ReturnsAsync(dbUser);
            }

            // Act
            var result = await _service.SignInAsync(userDto);

            // Assert
            result.Should().BeNull();
        }

        [Test]
        public async Task GetUserProfileAsync_ShouldReturnProfile_WhenUserExists()
        {
            // Arrange
            var email = "profile@example.com";
            var expectedProfile = new UserProfileDto(email, "John", "Doe");

            _mockRepo.Setup(r => r.GetUserProfileByEmailAsync(email, It.IsAny<CancellationToken>()))
                     .ReturnsAsync(expectedProfile);

            // Act
            var result = await _service.GetUserProfileAsync(email);

            // Assert
            result.Should().NotBeNull();
            result!.Email.Should().Be(email);
            result.FirstName.Should().Be("John");
            _mockRepo.Verify(r => r.GetUserProfileByEmailAsync(email, It.IsAny<CancellationToken>()), Times.Once);
        }

        [Test]
        public async Task GetUserProfileAsync_ShouldReturnNull_WhenUserDoesNotExist()
        {
            // Arrange
            var email = "missing@example.com";

            _mockRepo.Setup(r => r.GetUserProfileByEmailAsync(email, It.IsAny<CancellationToken>()))
                     .ReturnsAsync((UserProfileDto?)null);

            // Act
            var result = await _service.GetUserProfileAsync(email);

            // Assert
            result.Should().BeNull();
        }

        [Test]
        public async Task UpdateUserProfileAsync_ShouldReturnNull_WhenUserDoesNotExist()
        {
            // Arrange
            var email = "nonexistent@example.com";
            var updates = new UserUpdateDto(null, "New", "New", null);

            _mockRepo.Setup(r => r.GetUserByEmailAsync(email, It.IsAny<CancellationToken>()))
                     .ReturnsAsync((Entities.User?)null);

            // Act
            var result = await _service.UpdateUserProfileAsync(email, updates);

            // Assert
            result.Should().BeNull();
            _mockRepo.Verify(r => r.UpdateUserAsync(It.IsAny<Entities.User>(), It.IsAny<CancellationToken>()), Times.Never);
        }

        [Test]
        public async Task UpdateUserProfileAsync_ShouldHashNewPassword_WhenProvided()
        {
            // Arrange
            var email = "test@example.com";
            var updates = new UserUpdateDto(null, null, null, "NewSecurePassword123!");
            var dbUser = new Entities.User
            {
                Email = email,
                FirstName = "A",
                LastName = "B",
                HashedPassword = "old_hash"
            };

            _mockRepo.Setup(r => r.GetUserByEmailAsync(email, It.IsAny<CancellationToken>()))
                     .ReturnsAsync(dbUser);

            // Act
            await _service.UpdateUserProfileAsync(email, updates);

            // Assert
            dbUser.HashedPassword.Should().NotBe("old_hash");
            dbUser.HashedPassword.Should().NotBe("NewSecurePassword123!");
            BCrypt.Net.BCrypt.Verify("NewSecurePassword123!", dbUser.HashedPassword).Should().BeTrue();
        }

        [Test]
        public async Task UpdateUserProfileAsync_ShouldThrowException_WhenNewEmailIsTaken()
        {
            // Arrange
            var oldEmail = "old@example.com";
            var takenEmail = "taken@example.com";
            var updates = new UserUpdateDto(takenEmail, null, null, null);

            var dbUser = new Entities.User { Email = oldEmail, FirstName = "A", LastName = "B", HashedPassword = "H" };

            _mockRepo.Setup(r => r.GetUserByEmailAsync(oldEmail, It.IsAny<CancellationToken>()))
                     .ReturnsAsync(dbUser);

            // Simulate the Repository finding another user with the new requested email
            _mockRepo.Setup(r => r.GetUserByEmailAsync(takenEmail, It.IsAny<CancellationToken>()))
                     .ReturnsAsync(new Entities.User { Email = takenEmail, FirstName = "Other", LastName = "User", HashedPassword = "H2" });

            // Act
            AsyncTestDelegate act = async () => await _service.UpdateUserProfileAsync(oldEmail, updates);

            // Assert
            var ex = Assert.ThrowsAsync<Exception>(act);
            Assert.That(ex.Message, Is.EqualTo("Email already in use"));
        }

        [Test]
        public async Task UpdateUserProfileAsync_ShouldCorrectlyUpdateEmail_WhenNotTaken()
        {
            // Arrange
            var oldEmail = "old@example.com";
            var newEmail = "new@example.com";
            var updates = new UserUpdateDto(newEmail, null, null, null);
            var dbUser = new Entities.User { Email = oldEmail, FirstName = "A", LastName = "B", HashedPassword = "H" };

            _mockRepo.Setup(r => r.GetUserByEmailAsync(oldEmail, It.IsAny<CancellationToken>()))
                     .ReturnsAsync(dbUser);

            // New email is NOT taken
            _mockRepo.Setup(r => r.GetUserByEmailAsync(newEmail, It.IsAny<CancellationToken>()))
                     .ReturnsAsync((Entities.User?)null);

            // Act
            var result = await _service.UpdateUserProfileAsync(oldEmail, updates);

            // Assert
            result!.User.Email.Should().Be(newEmail);
            dbUser.Email.Should().Be(newEmail);
        }
    }
}