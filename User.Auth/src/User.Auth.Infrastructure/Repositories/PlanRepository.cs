using Microsoft.EntityFrameworkCore;
using System.Threading;
using User.Auth.Core.Entities;
using User.Auth.Core.Interfaces;
using User.Auth.Infrastructure.Data;

namespace User.Auth.Infrastructure.Repositories
{
    public class PlanRepository : IPlanRepository
    {
        private readonly AppDbContext _context;

        public PlanRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<Plan> AddAsync(Plan plan, CancellationToken ct = default)
        {
            _context.Plans.Add(plan);
            await _context.SaveChangesAsync(ct);
            return plan;
        }

        public async Task<IEnumerable<Plan>> GetAllByUserAsync(string email, CancellationToken ct = default)
        {
            return await _context.Plans
                .AsNoTracking() // Skips Tracking!
                .Where(p => p.UserEmail == email)
                .OrderByDescending(p => p.CreatedAt)
                .ToListAsync(ct); // Passes CT to ADO.NET query!
        }

        public async Task<IEnumerable<string>> GetAllPlanNamesByUserAsync(string email, CancellationToken ct = default)
        {
            return await _context.Plans
                .AsNoTracking() // Skips Tracking!
                .Where(p => p.UserEmail == email)
                .Select(p => p.Name)
                .ToListAsync(ct);
        }

        public async Task<Plan?> GetByIdAsync(Guid planId, string email, bool track = false, CancellationToken ct = default)
        {
            var query = _context.Plans.AsQueryable();

            if (!track)
            {
                query = query.AsNoTracking(); // Skips memory tracking when just reading!
            }

            return await query.FirstOrDefaultAsync(p => p.Id == planId && p.UserEmail == email, ct);
        }

        public async Task UpdateAsync(Plan plan, CancellationToken ct = default)
        {
            await _context.SaveChangesAsync(ct);
        }

        public async Task DeleteAsync(Plan plan, CancellationToken ct = default)
        {
            _context.Plans.Remove(plan);
            await _context.SaveChangesAsync(ct);
        }
    }
}
