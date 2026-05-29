using System.Text.Json;

namespace User.Auth.Core.DTOs
{
    public record PlanCreateDto(
        string Name, 
        string Description, 
        JsonElement Data, 
        JsonElement ProfileData
    );

    public record PlanUpdateDto(
        string? Name, 
        string? Description, 
        JsonElement? Data, 
        JsonElement? ProfileData
    );

    public record PlanResponseDto(
        Guid Id, 
        string UserEmail, 
        string Name, 
        string Description, 
        JsonElement? Data, 
        JsonElement? ProfileData, 
        DateTime CreatedAt, 
        DateTime UpdatedAt
    );

    public record PlanListItemDto(
        Guid Id, 
        string Name
    );
}