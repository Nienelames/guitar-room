using Microsoft.AspNetCore.SignalR;

namespace GuitarRoom.Hubs;

public class BrokerHub : Hub
{
    private readonly Dictionary<string, string> _peerIds = new();
    
    public async Task AnnounceConnection(string peerId)
    {
        _peerIds[Context.ConnectionId] = peerId;
        await Clients.All.SendAsync("peer-connected", peerId);
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