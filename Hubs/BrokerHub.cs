using Microsoft.AspNetCore.SignalR;

namespace GuitarRoom.Hubs;

public class BrokerHub : Hub
{
    public async Task AnnounceConnection(string userId)
    {
        Console.WriteLine($"Announcing user connection with id of {userId}");
        await Clients.All.SendAsync("user-connected", userId);
    }
    
    public override async Task OnConnectedAsync()
    {
        Console.WriteLine($"Client connected: {Context.ConnectionId}");
        
        await base.OnConnectedAsync();
    }
    
    public override async Task OnDisconnectedAsync(Exception? exception) 
    {
        Console.WriteLine($"Client disconnected: {Context.ConnectionId}");
        
        await base.OnDisconnectedAsync(exception);
    }
    
}