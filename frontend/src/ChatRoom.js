import React , { useState ,useEffect } from "react";
import socket from "./socket";

const ChatRoom = ({ userId, room }) => {
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchMessages = async () => {
            try {
              const response = await fetch(`/api/chat/${room}`); // Fetch messages from the backend
              const data = await response.json();
              setMessages(data); // Update the messages state with chat history
            } catch (error) {
              console.error('Failed to fetch messages:', error);
            }
          };
      
        fetchMessages();

        socket.emit('join_room', room);

        socket.on('receive_message', (data) => {
            console.log(`Message received: ${data}`);
            setMessages((prev) => [...prev, data]);
        });

        return () => {
            socket.off('receive_message');
        }
    }, [room]);

    const sendMessage = () => {
        const data = { sender: userId, message, room };

        socket.emit('send_message', data);
        setMessages((prev) => [...prev, data]);
        setMessage('');
    };

    return (
        <div>
          <div className="chat-history">
            {messages.map((msg, index) => (
              <div key={index}>
                <strong>{msg.senderId === userId ? 'You' : msg.senderId}:</strong> {msg.message}
              </div>
            ))}
          </div>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
          />
          <button onClick={sendMessage}>Send</button>
        </div>
    );
};

export default ChatRoom;