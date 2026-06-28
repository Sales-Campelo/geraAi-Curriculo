import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import ProgressBar from "../components/ProgressBar";
import SectionNav from "../components/SectionNav";
import { startInterview, sendInterviewMessage } from "../api/endpoints";
import { useSession } from "../context/SessionContext";

export default function InterviewPage() {
  const { sessionId, jobAnalysisId, setInterviewId } = useSession();
  const navigate = useNavigate();

  const [messages, setMessages] = useState([]); // [{role, text}]
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [interviewIdLocal, setInterviewIdLocal] = useState(null);
  const [questionCount, setQuestionCount] = useState(0);
  const totalQuestions = 5;
  const bottomRef = useRef(null);

  useEffect(() => {
    if (!jobAnalysisId) {
      navigate("/");
      return;
    }
    (async () => {
      const { data } = await startInterview(jobAnalysisId, sessionId);
      setInterviewId(data.id);
      setInterviewIdLocal(data.id);
      setQuestionCount(data.question_count);
      setMessages(
        data.history.map((h) => ({ role: h.role, text: h.parts[0] }))
      );
      setLoading(false);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || sending) return;
    const userMessage = input.trim();
    setMessages((prev) => [...prev, { role: "user", text: userMessage }]);
    setInput("");
    setSending(true);

    const { data } = await sendInterviewMessage(interviewIdLocal, userMessage);
    setQuestionCount(data.question_count);

    if (data.finished) {
      navigate("/resultado");
      return;
    }

    const lastModelMessage = data.history[data.history.length - 1].parts[0];
    setMessages((prev) => [...prev, { role: "model", text: lastModelMessage }]);
    setSending(false);
  };

  return (
    <div className="page-container">
      <ProgressBar currentStep={1} />

      <div className="card" style={{ display: "flex", flexDirection: "column", height: 520 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
          <h2 style={{ marginTop: 0, color: "var(--color-primary-dark)" }}>
            Entrevista com a IA
          </h2>
          {questionCount > 0 && (
            <span style={{ fontSize: 12, color: "var(--color-muted)", fontFamily: "var(--font-mono)" }}>
              {questionCount}/{totalQuestions}
            </span>
          )}
        </div>

        <div style={{ flex: 1, overflowY: "auto", padding: "8px 4px" }}>
          {loading && <p>Carregando primeira pergunta...</p>}
          {messages.map((m, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                display: "flex",
                justifyContent: m.role === "user" ? "flex-end" : "flex-start",
                marginBottom: 10,
              }}
            >
              <div
                style={{
                  background: m.role === "user" ? "var(--color-primary)" : "#f1f5f9",
                  color: m.role === "user" ? "#fff" : "var(--color-gray-dark)",
                  padding: "10px 14px",
                  borderRadius: 14,
                  maxWidth: "75%",
                  fontSize: 14,
                }}
              >
                {m.text}
              </div>
            </motion.div>
          ))}
          {sending && <p style={{ fontSize: 13, color: "#94a3b8" }}>IA está digitando...</p>}
          <div ref={bottomRef} />
        </div>

        <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Digite sua resposta..."
            disabled={loading || sending}
            style={{
              flex: 1,
              padding: "12px 14px",
              borderRadius: 12,
              border: "1px solid #e2e8f0",
              fontSize: 14,
            }}
          />
          <button className="btn-primary" onClick={handleSend} disabled={loading || sending}>
            Enviar
          </button>
        </div>
      </div>

      <SectionNav currentStep={1} />
    </div>
  );
}
