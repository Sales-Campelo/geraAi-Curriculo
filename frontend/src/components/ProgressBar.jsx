const STEPS = ["Vaga", "Entrevista", "Resultado", "Currículo", "Plano"];

export default function ProgressBar({ currentStep }) {
  return (
    <div className="stepper">
      {STEPS.map((label, i) => (
        <div className="stepper-step" key={label} style={{ flex: i === STEPS.length - 1 ? "0 0 auto" : 1 }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div
              className={
                "stepper-circle" +
                (i < currentStep ? " is-done" : i === currentStep ? " is-active" : "")
              }
            >
              {i < currentStep ? "✓" : i + 1}
            </div>
            <span className={"stepper-label" + (i === currentStep ? " is-active" : "")}>
              {label}
            </span>
          </div>
          {i < STEPS.length - 1 && (
            <div className="stepper-line">
              <div
                className="stepper-line-fill"
                style={{ transform: `scaleX(${i < currentStep ? 1 : 0})` }}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
