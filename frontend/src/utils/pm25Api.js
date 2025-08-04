// Utility functions for fetching real-time PM2.5 data
import { GISTDA_PM25_API_BASE_URL } from "../config/constants";

/**
 * Fetch current PM2.5 level for a given location
 * @param {number} lat - Latitude
 * @param {number} lng - Longitude
 * @returns {Promise<{value: number, status: string, timestamp: string}>}
 */
export const getPm25ByLatLng = async (lat, lng) => {
  try {
    if (!lat || !lng) {
      throw new Error("Latitude and longitude are required");
    }

    const url = `https://pm25.gistda.or.th/rest/getPm25byLocation?lat=${lat}&lng=${lng}`;
    console.log(`Fetching PM2.5 data from: ${url}`);

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(
        `Failed to fetch PM2.5 data: ${response.status} ${response.statusText}`
      );
    }

    const responseData = await response.json();
    console.log("PM2.5 API Response:", responseData);

    // Check if the response has the expected GISTDA API format
    if (
      responseData &&
      responseData.status === 200 &&
      responseData.data &&
      typeof responseData.data.pm25 !== "undefined"
    ) {
      const pm25Value = parseFloat(responseData.data.pm25);
      const timestamp = responseData.data.datetimeEng
        ? new Date(
            `${responseData.data.datetimeEng.dateEng} ${responseData.data.datetimeEng.timeEng}`
          ).toISOString()
        : new Date().toISOString();

      console.log(`Successfully parsed PM2.5 value: ${pm25Value}`);

      return {
        value: pm25Value,
        status: getAirQualityStatus(pm25Value),
        timestamp: timestamp,
        location: { lat, lng },
        locationInfo: responseData.data.loc || null,
        avg24hrs: responseData.data.pm25Avg24hrs || null,
      };
    } else {
      throw new Error(
        `Invalid response format from PM2.5 API: ${
          responseData?.errMsg || "Unknown error"
        }`
      );
    }
  } catch (error) {
    console.error("Error fetching PM2.5 data:", error);
    throw error;
  }
};

/**
 * Get air quality status based on PM2.5 value (Thai standards)
 * @param {number} pm25Value - PM2.5 concentration in µg/m³
 * @returns {string} Air quality status in Thai
 */
export const getAirQualityStatus = (pm25Value) => {
  if (pm25Value <= 25) return "ดี";
  if (pm25Value <= 37) return "ปานกลาง";
  if (pm25Value <= 50) return "เริ่มมีผลกระทบ";
  if (pm25Value <= 90) return "มีผลกระทบต่อสุขภาพ";
  return "อันตราย";
};

/**
 * Get color code for PM2.5 level
 * @param {number} pm25Value - PM2.5 concentration in µg/m³
 * @returns {string} Color code
 */
export const getPm25Color = (pm25Value) => {
  if (pm25Value <= 25) return "#4CAF50"; // Green
  if (pm25Value <= 37) return "#FFC107"; // Amber
  if (pm25Value <= 50) return "#FF9800"; // Orange
  if (pm25Value <= 90) return "#F44336"; // Red
  return "#9C27B0"; // Purple
};

/**
 * Format PM2.5 value for display
 * @param {number} value - PM2.5 value
 * @returns {string} Formatted value
 */
export const formatPm25Value = (value) => {
  if (typeof value !== "number" || isNaN(value)) return "N/A";
  return value.toFixed(1);
};
