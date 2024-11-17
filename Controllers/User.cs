using System.Security.Claims;
using GuitarRoom.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;

namespace GuitarRoom.Controllers;

[Authorize]
[ApiController]
[Route("api/user")]
public class User(ApplicationDbContext dbContext) : ControllerBase
{
    [HttpGet]
    [Route("me")]
    public IActionResult GetAvatar()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        var displayName = User.FindFirstValue(ClaimTypes.Name);

        var avatarDir = new DirectoryInfo("./wwwroot/assets/avatars");
        var avatars = avatarDir.GetFiles($"{displayName}.*");
        var avatarUrl = $"/assets/avatars/{avatars.Single().Name}";
        
        return Ok(new
        {
            UserId = userId,
            DisplayName = displayName,
            AvatarUrl = avatarUrl,
        });
    }
}