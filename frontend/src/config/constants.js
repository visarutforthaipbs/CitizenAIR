// API Configuration Constants
export const GISTDA_PM25_API_BASE_URL = "https://pm25.gistda.or.th/rest";

// Backend API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

// API Endpoints
export const PM25_ENDPOINTS = {
  BY_LOCATION: "/getPm25byLocation",
};

// Default fetch timeout (ms)
export const API_TIMEOUT = 10000;

// PM2.5 Air Quality Standards (µg/m³)
export const PM25_STANDARDS = {
  GOOD: 25,
  MODERATE: 37,
  UNHEALTHY_SENSITIVE: 50,
  UNHEALTHY: 90,
  HAZARDOUS: 150,
};
