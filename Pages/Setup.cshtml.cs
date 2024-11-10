using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.EntityFrameworkCore.Metadata.Internal;

namespace GuitarRoom.Pages;

public class SetupModel : PageModel
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

        var avatarFileName = $"{Guid.NewGuid()}.{Path.GetExtension(Avatar.FileName)}";
        await using var stream = System.IO.File.Create($"wwwroot/assets/avatars/{avatarFileName}");
        await Avatar.CopyToAsync(stream);

        TempData["AvatarUrl"] = $"~/assets/avatars/{avatarFileName}";
        TempData["DisplayName"] = DisplayName;
        
        return RedirectToPage("/SetupSuccess");
    }
}