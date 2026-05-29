using System.Text.Json;

namespace User.Auth.Core.Entities
{
    public class Plan
    {
        public Guid Id { get; set; }
        
        public string UserEmail { get; set; } = string.Empty;
        
        public string Name { get; set; } = string.Empty;
        
        public string Description { get; set; } = string.Empty;

        public JsonDocument? Data { get; set; }
        
        public JsonDocument? ProfileData { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }
}