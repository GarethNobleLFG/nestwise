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

        private string GenerateToken(Entities.User user)
        {
            var jwtSettings = _config.GetSection("JwtSettings");

            // Core fallback check to match docker/global .env keys
            var secretKey = Environment.GetEnvironmentVariable("AUTH_JWT_SECRET")
                            ?? jwtSettings["SecretKey"]
                            ?? throw new InvalidOperationException("JWT Secret Key is missing.");

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.Email),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim("name", user.Name),
                new Claim("user_id", user.Id.ToString()),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            };

            var token = new JwtSecurityToken(
                claims: claims,
                expires: DateTime.UtcNow.AddHours(2),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        public async Task<UserSignUpResponseDto> SignUpAsync(UserAuthDto userDto, CancellationToken ct = default)
        {
            if (await _userRepository.GetUserByEmailAsync(userDto.Email, ct) != null)
                throw new Exception("Email already registered");

            var user = new Entities.User
            {
                Email = userDto.Email,
                Name = userDto.Name ?? "NestWise User",
                HashedPassword = BCrypt.Net.BCrypt.HashPassword(userDto.Password)
            };

            var savedUser = await _userRepository.AddUserAsync(user, ct);

            return new UserSignUpResponseDto(
                "User created successfully",
                savedUser.Id.ToString(),
                savedUser.Email,
                savedUser.Name
            );
        }

        public async Task<TokenResponseDto?> SignInAsync(UserAuthDto userDto, CancellationToken ct = default)
        {
            var user = await _userRepository.GetUserByEmailAsync(userDto.Email, ct);

            if (user == null || !BCrypt.Net.BCrypt.Verify(userDto.Password, user.HashedPassword))
                return null;

            var token = GenerateToken(user);
            return new TokenResponseDto(token);
        }

        public async Task<UserProfileDto?> GetUserProfileAsync(string email, CancellationToken ct = default)
        {
            return await _userRepository.GetUserProfileByEmailAsync(email, ct);
        }

        public async Task<UserUpdateResponseDto?> UpdateUserProfileAsync(string email, UserUpdateDto updates, CancellationToken ct = default)
        {
            var user = await _userRepository.GetUserByEmailAsync(email, ct);
            if (user == null) return null;

            if (!string.IsNullOrEmpty(updates.Name))
            {
                user.Name = updates.Name;
            }

            if (!string.IsNullOrEmpty(updates.Email) && updates.Email != email)
            {
                if (await _userRepository.GetUserByEmailAsync(updates.Email, ct) != null)
                    throw new Exception("Email already in use");
                user.Email = updates.Email;
            }

            if (!string.IsNullOrEmpty(updates.Password))
                user.HashedPassword = BCrypt.Net.BCrypt.HashPassword(updates.Password);

            await _userRepository.UpdateUserAsync(user, ct);

            var token = GenerateToken(user);

            return new UserUpdateResponseDto(
                "Profile updated successfully",
                user.Email,
                user.Name,
                token
            );
        }
    }
}