import { TRADING_PROCESS_ENDPOINTS } from "./endpoints";

/**
 * Type definitions for Trading Process API
 */
export interface ShipmentDetails {
  shipmentId: string;
  clientName: string;
  email?: string;
  notificationsEnabled?: boolean;
}

export interface TradingStep {
  id: number;
  title: string;
  description: string;
  icon?: string; // Icon identifier
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

/**
 * Get shipment details and trading steps
 * @param shipmentId - The shipment ID
 * @param clientName - The client name for verification
 * @returns Promise with shipment details and trading steps
 */
export const getShipmentDetails = async (
  shipmentId: string,
  clientName: string,
): Promise<{
  success: boolean;
  shipment?: ShipmentDetails;
  tradingSteps?: TradingStep[];
  error?: string;
}> => {
  try {
    const response = await fetch(TRADING_PROCESS_ENDPOINTS.GET_SHIPMENT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ shipmentId, clientName }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to get shipment details");
    }

    return {
      success: true,
      shipment: data.shipment,
      tradingSteps: data.tradingSteps,
    };
  } catch (error) {
    console.error("Error getting shipment details:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
};

/**
 * Complete an action for a trading step
 * @param shipmentId - The shipment ID
 * @param stepId - The step ID
 * @param actionIndex - The action index
 * @returns Promise with the updated trading step
 */
export const completeAction = async (
  shipmentId: string,
  stepId: number,
  actionIndex: number,
): Promise<{ success: boolean; updatedStep?: TradingStep; error?: string }> => {
  try {
    const response = await fetch(TRADING_PROCESS_ENDPOINTS.COMPLETE_ACTION, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ shipmentId, stepId, actionIndex }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to complete action");
    }

    return {
      success: true,
      updatedStep: data.updatedStep,
    };
  } catch (error) {
    console.error("Error completing action:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
};

/**
 * Toggle notifications for a shipment
 * @param shipmentId - The shipment ID
 * @param enabled - Whether notifications should be enabled
 * @param email - Email to send notifications to
 * @returns Promise with the updated shipment details
 */
export const toggleNotifications = async (
  shipmentId: string,
  enabled: boolean,
  email?: string,
): Promise<{
  success: boolean;
  shipment?: ShipmentDetails;
  error?: string;
}> => {
  try {
    const response = await fetch(
      TRADING_PROCESS_ENDPOINTS.ENABLE_NOTIFICATIONS,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ shipmentId, enabled, email }),
      },
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to update notification settings");
    }

    return {
      success: true,
      shipment: data.shipment,
    };
  } catch (error) {
    console.error("Error updating notification settings:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
};

/**
 * Add an update to a trading step
 * @param shipmentId - The shipment ID
 * @param stepId - The step ID
 * @param message - The update message
 * @param isImportant - Whether the update is important
 * @returns Promise with the updated trading step
 */
export const addUpdate = async (
  shipmentId: string,
  stepId: number,
  message: string,
  isImportant: boolean = false,
): Promise<{ success: boolean; updatedStep?: TradingStep; error?: string }> => {
  try {
    const response = await fetch(TRADING_PROCESS_ENDPOINTS.ADD_UPDATE, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ shipmentId, stepId, message, isImportant }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to add update");
    }

    return {
      success: true,
      updatedStep: data.updatedStep,
    };
  } catch (error) {
    console.error("Error adding update:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
};

/**
 * Add a document to a trading step
 * @param shipmentId - The shipment ID
 * @param stepId - The step ID
 * @param document - The document details
 * @returns Promise with the updated trading step
 */
export const addDocument = async (
  shipmentId: string,
  stepId: number,
  document: { name: string; type: string; url: string },
): Promise<{ success: boolean; updatedStep?: TradingStep; error?: string }> => {
  try {
    const response = await fetch(TRADING_PROCESS_ENDPOINTS.ADD_DOCUMENT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ shipmentId, stepId, document }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to add document");
    }

    return {
      success: true,
      updatedStep: data.updatedStep,
    };
  } catch (error) {
    console.error("Error adding document:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
};

/**
 * Update a trading step
 * @param shipmentId - The shipment ID
 * @param stepId - The step ID
 * @param stepData - The updated step data
 * @returns Promise with the updated trading step
 */
export const updateStep = async (
  shipmentId: string,
  stepId: number,
  stepData: Partial<TradingStep>,
): Promise<{ success: boolean; updatedStep?: TradingStep; error?: string }> => {
  try {
    const response = await fetch(TRADING_PROCESS_ENDPOINTS.UPDATE_STEP, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ shipmentId, stepId, stepData }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to update step");
    }

    return {
      success: true,
      updatedStep: data.updatedStep,
    };
  } catch (error) {
    console.error("Error updating step:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
};
