import React, { useRef, useEffect } from "react";
import io from "socket.io-client";

const SERVER_URL = "http://localhost:8000";
const SOCKET_PATH = "/ws/video/";

const CaptureVideo = () => {
  const videoRef = useRef(null);
  const socketRef = useRef(null);

  useEffect(() => {
    // Connect to the WebSocket server
    socketRef.current = io(SERVER_URL, {
      path: SOCKET_PATH,
    });

    // Initialize the WebRTC media stream
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: false })
      .then((stream) => {
        videoRef.current.srcObject = stream;

        // Send the video stream to the server via WebSockets
        const videoTracks = stream.getVideoTracks();
        const videoSender = peerConnection.addTrack(videoTracks[0], stream);

        socketRef.current.emit("stream-start", {
          streamId: "my-stream-id", // unique ID for this stream
        });
      });

    return () => {
      // Cleanup code
      socketRef.current.disconnect();
    };
  }, []);

  return (
    <div>
      <video ref={videoRef} autoPlay />
    </div>
  );
};

export default CaptureVideo;