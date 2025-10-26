import React, { useState, useEffect } from "react";
import { createRoot } from "react-dom/client";

const API = "https://fastapi-auth-backend.onrender.com"; // replace with your backend URL

function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState("");

  useEffect(() => {
    if (token) fetchMessages();
  }, [token]);

  async function fetchMessages() {
    const res = await fetch(`${API}/messages`);
    const data = await res.json();
    setMessages(data);
  }

  async function register() {
    const res = await fetch(`${API}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    const data = await res.json();
    alert(data.message || "Registered!");
  }

  async function login() {
    const form = new URLSearchParams();
    form.append("username", username);
    form.append("password", password);
    const res = await fetch(`${API}/token`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: form.toString(),
    });
    const data = await res.json();
    if (data.access_token) {
      localStorage.setItem("token", data.access_token);
      setToken(data.access_token);
    } else {
      alert("Login failed");
    }
  }

  async function sendMessage() {
    await fetch(`${API}/messages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ text: newMsg }),
    });
    setNewMsg("");
    fetchMessages();
  }

  function logout() {
    localStorage.removeItem("token");
    setToken(null);
  }

  if (!token)
    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        <h1>🔒 Login / Register</h1>
        <input
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <br />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <br />
        <button onClick={login}>Login</button>
        <button onClick={register}>Register</button>
      </div>
    );

  return (
    <div style={{ textAlign: "center", marginTop: "30px" }}>
      <h1>💬 Welcome!</h1>
      <button onClick={logout}>Logout</button>
      <div>
        <input
          placeholder="Type a message..."
          value={newMsg}
          onChange={(e) => setNewMsg(e.target.value)}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {messages.map((m, i) => (
          <li key={i}>
            <b>{m.username}</b>: {m.text}
          </li>
        ))}
      </ul>
    </div>
  );
}

createRoot(document.getElementById("root")).render(<App />);
