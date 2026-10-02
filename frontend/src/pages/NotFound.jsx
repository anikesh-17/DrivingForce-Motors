import Button from "../components/Button";

export default function NotFound() {
  return (
    <div className="container" style={{ minHeight: "65vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", paddingBlock: "4rem" }}>
      <span style={{ fontSize: "4rem", marginBottom: "1rem" }}>🏎️</span>
      <h1 style={{ fontSize: "3rem", marginBottom: "0.5rem" }}>404</h1>
      <h2 style={{ fontSize: "1.5rem", marginBottom: "1rem", color: "var(--text-secondary)" }}>Off-Track — Page Not Found</h2>
      <p style={{ maxWidth: "480px", color: "var(--text-muted)", marginBottom: "2rem" }}>
        The route you are navigating does not exist in our showroom catalog. Let us steer you back to our vehicle inventory.
      </p>
      <div style={{ display: "flex", gap: "1rem" }}>
        <Button to="/" variant="primary" size="md">Return Home</Button>
        <Button to="/vehicles" variant="outline" size="md">View Fleet</Button>
      </div>
    </div>
  );
}
