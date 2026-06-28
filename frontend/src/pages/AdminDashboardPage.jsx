import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import AdSlot from "../components/AdSlot";
import { getStatistics, listResumes, updateResumeStatus } from "../api/endpoints";
import { useSession } from "../context/SessionContext";

const STATUS_MAP = {
  enviado: { label: "Enviado", color: "#64748b" },
  teste: { label: "Teste Técnico", color: "#f59e0b" },
  entrevista: { label: "Entrevista", color: "#2563eb" },
  conclusao: { label: "Conclusão", color: "#10b981" },
};

const STATUS_ORDER = ["enviado", "teste", "entrevista", "conclusao"];

function StatCard({ label, value }) {
  return (
    <div className="card" style={{ flex: 1, minWidth: 160, textAlign: "center" }}>
      <p style={{ fontSize: 13, color: "#64748b", margin: 0 }}>{label}</p>
      <p style={{ fontSize: 28, fontWeight: 800, color: "var(--color-primary-dark)", margin: "6px 0 0" }}>
        {value}
      </p>
    </div>
  );
}

export default function AdminDashboardPage() {
  const { sessionId } = useSession();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loadingApps, setLoadingApps] = useState(true);

  useEffect(() => {
    (async () => {
      const { data } = await getStatistics();
      setStats(data);
    })();
  }, []);

  useEffect(() => {
    if (!sessionId) return;
    (async () => {
      try {
        const { data } = await listResumes(sessionId);
        setApplications(data);
      } catch {
        // silently fail
      }
      setLoadingApps(false);
    })();
  }, [sessionId]);

  const handleStatusChange = async (resumeId, newStatus) => {
    try {
      await updateResumeStatus(resumeId, newStatus);
      setApplications((prev) =>
        prev.map((app) =>
          app.id === resumeId ? { ...app, status: newStatus } : app
        )
      );
    } catch {
      // silently fail
    }
  };

  const activeApps = applications.filter((a) => a.status !== "conclusao");
  const concludedApps = applications.filter((a) => a.status === "conclusao");

  return (
    <div className="page-container" style={{ display: "flex", gap: 24 }}>
      <div style={{ flex: 1 }}>
        <h1 style={{ color: "var(--color-primary-dark)" }}>Dashboard</h1>

        {!stats ? (
          <p>Carregando estatísticas...</p>
        ) : (
          <>
            <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 24 }}>
              <StatCard label="Currículos gerados" value={stats.total_curriculos_gerados} />
              <StatCard label="Análises realizadas" value={stats.total_analises} />
              <StatCard label="Avaliação média" value={`${stats.media_avaliacao} ⭐`} />
              <StatCard label="Taxa de conversão" value={`${stats.taxa_conversao_percentual}%`} />
            </div>

            <div className="card" style={{ marginBottom: 24 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <h3 style={{ margin: 0 }}>Suas Candidaturas</h3>
                {activeApps.length > 0 && (
                  <span style={{ fontSize: 13, color: "var(--color-muted)" }}>
                    {activeApps.length} ativa{activeApps.length > 1 ? "s" : ""}
                  </span>
                )}
              </div>

              {loadingApps ? (
                <p style={{ color: "#94a3b8", marginTop: 12 }}>Carregando candidaturas...</p>
              ) : applications.length === 0 ? (
                <p style={{ color: "#94a3b8", marginTop: 12 }}>
                  Nenhuma candidatura encontrada. <a href="/" style={{ color: "var(--color-primary)", textDecoration: "underline" }}>Analise uma vaga</a> para começar.
                </p>
              ) : (
                <div style={{ overflowX: "auto", marginTop: 16 }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                    <thead>
                      <tr style={{ borderBottom: "1px solid var(--color-border)" }}>
                        <th style={{ textAlign: "left", padding: "8px 6px", fontWeight: 600, color: "var(--color-muted)", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.06em" }}>Vaga</th>
                        <th style={{ textAlign: "center", padding: "8px 6px", fontWeight: 600, color: "var(--color-muted)", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.06em" }}>Score ATS</th>
                        <th style={{ textAlign: "center", padding: "8px 6px", fontWeight: 600, color: "var(--color-muted)", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.06em" }}>Status</th>
                        <th style={{ textAlign: "right", padding: "8px 6px", fontWeight: 600, color: "var(--color-muted)", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.06em" }}>Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {applications.map((app) => (
                        <tr key={app.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                          <td style={{ padding: "10px 6px" }}>
                            <span style={{ fontWeight: 500 }}>{app.job_title || "Vaga"}</span>
                            <div style={{ fontSize: 11, color: "var(--color-faint)", marginTop: 2 }}>
                              {new Date(app.created_at).toLocaleDateString("pt-BR")}
                            </div>
                          </td>
                          <td style={{ padding: "10px 6px", textAlign: "center" }}>
                            <span style={{
                              fontFamily: "var(--font-mono)",
                              fontWeight: 600,
                              fontSize: 14,
                              color: app.compatibilidade_geral >= 70 ? "var(--color-success)" : app.compatibilidade_geral >= 40 ? "#f59e0b" : "#ef4444",
                            }}>
                              {Math.round(app.compatibilidade_geral || 0)}%
                            </span>
                          </td>
                          <td style={{ padding: "10px 6px", textAlign: "center" }}>
                            <select
                              value={app.status}
                              onChange={(e) => handleStatusChange(app.id, e.target.value)}
                              style={{
                                padding: "5px 8px",
                                borderRadius: 6,
                                border: `1px solid ${STATUS_MAP[app.status]?.color || "#e2e8f0"}`,
                                background: `${STATUS_MAP[app.status]?.color}15`,
                                color: STATUS_MAP[app.status]?.color,
                                fontWeight: 600,
                                fontSize: 12,
                                cursor: "pointer",
                              }}
                            >
                              {STATUS_ORDER.map((s) => (
                                <option key={s} value={s}>{STATUS_MAP[s].label}</option>
                              ))}
                            </select>
                          </td>
                          <td style={{ padding: "10px 6px", textAlign: "right" }}>
                            <div style={{ display: "flex", gap: 6, justifyContent: "flex-end" }}>
                              <button
                                className="btn-secondary"
                                style={{ fontSize: 12, padding: "6px 12px" }}
                                onClick={() => navigate(`/curriculo`)}
                              >
                                Ver
                              </button>
                              <a
                                className="btn-secondary"
                                style={{ fontSize: 12, padding: "6px 12px", textDecoration: "none" }}
                                href={`${import.meta.env.VITE_API_URL}/resumes/${app.id}/?format=pdf`}
                                target="_blank"
                                rel="noreferrer"
                              >
                                PDF
                              </a>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            <div className="card">
              <h3 style={{ marginTop: 0 }}>Comentários recentes</h3>
              {stats.comentarios_recentes.length === 0 && (
                <p style={{ color: "#94a3b8" }}>Nenhum comentário ainda.</p>
              )}
              {stats.comentarios_recentes.map((c) => (
                <div
                  key={c.id}
                  style={{ borderBottom: "1px solid #f1f5f9", padding: "10px 0", fontSize: 14 }}
                >
                  <strong>{"⭐".repeat(c.rating)}</strong>
                  <p style={{ margin: "4px 0 0", color: "#64748b" }}>{c.comment}</p>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      <div style={{ width: 200 }}>
        <AdSlot label="Barra lateral (200x600)" style={{ height: 400 }} />
      </div>
    </div>
  );
}
