const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

function toUiVehicle(vehicle) {
  return {
    id: vehicle.Id,
    name: vehicle.Name,

    brand: vehicle.Brand__c,
    model: vehicle.Model__c,
    variant: vehicle.Variant__c,

    year: vehicle.Model_Year__c,
    category: vehicle.Vehicle_Type__c,
    fuelType: vehicle.Fuel_Type__c,
    transmission: vehicle.Transmission__c,

    price: vehicle.Price__c,
    mileage: vehicle.Mileage__c,

    seatingCapacity: vehicle.Seating_Capacity__c,
    seating:
      vehicle.Seating_Capacity__c == null
        ? "—"
        : `${vehicle.Seating_Capacity__c} Seats`,

    color: vehicle.Color__c,
    availability: vehicle.Availability_Status__c,
    description: vehicle.Description__c || "No description available.",

    images: vehicle.Primary_Image_URL__c
      ? [vehicle.Primary_Image_URL__c]
      : [
          "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1200&q=80",
        ],

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
    const response = await fetch(`${BASE_URL}/test-drives`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(bookingData),
    });

    let body;
    try {
      body = await response.json();
    } catch {
      throw new Error(`Test drive API returned an invalid response (HTTP ${response.status}).`);
    }

    if (!response.ok) {
      const error = new Error(body.message || `Test drive API request failed (HTTP ${response.status}).`);
      error.status = response.status;
      throw error;
    }
    if (body.success !== true) {
      throw new Error(body.message || "Test drive booking was unsuccessful.");
    }

    return body;
  },


  /**
   * Fetch leads from Salesforce through the backend
   */
  async getLeads() {
    const response = await fetch(`${BASE_URL}/leads`);

    let body;
    try {
      body = await response.json();
    } catch {
      throw new Error(
        `Lead API returned an invalid response (HTTP ${response.status}).`
      );
    }

    if (!response.ok) {
      const error = new Error(
        body.message || `Lead API request failed (HTTP ${response.status}).`
      );
      error.status = response.status;
      throw error;
    }

    if (body.success !== true || !Array.isArray(body.data)) {
      throw new Error(body.message || "Lead API returned an invalid lead list.");
    }

    return {
      success: true,
      data: body.data,
      total: body.total ?? body.data.length,
    };
  },

  /** Fetch follow-up records for a Salesforce lead */
  async getLeadFollowUps(leadId) {
    const response = await fetch(`${BASE_URL}/leads/${encodeURIComponent(leadId)}/follow-ups`);
    let body;
    try {
      body = await response.json();
    } catch {
      throw new Error(`Follow-up API returned an invalid response (HTTP ${response.status}).`);
    }

    if (!response.ok) {
      const error = new Error(body.message || `Follow-up API request failed (HTTP ${response.status}).`);
      error.status = response.status;
      throw error;
    }
    if (body.success !== true || !Array.isArray(body.data)) {
      throw new Error(body.message || "Follow-up API returned an invalid follow-up list.");
    }

    return { success: true, data: body.data, total: body.total ?? body.data.length };
  },

  /** Update the status field on a Salesforce lead */
  async updateLeadStatus(leadId, status) {
    const response = await fetch(`${BASE_URL}/leads/${encodeURIComponent(leadId)}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });

    const responseText = await response.text();
    let body = null;
    if (responseText) {
      try {
        body = JSON.parse(responseText);
      } catch {
        if (response.ok) {
          throw new Error("Lead status API returned an invalid response.");
        }
      }
    }

    if (!response.ok) {
      const error = new Error(
        body?.message || `Lead status update failed (HTTP ${response.status}).`,
      );
      error.status = response.status;
      throw error;
    }
    if (body?.success !== true) {
      throw new Error(body?.message || "Lead status update was unsuccessful.");
    }

    return body;
  },


  /**
   * Submit a vehicle enquiry lead
   */
  async submitLead(leadData) {
    const response = await fetch(`${BASE_URL}/leads`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(leadData),
    });

    let body;
    try {
      body = await response.json();
    } catch {
      throw new Error(`Lead API returned an invalid response (HTTP ${response.status}).`);
    }

    if (!response.ok) {
      const error = new Error(body.message || `Lead API request failed (HTTP ${response.status}).`);
      error.status = response.status;
      throw error;
    }
    if (body.success !== true) {
      throw new Error(body.message || "Lead submission was unsuccessful.");
    }

    return body;
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
