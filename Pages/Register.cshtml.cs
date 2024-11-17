using System.ComponentModel.DataAnnotations;
using System.Security.Claims;
using GuitarRoom.Data;
using GuitarRoom.Data.Models;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.EntityFrameworkCore.Metadata.Internal;

namespace GuitarRoom.Pages;

[AllowAnonymous]
public class RegisterModel(ApplicationDbContext dbContext) : PageModel
{
    [Required(ErrorMessage = "You must enter a Display Name")]
    [StringLength(25, ErrorMessage = "Display Name too long")]
    [BindProperty]
    public string DisplayName { get; set; }
    
    [BindProperty]
    [Required(ErrorMessage = "You must upload an Avatar")]
    public IFormFile Avatar { get; set; }
    
    public async Task<IActionResult> OnPostAsync()
    {
        if (!ModelState.IsValid)
            return Page();

        var displayName = dbContext.Users.SingleOrDefault(u => u.DisplayName == DisplayName);
        if (displayName != null)
        {
            ModelState.AddModelError(string.Empty, "Display Name already exists.");
            
            return Page();
        }

        var newUser = new User { DisplayName = DisplayName };
        await dbContext.Users.AddAsync(newUser);
        await dbContext.SaveChangesAsync();
        
        var claims = new List<Claim>
        {
            new(ClaimTypes.Name, DisplayName),
            new(ClaimTypes.NameIdentifier, newUser.Id.ToString())
        };

        var avatarFileName = $"{DisplayName}{Path.GetExtension(Avatar.FileName)}";
        await using var stream = System.IO.File.Create($"wwwroot/assets/avatars/{avatarFileName}");
        await Avatar.CopyToAsync(stream);
        
        var identity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);
        await HttpContext.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme, new ClaimsPrincipal(identity));  
        
        return Redirect("~/");
    }
}