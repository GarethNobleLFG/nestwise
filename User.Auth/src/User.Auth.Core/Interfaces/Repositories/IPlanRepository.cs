using System.Threading;
using User.Auth.Core.Entities;

namespace User.Auth.Core.Interfaces
{
    public interface IPlanRepository
    {
        Task<Plan> AddAsync(Plan plan, CancellationToken ct = default);
        
        Task<IEnumerable<Plan>> GetAllByUserAsync(string email, CancellationToken ct = default);
        
        Task<IEnumerable<string>> GetAllPlanNamesByUserAsync(string email, CancellationToken ct = default);
        
        Task<Plan?> GetByIdAsync(Guid planId, string email, bool track = false, CancellationToken ct = default);
        
        Task UpdateAsync(Plan plan, CancellationToken ct = default);
        
        Task DeleteAsync(Plan plan, CancellationToken ct = default);
    }
}
