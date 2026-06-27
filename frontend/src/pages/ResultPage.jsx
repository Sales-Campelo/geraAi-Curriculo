import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import AdSlot from "../components/AdSlot";
import CompatibilityGauge from "../components/CompatibilityGauge";
import ProgressBar from "../components/ProgressBar";
import FeedbackModal from "../components/FeedbackModal";
import { generateResume } from "../api/endpoints";
import { useSession } from "../context/SessionContext";

export default function ResultPage() {
  const { interviewId, setResumeId } = useSession();
  const navigate = useNavigate();
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showFeedback, setShowFeedback] = useState(false);

  useEffect(() => {
    if (!interviewId) {
      navigate("/");
      return;
    }
    (async () => {
      const { data } = await generateResume(interviewId);
      setResume(data);
      setResumeId(data.id);
      setLoading(false);
      setShowFeedback(true);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return (
      <div className="page-container">
        <ProgressBar currentStep={2} />
        <div className="card">Gerando seu currículo e análise de compatibilidade...</div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <ProgressBar currentStep={2} />

      <div className="card" style={{ marginBottom: 20 }}>
        <span className="eyebrow">Diagnóstico de aderência</span>
        <h2 style={{ marginTop: 6 }}>Sua compatibilidade com a vaga</h2>

        <div
          style={{
            display: "flex",
            gap: 28,
            justifyContent: "center",
            flexWrap: "wrap",
            margin: "24px 0 8px",
          }}
        >
          <CompatibilityGauge
            label="Compatibilidade Geral"
            value={resume.compatibilidade_geral}
            color="var(--color-primary)"
          />
          <CompatibilityGauge
            label="Compatibilidade Técnica"
            value={resume.compatibilidade_tecnica}
            color="var(--color-success)"
          />
          <CompatibilityGauge
            label="Compatibilidade Comportamental"
            value={resume.compatibilidade_comportamental}
            color="var(--color-primary-dark)"
          />
        </div>

        <div style={{ display: "flex", gap: 24, marginTop: 20, flexWrap: "wrap" }}>
          <div style={{ flex: 1, minWidth: 220 }}>
            <h4>✅ Competências atendidas</h4>
            <ul style={{ fontSize: 14 }}>
              {(resume.competencias_atendidas || []).map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
          </div>
          <div style={{ flex: 1, minWidth: 220 }}>
            <h4>⚠️ Competências ausentes</h4>
            <ul style={{ fontSize: 14 }}>
              {(resume.competencias_ausentes || []).map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <AdSlot label="Bloco de anúncio abaixo do currículo" style={{ height: 100, marginBottom: 20 }} />

      <div style={{ display: "flex", justifyContent: "flex-end", gap: 12 }}>
        <button className="btn-secondary" onClick={() => navigate("/curriculo")}>
          Ver currículo completo
        </button>
        <button className="btn-primary" onClick={() => navigate("/plano-carreira")}>
          Ver plano de desenvolvimento →
        </button>
      </div>

      <FeedbackModal open={showFeedback} onClose={() => setShowFeedback(false)} />
    </div>
  );
}
