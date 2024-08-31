import { useEffect, useState, useRef } from 'react';
import { useSocket } from '../providers/socket';

export function useCameraConnection(canvasRef, remoteRef) {
  const socket = useSocket();

  const [remoteStream, setRemoteStream] = useState(null);

  const peerConnection = useRef(null);

  useEffect(() => {
    if (!socket || !canvasRef.current || !remoteRef.current) {
      return;
    }

    const pc = new RTCPeerConnection(
      {
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' },
          { urls: 'stun:stun2.l.google.com:19302' },
          { urls: 'stun:stun3.l.google.com:19302' },
          { urls: 'stun:stun.awt.be:3478' },
          { urls: 'stun:stun.poivy.com:3478' },
        ],
      },
      {
        optional: [{ DtlsSrtpKeyAgreement: true }],
      }
    );

    peerConnection.current = pc;

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit('webrtc-message', {
          type: 'ice-candidate',
          candidate: event.candidate,
        });

        console.log('ICE candidate', event.candidate);
      }
    };

    pc.ontrack = (event) => {
      remoteRef.current.srcObject.addTrack(event.track);

      console.log(event.streams);
    };

    const stream = canvasRef.current.captureStream();

    stream.getTracks().forEach((track) => pc.addTrack(track, stream));

    socket.on('webrtc-message', handleWebRtcMessages);

    return () => {
      pc.close();
    };
  }, [socket, canvasRef, remoteRef]);

  const handleOffer = async (offer) => {
    const pc = peerConnection.current;

    const stream = canvasRef.current.captureStream();

    stream.getTracks().forEach((track) => pc.addTrack(track, stream));

    await pc.setRemoteDescription(new RTCSessionDescription(offer));

    const answer = await pc.createAnswer();

    await pc.setLocalDescription(answer);

    socket.emit('webrtc-message', {
      type: 'answer',
      answer: pc.localDescription,
    });
  };

  const handleAnswer = async (answer) => {
    const pc = peerConnection.current;

    await pc.setRemoteDescription(new RTCSessionDescription(answer));
  };

  const handleIceCandidate = async (candidate) => {
    const pc = peerConnection.current;

    try {
      await pc.addIceCandidate(new RTCIceCandidate(candidate));
    } catch (error) {
      console.error('Error adding received ICE candidate:', error);
    }
  };

  const handleWebRtcMessages = (message) => {
    console.log('socket webrtc message', message);

    switch (message.type) {
      case 'offer':
        handleOffer(message.offer);
        break;
      case 'answer':
        handleAnswer(message.answer);
        break;
      case 'iceCandidate':
        handleIceCandidate(message.candidate);
        break;
    }
  };

  const call = async () => {
    const pc = peerConnection.current;

    const stream = canvasRef.current.captureStream();

    stream.getTracks().forEach((track) => pc.addTrack(track, stream));

    const offer = await pc.createOffer();

    await pc.setLocalDescription(offer);

    socket.emit('webrtc-message', { type: 'offer', offer });
  };

  const prepare = (stream) => {
    if (!stream) {
      console.error('problems with stream');

      return;
    }

    const pc = peerConnection.current;

    stream.getTracks().forEach((track) => pc.addTrack(track, stream));
  };

  return { remoteStream, call, prepare };
}
