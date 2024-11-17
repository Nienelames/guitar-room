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
public class LoginModel(ApplicationDbContext dbContext) : PageModel
{
    [Required(ErrorMessage = "You must enter a Display Name")]
    [BindProperty]
    public string DisplayName { get; set; }
    
    public async Task<IActionResult> OnPostAsync()
    {
        if (!ModelState.IsValid)
            return Page();

        var user = dbContext.Users.SingleOrDefault(u => u.DisplayName == DisplayName);
        if (user == null)
        {
            ModelState.AddModelError(string.Empty, "Account does not exist.");
            
            return Page();
        }

        var claims = new List<Claim>
        {
            new(ClaimTypes.Name, DisplayName),
            new(ClaimTypes.NameIdentifier, user.Id.ToString())
        };
        
        var identity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);
        await HttpContext.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme, new ClaimsPrincipal(identity));  
        
        return Redirect("~/");
    }
}