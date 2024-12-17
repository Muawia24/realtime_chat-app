import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";

// Connect to the WebSocket server

function App() {
  const [message, setMessage] = useState(""); // State for the input message
  const [messages, setMessages] = useState([]); // State to store all received messages
  

  // Establish WebSocket connection and listen for events
  useEffect(() => {
    // Log when the socket successfully connects
    console.log('Use Effect triggered!');

    const socket = io("http://localhost:5000", {
      transports: ["websocket"], // Force WebSocket transport
      reconnection: true, // Enable reconnection
      reconnectionAttempts: 5, // Number of reconnection attempts before giving up
      reconnectionDelay: 1000, // Delay between reconnection attempts (1 second)
      reconnectionDelayMax: 5000,
    });
    
    socket.on("connect", () => {
      console.log("WebSocket connected:", socket.id);
    });
    // Listen for the server's "receive_message" event
    socket.on("receive_message", (message) => {
      console.log("Message received from server:", message);
      setMessages((messages) => [...messages, message]);
    });

    return () => {
      console.log("Cleaning up socket connection...");
      socket.disconnect();
    }
  }, []);




  // Send a message to the server
  const sendMessage = () => {
    if (message.trim() !== "") {
      const data = { message }; // Prepare the message payload
      console.log("Emitting send_message:", data);

      const socket = io("http://localhost:5000");
      socket.emit("send_message", data); // Emit the "send_message" event
      setMessage(""); // Clear the input field
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>Real-Time Chat App</h1>

      {/* Display received messages */}
      <div
        style={{
          border: "1px solid #ddd",
          borderRadius: "5px",
          padding: "10px",
          marginBottom: "10px",
          height: "300px",
          overflowY: "scroll",
        }}
      >
        {messages.map((msg, index) => (
          <p key={index} style={{ margin: "5px 0" }}>
            {msg.message}
          </p>
        ))}
      </div>

      {/* Input field and Send button */}
      <div style={{ display: "flex", gap: "10px" }}>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message"
          style={{
            flex: 1,
            padding: "10px",
            border: "1px solid #ddd",
            borderRadius: "5px",
          }}
        />
        <button
          onClick={sendMessage}
          style={{
            padding: "10px 20px",
            backgroundColor: "#007bff",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default App;
