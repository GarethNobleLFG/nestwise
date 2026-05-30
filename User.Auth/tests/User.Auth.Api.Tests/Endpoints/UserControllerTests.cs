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
            var req = new UserAuthDto(_testEmail, "password123", "First", "Last");
            _mockService.Setup(s => s.SignUpAsync(req, It.IsAny<CancellationToken>()))
                        .ReturnsAsync(req);

            var result = await _controller.SignUp(req);

            var createdResult = result.Result as CreatedResult;
            createdResult.Should().NotBeNull();
            createdResult!.StatusCode.Should().Be(201);
            createdResult.Value.Should().BeEquivalentTo(req);
        }

        [Test]
        public async Task SignUp_ShouldReturnBadRequest_WhenEmailAlreadyExists()
        {
            var req = new UserAuthDto(_testEmail, "password123", "First", "Last");
            _mockService.Setup(s => s.SignUpAsync(req, It.IsAny<CancellationToken>()))
                        .ThrowsAsync(new Exception("Email already registered"));

            var result = await _controller.SignUp(req);

            var badRequestResult = result.Result as BadRequestObjectResult;
            badRequestResult.Should().NotBeNull();
            badRequestResult!.StatusCode.Should().Be(400);
            // Verify the detail object matches controller logic
            badRequestResult.Value.ToString().Should().Contain("Email already registered");
        }

        [Test]
        public async Task SignIn_ShouldReturnOk_WithToken_WhenCredentialsValid()
        {
            var req = new UserAuthDto(_testEmail, "password123", null, null);
            var expectedToken = new TokenResponseDto("mock-jwt-token");
            
            _mockService.Setup(s => s.SignInAsync(req, It.IsAny<CancellationToken>()))
                        .ReturnsAsync(expectedToken);

            var result = await _controller.SignIn(req);

            var okResult = result.Result as OkObjectResult;
            okResult.Should().NotBeNull();
            okResult!.Value.Should().BeEquivalentTo(expectedToken);
        }

        [Test]
        public async Task SignIn_ShouldReturnUnauthorized_WhenCredentialsInvalid()
        {
            var req = new UserAuthDto(_testEmail, "wrong-password", null, null);
            _mockService.Setup(s => s.SignInAsync(req, It.IsAny<CancellationToken>()))
                        .ReturnsAsync((TokenResponseDto?)null);

            var result = await _controller.SignIn(req);

            var unauthorizedResult = result.Result as UnauthorizedObjectResult;
            unauthorizedResult.Should().NotBeNull();
            unauthorizedResult!.StatusCode.Should().Be(401);
        }

        [Test]
        public async Task ReadUsersMe_ShouldReturnOk_WithProfile_WhenUserFound()
        {
            var profile = new UserProfileDto(_testEmail, "First", "Last");
            _mockService.Setup(s => s.GetUserProfileAsync(_testEmail, It.IsAny<CancellationToken>()))
                        .ReturnsAsync(profile);

            var result = await _controller.ReadUsersMe();

            var okResult = result.Result as OkObjectResult;
            okResult.Should().NotBeNull();
            okResult!.Value.Should().BeEquivalentTo(profile);
        }

        [Test]
        public async Task ReadUsersMe_ShouldReturnNotFound_WhenUserDoesNotExist()
        {
            _mockService.Setup(s => s.GetUserProfileAsync(_testEmail, It.IsAny<CancellationToken>()))
                        .ReturnsAsync((UserProfileDto?)null);

            var result = await _controller.ReadUsersMe();

            result.Result.Should().BeOfType<NotFoundResult>();
        }

        [Test]
        public async Task UpdateUser_ShouldReturnOk_WhenSuccessful()
        {
            var updates = new UserUpdateDto(null, "NewFirst", "NewLast", null);
            var response = new UserUpdateResponseDto("Success", new UserProfileDto(_testEmail, "NewFirst", "NewLast"));
            
            _mockService.Setup(s => s.UpdateUserProfileAsync(_testEmail, updates, It.IsAny<CancellationToken>()))
                        .ReturnsAsync(response);

            var result = await _controller.UpdateUser(updates);

            var okResult = result.Result as OkObjectResult;
            okResult.Should().NotBeNull();
            okResult!.Value.Should().BeEquivalentTo(response);
        }

        [Test]
        public async Task UpdateUser_ShouldReturnBadRequest_WhenServiceThrows()
        {
            var updates = new UserUpdateDto("forbidden@email.com", null, null, null);
            _mockService.Setup(s => s.UpdateUserProfileAsync(It.IsAny<string>(), It.IsAny<UserUpdateDto>(), It.IsAny<CancellationToken>()))
                        .ThrowsAsync(new Exception("Cannot change email"));

            var result = await _controller.UpdateUser(updates);

            var badRequest = result.Result as BadRequestObjectResult;
            badRequest!.StatusCode.Should().Be(400);
        }

        [Test]
        public async Task ValidateToken_ShouldReturnProfile_WhenValid()
        {
            var profile = new UserProfileDto(_testEmail, "Jane", "Doe");
            _mockService.Setup(s => s.GetUserProfileAsync(_testEmail, It.IsAny<CancellationToken>()))
                        .ReturnsAsync(profile);

            var result = await _controller.ValidateToken();

            var okResult = result.Result as OkObjectResult;
            okResult!.Value.Should().BeEquivalentTo(profile);
        }

        [Test]
        public async Task AnyProtectedEndpoint_ShouldThrowUnauthorized_WhenClaimMissing()
        {
            _controller.ControllerContext.HttpContext.User = new ClaimsPrincipal(new ClaimsIdentity());

            var act = () => _controller.ReadUsersMe();

            await act.Should().ThrowAsync<UnauthorizedAccessException>()
                     .WithMessage("Invalid token claims.");
        }
    }
}