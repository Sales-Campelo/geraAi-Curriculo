import { useEffect, useState } from "react";

import AdSlot from "../components/AdSlot";
import { getStatistics } from "../api/endpoints";

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
  const [stats, setStats] = useState(null);

  useEffect(() => {
    (async () => {
      const { data } = await getStatistics();
      setStats(data);
    })();
  }, []);

  return (
    <div className="page-container" style={{ display: "flex", gap: 24 }}>
      <div style={{ flex: 1 }}>
        <h1 style={{ color: "var(--color-primary-dark)" }}>Dashboard Administrativo</h1>

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
