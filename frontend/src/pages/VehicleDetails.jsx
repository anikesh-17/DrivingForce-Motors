import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Button from "../components/Button";
import VehicleCard from "../components/VehicleCard";
import api from "../services/api";
import "./VehicleDetails.css";

export default function VehicleDetails() {
  const { id } = useParams();
  const [vehicle, setVehicle] = useState(null);
  const [allVehicles, setAllVehicles] = useState([]);
  const [selectedImage, setSelectedImage] = useState("");
  const [loading, setLoading] = useState(true);
  const [enquireModalOpen, setEnquireModalOpen] = useState(false);
  const [enquireSubmitted, setEnquireSubmitted] = useState(false);
  const [enquiryForm, setEnquiryForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [submittingEnquiry, setSubmittingEnquiry] = useState(false);

  useEffect(() => {
    async function fetchDetails() {
      setLoading(true);
      const [vehicleRes, allRes] = await Promise.all([
        api.getVehicleById(id),
        api.getVehicles()
      ]);

      if (vehicleRes.success) {
        setVehicle(vehicleRes.data);
        setSelectedImage(vehicleRes.data.images?.[0] || "");
      }
      if (allRes.success) {
        setAllVehicles(allRes.data);
      }
      setLoading(false);
    }
    fetchDetails();
  }, [id]);

  const handleEnquirySubmit = async (e) => {
    e.preventDefault();
    setSubmittingEnquiry(true);
    await api.submitContact({
      ...enquiryForm,
      vehicle: `${vehicle.brand} ${vehicle.model} (${vehicle.variant})`,
      type: "Vehicle Acquisition Enquiry"
    });
    setSubmittingEnquiry(false);
    setEnquireSubmitted(true);
  };

  if (loading) {
    return (
      <div className="container details-loading">
        <div className="spinner"></div>
        <p>Loading vehicle specifications...</p>
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className="container not-found-view">
        <h2>Vehicle Not Found</h2>
        <p>The vehicle you are seeking is either no longer available or the identifier is invalid.</p>
        <Button to="/vehicles" variant="primary">
          Back to Inventory
        </Button>
      </div>
    );
  }

  const formattedPrice = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0
  }).format(vehicle.price);

  const relatedVehicles = allVehicles
    .filter((v) => v.id !== vehicle.id)
    .slice(0, 3);

  return (
    <div className="vehicle-details-page" id="vehicle-details-view">
      {/* Breadcrumb Navigation */}
      <div className="container breadcrumb-wrap">
        <nav aria-label="Breadcrumb">
          <ol className="breadcrumbs-list">
            <li><Link to="/">Home</Link></li>
            <li><span className="bc-sep">/</span></li>
            <li><Link to="/vehicles">Vehicles</Link></li>
            <li><span className="bc-sep">/</span></li>
            <li className="bc-current">{vehicle.brand} {vehicle.model}</li>
          </ol>
        </nav>
      </div>

      <div className="container details-main-layout">
        {/* Left Column: Image Gallery & Overview */}
        <div className="gallery-and-overview">
          {/* Main Large Display Image */}
          <div className="main-gallery-display glass-panel">
            <img
              src={selectedImage}
              alt={`${vehicle.brand} ${vehicle.model}`}
              className="featured-display-img"
            />
            <div className="gallery-badge-overlay">
              <span className={`pill-availability ${vehicle.availability.toLowerCase().replace(/\s+/g, "-")}`}>
                ● {vehicle.availability}
              </span>
              <span className="pill-category">{vehicle.category}</span>
            </div>
          </div>

          {/* Thumbnail Gallery Strip */}
          {vehicle.images && vehicle.images.length > 1 && (
            <div className="thumbnails-strip">
              {vehicle.images.map((imgUrl, idx) => (
                <button
                  key={idx}
                  type="button"
                  className={`thumb-btn ${selectedImage === imgUrl ? "active" : ""}`}
                  onClick={() => setSelectedImage(imgUrl)}
                >
                  <img src={imgUrl} alt={`Thumbnail ${idx + 1}`} />
                </button>
              ))}
            </div>
          )}

          {/* Detailed Specifications Section */}
          <div className="specifications-section glass-panel">
            <h3 className="section-subheading">Technical Specifications</h3>
            <div className="specs-detail-grid">
              <div className="spec-card">
                <span className="spec-label">Fuel Type</span>
                <span className="spec-value">{vehicle.fuelType}</span>
              </div>
              <div className="spec-card">
                <span className="spec-label">Transmission</span>
                <span className="spec-value">{vehicle.transmission}</span>
              </div>
              <div className="spec-card">
                <span className="spec-label">Efficiency / Range</span>
                <span className="spec-value">{vehicle.mileage}</span>
              </div>
              <div className="spec-card">
                <span className="spec-label">Seating Capacity</span>
                <span className="spec-value">{vehicle.seating}</span>
              </div>
              <div className="spec-card">
                <span className="spec-label">Model Year</span>
                <span className="spec-value">{vehicle.year}</span>
              </div>
              <div className="spec-card">
                <span className="spec-label">Exterior Color</span>
                <span className="spec-value">{vehicle.color}</span>
              </div>
              <div className="spec-card">
                <span className="spec-label">Horsepower</span>
                <span className="spec-value">{vehicle.horsepower}</span>
              </div>
              <div className="spec-card">
                <span className="spec-label">Acceleration</span>
                <span className="spec-value">{vehicle.acceleration}</span>
              </div>
              <div className="spec-card">
                <span className="spec-label">Top Speed</span>
                <span className="spec-value">{vehicle.topSpeed}</span>
              </div>
              <div className="spec-card">
                <span className="spec-label">Drivetrain</span>
                <span className="spec-value">{vehicle.drivetrain}</span>
              </div>
              <div className="spec-card full-width">
                <span className="spec-label">Vehicle Identification (VIN)</span>
                <span className="spec-value monospace">{vehicle.vin}</span>
              </div>
            </div>
          </div>

          {/* Description & Overview */}
          <div className="description-section glass-panel">
            <h3 className="section-subheading">Curator Overview</h3>
            <p className="vehicle-editorial">{vehicle.description}</p>
          </div>

          {/* Key Features & Options */}
          {vehicle.features && (
            <div className="features-section glass-panel">
              <h3 className="section-subheading">Installed Equipment & Options</h3>
              <div className="features-checklist-grid">
                {vehicle.features.map((feature, idx) => (
                  <div key={idx} className="feature-item">
                    <span className="feature-check">✓</span>
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Pricing, Primary Actions & Concierge Card */}
        <aside className="details-action-sidebar">
          <div className="pricing-card glass-panel-glow">
            <div className="brand-header">
              <span className="brand-badge">{vehicle.brand}</span>
              <span className="model-year-text">{vehicle.year} Model</span>
            </div>

            <h1 className="details-vehicle-title">{vehicle.model}</h1>
            <p className="details-variant">{vehicle.variant}</p>

            <div className="details-price-block">
              <span className="price-tagline">Acquisition Price</span>
              <div className="details-price">{formattedPrice}</div>
              <span className="tax-notice">Taxes, title, and registration extra. Zero dealer markup.</span>
            </div>

            {/* Action CTA Buttons */}
            <div className="details-cta-stack">
              <Button
                to={`/test-drive?vehicleId=${vehicle.id}`}
                variant="primary"
                size="lg"
                className="w-full"
                id="btn-details-test-drive"
              >
                Book Test Drive
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="w-full"
                onClick={() => setEnquireModalOpen(true)}
                id="btn-details-enquire"
              >
                Enquire Now
              </Button>
            </div>

            <div className="concierge-guarantee">
              <div className="guarantee-row">
                <span>🛡️</span>
                <span>DrivingForce Certified Provenance</span>
              </div>
              <div className="guarantee-row">
                <span>⚡</span>
                <span>White-Glove Home Delivery Available</span>
              </div>
              <div className="guarantee-row">
                <span>💼</span>
                <span>Bespoke Leasing & Financing Concierge</span>
              </div>
            </div>
          </div>
        </aside>
      </div>

      {/* Enquire Now Modal */}
      {enquireModalOpen && (
        <div className="modal-backdrop" onClick={() => setEnquireModalOpen(false)}>
          <div className="enquire-modal glass-panel" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => setEnquireModalOpen(false)}>✕</button>

            {enquireSubmitted ? (
              <div className="enquiry-success-state">
                <div className="success-icon">✓</div>
                <h3>Enquiry Transmitted</h3>
                <p>
                  Thank you. Your dedicated brand advisor has received your enquiry regarding the <strong>{vehicle.year} {vehicle.brand} {vehicle.model}</strong> and will reach out shortly.
                </p>
                <Button variant="primary" size="md" onClick={() => setEnquireModalOpen(false)}>
                  Close
                </Button>
              </div>
            ) : (
              <>
                <h3 className="modal-title">Enquire About This Vehicle</h3>
                <p className="modal-sub">
                  {vehicle.year} {vehicle.brand} {vehicle.model} — {formattedPrice}
                </p>

                <form onSubmit={handleEnquirySubmit} className="enquiry-form">
                  <div className="form-group">
                    <label>Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. John Anderson"
                      value={enquiryForm.name}
                      onChange={(e) => setEnquiryForm({ ...enquiryForm, name: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>Email Address *</label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. john@example.com"
                      value={enquiryForm.email}
                      onChange={(e) => setEnquiryForm({ ...enquiryForm, email: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>Phone Number *</label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. +1 (555) 019-2834"
                      value={enquiryForm.phone}
                      onChange={(e) => setEnquiryForm({ ...enquiryForm, phone: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>Inquiry Details / Trade-in Notes</label>
                    <textarea
                      rows="3"
                      placeholder="Ask about financing, delivery timeline, or schedule a virtual walkthrough..."
                      value={enquiryForm.message}
                      onChange={(e) => setEnquiryForm({ ...enquiryForm, message: e.target.value })}
                    ></textarea>
                  </div>

                  <Button type="submit" variant="primary" size="lg" disabled={submittingEnquiry} className="w-full">
                    {submittingEnquiry ? "Transmitting..." : "Send Acquisition Request"}
                  </Button>
                </form>
              </>
            )}
          </div>
        </div>
      )}

      {/* Related Vehicles Section */}
      {relatedVehicles.length > 0 && (
        <section className="section related-vehicles-section">
          <div className="container">
            <h3 className="related-heading">Similar Vehicles in Collection</h3>
            <div className="vehicles-grid">
              {relatedVehicles.map((v) => (
                <VehicleCard key={v.id} vehicle={v} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
