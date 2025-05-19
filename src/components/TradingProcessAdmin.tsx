import React, { useState, useEffect } from "react";
import {
  AlertCircle,
  Calendar,
  Check,
  ChevronDown,
  ChevronUp,
  Edit,
  FileText,
  Loader2,
  Lock,
  Plus,
  Save,
  Trash2,
  User,
  X,
  MessageSquare,
  ClipboardCheck,
  Search,
  Ship,
  Package,
  CheckCircle,
  Clock,
  Eye,
  Download,
  Upload,
  DollarSign,
} from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Badge } from "./ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { motion } from "framer-motion";

// Desert theme colors
const desertTheme = {
  sand: "#E5C59E",
  darksand: "#C4A484",
  lightsand: "#F5DEB3",
  desert: "#EDC9AF",
  dune: "#C19A6B",
  accent: "#F5A623",
};

const PREDEFINED_STEPS = [
  {
    id: 1,
    title: "Initial Inquiry",
    icon: MessageSquare,
    description: "Client submits product requirements and specifications",
    defaultActions: [
      "Submit RFQ form",
      "Provide product specifications",
      "Indicate quantity required",
      "Specify delivery location"
    ]
  },
  {
    id: 2,
    title: "Quotation",
    icon: FileText,
    description: "Price quotation and terms preparation",
    defaultActions: [
      "Review price quotation",
      "Check payment terms",
      "Verify delivery timeline",
      "Confirm product specifications"
    ]
  },
  {
    id: 3,
    title: "Contract & Documentation",
    icon: ClipboardCheck,
    description: "Contract preparation and signing",
    defaultActions: [
      "Review contract terms",
      "Sign agreement",
      "Submit company documents",
      "Provide bank details"
    ]
  },
  {
    id: 4,
    title: "Product Sourcing",
    icon: Search,
    description: "Sourcing and quality verification",
    defaultActions: [
      "Quality inspection arrangement",
      "Sample verification",
      "Certificate verification",
      "Origin documentation"
    ]
  },
  {
    id: 5,
    title: "Payment Processing",
    icon: DollarSign,
    description: "Payment processing and verification",
    defaultActions: [
      "Process initial payment",
      "Verify fund transfer",
      "Issue payment receipt",
      "Update payment status"
    ]
  },
  {
    id: 6,
    title: "Shipping & Logistics",
    icon: Ship,
    description: "Shipping arrangement and documentation",
    defaultActions: [
      "Book vessel/transport",
      "Prepare shipping documents",
      "Arrange inspection",
      "Process customs clearance"
    ]
  },
  {
    id: 7,
    title: "Delivery",
    icon: Package,
    description: "Final delivery and documentation",
    defaultActions: [
      "Track shipment",
      "Coordinate delivery",
      "Verify documentation",
      "Confirm receipt"
    ]
  }
];

type StepStatus = "completed" | "partially_completed" | "current" | "upcoming" | "delayed";

interface Client {
  id: string;
  name: string;
  email: string;
  phone?: string;
}

interface TradingStep {
  id: number;
  title: string;
  description: string;
  icon: React.ElementType;
  status: StepStatus;
  requiredActions: string[];
  completedActions: string[];
  estimatedCompletion?: string;
  notes?: string;
  shipmentId: string;
  client: Client;
  startDate: string;
  lastUpdated: string;
}

interface TradingProcessAdminProps {
  isLoggedIn?: boolean;
}

const TradingProcessAdmin: React.FC<TradingProcessAdminProps> = ({ isLoggedIn = false }) => {
  const [activeSteps, setActiveSteps] = useState<TradingStep[]>([]);
  const [selectedStep, setSelectedStep] = useState("");
  const [notes, setNotes] = useState("");
  const [estimatedCompletion, setEstimatedCompletion] = useState("");
  const [shipmentId, setShipmentId] = useState("");
  const [clientId, setClientId] = useState("");
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // Effect to load steps from localStorage
  useEffect(() => {
    const savedSteps = localStorage.getItem('tradingSteps');
    if (savedSteps) {
      const parsed = JSON.parse(savedSteps);
      const reconstructed = parsed.map((savedStep: any) => {
        const template = PREDEFINED_STEPS.find(s => s.id === savedStep.id);
        return {
          ...template,
          ...savedStep,
          icon: template.icon, // ensure icon is the component, not from storage
        };
      });
      setActiveSteps(reconstructed);
    }
  }, []);

  // Effect to save steps to localStorage
  useEffect(() => {
    if (activeSteps.length > 0) {
      // Only save serializable fields
      const serializableSteps = activeSteps.map(step => ({
        id: step.id,
        status: step.status,
        requiredActions: step.requiredActions,
        completedActions: step.completedActions,
        estimatedCompletion: step.estimatedCompletion,
        notes: step.notes,
        shipmentId: step.shipmentId,
        client: step.client,
        startDate: step.startDate,
        lastUpdated: step.lastUpdated,
      }));
      localStorage.setItem('tradingSteps', JSON.stringify(serializableSteps));
    }
  }, [activeSteps]);

  const updateStepStatus = (step: TradingStep): TradingStep => {
    if (step.completedActions.length === 0) {
      return { ...step, status: "upcoming" as StepStatus };
    } else if (step.completedActions.length === step.requiredActions.length) {
      return { ...step, status: "completed" as StepStatus };
    } else {
      return { ...step, status: "partially_completed" as StepStatus };
    }
  };

  const handleSaveProgress = (stepId: number) => {
    setIsSaving(true);
    setActiveSteps(prev =>
      prev.map(step => {
        if (step.id === stepId) {
          return {
            ...step,
            lastUpdated: new Date().toISOString(),
            status: step.completedActions.length === step.requiredActions.length 
              ? "completed" as StepStatus 
              : "partially_completed" as StepStatus
          };
        }
        return step;
      })
    );
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      alert("Progress saved successfully!");
    }, 500);
  };

  const handleAddStep = (e: React.FormEvent) => {
    e.preventDefault();
    const stepTemplate = PREDEFINED_STEPS.find(step => step.title === selectedStep);
    if (!stepTemplate) return;

    // Validate required fields
    if (!shipmentId || !clientId || !clientName || !clientEmail) {
      alert("Please fill in all required fields (Shipment ID, Client ID, Client Name, and Client Email)");
      return;
    }

    // Check if we can add this step
    const lastStep = activeSteps[activeSteps.length - 1];
    if (lastStep && lastStep.status !== "completed") {
      alert("Please complete the current step before adding a new one");
      return;
    }

    const now = new Date().toISOString();
    const newStep: TradingStep = {
      id: stepTemplate.id,
      title: stepTemplate.title,
      description: stepTemplate.description,
      icon: stepTemplate.icon,
      status: "current" as StepStatus,
      requiredActions: [...stepTemplate.defaultActions],
      completedActions: [],
      estimatedCompletion,
      notes,
      shipmentId,
      client: {
        id: clientId, // Use the provided client ID
        name: clientName,
        email: clientEmail,
        phone: clientPhone
      },
      startDate: now,
      lastUpdated: now
    };

    // Update previous step status if exists
    const updatedSteps = activeSteps.map(step => 
      step.id === lastStep?.id ? { ...step, status: "completed" as StepStatus } : step
    );

    setActiveSteps([...updatedSteps, newStep]);
    // Reset form
    setSelectedStep("");
    setNotes("");
    setEstimatedCompletion("");
    // Don't reset client info to maintain consistency
    // setShipmentId("");
    // setClientId("");
    // setClientName("");
    // setClientEmail("");
    // setClientPhone("");
  };

  const handleToggleAction = (stepId: number, action: string) => {
    setActiveSteps(prev =>
      prev.map(step => {
        if (step.id === stepId) {
          const isCompleted = step.completedActions.includes(action);
          const updatedCompleted = isCompleted
            ? step.completedActions.filter(a => a !== action)
            : [...step.completedActions, action];
          const updatedStep = {
            ...step,
            completedActions: updatedCompleted,
            lastUpdated: new Date().toISOString(),
            status:
              updatedCompleted.length === step.requiredActions.length
                ? ("completed" as StepStatus)
                : updatedCompleted.length > 0
                ? ("partially_completed" as StepStatus)
                : ("current" as StepStatus),
          };
          return updatedStep;
        }
        return step;
      })
    );
  };

  const handleCompleteStep = (stepId: number) => {
    setActiveSteps(prev =>
      prev.map(step => {
        if (step.id === stepId) {
          const updatedStep = {
            ...step,
            status: "completed" as StepStatus,
            completedActions: [...step.requiredActions],
            lastUpdated: new Date().toISOString()
          };
          
          // Find the next step in PREDEFINED_STEPS
          const currentStepIndex = PREDEFINED_STEPS.findIndex(s => s.id === stepId);
          const nextStep = PREDEFINED_STEPS[currentStepIndex + 1];
          
          // If there's a next step, add it automatically
          if (nextStep && !activeSteps.find(s => s.id === nextStep.id)) {
            const now = new Date().toISOString();
            const newStep: TradingStep = {
              id: nextStep.id,
              title: nextStep.title,
              description: nextStep.description,
              icon: nextStep.icon,
              status: "current" as StepStatus,
              requiredActions: [...nextStep.defaultActions],
              completedActions: [],
              shipmentId: step.shipmentId,
              client: step.client,
              startDate: now,
              lastUpdated: now
            };
            return [updatedStep, newStep];
          }
          return updatedStep;
        }
        return step;
      }).flat()
    );
  };

  const isStepCompletable = (step: TradingStep) => {
    return step.requiredActions.every(action => step.completedActions.includes(action));
  };

  if (!isLoggedIn) return null;

  return (
    <div className="space-y-6 p-4">
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Add Trading Process Step</h2>
        <form onSubmit={handleAddStep} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="shipmentId">Shipment ID *</Label>
              <Input
                id="shipmentId"
                value={shipmentId}
                onChange={(e) => setShipmentId(e.target.value)}
                placeholder="Enter shipment ID"
                required
              />
            </div>
            <div>
              <Label htmlFor="clientId">Client ID *</Label>
              <Input
                id="clientId"
                value={clientId}
                onChange={(e) => setClientId(e.target.value)}
                placeholder="Enter client ID"
                required
              />
            </div>
            <div>
              <Label htmlFor="step">Select Step *</Label>
              <Select
                value={selectedStep}
                onValueChange={setSelectedStep}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Choose a step" />
                </SelectTrigger>
                <SelectContent>
                  {PREDEFINED_STEPS
                    .filter(step => !activeSteps.find(active => active.title === step.title))
                    .map(step => (
                      <SelectItem key={step.id} value={step.title}>
                        {step.title}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="clientName">Client Name *</Label>
              <Input
                id="clientName"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder="Enter client name"
                required
              />
            </div>
            <div>
              <Label htmlFor="clientEmail">Client Email *</Label>
              <Input
                id="clientEmail"
                type="email"
                value={clientEmail}
                onChange={(e) => setClientEmail(e.target.value)}
                placeholder="Enter client email"
                required
              />
            </div>
            <div>
              <Label htmlFor="clientPhone">Client Phone</Label>
              <Input
                id="clientPhone"
                type="tel"
                value={clientPhone}
                onChange={(e) => setClientPhone(e.target.value)}
                placeholder="Enter client phone (optional)"
              />
            </div>
            <div>
              <Label htmlFor="estimatedCompletion">Estimated Completion</Label>
              <Input
                id="estimatedCompletion"
                type="date"
                value={estimatedCompletion}
                onChange={(e) => setEstimatedCompletion(e.target.value)}
              />
            </div>
          </div>
          <div>
            <Label htmlFor="notes">Additional Notes</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any specific requirements or notes"
            />
          </div>
          <Button 
            type="submit"
            className="bg-simba-navy hover:bg-simba-darknavy text-white"
            disabled={!selectedStep || !shipmentId || !clientId || !clientName || !clientEmail || 
              (activeSteps.length > 0 && activeSteps[activeSteps.length - 1].status !== "completed")}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Step
          </Button>
        </form>
      </Card>

      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Active Trading Steps</h2>
        <div className="space-y-4">
          {activeSteps.map((step) => {
            const completed = step.completedActions;
            const missing = step.requiredActions.filter(a => !completed.includes(a));
            return (
              <Card key={step.id} className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <step.icon className="h-5 w-5 text-simba-navy" />
                    <div>
                      <h3 className="font-semibold">{step.title}</h3>
                      <div className="text-sm space-y-1">
                        <div className="text-gray-600">
                          Shipment ID: <span className="font-medium">{step.shipmentId}</span>
                        </div>
                        <div className="text-gray-600">
                          Client ID: <span className="font-medium">{step.client.id}</span>
                        </div>
                        <div className="text-gray-600">
                          Client: <span className="font-medium">{step.client.name}</span>
                          {step.client.phone && ` (${step.client.phone})`}
                        </div>
                        <span className={`${
                          step.status === "completed" ? "text-green-600" :
                          step.status === "partially_completed" ? "text-yellow-600" :
                          "text-gray-600"
                        }`}>
                          {step.status === "completed" ? "Completed" :
                          step.status === "partially_completed" ? "Partially Completed" :
                          step.status === "current" ? "In Progress" :
                          "Upcoming"}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {step.status !== "completed" && (
                      <Button
                        onClick={() => handleSaveProgress(step.id)}
                        className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
                        disabled={isSaving}
                      >
                        {isSaving ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          <>
                            <Save className="h-4 w-4" />
                            Save Progress
                          </>
                        )}
                      </Button>
                    )}
                    <Button
                      onClick={() => handleCompleteStep(step.id)}
                      className={`flex items-center gap-2 ${
                        step.status === "completed" 
                          ? "bg-gray-400 cursor-not-allowed" 
                          : isStepCompletable(step)
                            ? "bg-green-600 hover:bg-green-700"
                            : "bg-gray-400 cursor-not-allowed"
                      } text-white`}
                      disabled={step.status === "completed" || !isStepCompletable(step)}
                    >
                      <CheckCircle className="h-4 w-4" />
                      {step.status === "completed" ? "Completed" : "Complete Step"}
                    </Button>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <h4 className="font-medium mb-2">Required Actions:</h4>
                    <div className="space-y-2">
                      {step.requiredActions.map((action, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={step.completedActions.includes(action)}
                            onChange={() => handleToggleAction(step.id, action)}
                            className="rounded border-gray-300 h-4 w-4"
                          />
                          <span className={step.completedActions.includes(action) ? "line-through text-gray-500" : ""}>
                            {action}
                          </span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-2 text-sm text-gray-600">
                      <span className="font-semibold">{completed.length} of {step.requiredActions.length} actions completed.</span>
                      {missing.length > 0 ? (
                        <span className="ml-2 text-red-600">Missing: {missing.join(", ")}</span>
                      ) : (
                        <span className="ml-2 text-green-600">All actions completed!</span>
                      )}
                    </div>
                  </div>

                  {step.notes && (
                    <div>
                      <h4 className="font-medium mb-1">Notes:</h4>
                      <p className="text-sm text-gray-600">{step.notes}</p>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                    {step.estimatedCompletion && (
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <span>Due: {new Date(step.estimatedCompletion).toLocaleDateString()}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>Started: {new Date(step.startDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span>Last Updated: {new Date(step.lastUpdated).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </Card>
    </div>
  );
};

export default TradingProcessAdmin;
