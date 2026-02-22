import React from "react";

export default function Home() {
  const [backendStatus, setBackendStatus] = React.useState("Loading...");
  const [messages, setMessages] = React.useState<Array<{ role: string; content: string }>>([]);
  const [input, setInput] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  React.useEffect(() => {
    fetch(`${apiUrl}/health`)
      .then(res => res.json())
      .then(data => setBackendStatus(data.status))
      .catch(() => setBackendStatus("Backend unavailable"));
  }, []);

  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input;
    setInput("");
    setMessages(prev => [...prev, { role: "user", content: userMessage }]);
    setLoading(true);

    try {
      const response = await fetch(`${apiUrl}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setMessages(prev => [...prev, { role: "assistant", content: data.response || data.message }]);
    } catch (error) {
      setMessages(prev => [...prev, {
        role: "assistant",
        content: `Error: ${error instanceof Error ? error.message : "Failed to get response"}`
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      padding: "20px",
      fontFamily: "Arial, sans-serif",
      maxWidth: "800px",
      margin: "0 auto",
      height: "100vh",
      display: "flex",
      flexDirection: "column"
    }}>
      <h1>🤖 Agentic Chatbot</h1>
      <p>Backend Status: <strong style={{ color: backendStatus === "ok" ? "green" : "red" }}>
        {backendStatus}
      </strong></p>

      <div style={{
        flex: 1,
        overflowY: "auto",
        border: "1px solid #ddd",
        padding: "15px",
        marginBottom: "15px",
        backgroundColor: "#f9f9f9",
        borderRadius: "8px"
      }}>
        {messages.length === 0 ? (
          <p style={{ color: "#999" }}>Start a conversation...</p>
        ) : (
          messages.map((msg, idx) => (
            <div key={idx} style={{
              marginBottom: "10px",
              padding: "10px",
              backgroundColor: msg.role === "user" ? "#007bff" : "#e9ecef",
              color: msg.role === "user" ? "white" : "black",
              borderRadius: "8px",
              maxWidth: "80%",
              marginLeft: msg.role === "user" ? "auto" : "0"
            }}>
              <strong>{msg.role === "user" ? "You" : "Bot"}:</strong> {msg.content}
            </div>
          ))
        )}
        {loading && <p style={{ color: "#999" }}>Bot is thinking...</p>}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={sendMessage} style={{ display: "flex", gap: "10px" }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          disabled={loading || backendStatus !== "ok"}
          style={{
            flex: 1,
            padding: "10px",
            border: "1px solid #ddd",
            borderRadius: "4px",
            fontSize: "16px"
          }}
        />
        <button
          type="submit"
          disabled={loading || backendStatus !== "ok"}
          style={{
            padding: "10px 20px",
            backgroundColor: backendStatus === "ok" ? "#007bff" : "#ccc",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: backendStatus === "ok" ? "pointer" : "not-allowed",
            fontSize: "16px"
          }}
        >
          {loading ? "..." : "Send"}
        </button>
      </form>
    </div>
  );
}
