using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Threading;
using User.Auth.Core.DTOs;
using User.Auth.Core.Interfaces;

namespace User.Auth.Core.Services
{
    public class UserService : IUserService
    {
        private readonly IUserRepository _userRepository;
        private readonly IConfiguration _config;

        public UserService(IUserRepository userRepository, IConfiguration config)
        {
            _userRepository = userRepository;
            _config = config;
        }

        public async Task<UserAuthDto> SignUpAsync(UserAuthDto userDto, CancellationToken ct = default)
        {
            if (await _userRepository.GetUserByEmailAsync(userDto.Email, ct) != null)
                throw new Exception("Email already registered");

            var user = new Entities.User
            {
                Email = userDto.Email,
                FirstName = userDto.FirstName ?? "",
                LastName = userDto.LastName ?? "",
                HashedPassword = BCrypt.Net.BCrypt.HashPassword(userDto.Password)
            };

            await _userRepository.AddUserAsync(user, ct);

            return userDto;
        }

        public async Task<TokenResponseDto?> SignInAsync(UserAuthDto userDto, CancellationToken ct = default)
        {
            var user = await _userRepository.GetUserByEmailAsync(userDto.Email, ct);
            
            if (user == null || !BCrypt.Net.BCrypt.Verify(userDto.Password, user.HashedPassword))
                return null;

            var jwtSettings = _config.GetSection("JwtSettings");
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings["SecretKey"]!));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            };

            var token = new JwtSecurityToken(
                issuer: jwtSettings["Issuer"],
                audience: jwtSettings["Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddHours(2),
                signingCredentials: creds
            );

            return new TokenResponseDto(new JwtSecurityTokenHandler().WriteToken(token));
        }

        public async Task<UserProfileDto?> GetUserProfileAsync(string email, CancellationToken ct = default)
        {
            return await _userRepository.GetUserProfileByEmailAsync(email, ct);
        }

        public async Task<UserUpdateResponseDto?> UpdateUserProfileAsync(string email, UserUpdateDto updates, CancellationToken ct = default)
        {
            var user = await _userRepository.GetUserByEmailAsync(email, ct);
            if (user == null) return null;

            if (!string.IsNullOrEmpty(updates.FirstName)) user.FirstName = updates.FirstName;
            if (!string.IsNullOrEmpty(updates.LastName)) user.LastName = updates.LastName;
            
            if (!string.IsNullOrEmpty(updates.Email) && updates.Email != email)
            {
                if (await _userRepository.GetUserByEmailAsync(updates.Email, ct) != null)
                    throw new Exception("Email already in use");
                user.Email = updates.Email;
            }

            if (!string.IsNullOrEmpty(updates.Password))
                user.HashedPassword = BCrypt.Net.BCrypt.HashPassword(updates.Password);

            await _userRepository.UpdateUserAsync(user, ct);

            var profile = new UserProfileDto(user.Email, user.FirstName, user.LastName);
            return new UserUpdateResponseDto("User profile updated successfully", profile);
        }
    }
}
