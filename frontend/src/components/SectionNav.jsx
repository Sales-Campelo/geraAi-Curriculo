import { useNavigate } from "react-router-dom";
import { useSession } from "../context/SessionContext";
import { motion } from "framer-motion";

const SECTIONS = [
  { step: 0, path: "/", label: "Vaga" },
  { step: 1, path: "/entrevista", label: "Entrevista" },
  { step: 2, path: "/resultado", label: "Resultado" },
  { step: 3, path: "/curriculo", label: "Currículo" },
  { step: 4, path: "/plano-carreira", label: "Plano" },
];

export default function SectionNav({ currentStep }) {
  const { jobAnalysisId, interviewId, resumeId } = useSession();
  const navigate = useNavigate();

  const completed = {
    0: !!jobAnalysisId,
    1: !!interviewId,
    2: !!resumeId,
    3: !!resumeId,
    4: !!resumeId,
  };

  let prevSection = null;
  for (let i = currentStep - 1; i >= 0; i--) {
    if (completed[i]) {
      prevSection = SECTIONS[i];
      break;
    }
  }

  let nextSection = null;
  for (let i = currentStep + 1; i < SECTIONS.length; i++) {
    if (completed[i]) {
      nextSection = SECTIONS[i];
      break;
    }
  }

  if (!prevSection && !nextSection) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        display: "flex",
        justifyContent: "flex-end",
        gap: 12,
        marginTop: 28,
      }}
    >
      {prevSection && (
        <button
          className="btn-secondary"
          onClick={() => navigate(prevSection.path)}
        >
          ← {prevSection.label}
        </button>
      )}
      {nextSection && (
        <button
          className="btn-primary"
          onClick={() => navigate(nextSection.path)}
        >
          {nextSection.label} →
        </button>
      )}
    </motion.div>
  );
}
