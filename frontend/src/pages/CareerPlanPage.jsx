import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import ProgressBar from "../components/ProgressBar";
import { generateCareerPlan } from "../api/endpoints";
import { useSession } from "../context/SessionContext";

function PlanColumn({ title, items, color }) {
  return (
    <div style={{ flex: 1, minWidth: 220 }}>
      <h4 style={{ color }}>{title}</h4>
      {(items || []).map((item, i) => (
        <div
          key={i}
          style={{
            background: "#f8fafc",
            borderRadius: 10,
            padding: 12,
            marginBottom: 8,
            fontSize: 13,
          }}
        >
          <strong>{item.titulo}</strong>
          <p style={{ margin: "4px 0 0", color: "#64748b" }}>{item.descricao}</p>
        </div>
      ))}
    </div>
  );
}

export default function CareerPlanPage() {
  const { resumeId } = useSession();
  const navigate = useNavigate();
  const [plan, setPlan] = useState(null);

  useEffect(() => {
    if (!resumeId) {
      navigate("/");
      return;
    }
    (async () => {
      const { data } = await generateCareerPlan(resumeId);
      setPlan(data);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!plan) {
    return (
      <div className="page-container">
        <ProgressBar currentStep={4} />
        <div className="card">Montando seu plano de desenvolvimento...</div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <ProgressBar currentStep={4} />

      <div className="card">
        <h2 style={{ marginTop: 0, color: "var(--color-primary-dark)" }}>
          Seu plano de desenvolvimento
        </h2>
        <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
          <PlanColumn title="Curto Prazo (30 dias)" items={plan.curto_prazo} color="var(--color-primary)" />
          <PlanColumn title="Médio Prazo (90 dias)" items={plan.medio_prazo} color="var(--color-success)" />
          <PlanColumn title="Longo Prazo (180 dias)" items={plan.longo_prazo} color="var(--color-primary-dark)" />
        </div>
      </div>
    </div>
  );
}
