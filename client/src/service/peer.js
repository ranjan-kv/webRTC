class PeerService {
  constructor() {
    if (!this.peer) {
      this.peer = new RTCPeerConnection({
        iceServers: [
          {
            urls: [
              "stun:stun.l.google.com:19302",
              "stun:global.stun.twilio.com:3478",
            ],
          },
        ],
      });
    }
    this.senders = new Map(); // Track management
  }

  // Add a new method to handle media tracks
  async addTrack(track, stream) {
    if (this.peer) {
      // Check if we already have a sender for this track kind
      const existingSender = this.senders.get(track.kind);
      if (existingSender) {
        // Replace the track instead of adding a new one
        await existingSender.replaceTrack(track);
      } else {
        // Add new track and store the sender
        const sender = this.peer.addTrack(track, stream);
        this.senders.set(track.kind, sender);
      }
    }
  }

  async getAnswer(offer) {
    if (this.peer) {
      await this.peer.setRemoteDescription(offer);
      const ans = await this.peer.createAnswer();
      await this.peer.setLocalDescription(new RTCSessionDescription(ans));
      return ans;
    }
  }

  async setLocalDescription(ans) {
    if (this.peer) {
      await this.peer.setRemoteDescription(new RTCSessionDescription(ans));
    }
  }

  async getOffer() {
    if (this.peer) {
      const offer = await this.peer.createOffer();
      await this.peer.setLocalDescription(new RTCSessionDescription(offer));
      return offer;
    }
  }
}

export default new PeerService();
