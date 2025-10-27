import React, { useState, useEffect } from "react";
import { createRoot } from "react-dom/client";

const API = "https://fastapi-auth-backend-y31n.onrender.com";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState("");

  async function register() {
    alert(`Registering with:\nUsername: ${username}\nPassword length: ${password.length}`);
    console.log("➡️ Sending register:", { username, password });

    try {
      const res = await fetch(`${API}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const text = await res.text();
      console.log("🔍 Raw response text:", text);

      const data = JSON.parse(text);
      alert(`✅ Register response: ${JSON.stringify(data)}`);
    } catch (err) {
      console.error("❌ Register failed:", err);
      alert(`❌ Register failed: ${err}`);
    }
  }

  async function login() {
    alert(`Logging in: ${username}`);
    const form = new URLSearchParams();
    form.append("username", username);
    form.append("password", password);

    try {
      const res = await fetch(`${API}/token`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: form.toString(),
      });

      const text = await res.text();
      console.log("🔍 Raw login response:", text);
      const data = JSON.parse(text);

      if (data.access_token) {
        localStorage.setItem("token", data.access_token);
        setToken(data.access_token);
        alert("✅ Login successful!");
      } else {
        alert("❌ Login failed, check console.");
      }
    } catch (err) {
      console.error("❌ Login failed:", err);
      alert(`Login error: ${err}`);
    }
  }

  async function fetchMessages() {
    console.log("Fetching messages...");
    const res = await fetch(`${API}/messages`);
    const data = await res.json();
    console.log("💬 Messages:", data);
    setMessages(data);
  }

  useEffect(() => {
    if (token) fetchMessages();
  }, [token]);

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
      <button
        onClick={() => {
          localStorage.removeItem("token");
          setToken(null);
        }}
      >
        Logout
      </button>

      <div>
        <input
          placeholder="Type a message..."
          value={newMsg}
          onChange={(e) => setNewMsg(e.target.value)}
        />
        <button onClick={fetchMessages}>🔄 Refresh</button>
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
