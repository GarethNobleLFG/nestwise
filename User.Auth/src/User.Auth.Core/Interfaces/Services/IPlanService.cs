using System.Threading;
using User.Auth.Core.DTOs;

namespace User.Auth.Core.Interfaces
{
    public interface IPlanService
    {
        Task<PlanResponseDto> CreatePlanAsync(string email, PlanCreateDto dto, CancellationToken ct = default);
        
        Task<IEnumerable<PlanListItemDto>> GetUserPlansAsync(string email, CancellationToken ct = default);
        
        Task<PlanResponseDto?> GetPlanAsync(string email, Guid planId, CancellationToken ct = default);
        
        Task<PlanResponseDto?> UpdatePlanAsync(string email, Guid planId, PlanUpdateDto updates, CancellationToken ct = default);
        
        Task<bool> DeletePlanAsync(string email, Guid planId, CancellationToken ct = default);
    }
}
