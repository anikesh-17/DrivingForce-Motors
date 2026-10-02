import Button from "../components/Button";
import SectionTitle from "../components/SectionTitle";
import { dealershipInfo } from "../data/mockVehicles";
import "./About.css";

export default function About() {
  const values = [
    {
      title: "Precision Engineering",
      icon: "⚙️",
      desc: "We celebrate mechanical and software perfection. Every vehicle we represent is vetted against exhaustive factory engineering benchmarks."
    },
    {
      title: "Uncompromising Integrity",
      icon: "⚖️",
      desc: "Fixed acquisition pricing, authentic vehicle pedigrees, and transparent history records. We eliminate dealership ambiguity entirely."
    },
    {
      title: "Elevated Experience",
      icon: "✨",
      desc: "From personalized track drives to enclosed home delivery, our concierge treats each acquisition as a milestone personal event."
    },
    {
      title: "Innovation First",
      icon: "🔋",
      desc: "Leading the high-performance electrification era with specialized charging infrastructure, battery diagnostics, and next-gen powertrains."
    }
  ];

  const leadership = [
    {
      name: "Marcus Vance",
      role: "Founder & Chief Executive Officer",
      bio: "Former endurance racing driver and automotive engineer with 20+ years curating bespoke collections for distinguished clientele.",
      img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80"
    },
    {
      name: "Elena Rostova",
      role: "VP of Vehicle Acquisition & Provenance",
      bio: "Master mechanical inspector formerly with Porsche Motorsport Europe, specializing in hypercar authentication and powertrain certification.",
      img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80"
    },
    {
      name: "Darius Chen",
      role: "Director of VIP Client Experience",
      bio: "Concierge architect with background in luxury hospitality, dedicated to seamless test drive logistics and tailored delivery services.",
      img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80"
    }
  ];

  return (
    <div className="about-page" id="about-view">
      {/* Header Banner */}
      <section className="about-hero-banner">
        <div className="container">
          <SectionTitle
            eyebrow="The Heritage"
            title="Redefining the Luxury"
            highlight="Dealership"
            description="DrivingForce Motors was founded with a singular conviction: acquiring a world-class automobile should feel as exhilarating as driving one."
          />
        </div>
      </section>

      {/* Who We Are Editorial */}
      <section className="section who-we-are-section">
        <div className="container who-we-are-grid">
          <div className="who-text-content">
            <span className="editorial-eyebrow">Who We Are</span>
            <h2 className="editorial-title">Where Passion Meets Provenance</h2>
            <p className="editorial-lead">
              Headquartered in Silicon Valley with experience centers spanning Los Angeles, New York, and Miami, DrivingForce Motors is the premier destination for discerning drivers.
            </p>
            <p className="editorial-body">
              We bridge the gap between boutique automotive collectors and contemporary luxury buyers. Unlike traditional volume dealerships, every vehicle in our inventory is individually curated, subjected to 160-point mechanical diagnostics, and road-tested by certified specialists before earning its place in our showroom.
            </p>
            <div className="who-highlights-row">
              <div className="wh-stat">
                <span className="wh-number">100%</span>
                <span className="wh-label">Clean Title & Provenance</span>
              </div>
              <div className="wh-stat">
                <span className="wh-number">160+</span>
                <span className="wh-label">Point Inspection Protocol</span>
              </div>
              <div className="wh-stat">
                <span className="wh-number">15+</span>
                <span className="wh-label">Years of Excellence</span>
              </div>
            </div>
          </div>

          <div className="who-image-frame glass-panel">
            <img
              src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1000&q=80"
              alt="DrivingForce Motors Showroom Experience"
              className="editorial-img"
            />
            <div className="image-caption-badge">
              <span>Flagship Automotive Sanctuary • Silicon Valley</span>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision Split */}
      <section className="section mission-vision-section">
        <div className="container mission-vision-grid">
          <div className="mv-card glass-panel-glow">
            <div className="mv-badge">Our Mission</div>
            <h3 className="mv-title">Elevating the Automotive Journey</h3>
            <p className="mv-desc">
              To deliver an effortless, transparent, and exhilarating vehicle acquisition experience by combining deep mechanical expertise, fixed upfront pricing, and uncompromised concierge service.
            </p>
          </div>

          <div className="mv-card glass-panel-glow">
            <div className="mv-badge">Our Vision</div>
            <h3 className="mv-title">Pioneering the Next Era of Performance</h3>
            <p className="mv-desc">
              To stand as the global benchmark for luxury automotive retail, seamlessly bridging the transition from internal combustion icons to high-performance electric supercars.
            </p>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="section values-section">
        <div className="container">
          <SectionTitle
            eyebrow="Our Foundation"
            title="The DrivingForce"
            highlight="Core Values"
            description="Four immutable principles that steer every transaction, inspection, and client relationship."
          />

          <div className="values-cards-grid">
            {values.map((v, i) => (
              <div key={i} className="value-card glass-panel">
                <div className="value-icon">{v.icon}</div>
                <h4 className="value-card-title">{v.title}</h4>
                <p className="value-card-desc">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Customers Choose Us */}
      <section className="section why-choose-section">
        <div className="container choose-box glass-panel">
          <div className="choose-content">
            <SectionTitle
              eyebrow="The DFM Advantage"
              title="Why Clients Choose"
              highlight="DrivingForce"
              description="A boutique approach designed around your time, discretion, and driving ambitions."
              align="left"
            />

            <div className="reasons-list">
              <div className="reason-item">
                <span className="reason-num">01</span>
                <div>
                  <strong>No Haggling, Zero Dealer Fees:</strong>
                  <p>Transparent pricing means the price you see is the price you pay. No hidden documentation upcharges or surprise prep fees.</p>
                </div>
              </div>
              <div className="reason-item">
                <span className="reason-num">02</span>
                <div>
                  <strong>Enclosed Doorstep Delivery:</strong>
                  <p>We deliver your vehicle directly to your driveway in a climate-controlled transport vehicle anywhere in North America.</p>
                </div>
              </div>
              <div className="reason-item">
                <span className="reason-num">03</span>
                <div>
                  <strong>7-Day / 500-Mile Peace of Mind:</strong>
                  <p>Enjoy total confidence with our complimentary exchange guarantee should your acquired vehicle not completely satisfy your lifestyle.</p>
                </div>
              </div>
            </div>

            <div className="choose-cta">
              <Button to="/vehicles" variant="primary" size="lg">
                Explore The Fleet
              </Button>
              <Button to="/test-drive" variant="outline" size="lg">
                Book a Private Viewing
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Leadership Team */}
      <section className="section leadership-section">
        <div className="container">
          <SectionTitle
            eyebrow="Master Curators"
            title="Executive"
            highlight="Leadership"
            description="The dedicated automotive specialists steering DrivingForce Motors."
          />

          <div className="leadership-grid">
            {leadership.map((member, i) => (
              <div key={i} className="leader-card glass-panel">
                <div className="leader-photo-wrap">
                  <img src={member.img} alt={member.name} className="leader-img" />
                </div>
                <div className="leader-info">
                  <h4 className="leader-name">{member.name}</h4>
                  <span className="leader-role">{member.role}</span>
                  <p className="leader-bio">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
