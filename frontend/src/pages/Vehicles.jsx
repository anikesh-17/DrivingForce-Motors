import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import SectionTitle from "../components/SectionTitle";
import VehicleCard from "../components/VehicleCard";
import Button from "../components/Button";
import api from "../services/api";
import "./Vehicles.css";

export default function Vehicles() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState("");

  // Filter States initialized from URL params if present
  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category") || "All");
  const [selectedFuel, setSelectedFuel] = useState("All");
  const [selectedTransmission, setSelectedTransmission] = useState("All");
  const [maxPrice, setMaxPrice] = useState(250000);
  const [sortBy, setSortBy] = useState("featured");

  useEffect(() => {
    async function loadInventory() {
      setLoading(true);
      try {
        const res = await api.getVehicles();
        setVehicles(res.data);
        setMaxPrice(Math.max(250000, ...res.data.map((vehicle) => vehicle.price)));
      } catch (error) {
        setApiError(error.message || "Unable to load vehicle inventory.");
      } finally {
        setLoading(false);
      }
    }
    loadInventory();
  }, []);

  // Update URL params when category changes
  const handleCategoryChange = (cat) => {
    setSelectedCategory(cat);
    if (cat === "All") {
      searchParams.delete("category");
    } else {
      searchParams.set("category", cat);
    }
    setSearchParams(searchParams);
  };

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedCategory("All");
    setSelectedFuel("All");
    setSelectedTransmission("All");
    setMaxPrice(priceCeiling);
    setSortBy("featured");
    setSearchParams({});
  };

  // Filter and sort vehicles
  const filteredVehicles = useMemo(() => {
    return vehicles
      .filter((vehicle) => {
        // Search term
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const match =
            vehicle.brand.toLowerCase().includes(q) ||
            vehicle.model.toLowerCase().includes(q) ||
            vehicle.variant.toLowerCase().includes(q) ||
            vehicle.color.toLowerCase().includes(q);
          if (!match) return false;
        }

        // Category
        if (selectedCategory !== "All" && vehicle.category !== selectedCategory) {
          return false;
        }

        // Fuel Type
        if (selectedFuel !== "All" && vehicle.fuelType !== selectedFuel) {
          return false;
        }

        // Transmission
        if (selectedTransmission !== "All") {
          if (!vehicle.transmission.toLowerCase().includes(selectedTransmission.toLowerCase())) {
            return false;
          }
        }

        // Price
        if (vehicle.price > maxPrice) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "price-low") return a.price - b.price;
        if (sortBy === "price-high") return b.price - a.price;
        if (sortBy === "year-new") return b.year - a.year;
        if (sortBy === "brand-asc") return a.brand.localeCompare(b.brand);
        return 0; // "featured" defaults to natural order
      });
  }, [vehicles, searchQuery, selectedCategory, selectedFuel, selectedTransmission, maxPrice, sortBy]);

  const categories = ["All", "Electric", "Coupe", "SUV", "Sedan"];
  const fuelTypes = ["All", "Electric", "Petrol", "Diesel", "Hybrid"];
  const transmissions = ["All", "Automatic", "Dual-Clutch"];
  const priceCeiling = Math.max(250000, ...vehicles.map((vehicle) => vehicle.price));

  return (
    <div className="vehicles-page" id="vehicles-view">
      {/* Page Header Banner */}
      <section className="vehicles-header-banner">
        <div className="container">
          <SectionTitle
            eyebrow="Inventory Discovery"
            title="Explore Our"
            highlight="Showroom"
            description="Precision-engineered luxury, sports, and electric vehicles available for acquisition and private test drives."
            align="left"
          />
        </div>
      </section>

      {/* Main Content Area: Filter Sidebar + Vehicle Grid */}
      <div className="container inventory-layout">
        {/* Filter Controls Panel */}
        <aside className="filters-sidebar glass-panel" id="filters-panel">
          <div className="filters-header-row">
            <h3 className="filters-heading">Filter Fleet</h3>
            <button type="button" className="reset-filters-btn" onClick={resetFilters}>
              Reset All
            </button>
          </div>

          {/* Search Box */}
          <div className="filter-group">
            <label htmlFor="search-input" className="filter-label">Search</label>
            <div className="search-input-wrap">
              <span className="search-icon">🔍</span>
              <input
                id="search-input"
                type="text"
                placeholder="Brand, model, or feature..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="filter-text-input"
              />
              {searchQuery && (
                <button
                  type="button"
                  className="clear-search-btn"
                  onClick={() => setSearchQuery("")}
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Category Filter */}
          <div className="filter-group">
            <label className="filter-label">Body Style</label>
            <div className="filter-pill-grid">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  className={`filter-pill ${selectedCategory === cat ? "active" : ""}`}
                  onClick={() => handleCategoryChange(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Fuel Type */}
          <div className="filter-group">
            <label htmlFor="fuel-select" className="filter-label">Fuel & Powertrain</label>
            <select
              id="fuel-select"
              value={selectedFuel}
              onChange={(e) => setSelectedFuel(e.target.value)}
              className="filter-select"
            >
              {fuelTypes.map((fuel) => (
                <option key={fuel} value={fuel}>
                  {fuel === "All" ? "All Powertrains" : fuel}
                </option>
              ))}
            </select>
          </div>

          {/* Transmission */}
          <div className="filter-group">
            <label htmlFor="trans-select" className="filter-label">Transmission</label>
            <select
              id="trans-select"
              value={selectedTransmission}
              onChange={(e) => setSelectedTransmission(e.target.value)}
              className="filter-select"
            >
              {transmissions.map((t) => (
                <option key={t} value={t}>
                  {t === "All" ? "All Transmissions" : t}
                </option>
              ))}
            </select>
          </div>

          {/* Price Range Slider */}
          <div className="filter-group">
            <div className="filter-price-header">
              <label htmlFor="price-range" className="filter-label">Max Price</label>
              <span className="price-display">
                {new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(maxPrice)}
              </span>
            </div>
            <input
              id="price-range"
              type="range"
              min={0}
              max={priceCeiling}
              step={Math.max(1, Math.round(priceCeiling / 50))}
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="price-slider"
            />
            <div className="slider-bounds">
              <span>₹0</span>
              <span>{new Intl.NumberFormat("en-IN", { notation: "compact", maximumFractionDigits: 0 }).format(priceCeiling)}</span>
            </div>
          </div>
        </aside>

        {/* Results Area */}
        <main className="inventory-results-area">
          {/* Top Bar with Count & Sort */}
          <div className="results-top-bar glass-panel">
            <div className="results-count">
              <span>Showing <strong>{filteredVehicles.length}</strong> of {vehicles.length} Vehicles</span>
            </div>

            <div className="sort-group">
              <label htmlFor="sort-select" className="sort-label">Sort by:</label>
              <select
                id="sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="sort-select"
              >
                <option value="featured">Featured Order</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="year-new">Year: Newest First</option>
                <option value="brand-asc">Marque: A to Z</option>
              </select>
            </div>
          </div>

          {/* Vehicle Grid */}
          {loading ? (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Loading vehicle inventory...</p>
            </div>
          ) : apiError ? (
            <div className="empty-results-card glass-panel" role="alert">
              <h3>Vehicle Inventory Unavailable</h3>
              <p>{apiError}</p>
            </div>
          ) : filteredVehicles.length > 0 ? (
            <div className="vehicles-catalog-grid">
              {filteredVehicles.map((vehicle) => (
                <VehicleCard key={vehicle.id} vehicle={vehicle} />
              ))}
            </div>
          ) : (
            <div className="empty-results-card glass-panel">
              <div className="empty-icon">🏎️</div>
              <h3>No Vehicles Match Your Selection</h3>
              <p>We could not find any vehicle matching the specified criteria. Try clearing your filters or adjusting your budget parameters.</p>
              <Button onClick={resetFilters} variant="primary" size="md">
                Reset All Filters
              </Button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
