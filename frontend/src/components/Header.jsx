import { Link, useLocation } from "react-router-dom";

export default function Header() {
  const { pathname } = useLocation();
  const isAdmin = pathname === "/admin";

  return (
    <header
      style={{
        background: "rgba(255,255,255,0.85)",
        backdropFilter: "blur(8px)",
        borderBottom: "1px solid var(--color-border)",
        padding: "18px 20px",
        position: "sticky",
        top: 0,
        zIndex: 10,
      }}
    >
      <div
        className="page-container"
        style={{
          padding: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Link
          to="/"
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 600,
            fontSize: 21,
            color: "var(--color-primary-dark)",
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <span
            style={{
              width: 9,
              height: 9,
              borderRadius: "50%",
              background: "var(--color-success)",
              display: "inline-block",
            }}
          />
          GeraAI <span style={{ fontStyle: "italic", color: "var(--color-success)" }}>Currículo</span>
        </Link>
        <nav style={{ display: "flex", gap: 22, fontSize: 13.5, fontWeight: 500 }}>
          <Link
            to="/"
            style={{ color: !isAdmin ? "var(--color-primary-dark)" : "var(--color-muted)" }}
          >
            Início
          </Link>
          <Link
            to="/admin"
            style={{ color: isAdmin ? "var(--color-primary-dark)" : "var(--color-muted)" }}
          >
            Dashboard
          </Link>
        </nav>
      </div>
    </header>
  );
}
