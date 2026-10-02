import { mockVehicles } from "../data/mockVehicles";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

/**
 * DrivingForce Motors API Service
 * Configured with future backend endpoint (http://localhost:5000/api).
 * Returns robust mock data for the UI phase while maintaining standard API signatures.
 */

export const api = {
  baseUrl: BASE_URL,

  /**
   * Fetch all vehicles with optional query filters
   */
  async getVehicles(filters = {}) {
    try {
      // In production/future:
      // const res = await fetch(`${BASE_URL}/vehicles?${new URLSearchParams(filters)}`);
      // if (res.ok) return await res.json();
    } catch (e) {
      console.warn("Backend not reached, using local mock vehicles:", e.message);
    }

    // Filter mock data locally
    let list = [...mockVehicles];
    if (filters.category && filters.category !== "All") {
      list = list.filter((v) => v.category.toLowerCase() === filters.category.toLowerCase());
    }
    if (filters.fuelType && filters.fuelType !== "All") {
      list = list.filter((v) => v.fuelType.toLowerCase() === filters.fuelType.toLowerCase());
    }
    if (filters.search) {
      const q = filters.search.toLowerCase();
      list = list.filter(
        (v) =>
          v.brand.toLowerCase().includes(q) ||
          v.model.toLowerCase().includes(q) ||
          v.variant.toLowerCase().includes(q)
      );
    }
    return { success: true, data: list, total: list.length };
  },

  /**
   * Fetch a single vehicle by ID
   */
  async getVehicleById(id) {
    try {
      // const res = await fetch(`${BASE_URL}/vehicles/${id}`);
      // if (res.ok) return await res.json();
    } catch (e) {
      console.warn("Backend not reached, resolving from local mock:", e.message);
    }

    const vehicle = mockVehicles.find((v) => v.id === id);
    if (!vehicle) {
      return { success: false, error: "Vehicle not found" };
    }
    return { success: true, data: vehicle };
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
