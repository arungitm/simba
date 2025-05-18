import { RFQ_ENDPOINTS } from "./endpoints";

/**
 * Type definition for RFQ form data
 */
export type FormData = {
  fullName: string;
  email: string;
  company: string;
  phone: string;
  productCategory: string;
  productSpecifications: string;
  quantity: string;
  unit: string;
  incoterm: string;
  additionalInfo: string;
};

/**
 * Submit RFQ form data to the API
 * @param formData - The form data to submit
 * @returns Promise with the response data
 */
export const submitRFQ = async (
  formData: FormData,
): Promise<{ success: boolean; requestId?: string; error?: string }> => {
  try {
    const response = await fetch(RFQ_ENDPOINTS.SUBMIT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to submit RFQ");
    }

    return {
      success: true,
      requestId: data.requestId,
    };
  } catch (error) {
    console.error("Error submitting RFQ:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
};

/**
 * Get RFQ status by request ID
 * @param requestId - The RFQ request ID
 * @returns Promise with the status data
 */
export const getRFQStatus = async (
  requestId: string,
): Promise<{ status: string; details?: any; error?: string }> => {
  try {
    const response = await fetch(`${RFQ_ENDPOINTS.GET_STATUS}/${requestId}`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to get RFQ status");
    }

    return {
      status: data.status,
      details: data.details,
    };
  } catch (error) {
    console.error("Error getting RFQ status:", error);
    return {
      status: "error",
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
};
