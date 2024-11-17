using GuitarRoom.Data;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;

namespace GuitarRoom.Hubs;

public class BrokerHub(ApplicationDbContext dbContext) : Hub
{
    private readonly Dictionary<string, string> _peerIds = new();
    
    public async Task AnnounceConnection(string peerId, string userId)
    {
        _peerIds[Context.ConnectionId] = peerId;
        await dbContext.Users
            .Where(u => u.Id == int.Parse(userId))
            .ExecuteUpdateAsync(u => u.SetProperty(e => e.PeerId, peerId));
        await dbContext.SaveChangesAsync();
        
        await Clients.All.SendAsync("peer-connected", peerId, userId);
    }

    public override async Task OnDisconnectedAsync(Exception? exception) 
    {
        if (_peerIds.TryGetValue(Context.ConnectionId, out var peerId))
        {
            await Clients.All.SendAsync("peer-disconnected", peerId);
            _peerIds.Remove(Context.ConnectionId);
        }
        
        await base.OnDisconnectedAsync(exception);
    }
    
}