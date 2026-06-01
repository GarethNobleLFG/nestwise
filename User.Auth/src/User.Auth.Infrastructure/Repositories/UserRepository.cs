using Microsoft.EntityFrameworkCore;
using System.Threading;
using User.Auth.Core.Interfaces;
using User.Auth.Infrastructure.Data;
using User.Auth.Core.DTOs;

namespace User.Auth.Infrastructure.Repositories
{
    public class UserRepository : IUserRepository
    {
        private readonly AppDbContext _context;

        public UserRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<Core.Entities.User?> GetUserByEmailAsync(string email, CancellationToken ct = default)
        {
            return await _context.Users.FirstOrDefaultAsync(u => u.Email == email, ct);
        }

        public async Task<UserProfileDto?> GetUserProfileByEmailAsync(string email, CancellationToken ct = default)
        {
            return await _context.Users
                .AsNoTracking() 
                .Where(u => u.Email == email)
                .Select(u => new UserProfileDto( 
                    u.Email,
                    u.Name
                ))
                .FirstOrDefaultAsync(ct);
        }

        public async Task<Core.Entities.User> AddUserAsync(Core.Entities.User user, CancellationToken ct = default)
        {
            _context.Users.Add(user);
            await _context.SaveChangesAsync(ct);
            return user;
        }

        public async Task UpdateUserAsync(Core.Entities.User user, CancellationToken ct = default)
        {
            _context.Users.Update(user);
            await _context.SaveChangesAsync(ct);
        }
    }
}