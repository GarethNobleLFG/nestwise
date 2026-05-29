using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using User.Auth.Core.DTOs;
using User.Auth.Core.Interfaces;

namespace User.Auth.Api.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class UserController : ControllerBase
    {
        private readonly IUserService _userService;

        public UserController(IUserService userService)
        {
            _userService = userService;
        }

        private string GetAuthenticatedEmail()
        {
            return User.FindFirst(ClaimTypes.Email)?.Value 
                ?? throw new UnauthorizedAccessException("Invalid token claims.");
        }

        [HttpPost("signup")]
        public async Task<ActionResult<UserAuthDto>> SignUp([FromBody] UserAuthDto userDto)
        {
            try
            {
                var response = await _userService.SignUpAsync(userDto);
                return Created("", response); // 201 Created
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

            return Ok(token);
        }

        [Authorize]
        [HttpGet("getUser")]
        public async Task<ActionResult<UserProfileDto>> ReadUsersMe()
        {
            var email = GetAuthenticatedEmail();
            var profile = await _userService.GetUserProfileAsync(email);

            if (profile == null) return NotFound();

            return Ok(profile);
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
        public async Task<ActionResult<UserProfileDto>> ValidateToken()
        {
            var email = GetAuthenticatedEmail();
            var profile = await _userService.GetUserProfileAsync(email);

            if (profile == null) return NotFound();

            return Ok(profile);
        }
    }
}