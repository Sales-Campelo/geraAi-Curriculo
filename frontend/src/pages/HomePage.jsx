import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import AdSlot from "../components/AdSlot";
import ProgressBar from "../components/ProgressBar";
import SectionNav from "../components/SectionNav";
import { analyzeJob } from "../api/endpoints";
import { useSession } from "../context/SessionContext";

export default function HomePage() {
  const { register, handleSubmit, formState } = useForm();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { sessionId, setJobAnalysisId } = useSession();

  const onSubmit = async ({ job_description }) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await analyzeJob(job_description, sessionId);
      setJobAnalysisId(data.id);
      navigate("/entrevista");
    } catch (err) {
      setError("Não foi possível analisar a vaga. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <AdSlot label="Banner superior · 728×90" style={{ height: 90, marginBottom: 28 }} />

      <ProgressBar currentStep={0} />

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        style={{ textAlign: "center", marginBottom: 36 }}
      >
        <span className="eyebrow">Cole a vaga · receba um currículo sob medida</span>
        <h1
          style={{
            fontSize: "clamp(30px, 5vw, 44px)",
            margin: "10px 0 14px",
            fontWeight: 600,
          }}
        >
          Transforme uma descrição de vaga em um <em style={{ fontStyle: "italic" }}>currículo aprovado por ATS</em>
        </h1>
        <p style={{ color: "var(--color-muted)", maxWidth: 520, margin: "0 auto", fontSize: 15.5 }}>
          Nossa IA lê os requisitos, conversa com você para entender sua trajetória e
          monta um currículo otimizado — junto com seu score real de compatibilidade.
        </p>
      </motion.div>

      <motion.div
        className="card"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <label
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 11,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "var(--color-muted)",
            display: "block",
            marginBottom: 10,
          }}
        >
          Descrição da vaga
        </label>

        <form onSubmit={handleSubmit(onSubmit)}>
          <textarea
            {...register("job_description", { required: true, minLength: 30 })}
            rows={10}
            placeholder="Cole aqui o texto completo da vaga: responsabilidades, requisitos, tecnologias..."
            style={{
              width: "100%",
              padding: 16,
              borderRadius: 12,
              border: "1px solid var(--color-border)",
              fontFamily: "var(--font-body)",
              fontSize: 14.5,
              lineHeight: 1.6,
              resize: "vertical",
              background: "var(--color-gray-light)",
            }}
          />
          {formState.errors.job_description && (
            <p style={{ color: "#ef4444", fontSize: 13 }}>
              Cole uma descrição de vaga com pelo menos 30 caracteres.
            </p>
          )}
          {error && <p style={{ color: "#ef4444", fontSize: 13 }}>{error}</p>}

          <div style={{ marginTop: 18, display: "flex", justifyContent: "flex-end" }}>
            <button className="btn-primary" type="submit" disabled={loading}>
              {loading ? "Analisando vaga..." : "Analisar vaga →"}
            </button>
          </div>
        </form>
      </motion.div>

      <SectionNav currentStep={0} />
    </div>
  );
}
