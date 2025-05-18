import { useState, useEffect } from "react";

export interface TradingStep {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  status: "completed" | "current" | "upcoming" | "delayed";
  requiredActions?: string[];
  delayReason?: string;
  estimatedCompletion?: string;
}

interface UseTradingProcessOptions {
  orderId?: string;
  mockData?: boolean;
}

export const useTradingProcess = ({
  orderId = "demo-123",
  mockData = true,
}: UseTradingProcessOptions = {}) => {
  const [tradingSteps, setTradingSteps] = useState<TradingStep[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentStepId, setCurrentStepId] = useState<number | null>(null);

  // Mock data for demonstration
  const mockTradingSteps: TradingStep[] = [
    {
      id: 1,
      title: "Enquiry",
      description:
        "Submit your product requirements and specifications through our RFQ form.",
      icon: "MessageSquare", // Icon name as string for serialization
      status: "completed",
      requiredActions: [],
    },
    {
      id: 2,
      title: "Quote",
      description:
        "Receive a detailed quotation based on your requirements within 24-48 hours.",
      icon: "FileText",
      status: "completed",
      requiredActions: [],
    },
    {
      id: 3,
      title: "Contract",
      description:
        "Review and sign the contract with agreed terms, specifications, and payment conditions.",
      icon: "ClipboardCheck",
      status: "current",
      requiredActions: ["Sign contract", "Submit payment proof"],
      estimatedCompletion: "2023-10-15",
    },
    {
      id: 4,
      title: "Sourcing",
      description:
        "We source the highest quality products that meet your exact specifications.",
      icon: "Search",
      status: "upcoming",
      requiredActions: [],
      estimatedCompletion: "2023-10-30",
    },
    {
      id: 5,
      title: "Logistics",
      description:
        "Coordinate shipping, documentation, and customs clearance based on agreed Incoterms.",
      icon: "Ship",
      status: "delayed",
      requiredActions: ["Confirm shipping address"],
      delayReason: "Customs documentation pending",
      estimatedCompletion: "2023-11-15",
    },
    {
      id: 6,
      title: "Delivery",
      description:
        "Products are delivered to your specified location with all necessary documentation.",
      icon: "Package",
      status: "upcoming",
      requiredActions: [],
      estimatedCompletion: "2023-11-30",
    },
  ];

  // Fetch trading steps data
  useEffect(() => {
    const fetchTradingSteps = async () => {
      setIsLoading(true);
      setError(null);

      try {
        if (mockData) {
          // Simulate API delay
          await new Promise((resolve) => setTimeout(resolve, 800));
          setTradingSteps(mockTradingSteps);

          // Find current step
          const currentStep = mockTradingSteps.find(
            (step) => step.status === "current",
          );
          setCurrentStepId(currentStep?.id || null);
        } else {
          // In a real app, this would be an API call
          const response = await fetch(`/api/trading-process/${orderId}`);
          if (!response.ok) {
            throw new Error(
              `Failed to fetch trading process: ${response.statusText}`,
            );
          }
          const data = await response.json();
          setTradingSteps(data.steps);
          setCurrentStepId(data.currentStepId);
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unknown error occurred",
        );
        console.error("Error fetching trading process:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTradingSteps();
  }, [orderId, mockData]);

  // Function to complete an action for a step
  const completeAction = async (stepId: number, actionIndex: number) => {
    if (!mockData) {
      // In a real app, this would be an API call
      try {
        const response = await fetch(
          `/api/trading-process/${orderId}/steps/${stepId}/actions/${actionIndex}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          },
        );

        if (!response.ok) {
          throw new Error(`Failed to complete action: ${response.statusText}`);
        }

        // Update local state based on response
        const updatedStep = await response.json();
        setTradingSteps((prev) =>
          prev.map((step) => (step.id === stepId ? updatedStep : step)),
        );
      } catch (err) {
        console.error("Error completing action:", err);
        return false;
      }
    } else {
      // Mock implementation for demo
      setTradingSteps((prev) =>
        prev.map((step) => {
          if (step.id === stepId && step.requiredActions) {
            // Remove the completed action
            const updatedActions = [...step.requiredActions];
            updatedActions.splice(actionIndex, 1);

            // If no more actions, update status if it was the current step
            let updatedStatus = step.status;
            if (updatedActions.length === 0 && step.status === "current") {
              updatedStatus = "completed";

              // Find the next step and make it current
              const nextStepIndex = prev.findIndex((s) => s.id === step.id) + 1;
              if (nextStepIndex < prev.length) {
                const nextStepId = prev[nextStepIndex].id;
                setTimeout(() => {
                  setTradingSteps((current) =>
                    current.map((s) =>
                      s.id === nextStepId ? { ...s, status: "current" } : s,
                    ),
                  );
                  setCurrentStepId(nextStepId);
                }, 500);
              }
            }

            return {
              ...step,
              requiredActions: updatedActions,
              status: updatedStatus,
            };
          }
          return step;
        }),
      );
    }
    return true;
  };

  return {
    tradingSteps,
    isLoading,
    error,
    currentStepId,
    completeAction,
  };
};

export default useTradingProcess;
