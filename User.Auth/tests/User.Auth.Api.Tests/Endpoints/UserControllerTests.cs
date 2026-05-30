using System;
using System.Security.Claims;
using System.Threading;
using System.Threading.Tasks;
using FluentAssertions;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Moq;
using NUnit.Framework; // Changed from Xunit
using User.Auth.Api.Controllers;
using User.Auth.Core.DTOs;
using User.Auth.Core.Interfaces;

namespace User.Auth.Api.Tests.Endpoints
{
    [TestFixture]
    public class UserControllerTests
    {
        private Mock<IUserService> _mockService;
        private UserController _controller;
        private readonly string _testEmail = "test@example.com";

        [SetUp] // Use SetUp for NUnit initialization
        public void SetUp()
        {
            _mockService = new Mock<IUserService>();
            _controller = new UserController(_mockService.Object);

            // Mock the User Claims context for [Authorize] endpoints
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
        public async Task SignUp_ShouldReturnCreated_WhenSuccessful()
        {
            // Arrange
            var req = new UserAuthDto(_testEmail, "password123", "First", "Last");
            _mockService.Setup(s => s.SignUpAsync(req, It.IsAny<CancellationToken>()))
                        .ReturnsAsync(req);

            // Act
            var result = await _controller.SignUp(req);

            // Assert
            var createdResult = result.Result as CreatedResult;
            createdResult.Should().NotBeNull();
            createdResult!.StatusCode.Should().Be(201);
            createdResult.Value.Should().BeEquivalentTo(req);
        }

        [Test]
        public async Task SignUp_ShouldReturnBadRequest_WhenEmailAlreadyExists()
        {
            // Arrange
            var req = new UserAuthDto(_testEmail, "password123", "First", "Last");
            _mockService.Setup(s => s.SignUpAsync(req, It.IsAny<CancellationToken>()))
                        .ThrowsAsync(new Exception("Email already registered"));

            // Act
            var result = await _controller.SignUp(req);

            // Assert
            var badRequestResult = result.Result as BadRequestObjectResult;
            badRequestResult.Should().NotBeNull();
            badRequestResult!.StatusCode.Should().Be(400);
            // Verify the detail object matches controller logic
            badRequestResult.Value.ToString().Should().Contain("Email already registered");
        }

        [Test]
        public async Task SignIn_ShouldReturnOk_WithToken_WhenCredentialsValid()
        {
            // Arrange
            var req = new UserAuthDto(_testEmail, "password123", null, null);
            var expectedToken = new TokenResponseDto("mock-jwt-token");
            
            _mockService.Setup(s => s.SignInAsync(req, It.IsAny<CancellationToken>()))
                        .ReturnsAsync(expectedToken);

            // Act
            var result = await _controller.SignIn(req);

            // Assert
            var okResult = result.Result as OkObjectResult;
            okResult.Should().NotBeNull();
            okResult!.Value.Should().BeEquivalentTo(expectedToken);
        }

        [Test]
        public async Task SignIn_ShouldReturnUnauthorized_WhenCredentialsInvalid()
        {
            // Arrange
            var req = new UserAuthDto(_testEmail, "wrong-password", null, null);
            _mockService.Setup(s => s.SignInAsync(req, It.IsAny<CancellationToken>()))
                        .ReturnsAsync((TokenResponseDto?)null);

            // Act
            var result = await _controller.SignIn(req);

            // Assert
            var unauthorizedResult = result.Result as UnauthorizedObjectResult;
            unauthorizedResult.Should().NotBeNull();
            unauthorizedResult!.StatusCode.Should().Be(401);
        }

        [Test]
        public async Task ReadUsersMe_ShouldReturnOk_WithProfile_WhenUserFound()
        {
            // Arrange
            var profile = new UserProfileDto(_testEmail, "First", "Last");
            _mockService.Setup(s => s.GetUserProfileAsync(_testEmail, It.IsAny<CancellationToken>()))
                        .ReturnsAsync(profile);

            // Act
            var result = await _controller.ReadUsersMe();

            // Assert
            var okResult = result.Result as OkObjectResult;
            okResult.Should().NotBeNull();
            okResult!.Value.Should().BeEquivalentTo(profile);
        }

        [Test]
        public async Task ReadUsersMe_ShouldReturnNotFound_WhenUserDoesNotExist()
        {
            // Arrange
            _mockService.Setup(s => s.GetUserProfileAsync(_testEmail, It.IsAny<CancellationToken>()))
                        .ReturnsAsync((UserProfileDto?)null);

            // Act
            var result = await _controller.ReadUsersMe();

            // Assert
            result.Result.Should().BeOfType<NotFoundResult>();
        }

        [Test]
        public async Task UpdateUser_ShouldReturnOk_WhenSuccessful()
        {
            // Arrange
            var updates = new UserUpdateDto(null, "NewFirst", "NewLast", null);
            var response = new UserUpdateResponseDto("Success", new UserProfileDto(_testEmail, "NewFirst", "NewLast"));
            
            _mockService.Setup(s => s.UpdateUserProfileAsync(_testEmail, updates, It.IsAny<CancellationToken>()))
                        .ReturnsAsync(response);

            // Act
            var result = await _controller.UpdateUser(updates);

            // Assert
            var okResult = result.Result as OkObjectResult;
            okResult.Should().NotBeNull();
            okResult!.Value.Should().BeEquivalentTo(response);
        }

        [Test]
        public async Task UpdateUser_ShouldReturnBadRequest_WhenServiceThrows()
        {
            // Arrange
            var updates = new UserUpdateDto("forbidden@email.com", null, null, null);
            _mockService.Setup(s => s.UpdateUserProfileAsync(It.IsAny<string>(), It.IsAny<UserUpdateDto>(), It.IsAny<CancellationToken>()))
                        .ThrowsAsync(new Exception("Cannot change email"));

            // Act
            var result = await _controller.UpdateUser(updates);

            // Assert
            var badRequest = result.Result as BadRequestObjectResult;
            badRequest!.StatusCode.Should().Be(400);
        }

        [Test]
        public async Task ValidateToken_ShouldReturnProfile_WhenValid()
        {
            // Arrange
            var profile = new UserProfileDto(_testEmail, "Jane", "Doe");
            _mockService.Setup(s => s.GetUserProfileAsync(_testEmail, It.IsAny<CancellationToken>()))
                        .ReturnsAsync(profile);

            // Act
            var result = await _controller.ValidateToken();

            // Assert
            var okResult = result.Result as OkObjectResult;
            okResult!.Value.Should().BeEquivalentTo(profile);
        }

        [Test]
        public async Task AnyProtectedEndpoint_ShouldThrowUnauthorized_WhenClaimMissing()
        {
            // Arrange: Anonymous user
            _controller.ControllerContext.HttpContext.User = new ClaimsPrincipal(new ClaimsIdentity());

            // Act
            var act = () => _controller.ReadUsersMe();

            // Assert
            await act.Should().ThrowAsync<UnauthorizedAccessException>()
                     .WithMessage("Invalid token claims.");
        }
    }
}