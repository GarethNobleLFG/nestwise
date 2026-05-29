namespace User.Auth.Core.DTOs
{
    public record UserAuthDto(string Email, string Password, string? FirstName, string? LastName);
    
    public record TokenResponseDto(string Token, string TokenType = "Bearer");
    
    public record UserProfileDto(string Email, string FirstName, string LastName);

    public record UserUpdateDto(string? Email, string? FirstName, string? LastName, string? Password);

    public record UserUpdateResponseDto(string Message, UserProfileDto User);
}