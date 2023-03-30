import React, { useRef, useEffect } from "react";
import SimpleWebRTC from "simplewebrtc";

const SERVER_URL = "http://localhost:8000";
const ROOM_NAME = "my-room-name";

const CaptureVideo = () => {
  const videoRef = useRef(null);
  const webrtcRef = useRef(null);

  useEffect(() => {
    // Initialize the WebRTC client
    webrtcRef.current = new SimpleWebRTC({
      localVideoEl: videoRef.current,
      autoRequestMedia: true,
      url: SERVER_URL,
      socketio: {
        path: "/socket.io",
      },
      roomName: ROOM_NAME,
    });

    // Listen for the readyToCall event before starting to send the video stream
    webrtcRef.current.on("readyToCall", () => {
      webrtcRef.current.joinRoom(ROOM_NAME);
    });

    return () => {
      // Cleanup code
      webrtcRef.current.stopLocalVideo();
      webrtcRef.current.leaveRoom();
      webrtcRef.current.disconnect();
    };
  }, []);

  return (
    <div>
      <video ref={videoRef} autoPlay />
    </div>
  );
};

export default CaptureVideo;
