import { Link } from "react-router-dom";
import "./Button.css";

export default function Button({
  children,
  to,
  href,
  variant = "primary",
  size = "md",
  className = "",
  icon = null,
  iconPosition = "right",
  disabled = false,
  onClick,
  type = "button",
  ...props
}) {
  const buttonClass = `dfm-btn dfm-btn-${variant} dfm-btn-${size} ${className} ${disabled ? "dfm-btn-disabled" : ""}`;

  const content = (
    <>
      {icon && iconPosition === "left" && <span className="dfm-btn-icon left">{icon}</span>}
      <span className="dfm-btn-label">{children}</span>
      {icon && iconPosition === "right" && <span className="dfm-btn-icon right">{icon}</span>}
    </>
  );

  if (to && !disabled) {
    return (
      <Link to={to} className={buttonClass} {...props}>
        {content}
      </Link>
    );
  }

  if (href && !disabled) {
    return (
      <a href={href} className={buttonClass} target="_blank" rel="noopener noreferrer" {...props}>
        {content}
      </a>
    );
  }

  return (
    <button type={type} className={buttonClass} disabled={disabled} onClick={onClick} {...props}>
      {content}
    </button>
  );
}
