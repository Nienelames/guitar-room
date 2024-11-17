using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore;

namespace GuitarRoom.Data.Models;

public class User
{
    public int Id { get; set; }
    public string DisplayName { get; set; }
}