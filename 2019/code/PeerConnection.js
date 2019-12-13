class PeerConnection {
    constructor({
        gotRemoteTrack,
        signalingConnection,
        onClose,
        localStream,
        username,
        targetUsername,
        dataChannelLabel
    }) {
        this.signalingConnection = signalingConnection;
        this.onClose = onClose;
        this.localStream = localStream;
        this.username = username;
        this.targetUsername = targetUsername;
        this.dataChannelLabel = dataChannelLabel;

        this.peerConnection = new RTCPeerConnection({
            /*iceServers: [
                {
                    url: 'turn:numb.viagenie.ca',
                    credential: 'jojolasurpise',
                    username: '696upjj@mail3plus.net'
                }
            ]*/
        });
        this.peerConnection.onicecandidate = this.handleICECandidateEvent;
        this.peerConnection.oniceconnectionstatechange = this.handleICEConnectionStateChangeEvent;
        this.peerConnection.onsignalingstatechange = this.handleSignalingStateChangeEvent;
        this.peerConnection.onicegatheringstatechange = this.handleICEGatheringStateChangeEvent
        //this.peerConnection.onnegotiationneeded = this.offerConnection;
        this.peerConnection.ontrack = gotRemoteTrack;

        if (this.localStream) {
            for (const track of this.localStream.getTracks()) {
                this.peerConnection.addTrack(track, this.localStream)
            }
        }
        console.log("peerconnection created", this.peerConnection);
    }

    handleICECandidateEvent = (event) => {
        if (event.candidate) {
            this.signalingConnection.sendToServer({
                type: "new-ice-candidate",
                target: this.targetUsername,
                candidate: event.candidate
            });
        }
    };

    handleICEConnectionStateChangeEvent = (event) => {
        console.log(`ICE state : ${event}`)

        switch (this.peerConnection.iceConnectionState) {
            case "closed":
            case "failed":
            case "disconnected":
                this.close();
        }
    };

    handleSignalingStateChangeEvent = () => {
        switch (this.peerConnection.signalingState) {
            case "closed":
                this.close();
        }
    };

    handleICEGatheringStateChangeEvent = () => {

    }

    offerConnection = () => {
        const { username, targetUsername } = this;

        console.log("creating offer");
        this.peerConnection
            .createOffer()
            .then(offer => {
                console.log("attempting local description", offer);
                console.log("state", this.peerConnection.signalingState);

                return this.peerConnection.setLocalDescription(offer);
            })
            .then(() => {
                console.log(
                    "Sending offer to",
                    targetUsername,
                    "from",
                    username
                );
                this.signalingConnection.sendToServer({
                    name: username,
                    target: targetUsername,
                    type: "connection-offer",
                    sdp: this.peerConnection.localDescription
                });
            })
            .catch(err => {
                console.log("Error in handleNegotiationNeededEvent");
                console.error(err);
            });
    };

    connectionOffer = ({ sdp }) => {
        const { username, targetUsername } = this;

        this.peerConnection
            .setRemoteDescription(new RTCSessionDescription(sdp))
            .then(() => this.peerConnection.createAnswer())
            .then(answer => {
                return this.peerConnection.setLocalDescription(answer);
            })
            .then(() => {
                this.signalingConnection.sendToServer({
                    name: username,
                    target: targetUsername,
                    type: "connection-answer",
                    sdp: this.peerConnection.localDescription
                });
            })
            .catch(err => {
                console.log("Error in connectionOffer");
                console.error(err);
            });
    };

    connectionAnswer = ({ sdp }) => {
        this.peerConnection
            .setRemoteDescription(new RTCSessionDescription(sdp))
            .catch(err => {
                console.log("Error in connectionAnswer");
                console.error(err);
            });
    };

    newICECandidate = ({ candidate }) => {
        this.peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
    };

    onDataChannelMessage = msg => {
        console.log("Data channel message received", msg);
    };

    close = () => {
        const { username, targetUsername } = this

        this.signalingConnection.sendToServer({
            name: username,
            target: targetUsername,
            type: "hang-up"
        });
        this.peerConnection.close();
        this.peerConnection = null;

        this.onClose();
    };
}

export default PeerConnection;
