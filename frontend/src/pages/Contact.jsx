import { useState } from "react";
import Button from "../components/Button";
import SectionTitle from "../components/SectionTitle";
import api from "../services/api";
import { dealershipInfo } from "../data/mockVehicles";
import "./Contact.css";

export default function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "General Inquiry",
    preferredContact: "Email",
    message: ""
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [activeFaq, setActiveFaq] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    await api.submitContact(form);
    setSubmitting(false);
    setSubmitted(true);
  };

  const faqs = [
    {
      q: "Can I trade in my existing vehicle against a DrivingForce acquisition?",
      a: "Yes. Our appraisal team offers comprehensive valuations within 4 business hours. We handle all equity roll-overs, lease returns, and interstate title transfers."
    },
    {
      q: "Do you offer enclosed white-glove national vehicle delivery?",
      a: "Absolutely. We utilize private climate-controlled transport rigs across the continental United States. Your vehicle arrives in showroom pristine condition directly at your garage."
    },
    {
      q: "What bespoke financing and leasing programs are available?",
      a: "We collaborate with tier-1 private automotive lenders and factory captive financiers to structure bespoke open-end leases, balloon options, and corporate tax-advantaged structures."
    },
    {
      q: "Can I reserve a custom factory-order build through DrivingForce Motors?",
      a: "Yes. Our allocations team holds direct manufacturer pipeline access for bespoke Porsche PTS (Paint to Sample), BMW Individual, Mercedes Manufaktur, and Range Rover SV builds."
    }
  ];

  return (
    <div className="contact-page" id="contact-view">
      {/* Banner */}
      <section className="contact-header-banner">
        <div className="container">
          <SectionTitle
            eyebrow="Direct Concierge"
            title="Connect With"
            highlight="DrivingForce"
            description="Our client advisors and automotive curators are on standby to facilitate bespoke consultations, acquisitions, and private viewings."
          />
        </div>
      </section>

      <div className="container contact-main-layout">
        {/* Contact Form Column */}
        <div className="contact-form-column glass-panel">
          <h3 className="column-title">Transmit a Message</h3>
          <p className="column-sub">Expect a prompt response from our senior advisory team within 2 hours.</p>

          {submitted ? (
            <div className="contact-success-state">
              <div className="success-badge">✓</div>
              <h3>Message Received</h3>
              <p>
                Thank you, <strong>{form.name}</strong>. Your communication has been dispatched directly to the Executive Concierge Desk. A senior advisor will follow up via {form.preferredContact.toLowerCase()} shortly.
              </p>
              <Button
                variant="outline"
                size="md"
                onClick={() => {
                  setSubmitted(false);
                  setForm({
                    name: "",
                    email: "",
                    phone: "",
                    subject: "General Inquiry",
                    preferredContact: "Email",
                    message: ""
                  });
                }}
              >
                Send Another Message
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="contact-form">
              <div className="form-grid-two">
                <div className="form-group">
                  <label htmlFor="c-name">Full Name *</label>
                  <input
                    id="c-name"
                    type="text"
                    required
                    placeholder="e.g. Julian Sterling"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="c-email">Email Address *</label>
                  <input
                    id="c-email"
                    type="email"
                    required
                    placeholder="e.g. julian@sterling.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-grid-two">
                <div className="form-group">
                  <label htmlFor="c-phone">Phone Number</label>
                  <input
                    id="c-phone"
                    type="tel"
                    placeholder="e.g. +1 (555) 789-0123"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="c-subject">Subject of Interest</label>
                  <select
                    id="c-subject"
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  >
                    <option value="Vehicle Acquisition">Vehicle Acquisition</option>
                    <option value="Private Test Drive">Private Test Drive</option>
                    <option value="Trade-In Appraisal">Trade-In Appraisal</option>
                    <option value="Bespoke Financing">Bespoke Financing & Leasing</option>
                    <option value="Factory Allocation">Factory Allocation Request</option>
                    <option value="General Inquiry">General Inquiry</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Preferred Communication Method</label>
                <div className="radio-group-row">
                  {["Email", "Phone Call", "SMS / WhatsApp"].map((method) => (
                    <label key={method} className="radio-label">
                      <input
                        type="radio"
                        name="preferredContact"
                        value={method}
                        checked={form.preferredContact === method}
                        onChange={(e) => setForm({ ...form, preferredContact: e.target.value })}
                      />
                      <span>{method}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="c-message">Message Details *</label>
                <textarea
                  id="c-message"
                  required
                  rows="4"
                  placeholder="Detail your inquiry, intended timeline, or vehicle specifications..."
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                ></textarea>
              </div>

              <Button type="submit" variant="primary" size="lg" disabled={submitting} id="btn-contact-submit">
                {submitting ? "Transmitting..." : "Send Message to Concierge"}
              </Button>
            </form>
          )}
        </div>

        {/* Showroom Information & Map Card Column */}
        <aside className="contact-info-column">
          {/* Quick Details Card */}
          <div className="showroom-details-card glass-panel">
            <h4 className="info-card-title">Flagship Showroom</h4>
            <div className="info-item-list">
              <div className="info-entry">
                <span className="entry-icon">📍</span>
                <div>
                  <strong>Address</strong>
                  <p>{dealershipInfo.address}</p>
                </div>
              </div>

              <div className="info-entry">
                <span className="entry-icon">📞</span>
                <div>
                  <strong>Direct Line</strong>
                  <p>{dealershipInfo.phoneFormatted}</p>
                </div>
              </div>

              <div className="info-entry">
                <span className="entry-icon">✉️</span>
                <div>
                  <strong>Executive Concierge</strong>
                  <p>{dealershipInfo.email}</p>
                </div>
              </div>

              <div className="info-entry">
                <span className="entry-icon">⏱️</span>
                <div>
                  <strong>Operating Hours</strong>
                  {dealershipInfo.hours.map((h, i) => (
                    <div key={i} className="hours-row">
                      <span className="days">{h.days}:</span>
                      <span className="time">{h.hours}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Map Placeholder Card */}
          <div className="showroom-map-card glass-panel">
            <div className="map-graphic-box">
              <div className="map-grid-lines"></div>
              <div className="map-pulse-marker">
                <div className="map-pin">🏎️</div>
                <div className="map-ripple"></div>
              </div>
              <div className="map-label-tag">DrivingForce Flagship • Silicon Valley</div>
            </div>
            <div className="map-footer">
              <span className="coords">37.4419° N, 122.1430° W</span>
              <Button
                variant="outline"
                size="sm"
                href="https://maps.google.com"
              >
                Get Driving Directions ↗
              </Button>
            </div>
          </div>
        </aside>
      </div>

      {/* FAQ Section */}
      <section className="section faq-section">
        <div className="container">
          <SectionTitle
            eyebrow="Frequently Asked Questions"
            title="Common Client"
            highlight="Inquiries"
            description="Clear answers regarding our acquisition process, vehicle provenance, and ownership advantages."
          />

          <div className="faq-accordion-wrap">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className={`faq-item glass-panel ${activeFaq === idx ? "is-open" : ""}`}
                onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
              >
                <div className="faq-question-row">
                  <h4 className="faq-question">{faq.q}</h4>
                  <span className="faq-toggle-icon">{activeFaq === idx ? "−" : "+"}</span>
                </div>
                {activeFaq === idx && (
                  <div className="faq-answer">
                    <p>{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
