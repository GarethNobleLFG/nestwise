using System.Text.Json.Serialization;

namespace User.Auth.Core.DTOs
{
    public record UserAuthDto(string Email, string Password, string? Name = null);

    public record TokenResponseDto(string Token, string TokenType = "Bearer");

    public record UserProfileDto(string Email, string Name);

    public record UserSignUpResponseDto(
        string Message,
        [property: JsonPropertyName("user_id")] string UserId,
        string Email,
        string Name
    );

    public record UserUpdateDto(
        [property: JsonPropertyName("new_email")] string? Email,
        [property: JsonPropertyName("new_name")] string? Name,
        string? Password
    );

    public record UserUpdateResponseDto(
        string Message,
        [property: JsonPropertyName("updated_email")] string UpdatedEmail,
        [property: JsonPropertyName("updated_name")] string UpdatedName,
        [property: JsonPropertyName("new_token")] string NewToken
    );

    public record ValidateTokenResponseDto(
        bool Valid,
        string Email,
        string Name,
        [property: JsonPropertyName("user_id")] string UserId
    );
}