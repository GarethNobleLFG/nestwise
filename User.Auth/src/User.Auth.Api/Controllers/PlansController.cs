using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using User.Auth.Core.DTOs;
using User.Auth.Core.Interfaces;

namespace User.Auth.Api.Controllers
{
    [ApiController]
    [Route("[controller]")]
    [Authorize]
    public class PlansController : ControllerBase
    {
        private readonly IPlanService _planService;

        public PlansController(IPlanService planService)
        {
            _planService = planService;
        }

        private string GetUserEmail()
        {
            return User.FindFirst(ClaimTypes.Email)?.Value
                ?? throw new UnauthorizedAccessException();
        }

        [HttpPost]
        public async Task<ActionResult<PlanResponseDto>> CreatePlan([FromBody] PlanCreateDto plan)
        {
            var email = GetUserEmail();
            var response = await _planService.CreatePlanAsync(email, plan);

            return CreatedAtAction(nameof(GetPlan), new { planId = response.Id }, response);
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<PlanListItemDto>>> ListPlans(CancellationToken ct)
        {
            var email = GetUserEmail();
            var plans = await _planService.GetUserPlansAsync(email, ct);
            return Ok(plans);
        }

        [HttpGet("{planId}")]
        public async Task<ActionResult<PlanResponseDto>> GetPlan(Guid planId)
        {
            var email = GetUserEmail();
            var plan = await _planService.GetPlanAsync(email, planId);

            if (plan == null) return NotFound("Plan not found");

            return Ok(plan);
        }

        [HttpPut("{planId}")]
        public async Task<ActionResult<PlanResponseDto>> UpdatePlan(Guid planId, [FromBody] PlanUpdateDto updates)
        {
            var email = GetUserEmail();
            var plan = await _planService.UpdatePlanAsync(email, planId, updates);

            if (plan == null) return NotFound("Plan not found");

            return Ok(plan);
        }

        [HttpDelete("{planId}")]
        public async Task<ActionResult> DeletePlan(Guid planId)
        {
            var email = GetUserEmail();
            var success = await _planService.DeletePlanAsync(email, planId);

            if (!success) return NotFound("Plan not found");

            return NoContent();
        }
    }
}
