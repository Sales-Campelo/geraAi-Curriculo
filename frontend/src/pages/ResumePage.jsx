import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import ProgressBar from "../components/ProgressBar";
import SectionNav from "../components/SectionNav";
import { getResume } from "../api/endpoints";
import { useSession } from "../context/SessionContext";

function formatResumeText(c) {
  const lines = [];
  if (c.dados_pessoais) {
    lines.push(c.dados_pessoais.nome || "Nome do candidato");
    const contato = [c.dados_pessoais.email, c.dados_pessoais.telefone].filter(Boolean).join(" • ");
    if (contato) lines.push(contato);
    lines.push("");
  }
  if (c.resumo_profissional) {
    lines.push("RESUMO PROFISSIONAL");
    lines.push(c.resumo_profissional);
    lines.push("");
  }
  if (Array.isArray(c.experiencia) && c.experiencia.length > 0) {
    lines.push("EXPERIÊNCIA");
    c.experiencia.forEach((exp) => {
      lines.push(`${exp.cargo} — ${exp.empresa}`);
      if (exp.descricao) lines.push(exp.descricao);
      lines.push("");
    });
  }
  if (Array.isArray(c.formacao) && c.formacao.length > 0) {
    lines.push("FORMAÇÃO");
    c.formacao.forEach((f) => lines.push(`${f.curso} — ${f.instituicao}`));
    lines.push("");
  }
  if (Array.isArray(c.competencias) && c.competencias.length > 0) {
    lines.push("COMPETÊNCIAS");
    lines.push(c.competencias.join(" • "));
    lines.push("");
  }
  if (Array.isArray(c.idiomas) && c.idiomas.length > 0) {
    lines.push("IDIOMAS");
    lines.push(c.idiomas.join(" • "));
  }
  return lines.join("\n");
}

export default function ResumePage() {
  const { resumeId } = useSession();
  const navigate = useNavigate();
  const [resume, setResume] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!resumeId) {
      navigate("/");
      return;
    }
    (async () => {
      const { data } = await getResume(resumeId);
      setResume(data);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!resume) {
    return (
      <div className="page-container">
        <ProgressBar currentStep={3} />
        <div className="card">Carregando currículo...</div>
      </div>
    );
  }

  const c = resume.content || {};
  const shareUrl = `${window.location.origin}/curriculo-publico/${resume.share_token}`;

  return (
    <div className="page-container">
      <ProgressBar currentStep={3} />

      <div className="sheet">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
          <div>
            <span className="eyebrow">Documento final</span>
            <h2 style={{ margin: "4px 0 0" }}>Seu currículo</h2>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button
              className="btn-secondary"
              onClick={() => {
                const text = formatResumeText(c);
                navigator.clipboard.writeText(text).then(() => {
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                });
              }}
            >
              {copied ? "Copiado!" : "Copiar conteúdo"}
            </button>
            <a
              className="btn-secondary"
              href={`${import.meta.env.VITE_API_URL}/resumes/${resume.id}/?format=pdf`}
              target="_blank"
              rel="noreferrer"
            >
              Baixar PDF
            </a>
            <a
              className="btn-secondary"
              href={`${import.meta.env.VITE_API_URL}/resumes/${resume.id}/?format=docx`}
              target="_blank"
              rel="noreferrer"
            >
              Baixar DOCX
            </a>
          </div>
        </div>

        <hr style={{ margin: "24px 0", border: "none", borderTop: "1px solid var(--color-border)" }} />

        {c.dados_pessoais && (
          <section>
            <h3>{c.dados_pessoais.nome || "Nome do candidato"}</h3>
            <p style={{ color: "#64748b", fontSize: 14 }}>
              {c.dados_pessoais.email} {c.dados_pessoais.telefone && `• ${c.dados_pessoais.telefone}`}
            </p>
          </section>
        )}

        {c.resumo_profissional && (
          <section style={{ marginTop: 16 }}>
            <h4>Resumo Profissional</h4>
            <p style={{ fontSize: 14 }}>{c.resumo_profissional}</p>
          </section>
        )}

        {Array.isArray(c.experiencia) && c.experiencia.length > 0 && (
          <section style={{ marginTop: 16 }}>
            <h4>Experiência</h4>
            {c.experiencia.map((exp, i) => (
              <div key={i} style={{ marginBottom: 10, fontSize: 14 }}>
                <strong>{exp.cargo}</strong> — {exp.empresa}
                <p style={{ margin: "4px 0", color: "#64748b" }}>{exp.descricao}</p>
              </div>
            ))}
          </section>
        )}

        {Array.isArray(c.formacao) && c.formacao.length > 0 && (
          <section style={{ marginTop: 16 }}>
            <h4>Formação</h4>
            {c.formacao.map((f, i) => (
              <p key={i} style={{ fontSize: 14 }}>{f.curso} — {f.instituicao}</p>
            ))}
          </section>
        )}

        {Array.isArray(c.competencias) && c.competencias.length > 0 && (
          <section style={{ marginTop: 16 }}>
            <h4>Competências</h4>
            <p style={{ fontSize: 14 }}>{c.competencias.join(" • ")}</p>
          </section>
        )}

        {Array.isArray(c.idiomas) && c.idiomas.length > 0 && (
          <section style={{ marginTop: 16 }}>
            <h4>Idiomas</h4>
            <p style={{ fontSize: 14 }}>{c.idiomas.join(" • ")}</p>
          </section>
        )}

        <hr style={{ margin: "24px 0", border: "none", borderTop: "1px solid var(--color-border)" }} />
        <p style={{ fontSize: 13, color: "var(--color-faint)" }}>
          Link para compartilhar: <a href={shareUrl} style={{ color: "var(--color-primary)" }}>{shareUrl}</a>
        </p>
      </div>

      <SectionNav currentStep={3} />
    </div>
  );
}
