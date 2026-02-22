import React from "react";

export default function Home() {
  const [backendStatus, setBackendStatus] = React.useState("Loading...");

  React.useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
    fetch(`${apiUrl}/health`)
      .then(res => res.json())
      .then(data => setBackendStatus(data.status))
      .catch(() => setBackendStatus("Backend unavailable"));
  }, []);

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>🤖 Agentic Chatbot</h1>
      <p>Backend Status: <strong>{backendStatus}</strong></p>
      <p>Welcome to the chatbot application</p>
    </div>
  );
}
