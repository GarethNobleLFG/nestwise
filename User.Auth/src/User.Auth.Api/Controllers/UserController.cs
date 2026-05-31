using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using User.Auth.Core.DTOs;
using User.Auth.Core.Interfaces;

namespace User.Auth.Api.Controllers
{
    [ApiController]
    [Route("userauth")]
    public class UserController : ControllerBase
    {
        private readonly IUserService _userService;
        private readonly IUserRepository _userRepository;

        public UserController(IUserService userService, IUserRepository userRepository)
        {
            _userService = userService;
            _userRepository = userRepository;
        }

        private string GetAuthenticatedEmail()
        {
            return User.FindFirst(ClaimTypes.Email)?.Value
                ?? throw new UnauthorizedAccessException("Invalid token claims.");
        }

        [HttpPost("signup")]
        public async Task<ActionResult<UserSignUpResponseDto>> SignUp([FromBody] UserAuthDto userDto)
        {
            try
            {
                var response = await _userService.SignUpAsync(userDto);
                return Created("", response);
            }
            catch (Exception ex)
            {
                return BadRequest(new { detail = ex.Message });
            }
        }

        [HttpPost("signin")]
        public async Task<ActionResult<TokenResponseDto>> SignIn([FromBody] UserAuthDto userDto)
        {
            var token = await _userService.SignInAsync(userDto);

            if (token == null)
            {
                return Unauthorized(new { detail = "Invalid email or password" });
            }

            return Ok(new { access_token = token.Token, token_type = "bearer" });
        }

        [Authorize]
        [HttpGet("getUser")]
        public async Task<ActionResult<UserProfileDto>> ReadUsersMe()
        {
            var email = GetAuthenticatedEmail();
            var profile = await _userService.GetUserProfileAsync(email);

            if (profile == null) return NotFound();

            return Ok(new { email = profile.Email, name = $"{profile.FirstName} {profile.LastName}" });
        }

        [Authorize]
        [HttpPut("updateUser")]
        public async Task<ActionResult<UserUpdateResponseDto>> UpdateUser([FromBody] UserUpdateDto updates)
        {
            try
            {
                var email = GetAuthenticatedEmail();
                var response = await _userService.UpdateUserProfileAsync(email, updates);

                if (response == null) return NotFound();

                return Ok(response);
            }
            catch (Exception ex)
            {
                return BadRequest(new { detail = ex.Message });
            }
        }

        [Authorize]
        [HttpPost("validateToken")]
        public async Task<ActionResult<ValidateTokenResponseDto>> ValidateToken()
        {
            var email = GetAuthenticatedEmail();
            var profile = await _userService.GetUserProfileAsync(email);

            if (profile == null) return NotFound();

            var userRecord = await _userRepository.GetUserByEmailAsync(email);
            if (userRecord == null) return NotFound();

            return Ok(new ValidateTokenResponseDto(
                Valid: true,
                Email: profile.Email,
                Name: $"{profile.FirstName} {profile.LastName}".Trim(),
                UserId: userRecord.Id.ToString()
            ));
        }
    }
}