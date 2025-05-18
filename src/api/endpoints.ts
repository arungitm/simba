/**
 * API Endpoints Configuration
 *
 * This file contains all the API endpoints used in the application.
 * Update the BASE_URL with your actual API server URL before deployment.
 */

// Base URL for API requests
export const BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "https://api.example.com";

// RFQ Form API endpoints
export const RFQ_ENDPOINTS = {
  SUBMIT: `${BASE_URL}/rfq/submit`,
  GET_STATUS: `${BASE_URL}/rfq/status`,
};

// Trading Process API endpoints
export const TRADING_PROCESS_ENDPOINTS = {
  GET_SHIPMENT: `${BASE_URL}/shipment/details`,
  GET_DOCUMENTS: `${BASE_URL}/shipment/documents`,
  GET_UPDATES: `${BASE_URL}/shipment/updates`,
  COMPLETE_ACTION: `${BASE_URL}/shipment/complete-action`,
  ENABLE_NOTIFICATIONS: `${BASE_URL}/shipment/notifications`,
};

// Authentication endpoints
export const AUTH_ENDPOINTS = {
  LOGIN: `${BASE_URL}/auth/login`,
  LOGOUT: `${BASE_URL}/auth/logout`,
};
