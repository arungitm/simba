# API Integration Documentation

## Overview

This directory contains the API integration code for the Simba Ventura FZE website. The API is responsible for handling form submissions, retrieving shipment details, and managing notifications.

## API Structure

### `endpoints.ts`

Contains all API endpoint URLs used in the application. Update the `BASE_URL` with your actual API server URL before deployment.

### `rfqApi.ts`

Handles the Request For Quote (RFQ) form submissions and status checks.

**Key Functions:**
- `submitRFQ(formData)`: Submits the RFQ form data to the API
- `getRFQStatus(requestId)`: Retrieves the status of a submitted RFQ

### `tradingProcessApi.ts`

Handles the Trading Process tracking functionality.

**Key Functions:**
- `getShipmentDetails(shipmentId, clientName)`: Retrieves shipment details and trading steps
- `completeAction(shipmentId, stepId, actionIndex)`: Marks an action as completed
- `toggleNotifications(shipmentId, enabled, email)`: Toggles notification settings

## API Implementation Requirements

### Backend Requirements

You need to implement a backend API that supports the following endpoints:

1. **RFQ Submission**
   - Endpoint: `POST /rfq/submit`
   - Request Body: Form data (name, email, company, etc.)
   - Response: `{ success: true, requestId: "unique-id" }` or error

2. **RFQ Status**
   - Endpoint: `GET /rfq/status/:requestId`
   - Response: `{ status: "pending|processing|completed", details: {} }` or error

3. **Shipment Details**
   - Endpoint: `POST /shipment/details`
   - Request Body: `{ shipmentId: "id", clientName: "name" }`
   - Response: `{ success: true, shipment: {}, tradingSteps: [] }` or error

4. **Complete Action**
   - Endpoint: `POST /shipment/complete-action`
   - Request Body: `{ shipmentId: "id", stepId: 1, actionIndex: 0 }`
   - Response: `{ success: true, updatedStep: {} }` or error

5. **Toggle Notifications**
   - Endpoint: `POST /shipment/notifications`
   - Request Body: `{ shipmentId: "id", enabled: true, email: "user@example.com" }`
   - Response: `{ success: true, shipment: {} }` or error

### Data Structures

**Trading Step:**
```typescript
interface TradingStep {
  id: number;
  title: string;
  description: string;
  icon: string; // Icon identifier (e.g., "MessageSquare", "FileText")
  status: "completed" | "current" | "upcoming" | "delayed";
  requiredActions?: string[];
  delayReason?: string;
  estimatedCompletion?: string;
  documents?: {
    name: string;
    type: string;
    url: string;
  }[];
  updates?: {
    date: string;
    message: string;
    isImportant?: boolean;
  }[];
}
```

**Shipment Details:**
```typescript
interface ShipmentDetails {
  shipmentId: string;
  clientName: string;
  email?: string;
  notificationsEnabled?: boolean;
}
```

## Error Handling

All API functions include error handling that:
1. Catches exceptions from fetch operations
2. Handles non-200 responses from the server
3. Returns standardized error objects
4. Logs errors to the console

## Testing

Before deploying to production, test all API endpoints with sample data to ensure they work correctly.
