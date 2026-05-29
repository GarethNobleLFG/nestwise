using System.Threading;
using User.Auth.Core.DTOs;
using User.Auth.Core.Entities;

namespace User.Auth.Core.Interfaces
{
    public interface IUserRepository
    {
        Task<Entities.User?> GetUserByEmailAsync(string email, CancellationToken ct = default);
        
        Task<Entities.User> AddUserAsync(Entities.User user, CancellationToken ct = default);
        
        Task UpdateUserAsync(Entities.User user, CancellationToken ct = default);
        
        Task<UserProfileDto?> GetUserProfileByEmailAsync(string email, CancellationToken ct = default); 
    }
}