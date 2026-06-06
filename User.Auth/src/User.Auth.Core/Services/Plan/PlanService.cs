using System.Text.Json;
using System.Text.RegularExpressions;
using System.Threading;
using User.Auth.Core.DTOs;
using User.Auth.Core.Entities;
using User.Auth.Core.Interfaces;

namespace User.Auth.Core.Services
{
    public class PlanService : IPlanService
    {
        private readonly IPlanRepository _repository;

        // Dependency Injecting our "Dumb" Repository
        public PlanService(IPlanRepository repository)
        {
            _repository = repository;
        }

        public async Task<PlanResponseDto> CreatePlanAsync(string email, PlanCreateDto dto, CancellationToken ct = default)
        {
            var baseName = dto.Name;
            var regexPattern = $"^{Regex.Escape(baseName)}( \\(version (\\d+)\\))?$";
            var regex = new Regex(regexPattern, RegexOptions.IgnoreCase);

            // Fetch exactly what we need using the isolated repository
            var existingNames = await _repository.GetAllPlanNamesByUserAsync(email, ct);

            var matchingNames = existingNames.Where(name => regex.IsMatch(name)).ToList();

            string finalName = baseName;

            if (matchingNames.Any())
            {
                var versionNumbers = new List<int>();

                foreach (var name in matchingNames)
                {
                    var match = Regex.Match(name, $"^{Regex.Escape(baseName)} \\(version (\\d+)\\)$", RegexOptions.IgnoreCase);
                    if (match.Success)
                    {
                        versionNumbers.Add(int.Parse(match.Groups[1].Value));
                    }
                    else if (name.Equals(baseName, StringComparison.OrdinalIgnoreCase))
                    {
                        versionNumbers.Add(1);
                    }
                }

                int newVersion = versionNumbers.Any() ? versionNumbers.Max() + 1 : 2;
                finalName = $"{baseName} (version {newVersion})";
            }

            var plan = new Plan
            {
                UserEmail = email,
                Name = finalName,
                Description = dto.Description,
                Data = JsonDocument.Parse(dto.Data.GetRawText()),
                ProfileData = JsonDocument.Parse(dto.ProfileData.GetRawText()),
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            await _repository.AddAsync(plan, ct);

            return MapToResponseDto(plan);
        }

        public async Task<IEnumerable<PlanListItemDto>> GetUserPlansAsync(string email, CancellationToken ct = default)
        {
            var plans = await _repository.GetAllByUserAsync(email, ct);
            return plans.Select(p => new PlanListItemDto(p.Id, p.Name));
        }

        public async Task<PlanResponseDto?> GetPlanAsync(string email, Guid planId, CancellationToken ct = default)
        {
            // track: false -> We are only reading this to return it to the user. Do not attach it to EF Core memory!
            var plan = await _repository.GetByIdAsync(planId, email, track: false, ct);
            return plan == null ? null : MapToResponseDto(plan);
        }

        public async Task<PlanResponseDto?> UpdatePlanAsync(string email, Guid planId, PlanUpdateDto updates, CancellationToken ct = default)
        {
            // track: true -> We need to update this, so we MUST track it!
            var plan = await _repository.GetByIdAsync(planId, email, track: true, ct);

            if (plan == null) return null;

            // Apply updates
            if (updates.Name != null) plan.Name = updates.Name;
            if (updates.Description != null) plan.Description = updates.Description;
            if (updates.Data.HasValue) plan.Data = JsonDocument.Parse(updates.Data.Value.GetRawText());
            if (updates.ProfileData.HasValue) plan.ProfileData = JsonDocument.Parse(updates.ProfileData.Value.GetRawText());
            
            plan.UpdatedAt = DateTime.UtcNow;

            await _repository.UpdateAsync(plan, ct);

            return MapToResponseDto(plan);
        }

        public async Task<bool> DeletePlanAsync(string email, Guid planId, CancellationToken ct = default)
        {
            // track: true -> You cannot delete an entity that isn't tracked!
            var plan = await _repository.GetByIdAsync(planId, email, track: true, ct);

            if (plan == null) return false;

            await _repository.DeleteAsync(plan, ct);
            return true;
        }

        private static PlanResponseDto MapToResponseDto(Plan plan)
        {
            return new PlanResponseDto(
                plan.Id,
                plan.UserEmail,
                plan.Name,
                plan.Description,
                plan.Data?.RootElement,
                plan.ProfileData?.RootElement,
                plan.CreatedAt,
                plan.UpdatedAt
            );
        }
    }
}
