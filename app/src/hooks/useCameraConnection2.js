import { useEffect, useState, useRef } from 'react';
import { useSocket } from '../providers/socket';

export function useCameraConnection(props) {
  const socket = useSocket();

  const localPC = useRef(null);

  const remotePC = useRef(null);

  const localRef = useRef(null);

  const remoteRef = useRef(null);

  const captureStream = () => {
    return props.captureStream(localRef);
  };

  useEffect(() => {
    socket.on('other-user', handleOtherUser);
    socket.on('webrtc-message', handleWebRtcMessages);
  }, [socket]);

  const handleOtherUser = async () => {
    setTimeout(async () => {
      localPC.current = new RTCPeerConnection({
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' },
          { urls: 'stun:stun2.l.google.com:19302' },
          { urls: 'stun:stun3.l.google.com:19302' },
          { urls: 'stun:stun.awt.be:3478' },
          { urls: 'stun:stun.poivy.com:3478' },
        ],
      });

      const stream = captureStream();

      stream
        .getTracks()
        .forEach((track) => localPC.current.addTrack(track, stream));

      localPC.current.onicecandidate = (event) => {
        if (event.candidate) {
          socket.emit('webrtc-message', {
            type: 'ice-candidate',
            candidate: event.candidate,
          });

          console.log('ICE candidate', event.candidate);
        }
      };

      localPC.current.ontrack = (event) => {
        remoteRef.current.srcObject = event.streams[0];
      };

      const offer = await localPC.current.createOffer();

      localPC.current.setLocalDescription(offer);

      socket.emit('webrtc-message', { type: 'offer', offer });
    }, 2000);
  };

  const handleAnswer = async (answer) => {
    await localPC.current.setRemoteDescription(
      new RTCSessionDescription(answer)
    );

    const offer = await localPC.current.createOffer();

    localPC.current.setLocalDescription(offer);

    socket.emit('webrtc-message', {
      type: 'renegotiation-offer',
      offer,
    });
  };

  const handleRenegotiateAnswer = async (answer) => {
    await localPC.current.setRemoteDescription(
      new RTCSessionDescription(answer)
    );
  };

  const handleCandidate = async (candidate) => {
    const pc = localPC.current || remotePC.current;
    try {
      await pc.addIceCandidate(new RTCIceCandidate(candidate));
    } catch (error) {
      console.error('Error adding received ICE candidate:', error);
    }
  };

  const handleOffer = async (offer) => {
    remotePC.current = new RTCPeerConnection({
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun2.l.google.com:19302' },
        { urls: 'stun:stun3.l.google.com:19302' },
        { urls: 'stun:stun.awt.be:3478' },
        { urls: 'stun:stun.poivy.com:3478' },
      ],
    });

    const stream = captureStream();

    stream
      .getTracks()
      .forEach((track) => remotePC.current.addTrack(track, stream));

    remotePC.current.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit('webrtc-message', {
          type: 'ice-candidate',
          candidate: event.candidate,
        });

        console.log('ICE candidate', event.candidate);
      }
    };

    remotePC.current.ontrack = (event) => {
      remoteRef.current.srcObject = event.streams[0];
    };

    await remotePC.current.setRemoteDescription(
      new RTCSessionDescription(offer)
    );

    const answer = await remotePC.current.createAnswer();

    await remotePC.current.setLocalDescription(answer);

    socket.emit('webrtc-message', { type: 'answer', answer });
  };

  const handleRenegotiateOffer = async (offer) => {
    await remotePC.current.setRemoteDescription(
      new RTCSessionDescription(offer)
    );

    const answer = await remotePC.current.createAnswer();

    await remotePC.current.setLocalDescription(answer);

    socket.emit('webrtc-message', { type: 'renegotitate-answer', answer });
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
        handleCandidate(message.candidate);
        break;
      case 'renegotiate-answer':
        handleRenegotiateAnswer(message.answer);
        break;
      case 'renegotiation-offer':
        handleRenegotiateOffer(message.offer);
        break;
    }
  };

  return { localRef, remoteRef };
}
