import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import Button from "../components/Button";
import SectionTitle from "../components/SectionTitle";
import api from "../services/api";
import { dealershipInfo } from "../data/mockVehicles";
import "./TestDrive.css";

export default function TestDrive() {
  const [searchParams] = useSearchParams();
  const preselectedVehicleId = searchParams.get("vehicleId") || "";

  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [confirmation, setConfirmation] = useState(null);

  // Form Fields
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    vehicleId: preselectedVehicleId,
    date: "",
    timeSlot: "10:00 AM",
    location: dealershipInfo.locations[0],
    experienceType: "Showroom & Highway Experience",
    notes: ""
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    async function loadVehicles() {
      setLoading(true);
      const res = await api.getVehicles();
      if (res.success) {
        setVehicles(res.data);
        if (!formData.vehicleId && res.data.length > 0) {
          setFormData((prev) => ({
            ...prev,
            vehicleId: preselectedVehicleId || res.data[0].id
          }));
        }
      }
      setLoading(false);
    }
    loadVehicles();
  }, [preselectedVehicleId]);

  // Tomorrow's date for datepicker min value
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split("T")[0];

  const validate = () => {
    const errs = {};
    if (!formData.fullName.trim()) errs.fullName = "Full name is required";
    if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) {
      errs.email = "Valid email address is required";
    }
    if (!formData.phone.trim() || formData.phone.length < 8) {
      errs.phone = "Valid phone number is required";
    }
    if (!formData.vehicleId) errs.vehicleId = "Please select a vehicle";
    if (!formData.date) errs.date = "Please select an appointment date";
    if (!formData.timeSlot) errs.timeSlot = "Please choose a preferred time";
    if (!formData.location) errs.location = "Please select a location";

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    const selectedVehicle = vehicles.find((v) => v.id === formData.vehicleId);

    const payload = {
      ...formData,
      vehicleDetails: selectedVehicle
        ? `${selectedVehicle.brand} ${selectedVehicle.model} (${selectedVehicle.variant})`
        : "Custom Fleet Selection"
    };

    const res = await api.bookTestDrive(payload);
    setSubmitting(false);

    if (res.success) {
      setConfirmation({
        reference: res.bookingReference,
        data: payload,
        vehicle: selectedVehicle
      });
      window.scrollTo({ top: 120, behavior: "smooth" });
    }
  };

  const selectedVehicleObj = vehicles.find((v) => v.id === formData.vehicleId);

  return (
    <div className="test-drive-page" id="test-drive-view">
      {/* Page Header */}
      <section className="td-header-banner">
        <div className="container">
          <SectionTitle
            eyebrow="VIP Appointment"
            title="Book Your"
            highlight="Test Drive"
            description="Experience automotive craftsmanship behind the wheel. Selected routes, uninterrupted throttle response, and personalized vehicle orientation."
          />
        </div>
      </section>

      <div className="container td-layout-container">
        {confirmation ? (
          /* Confirmation Success Card */
          <div className="confirmation-card glass-panel" id="booking-confirmation-view">
            <div className="confirmation-check-badge">✓</div>
            <span className="confirmation-eyebrow">Appointment Confirmed</span>
            <h2 className="confirmation-title">Your Drive Is Scheduled</h2>
            <p className="confirmation-subtitle">
              We have reserved your session. A DrivingForce Concierge has dispatched your confirmation packet to <strong>{confirmation.data.email}</strong>.
            </p>

            <div className="booking-summary-box">
              <div className="summary-field">
                <span className="s-label">Confirmation Reference</span>
                <span className="s-val monospace highlight-red">{confirmation.reference}</span>
              </div>
              <div className="summary-field">
                <span className="s-label">Selected Vehicle</span>
                <span className="s-val">
                  {confirmation.vehicle ? `${confirmation.vehicle.brand} ${confirmation.vehicle.model}` : "Selected Model"}
                </span>
              </div>
              <div className="summary-field">
                <span className="s-label">Date & Time</span>
                <span className="s-val">{confirmation.data.date} at {confirmation.data.timeSlot}</span>
              </div>
              <div className="summary-field">
                <span className="s-label">Dealership Hub</span>
                <span className="s-val">{confirmation.data.location}</span>
              </div>
              <div className="summary-field">
                <span className="s-label">Driver</span>
                <span className="s-val">{confirmation.data.fullName} ({confirmation.data.phone})</span>
              </div>
            </div>

            <div className="confirmation-instructions">
              <h4>What to bring on your drive:</h4>
              <ul>
                <li>Valid government-issued driver’s license</li>
                <li>Proof of current comprehensive automotive insurance</li>
              </ul>
            </div>

            <div className="confirmation-actions">
              <Button to="/vehicles" variant="primary" size="md">
                Browse More Vehicles
              </Button>
              <Button
                variant="outline"
                size="md"
                onClick={() => {
                  setConfirmation(null);
                  setFormData({
                    fullName: "",
                    email: "",
                    phone: "",
                    vehicleId: vehicles[0]?.id || "",
                    date: "",
                    timeSlot: "10:00 AM",
                    location: dealershipInfo.locations[0],
                    experienceType: "Showroom & Highway Experience",
                    notes: ""
                  });
                }}
              >
                Book Another Drive
              </Button>
            </div>
          </div>
        ) : (
          /* Booking Form & Preview Sidebar */
          <div className="td-grid">
            {/* Form Column */}
            <div className="td-form-column glass-panel">
              <h3 className="td-form-title">Driver & Reservation Details</h3>
              <p className="td-form-desc">
                Fill in the details below to reserve your private drive experience.
              </p>

              <form onSubmit={handleSubmit} noValidate className="test-drive-form">
                {/* Full Name */}
                <div className="form-row">
                  <div className="form-group flex-1">
                    <label htmlFor="td-name">Full Name *</label>
                    <input
                      id="td-name"
                      type="text"
                      placeholder="e.g. Eleanor Vance"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className={errors.fullName ? "is-invalid" : ""}
                    />
                    {errors.fullName && <span className="field-error">{errors.fullName}</span>}
                  </div>
                </div>

                {/* Email & Phone */}
                <div className="form-row two-cols">
                  <div className="form-group">
                    <label htmlFor="td-email">Email Address *</label>
                    <input
                      id="td-email"
                      type="email"
                      placeholder="e.g. eleanor@vance.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className={errors.email ? "is-invalid" : ""}
                    />
                    {errors.email && <span className="field-error">{errors.email}</span>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="td-phone">Phone Number *</label>
                    <input
                      id="td-phone"
                      type="tel"
                      placeholder="e.g. (555) 392-0192"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className={errors.phone ? "is-invalid" : ""}
                    />
                    {errors.phone && <span className="field-error">{errors.phone}</span>}
                  </div>
                </div>

                {/* Vehicle Selection */}
                <div className="form-row">
                  <div className="form-group flex-1">
                    <label htmlFor="td-vehicle">Select Vehicle of Interest *</label>
                    <select
                      id="td-vehicle"
                      value={formData.vehicleId}
                      onChange={(e) => setFormData({ ...formData, vehicleId: e.target.value })}
                      className={errors.vehicleId ? "is-invalid" : ""}
                    >
                      {loading ? (
                        <option value="">Loading fleet...</option>
                      ) : (
                        vehicles.map((v) => (
                          <option key={v.id} value={v.id}>
                            {v.year} {v.brand} {v.model} ({v.variant}) — ${v.price.toLocaleString()}
                          </option>
                        ))
                      )}
                    </select>
                    {errors.vehicleId && <span className="field-error">{errors.vehicleId}</span>}
                  </div>
                </div>

                {/* Date & Time */}
                <div className="form-row two-cols">
                  <div className="form-group">
                    <label htmlFor="td-date">Appointment Date *</label>
                    <input
                      id="td-date"
                      type="date"
                      min={minDate}
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className={errors.date ? "is-invalid" : ""}
                    />
                    {errors.date && <span className="field-error">{errors.date}</span>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="td-time">Preferred Time Slot *</label>
                    <select
                      id="td-time"
                      value={formData.timeSlot}
                      onChange={(e) => setFormData({ ...formData, timeSlot: e.target.value })}
                    >
                      <option value="10:00 AM">Morning — 10:00 AM</option>
                      <option value="11:30 AM">Late Morning — 11:30 AM</option>
                      <option value="01:30 PM">Afternoon — 01:30 PM</option>
                      <option value="03:30 PM">Mid Afternoon — 03:30 PM</option>
                      <option value="05:30 PM">Sunset Drive — 05:30 PM</option>
                    </select>
                  </div>
                </div>

                {/* Dealership Location */}
                <div className="form-row">
                  <div className="form-group flex-1">
                    <label htmlFor="td-location">Dealership Hub / Location *</label>
                    <select
                      id="td-location"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    >
                      {dealershipInfo.locations.map((loc, i) => (
                        <option key={i} value={loc}>
                          {loc}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Special Requests */}
                <div className="form-row">
                  <div className="form-group flex-1">
                    <label htmlFor="td-notes">Special Requests / Performance Preferences</label>
                    <textarea
                      id="td-notes"
                      rows="3"
                      placeholder="e.g. Interested in comparing with the Taycan, request highway acceleration run, or doorstep delivery..."
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    ></textarea>
                  </div>
                </div>

                {/* Submit CTA */}
                <div className="form-actions-wrap">
                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    disabled={submitting}
                    className="w-full"
                    id="btn-submit-test-drive"
                  >
                    {submitting ? "Confirming Reservation..." : "Book Test Drive"}
                  </Button>
                  <p className="privacy-reassurance">
                    🔒 Zero spam guarantee. We will never share your personal information.
                  </p>
                </div>
              </form>
            </div>

            {/* Sidebar Column: Selected Vehicle Card & Drive Perks */}
            <aside className="td-sidebar-column">
              {selectedVehicleObj && (
                <div className="selected-vehicle-preview glass-panel">
                  <span className="preview-label">Selected Machinery</span>
                  <div className="preview-thumb-wrap">
                    <img
                      src={selectedVehicleObj.images?.[0]}
                      alt={selectedVehicleObj.model}
                      className="preview-img"
                    />
                    <span className="preview-badge">{selectedVehicleObj.brand}</span>
                  </div>
                  <h4 className="preview-title">
                    {selectedVehicleObj.brand} {selectedVehicleObj.model}
                  </h4>
                  <p className="preview-variant">{selectedVehicleObj.variant}</p>
                  <div className="preview-specs-mini">
                    <span>⚡ {selectedVehicleObj.horsepower}</span>
                    <span>⏱️ {selectedVehicleObj.acceleration}</span>
                    <span>⛽ {selectedVehicleObj.fuelType}</span>
                  </div>
                </div>
              )}

              <div className="drive-experience-perks glass-panel">
                <h4 className="perks-heading">The DrivingForce Test Drive Experience</h4>
                <ul className="perks-list">
                  <li>
                    <span className="perk-bullet">✦</span>
                    <div>
                      <strong>Bespoke Drive Route:</strong> Curated mix of twisty asphalt, open freeway, and smooth pavement.
                    </div>
                  </li>
                  <li>
                    <span className="perk-bullet">✦</span>
                    <div>
                      <strong>Brand Specialist:</strong> 1-on-1 guidance on digital cockpit, launch controls, and safety systems.
                    </div>
                  </li>
                  <li>
                    <span className="perk-bullet">✦</span>
                    <div>
                      <strong>Zero Sales Pressure:</strong> An immersive driving evaluation crafted strictly around your schedule.
                    </div>
                  </li>
                </ul>
              </div>
            </aside>
          </div>
        )}
      </div>
    </div>
  );
}
