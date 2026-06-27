import { createContext, useContext, useMemo, useState } from "react";

const SessionContext = createContext(null);

function generateSessionId() {
  return crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`;
}

export function SessionProvider({ children }) {
  const [sessionId] = useState(() => {
    const existing = sessionStorage.getItem("geraai_session_id");
    if (existing) return existing;
    const fresh = generateSessionId();
    sessionStorage.setItem("geraai_session_id", fresh);
    return fresh;
  });

  const [jobAnalysisId, setJobAnalysisId] = useState(null);
  const [interviewId, setInterviewId] = useState(null);
  const [resumeId, setResumeId] = useState(null);

  const value = useMemo(
    () => ({
      sessionId,
      jobAnalysisId,
      setJobAnalysisId,
      interviewId,
      setInterviewId,
      resumeId,
      setResumeId,
    }),
    [sessionId, jobAnalysisId, interviewId, resumeId]
  );

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession() {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error("useSession deve ser usado dentro de SessionProvider");
  return ctx;
}
