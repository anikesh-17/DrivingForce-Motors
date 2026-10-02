const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

function toUiVehicle(vehicle) {
  return {
    ...vehicle,
    year: vehicle.modelYear,
    category: vehicle.vehicleType,
    availability: vehicle.availabilityStatus,
    seating: vehicle.seatingCapacity == null ? "—" : `${vehicle.seatingCapacity} Seats`,
    images: vehicle.imageUrl
      ? [vehicle.imageUrl]
      : ["https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1200&q=80"],
    horsepower: vehicle.horsepower || "Not specified",
    acceleration: vehicle.acceleration || "Not specified",
    topSpeed: vehicle.topSpeed || "Not specified",
    drivetrain: vehicle.drivetrain || "Not specified",
    vin: vehicle.vin || "Not specified",
    features: vehicle.features || [],
  };
}

async function getResponseData(url) {
  const response = await fetch(url);
  let body;
  try {
    body = await response.json();
  } catch {
    throw new Error(`Vehicle API returned an invalid response (HTTP ${response.status}).`);
  }

  if (!response.ok) {
    const error = new Error(body.message || `Vehicle API request failed (HTTP ${response.status}).`);
    error.status = response.status;
    throw error;
  }
  if (body.success !== true) {
    throw new Error(body.message || "Vehicle API request was unsuccessful.");
  }
  return body.data;
}

/**
 * DrivingForce Motors API Service
   * Vehicle reads use the Express API. Other UI-phase actions remain placeholders.
 */

export const api = {
  baseUrl: BASE_URL,

  /**
   * Fetch all vehicles. Existing filters are applied by the pages after retrieval.
   */
  async getVehicles() {
    const data = await getResponseData(`${BASE_URL}/vehicles`);
    if (!Array.isArray(data)) {
      throw new Error("Vehicle API returned an invalid vehicle list.");
    }
    return { success: true, data: data.map(toUiVehicle), total: data.length };
  },

  /**
   * Fetch a single vehicle by ID
   */
  async getVehicleById(id) {
    const data = await getResponseData(`${BASE_URL}/vehicles/${encodeURIComponent(id)}`);
    if (!data || typeof data !== "object") {
      throw new Error("Vehicle API returned an invalid vehicle record.");
    }
    return { success: true, data: toUiVehicle(data) };
  },

  /**
   * Submit test drive booking
   */
  async bookTestDrive(bookingData) {
    console.log("[API] Booking test drive:", bookingData);
    // Simulating API response
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          bookingReference: `DFM-TD-${Math.floor(100000 + Math.random() * 900000)}`,
          data: bookingData,
          message: "Test drive booking confirmed successfully."
        });
      }, 400);
    });
  },

  /**
   * Submit contact form message
   */
  async submitContact(contactData) {
    console.log("[API] Contact message submission:", contactData);
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          ticketNumber: `DFM-MSG-${Math.floor(1000 + Math.random() * 9000)}`,
          message: "Thank you for reaching out. A DrivingForce concierge will contact you within 2 business hours."
        });
      }, 400);
    });
  },

  /**
   * UI Login placeholder
   */
  async login(credentials) {
    console.log("[API] Login attempt (UI phase):", credentials.email);
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          token: "mock-jwt-token-demo",
          user: { name: "VIP Client", email: credentials.email }
        });
      }, 500);
    });
  },

  /**
   * Check backend health
   */
  async checkHealth() {
    try {
      const res = await fetch(`${BASE_URL}/health`);
      return await res.json();
    } catch {
      return { success: false, message: "Backend offline" };
    }
  }
};

export default api;
