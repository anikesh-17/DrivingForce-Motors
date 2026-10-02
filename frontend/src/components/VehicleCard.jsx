import { Link } from "react-router-dom";
import Button from "./Button";
import "./VehicleCard.css";

export default function VehicleCard({ vehicle }) {
  if (!vehicle) return null;

  const formattedPrice = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0
  }).format(vehicle.price);

  return (
    <article className="dfm-vehicle-card" id={`vehicle-card-${vehicle.id}`}>
      {/* Card Media Preview */}
      <div className="card-media-wrapper">
        <Link to={`/vehicles/${vehicle.id}`} className="card-image-link" tabIndex={-1}>
          <img
            src={vehicle.images?.[0] || "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=800&q=80"}
            alt={`${vehicle.year} ${vehicle.brand} ${vehicle.model}`}
            className="vehicle-thumbnail"
            loading="lazy"
          />
        </Link>

        {/* Top Badges */}
        <div className="card-badges-row">
          <span className="card-pill badge-brand">{vehicle.brand}</span>
          {vehicle.fuelType === "Electric" && (
            <span className="card-pill badge-electric">⚡ EV</span>
          )}
          {vehicle.availability && (
            <span className={`card-pill badge-status ${vehicle.availability.toLowerCase().replace(/\s+/g, "-")}`}>
              {vehicle.availability}
            </span>
          )}
        </div>
      </div>

      {/* Card Body */}
      <div className="card-body-content">
        <div className="card-header-info">
          <div className="model-row">
            <h3 className="vehicle-title">
              <Link to={`/vehicles/${vehicle.id}`}>
                {vehicle.brand} {vehicle.model}
              </Link>
            </h3>
            <span className="vehicle-year">{vehicle.year}</span>
          </div>
          <p className="vehicle-variant">{vehicle.variant}</p>
        </div>

        {/* Spec Chips */}
        <div className="card-specs-grid">
          <div className="spec-chip" title="Fuel Type">
            <span className="spec-icon">⛽</span>
            <span className="spec-val">{vehicle.fuelType}</span>
          </div>
          <div className="spec-chip" title="Transmission">
            <span className="spec-icon">⚙️</span>
            <span className="spec-val">{vehicle.transmission.split(" ")[0]}</span>
          </div>
          <div className="spec-chip" title="Horsepower">
            <span className="spec-icon">🐎</span>
            <span className="spec-val">{vehicle.horsepower}</span>
          </div>
          <div className="spec-chip" title="Acceleration 0-60">
            <span className="spec-icon">⏱️</span>
            <span className="spec-val">{vehicle.acceleration.split(" ")[0]}</span>
          </div>
        </div>

        {/* Price & Action Row */}
        <div className="card-footer-row">
          <div className="price-stack">
            <span className="price-label">Starting at</span>
            <span className="vehicle-price">{formattedPrice}</span>
          </div>

          <div className="card-action-group">
            <Button
              to={`/vehicles/${vehicle.id}`}
              variant="primary"
              size="sm"
              className="card-cta-btn"
            >
              View Details
            </Button>
            <Button
              to={`/test-drive?vehicleId=${vehicle.id}`}
              variant="outline"
              size="sm"
              className="card-test-btn"
              title="Book Test Drive"
            >
              Test Drive
            </Button>
          </div>
        </div>
      </div>
    </article>
  );
}
