import "./SectionTitle.css";

export default function SectionTitle({
  eyebrow,
  title,
  highlight,
  description,
  align = "center",
  className = ""
}) {
  return (
    <div className={`section-title-wrap align-${align} ${className}`}>
      {eyebrow && (
        <div className="section-eyebrow">
          <span className="eyebrow-dot"></span>
          <span>{eyebrow}</span>
        </div>
      )}
      <h2 className="section-heading">
        {title} {highlight && <span className="highlight-text">{highlight}</span>}
      </h2>
      {description && <p className="section-desc">{description}</p>}
    </div>
  );
}
