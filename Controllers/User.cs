using System.Security.Claims;
using GuitarRoom.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace GuitarRoom.Controllers;

[Authorize]
[ApiController]
[Route("api/user")]
public class User(ApplicationDbContext dbContext) : ControllerBase
{
    [HttpGet]
    [Route("me")]
    public IActionResult GetLoggedIn()
    {
        var id = User.FindFirstValue(ClaimTypes.NameIdentifier);
        var displayName = User.FindFirstValue(ClaimTypes.Name);

        var avatarDir = new DirectoryInfo("./wwwroot/assets/avatars");
        var avatars = avatarDir.GetFiles($"{displayName}.*");
        var avatarUrl = $"/assets/avatars/{avatars.Single().Name}";
        
        return Ok(new
        {
            Id = id,
            DisplayName = displayName,
            AvatarUrl = avatarUrl,
        });
    }

    [HttpGet]
    [Route("by-peer")]
    public async Task<IActionResult> GetByPeer([FromQuery] string id)
    {
        if (string.IsNullOrEmpty(id))
            return BadRequest();
        
        var user = await dbContext.Users.FirstOrDefaultAsync(u => u.PeerId == id);

        if (user is null)
        {
            return NotFound();
        }
        
        
        var avatarDir = new DirectoryInfo("./wwwroot/assets/avatars");
        var avatars = avatarDir.GetFiles($"{user.DisplayName}.*");
        var avatarUrl = $"/assets/avatars/{avatars.Single().Name}";
        
        return Ok(new
        {
            user.Id,
            user.DisplayName,
            AvatarUrl = avatarUrl,
        });
    }
}