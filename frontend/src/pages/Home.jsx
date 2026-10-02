import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Button from "../components/Button";
import SectionTitle from "../components/SectionTitle";
import VehicleCard from "../components/VehicleCard";
import api from "../services/api";
import { dealershipInfo } from "../data/mockVehicles";
import "./Home.css";

export default function Home() {
  const [vehicles, setVehicles] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const res = await api.getVehicles();
      if (res.success) {
        setVehicles(res.data);
      }
      setLoading(false);
    }
    loadData();
  }, []);

  const categories = ["All", "Electric", "Coupe", "SUV", "Sedan"];

  const filteredVehicles = activeCategory === "All"
    ? vehicles.slice(0, 6)
    : vehicles.filter((v) => v.category === activeCategory).slice(0, 6);

  return (
    <div className="home-page" id="home-view">
      {/* Hero Section */}
      <section className="hero-section" id="hero-banner">
        <div className="hero-backdrop-overlay"></div>
        <div className="hero-glow-orb hero-glow-1"></div>
        <div className="hero-glow-orb hero-glow-2"></div>

        <div className="container hero-container">
          <div className="hero-badge-pill">
            <span className="pulse-dot"></span>
            <span>Unrivaled Engineering & Prestige</span>
          </div>

          <h1 className="hero-headline">
            Drive Your <span className="hero-highlight">Ambition</span>
          </h1>

          <p className="hero-subtext">
            Discover premium vehicles built for performance, comfort and every journey. Curated automotive masterpieces engineered to redefine modern luxury.
          </p>

          <div className="hero-cta-group">
            <Button to="/vehicles" variant="primary" size="lg" id="hero-btn-explore">
              Explore Vehicles
            </Button>
            <Button to="/test-drive" variant="secondary" size="lg" id="hero-btn-test-drive">
              Book a Test Drive
            </Button>
          </div>

          {/* Key Metrics Strip */}
          <div className="hero-metrics-strip glass-panel">
            {dealershipInfo.stats.map((stat, idx) => (
              <div key={idx} className="metric-item">
                <span className="metric-value">{stat.value}</span>
                <span className="metric-label">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Vehicles Section */}
      <section className="section featured-section" id="featured-inventory">
        <div className="container">
          <SectionTitle
            eyebrow="Curated Collection"
            title="Featured"
            highlight="Vehicles"
            description="Explore our hand-selected showroom showcase of electric innovators, sports coupes, and commanding grand tourers."
          />

          {/* Category Tabs */}
          <div className="category-tabs-row" role="tablist">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                className={`category-tab-btn ${activeCategory === cat ? "is-active" : ""}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat === "All" ? "All Showroom" : cat}
              </button>
            ))}
          </div>

          {/* Vehicles Grid */}
          {loading ? (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Loading curated inventory...</p>
            </div>
          ) : (
            <div className="vehicles-grid">
              {filteredVehicles.map((vehicle) => (
                <VehicleCard key={vehicle.id} vehicle={vehicle} />
              ))}
            </div>
          )}

          <div className="explore-all-cta">
            <Button to="/vehicles" variant="outline" size="md">
              Browse Complete Inventory ({vehicles.length} Vehicles) →
            </Button>
          </div>
        </div>
      </section>

      {/* Why DrivingForce Motors */}
      <section className="section why-us-section" id="why-drivingforce">
        <div className="container">
          <SectionTitle
            eyebrow="The DrivingForce Standard"
            title="Why DrivingForce"
            highlight="Motors"
            description="We bridge the gap between world-class engineering and an effortless, boutique client experience."
          />

          <div className="benefits-grid">
            <div className="benefit-card glass-panel-glow">
              <div className="benefit-icon-box">🛡️</div>
              <h3 className="benefit-title">Trusted Vehicles</h3>
              <p className="benefit-desc">
                Every vehicle undergoes a rigorous 160-point provenance, mechanical, and electronic diagnostics protocol by certified master technicians.
              </p>
            </div>

            <div className="benefit-card glass-panel-glow">
              <div className="benefit-icon-box">⚡</div>
              <h3 className="benefit-title">Easy Test Drives</h3>
              <p className="benefit-desc">
                Experience high-performance capabilities on tailored highway routes, private track loops, or arranged directly at your residence.
              </p>
            </div>

            <div className="benefit-card glass-panel-glow">
              <div className="benefit-icon-box">💎</div>
              <h3 className="benefit-title">Transparent Pricing</h3>
              <p className="benefit-desc">
                Pure acquisition clarity. Fixed, zero-markup pricing with upfront bespoke leasing, financing, and trade-in valuations.
              </p>
            </div>

            <div className="benefit-card glass-panel-glow">
              <div className="benefit-icon-box">🤝</div>
              <h3 className="benefit-title">Expert Assistance</h3>
              <p className="benefit-desc">
                Personalized concierge guidance from dedicated automotive specialists passionate about matching you to your exact ambition.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Prominent Test Drive CTA Section */}
      <section className="section test-drive-cta-section" id="test-drive-cta">
        <div className="container">
          <div className="cta-banner-card">
            <div className="cta-banner-content">
              <span className="cta-eyebrow">Personalized Experience</span>
              <h2 className="cta-title">Feel the Drive Before You Buy</h2>
              <p className="cta-desc">
                Book a personalized test drive and experience your vehicle on the open road. Our advisors curate custom test routes to let you explore dynamic acceleration, cabin tranquility, and precision handling.
              </p>
              <div className="cta-buttons">
                <Button to="/test-drive" variant="primary" size="lg">
                  Book a Test Drive
                </Button>
                <Button to="/contact" variant="outline" size="lg">
                  Contact Showroom
                </Button>
              </div>
            </div>
            <div className="cta-banner-badge">
              <div className="badge-stat">100%</div>
              <div className="badge-stat-sub">Zero-Obligation Experience</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
