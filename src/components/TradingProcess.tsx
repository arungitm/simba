import React, { useState, useEffect } from "react";
import {
  ArrowRight,
  FileText,
  MessageSquare,
  ClipboardCheck,
  Search,
  Ship,
  Package,
  AlertCircle,
  CheckCircle,
  Clock,
  ChevronDown,
  ChevronUp,
  Send,
  Loader2,
  Calendar,
  Download,
  Share2,
  Bell,
  Filter,
} from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

// Desert theme colors
const desertTheme = {
  sand: "#E5C59E",
  darksand: "#C4A484",
  lightsand: "#F5DEB3",
  desert: "#EDC9AF",
  dune: "#C19A6B",
  accent: "#F5A623",
};

interface TradingStep {
  id: number;
  title: string;
  description: string;
  icon: React.ElementType;
  status: "completed" | "current" | "upcoming" | "delayed" | "partially_completed";
  requiredActions?: string[];
  completedActions?: string[];
  delayReason?: string;
  estimatedCompletion?: string;
  lastUpdated?: string;
  shipmentId?: string;
  client?: {
    id: string;
    name: string;
    email: string;
    phone?: string;
  };
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
  notes?: string;
}

interface ShipmentDetails {
  shipmentId: string;
  clientName: string;
  email?: string;
  notificationsEnabled: boolean;
}

// Add PREDEFINED_STEPS at the top of the file for reference
const PREDEFINED_STEPS = [
  {
    id: 1,
    title: "Enquiry",
    description: "Submit your product requirements and specifications through our RFQ form.",
    icon: MessageSquare,
    status: "completed",
    requiredActions: [],
  },
  {
    id: 2,
    title: "Quote",
    description: "Receive a detailed quotation based on your requirements within 24-48 hours.",
    icon: FileText,
    status: "completed",
    requiredActions: [],
  },
  {
    id: 3,
    title: "Contract",
    description: "Review and sign the contract with agreed terms, specifications, and payment conditions.",
    icon: ClipboardCheck,
    status: "current",
    requiredActions: ["Sign contract", "Submit payment proof"],
  },
  {
    id: 4,
    title: "Quality Assurance",
    description: "Our quality control team inspects the products to ensure they meet all specifications and standards.",
    icon: Search,
    status: "upcoming",
    requiredActions: [],
  },
  {
    id: 5,
    title: "Logistics",
    description: "Coordinate shipping, documentation, and customs clearance based on agreed Incoterms.",
    icon: Ship,
    status: "delayed",
    requiredActions: ["Confirm shipping address"],
  },
  {
    id: 6,
    title: "Delivery",
    description: "Products are delivered to your specified location with all necessary documentation.",
    icon: Package,
    status: "upcoming",
    requiredActions: [],
  },
];

const TradingProcess = () => {
  const [shipmentDetails, setShipmentDetails] =
    useState<ShipmentDetails | null>(null);
  const [inputShipmentId, setInputShipmentId] = useState("");
  const [inputClientName, setInputClientName] = useState("");
  const [inputEmail, setInputEmail] = useState("");
  const [showSpecificProcess, setShowSpecificProcess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("timeline");
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  // Mock data - in a real app, this would come from an API
  const [tradingSteps, setTradingSteps] = useState<TradingStep[]>([
    {
      id: 1,
      title: "Enquiry",
      description:
        "Submit your product requirements and specifications through our RFQ form.",
      icon: MessageSquare,
      status: "completed",
      requiredActions: [],
      documents: [
        {
          name: "Initial Inquiry Form",
          type: "PDF",
          url: "#",
        },
      ],
      updates: [
        {
          date: "2023-09-01",
          message: "Inquiry received and processed",
        },
        {
          date: "2023-09-02",
          message: "Product specifications confirmed",
          isImportant: true,
        },
      ],
    },
    {
      id: 2,
      title: "Quote",
      description:
        "Receive a detailed quotation based on your requirements within 24-48 hours.",
      icon: FileText,
      status: "completed",
      requiredActions: [],
      documents: [
        {
          name: "Quotation Document",
          type: "PDF",
          url: "#",
        },
        {
          name: "Price Breakdown",
          type: "XLSX",
          url: "#",
        },
      ],
      updates: [
        {
          date: "2023-09-05",
          message: "Quotation prepared based on requirements",
        },
        {
          date: "2023-09-07",
          message: "Quotation sent to client",
          isImportant: true,
        },
      ],
    },
    {
      id: 3,
      title: "Contract",
      description:
        "Review and sign the contract with agreed terms, specifications, and payment conditions.",
      icon: ClipboardCheck,
      status: "current",
      requiredActions: ["Sign contract", "Submit payment proof"],
      estimatedCompletion: "2023-10-15",
      documents: [
        {
          name: "Contract Draft",
          type: "PDF",
          url: "#",
        },
        {
          name: "Payment Instructions",
          type: "PDF",
          url: "#",
        },
      ],
      updates: [
        {
          date: "2023-10-01",
          message: "Contract draft sent for review",
        },
        {
          date: "2023-10-05",
          message: "Awaiting contract signature and payment proof",
          isImportant: true,
        },
      ],
    },
    {
      id: 4,
      title: "Quality Assurance",
      description:
        "Our quality control team inspects the products to ensure they meet all specifications and standards.",
      icon: Search,
      status: "upcoming",
      requiredActions: [],
      estimatedCompletion: "2023-10-30",
      documents: [
        {
          name: "Quality Standards Document",
          type: "PDF",
          url: "#",
        },
        {
          name: "Inspection Checklist",
          type: "PDF",
          url: "#",
        },
      ],
      updates: [],
    },
    {
      id: 5,
      title: "Logistics",
      description:
        "Coordinate shipping, documentation, and customs clearance based on agreed Incoterms.",
      icon: Ship,
      status: "delayed",
      requiredActions: ["Confirm shipping address"],
      delayReason: "Customs documentation pending",
      estimatedCompletion: "2023-11-15",
      documents: [
        {
          name: "Shipping Instructions Form",
          type: "PDF",
          url: "#",
        },
      ],
      updates: [
        {
          date: "2023-11-01",
          message: "Logistics planning initiated",
        },
        {
          date: "2023-11-05",
          message: "Delay in customs documentation processing",
          isImportant: true,
        },
      ],
    },
    {
      id: 6,
      title: "Delivery",
      description:
        "Products are delivered to your specified location with all necessary documentation.",
      icon: Package,
      status: "upcoming",
      requiredActions: [],
      estimatedCompletion: "2023-11-30",
      documents: [],
      updates: [],
    },
  ]);

  const [expandedStep, setExpandedStep] = useState<number | null>(3); // Default to current step

  // Add state for syncing with admin
  const [adminSteps, setAdminSteps] = useState<TradingStep[]>([]);

  // Effect to sync with admin steps (reconstruct from PREDEFINED_STEPS)
  useEffect(() => {
    const fetchAdminSteps = async () => {
      try {
        const storedSteps = localStorage.getItem('tradingSteps');
        if (storedSteps) {
          const parsedSteps = JSON.parse(storedSteps);
          const reconstructed = parsedSteps.map((savedStep: any) => {
            const template = PREDEFINED_STEPS.find(s => s.id === savedStep.id);
            return {
              ...template,
              ...savedStep,
              icon: template.icon,
            };
          });
          setAdminSteps(reconstructed);
          setTradingSteps(reconstructed);
        }
      } catch (error) {
        console.error('Error syncing with admin steps:', error);
      }
    };
    fetchAdminSteps();
    const interval = setInterval(fetchAdminSteps, 5000);
    return () => clearInterval(interval);
  }, []);

  // Effect to simulate real-time updates
  useEffect(() => {
    if (showSpecificProcess) {
      const interval = setInterval(() => {
        // Randomly add an update to a step
        const randomStepIndex = Math.floor(Math.random() * tradingSteps.length);
        const randomStep = tradingSteps[randomStepIndex];

        if (
          randomStep.status === "current" ||
          randomStep.status === "delayed"
        ) {
          const newUpdate = {
            date: new Date().toISOString().split("T")[0],
            message: `Update: ${randomStep.title} process is being reviewed`,
            isImportant: Math.random() > 0.7, // 30% chance of being important
          };

          setTradingSteps((prev) =>
            prev.map((step, idx) =>
              idx === randomStepIndex
                ? {
                    ...step,
                    updates: [...(step.updates || []), newUpdate],
                  }
                : step,
            ),
          );

          // Show notification if enabled
          if (notificationsEnabled && newUpdate.isImportant) {
            // In a real app, this would trigger a notification
            console.log("Important notification:", newUpdate.message);
          }
        }
      }, 30000); // Every 30 seconds

      return () => clearInterval(interval);
    }
  }, [showSpecificProcess, tradingSteps, notificationsEnabled]);

  const toggleExpand = (stepId: number) => {
    setExpandedStep(expandedStep === stepId ? null : stepId);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "current":
        return <Clock className="h-5 w-5 text-blue-500 animate-pulse" />;
      case "delayed":
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-[#E5C59E] text-[#0B1C3F]";
      case "current":
        return "bg-[#F5A623] text-white";
      case "delayed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-[#F5DEB3] text-[#0B1C3F]";
    }
  };

  const handleSubmitDetails = () => {
    if (inputShipmentId.trim() && inputClientName.trim()) {
      setIsLoading(true);

      // Find steps for this shipment
      const shipmentSteps = adminSteps.filter(
        step => step.shipmentId === inputShipmentId.trim() &&
        step.client.name === inputClientName.trim()
      );

      if (shipmentSteps.length > 0) {
        setShipmentDetails({
          shipmentId: inputShipmentId.trim(),
          clientName: inputClientName.trim(),
          email: inputEmail.trim() || undefined,
          notificationsEnabled: notificationsEnabled,
        });
        setShowSpecificProcess(true);
        
        // Update trading steps with the found shipment steps
        setTradingSteps(prev => prev.map(step => {
          const shipmentStep = shipmentSteps.find(s => s.id === step.id);
          if (shipmentStep) {
            return {
              ...step,
              status: shipmentStep.status,
              requiredActions: shipmentStep.requiredActions,
              completedActions: shipmentStep.completedActions,
              estimatedCompletion: shipmentStep.estimatedCompletion,
              lastUpdated: shipmentStep.lastUpdated
            };
          }
          return step;
        }));
      } else {
        alert('No shipment found with the provided details');
      }
      
      setIsLoading(false);
    }
  };

  // Filter steps based on selected status
  const filteredSteps = filterStatus
    ? tradingSteps.filter((step) => step.status === filterStatus)
    : tradingSteps;

  const handleClearDetails = () => {
    setShipmentDetails(null);
    setInputShipmentId("");
    setInputClientName("");
    setInputEmail("");
    setNotificationsEnabled(false);
    setShowSpecificProcess(false);
    setFilterStatus(null);
    setShowFilters(false);
    setActiveTab("timeline");
  };

  const handleToggleNotifications = () => {
    setNotificationsEnabled(!notificationsEnabled);

    if (shipmentDetails) {
      setShipmentDetails({
        ...shipmentDetails,
        notificationsEnabled: !notificationsEnabled,
      });
    }
  };

  const handleExportData = () => {
    // In a real app, this would generate and download a report
    alert("Exporting shipment data as PDF...");
  };

  const handleShareProcess = () => {
    // In a real app, this would generate a shareable link
    if (shipmentDetails?.email) {
      alert(`Sharing process details with ${shipmentDetails.email}`);
    } else {
      alert("Please provide an email to share the process details");
    }
  };

  const handleCompleteAction = (stepId: number, actionIndex: number) => {
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
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8 bg-[#F5DEB3]/10">
      <div className="mb-8 p-6 bg-[#EDC9AF]/20 rounded-lg shadow-sm border border-[#C4A484]/20">
        <h3 className="text-xl font-bold text-[#C4A484] mb-4">
          Track Your Shipment
        </h3>
        <div className="grid md:grid-cols-3 gap-4 mb-4">
          <div>
            <Label htmlFor="shipmentId" className="mb-2 block">
              Shipment ID
            </Label>
            <Input
              id="shipmentId"
              placeholder="Enter your shipment ID"
              value={inputShipmentId}
              onChange={(e) => setInputShipmentId(e.target.value)}
              className="w-full"
            />
          </div>
          <div>
            <Label htmlFor="clientName" className="mb-2 block">
              Client Name
            </Label>
            <Input
              id="clientName"
              placeholder="Enter client name"
              value={inputClientName}
              onChange={(e) => setInputClientName(e.target.value)}
              className="w-full"
            />
          </div>
          <div>
            <Label htmlFor="email" className="mb-2 block">
              Email (Optional)
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter email for notifications"
              value={inputEmail}
              onChange={(e) => setInputEmail(e.target.value)}
              className="w-full"
            />
          </div>
        </div>
        <div className="flex flex-wrap gap-3 items-center">
          <div className="flex items-center gap-2 mr-2">
            <input
              type="checkbox"
              id="notifications"
              checked={notificationsEnabled}
              onChange={() => setNotificationsEnabled(!notificationsEnabled)}
              className="h-4 w-4 rounded border-gray-300 text-[#F5A623] focus:ring-[#F5A623]"
            />
            <Label htmlFor="notifications" className="text-sm cursor-pointer">
              Enable notifications
            </Label>
          </div>
          <Button
            onClick={handleSubmitDetails}
            className="bg-[#F5A623] hover:bg-[#C19A6B] text-white transition-colors duration-300"
            disabled={
              isLoading || !inputShipmentId.trim() || !inputClientName.trim()
            }
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Loading...
              </>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" /> Track Process
              </>
            )}
          </Button>
          {showSpecificProcess && (
            <Button
              onClick={handleClearDetails}
              variant="outline"
              disabled={isLoading}
            >
              Clear Details
            </Button>
          )}
        </div>
        {shipmentDetails && (
          <div className="mt-4 p-3 bg-blue-50 rounded border border-blue-100">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-sm text-blue-800">
                <span className="font-semibold">Tracking:</span> Shipment{" "}
                {shipmentDetails.shipmentId} for {shipmentDetails.clientName}
                {shipmentDetails.email && (
                  <span className="ml-1">({shipmentDetails.email})</span>
                )}
              </p>
              <div className="flex gap-2">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 px-2"
                        onClick={handleToggleNotifications}
                      >
                        <Bell
                          className={`h-4 w-4 ${shipmentDetails.notificationsEnabled ? "text-[#F5A623]" : "text-gray-400"}`}
                        />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>
                        {shipmentDetails.notificationsEnabled
                          ? "Disable"
                          : "Enable"}{" "}
                        notifications
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 px-2"
                        onClick={handleExportData}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Export shipment data</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 px-2"
                        onClick={handleShareProcess}
                      >
                        <Share2 className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Share process details</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 px-2"
                        onClick={() => setShowFilters(!showFilters)}
                      >
                        <Filter className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Filter by status</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>

            {showFilters && (
              <div className="mt-3 pt-3 border-t border-blue-200 flex flex-wrap gap-2">
                <Badge
                  className={`cursor-pointer ${filterStatus === null ? "bg-blue-500" : "bg-blue-200 hover:bg-blue-300"}`}
                  onClick={() => setFilterStatus(null)}
                >
                  All
                </Badge>
                <Badge
                  className={`cursor-pointer ${filterStatus === "completed" ? "bg-green-500" : "bg-green-100 text-green-800 hover:bg-green-200"}`}
                  onClick={() => setFilterStatus("completed")}
                >
                  Completed
                </Badge>
                <Badge
                  className={`cursor-pointer ${filterStatus === "current" ? "bg-blue-500" : "bg-blue-100 text-blue-800 hover:bg-blue-200"}`}
                  onClick={() => setFilterStatus("current")}
                >
                  Current
                </Badge>
                <Badge
                  className={`cursor-pointer ${filterStatus === "upcoming" ? "bg-gray-500" : "bg-gray-100 text-gray-800 hover:bg-gray-200"}`}
                  onClick={() => setFilterStatus("upcoming")}
                >
                  Upcoming
                </Badge>
                <Badge
                  className={`cursor-pointer ${filterStatus === "delayed" ? "bg-red-500" : "bg-red-100 text-red-800 hover:bg-red-200"}`}
                  onClick={() => setFilterStatus("delayed")}
                >
                  Delayed
                </Badge>
              </div>
            )}
          </div>
        )}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        {showSpecificProcess && (
          <TabsList className="grid w-full grid-cols-3 bg-[#EDC9AF]/30">
            <TabsTrigger 
              value="timeline"
              className="data-[state=active]:bg-[#F5A623] data-[state=active]:text-white text-[#C4A484]"
            >
              Timeline
            </TabsTrigger>
            <TabsTrigger 
              value="documents"
              className="data-[state=active]:bg-[#F5A623] data-[state=active]:text-white text-[#C4A484]"
            >
              Documents
            </TabsTrigger>
            <TabsTrigger 
              value="updates"
              className="data-[state=active]:bg-[#F5A623] data-[state=active]:text-white text-[#C4A484]"
            >
              Updates
            </TabsTrigger>
          </TabsList>
        )}

        <div className="relative">
          <TabsContent value="timeline" className="mt-0">
            {/* Mobile view */}
            <div className="md:hidden space-y-4">
              {!showSpecificProcess
                ? tradingSteps.map((step) => (
                    <motion.div
                      key={step.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Card
                        className={`shadow-md hover:shadow-lg transition-shadow duration-300 border-l-4 ${
                          step.status === "completed"
                            ? "border-l-[#C4A484]"
                            : step.status === "current"
                            ? "border-l-[#F5A623]"
                            : step.status === "delayed"
                            ? "border-l-red-500"
                            : "border-l-[#F5DEB3]"
                        } bg-[#EDC9AF]/10 hover:bg-[#EDC9AF]/20`}
                      >
                        <CardContent className="p-4">
                          <div
                            className="flex items-center justify-between cursor-pointer"
                            onClick={() => toggleExpand(step.id)}
                          >
                            <div className="flex items-center gap-3">
                              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[#EDC9AF] transition-all duration-300 hover:bg-[#C19A6B]">
                                <step.icon className="h-8 w-8 text-[#F5A623]" />
                              </div>
                              <div>
                                <span className="text-[#0B1C3F] font-bold">
                                  {step.title}
                                </span>
                              </div>
                            </div>
                            {expandedStep === step.id ? (
                              <ChevronUp className="h-5 w-5 text-gray-500" />
                            ) : (
                              <ChevronDown className="h-5 w-5 text-gray-500" />
                            )}
                          </div>

                          <AnimatePresence>
                            {expandedStep === step.id && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.3 }}
                                className="overflow-hidden"
                              >
                                <div className="mt-4 pt-4 border-t border-gray-100">
                                  <p className="text-[#546E7A] text-sm mb-3">
                                    {step.description}
                                  </p>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))
                : filteredSteps.map((step) => (
                    <motion.div
                      key={step.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Card
                        className={`shadow-md hover:shadow-lg transition-shadow duration-300 border-l-4 ${
                          step.status === "completed"
                            ? "border-l-[#C4A484]"
                            : step.status === "current"
                            ? "border-l-[#F5A623]"
                            : step.status === "delayed"
                            ? "border-l-red-500"
                            : "border-l-[#F5DEB3]"
                        } bg-[#EDC9AF]/10 hover:bg-[#EDC9AF]/20`}
                      >
                        <CardContent className="p-4">
                          <div
                            className="flex items-center justify-between cursor-pointer"
                            onClick={() => toggleExpand(step.id)}
                          >
                            <div className="flex items-center gap-3">
                              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[#EDC9AF] transition-all duration-300 hover:bg-[#C19A6B]">
                                <step.icon className="h-8 w-8 text-[#F5A623]" />
                              </div>
                              <div>
                                <span className="text-[#0B1C3F] font-bold">
                                  {step.title}
                                </span>
                                <div
                                  className={`text-xs px-2 py-1 rounded-full inline-block ml-2 ${getStatusClass(step.status)}`}
                                >
                                  {step.status.charAt(0).toUpperCase() +
                                    step.status.slice(1)}
                                </div>
                              </div>
                            </div>
                            {expandedStep === step.id ? (
                              <ChevronUp className="h-5 w-5 text-gray-500" />
                            ) : (
                              <ChevronDown className="h-5 w-5 text-gray-500" />
                            )}
                          </div>

                          <AnimatePresence>
                            {expandedStep === step.id && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.3 }}
                                className="overflow-hidden"
                              >
                                <div className="mt-4 pt-4 border-t border-gray-100">
                                  <p className="text-[#546E7A] text-sm mb-3">
                                    {step.description}
                                  </p>

                                  {step.requiredActions &&
                                    step.requiredActions.length > 0 && (
                                      <div className="mt-3">
                                        <h4 className="text-sm font-semibold mb-2">
                                          Required Actions:
                                        </h4>
                                        <ul className="list-disc pl-5 text-sm text-[#546E7A]">
                                          {step.requiredActions.map(
                                            (action, idx) => (
                                              <li
                                                key={idx}
                                                className="flex items-center justify-between"
                                              >
                                                <span>{action}</span>
                                                <Button
                                                  size="sm"
                                                  variant="ghost"
                                                  className="text-green-600 hover:text-green-700 hover:bg-green-50 p-1 h-auto"
                                                  onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleCompleteAction(
                                                      step.id,
                                                      idx,
                                                    );
                                                  }}
                                                >
                                                  <CheckCircle className="h-4 w-4" />
                                                </Button>
                                              </li>
                                            ),
                                          )}
                                        </ul>
                                      </div>
                                    )}

                                  {step.delayReason && (
                                    <div className="mt-3 p-2 bg-red-50 rounded-md">
                                      <h4 className="text-sm font-semibold text-red-700 flex items-center">
                                        <AlertCircle className="h-4 w-4 mr-1" />{" "}
                                        Delay Information:
                                      </h4>
                                      <p className="text-sm text-red-600">
                                        {step.delayReason}
                                      </p>
                                    </div>
                                  )}

                                  {step.estimatedCompletion && (
                                    <div className="mt-3 text-sm text-[#546E7A]">
                                      <span className="font-semibold">
                                        Estimated completion:
                                      </span>{" "}
                                      {new Date(
                                        step.estimatedCompletion,
                                      ).toLocaleDateString()}
                                    </div>
                                  )}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
            </div>

            {/* Desktop view with timeline */}
            <div className="hidden md:block">
              {!showSpecificProcess ? (
                <div className="space-y-12">
                  {tradingSteps.map((step, index) => (
                    <div
                      key={step.id}
                      className="relative grid grid-cols-2 gap-8 items-center"
                    >
                      {/* Timeline dot */}
                      <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center bg-[#EDC9AF]">
                          <Clock className="h-5 w-5 text-[#C4A484]" />
                        </div>
                      </div>

                      {/* Content positioning based on even/odd */}
                      <div className={`contents`}>
                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          className={`${index % 2 === 0 ? "col-start-1 pr-12 text-right" : "col-start-2 pl-12"}`}
                        >
                          <Card
                            className={`h-full shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer bg-[#EDC9AF]/10 hover:bg-[#EDC9AF]/20`}
                            onClick={() => toggleExpand(step.id)}
                          >
                            <CardContent className="p-6">
                              <div
                                className={`flex items-center mb-4 gap-3 ${index % 2 === 0 ? "justify-end" : "justify-start"}`}
                              >
                                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-[#EDC9AF] transition-all duration-300 hover:bg-[#C19A6B] transform hover:rotate-6">
                                  <step.icon className="h-8 w-8 text-[#F5A623]" />
                                </div>
                                <div className="flex items-center">
                                  <span className="text-[#0B1C3F] font-bold text-xl">
                                    {step.title}
                                  </span>
                                </div>
                              </div>
                              <p className="text-[#546E7A]">
                                {step.description}
                              </p>
                            </CardContent>
                          </Card>
                        </motion.div>
                        {/* Empty div for layout in alternating pattern */}
                        <div
                          className={`${index % 2 === 0 ? "col-start-2" : "col-start-1"}`}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                /* Timeline line */
                <>
                  <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gray-200 transform -translate-x-1/2"></div>

                  {/* Timeline steps */}
                  <div className="space-y-12">
                    {filteredSteps.map((step, index) => (
                      <div
                        key={step.id}
                        className="relative grid grid-cols-2 gap-8 items-center"
                      >
                        {/* Timeline dot with status */}
                        <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center ${step.status === "completed" ? "bg-green-100" : step.status === "current" ? "bg-blue-100" : step.status === "delayed" ? "bg-red-100" : "bg-gray-100"}`}
                          >
                            {getStatusIcon(step.status)}
                          </div>
                        </div>

                        {/* Content positioning based on even/odd */}
                        <div className={`contents`}>
                          <motion.div
                            whileHover={{ scale: 1.02 }}
                            className={`${index % 2 === 0 ? "col-start-1 pr-12 text-right" : "col-start-2 pl-12"}`}
                          >
                            <Card
                              className={`h-full shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer bg-[#EDC9AF]/10 hover:bg-[#EDC9AF]/20`}
                              onClick={() => toggleExpand(step.id)}
                            >
                              <CardContent className="p-6">
                                <div
                                  className={`flex items-center mb-4 gap-3 ${index % 2 === 0 ? "justify-end" : "justify-start"}`}
                                >
                                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-[#EDC9AF] transition-all duration-300 hover:bg-[#C19A6B] transform hover:rotate-6">
                                    <step.icon className="h-8 w-8 text-[#F5A623]" />
                                  </div>
                                  <div className="flex items-center">
                                    <span className="text-[#0B1C3F] font-bold text-xl">
                                      {step.title}
                                    </span>
                                    <div
                                      className={`text-xs px-2 py-1 rounded-full inline-block ml-2 ${getStatusClass(step.status)}`}
                                    >
                                      {step.status.charAt(0).toUpperCase() +
                                        step.status.slice(1)}
                                    </div>
                                  </div>
                                </div>
                                <p className="text-[#546E7A]">
                                  {step.description}
                                </p>

                                <AnimatePresence>
                                  {expandedStep === step.id && (
                                    <motion.div
                                      initial={{ height: 0, opacity: 0 }}
                                      animate={{ height: "auto", opacity: 1 }}
                                      exit={{ height: 0, opacity: 0 }}
                                      transition={{ duration: 0.3 }}
                                      className="overflow-hidden"
                                    >
                                      <div className="mt-4 pt-4 border-t border-gray-100">
                                        {step.requiredActions &&
                                          step.requiredActions.length > 0 && (
                                            <div className="mt-3">
                                              <h4 className="text-sm font-semibold mb-2">
                                                Required Actions:
                                              </h4>
                                              <ul
                                                className={`list-disc ${index % 2 === 0 ? "pr-5 text-right" : "pl-5"} text-sm text-[#546E7A]`}
                                              >
                                                {step.requiredActions.map(
                                                  (action, idx) => (
                                                    <li
                                                      key={idx}
                                                      className={`${index % 2 === 0 ? "list-inside flex justify-end items-center" : "flex items-center justify-between"}`}
                                                    >
                                                      {index % 2 === 0 && (
                                                        <Button
                                                          size="sm"
                                                          variant="ghost"
                                                          className="text-green-600 hover:text-green-700 hover:bg-green-50 p-1 h-auto mr-2"
                                                          onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleCompleteAction(
                                                              step.id,
                                                              idx,
                                                            );
                                                          }}
                                                        >
                                                          <CheckCircle className="h-4 w-4" />
                                                        </Button>
                                                      )}
                                                      <span>{action}</span>
                                                      {index % 2 !== 0 && (
                                                        <Button
                                                          size="sm"
                                                          variant="ghost"
                                                          className="text-green-600 hover:text-green-700 hover:bg-green-50 p-1 h-auto"
                                                          onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleCompleteAction(
                                                              step.id,
                                                              idx,
                                                            );
                                                          }}
                                                        >
                                                          <CheckCircle className="h-4 w-4" />
                                                        </Button>
                                                      )}
                                                    </li>
                                                  ),
                                                )}
                                              </ul>
                                            </div>
                                          )}

                                        {step.delayReason && (
                                          <div className="mt-3 p-2 bg-red-50 rounded-md">
                                            <h4 className="text-sm font-semibold text-red-700 flex items-center">
                                              <AlertCircle className="h-4 w-4 mr-1" />{" "}
                                              Delay Information:
                                            </h4>
                                            <p className="text-sm text-red-600">
                                              {step.delayReason}
                                            </p>
                                          </div>
                                        )}

                                        {step.estimatedCompletion && (
                                          <div className="mt-3 text-sm text-[#546E7A]">
                                            <span className="font-semibold">
                                              Estimated completion:
                                            </span>{" "}
                                            {new Date(
                                              step.estimatedCompletion,
                                            ).toLocaleDateString()}
                                          </div>
                                        )}
                                      </div>
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </CardContent>
                            </Card>
                          </motion.div>
                          {/* Empty div for layout in alternating pattern */}
                          <div
                            className={`${index % 2 === 0 ? "col-start-2" : "col-start-1"}`}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </TabsContent>

          <TabsContent value="documents" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredSteps.flatMap((step) =>
                (step.documents || []).map((doc, idx) => (
                  <Card
                    key={`${step.id}-doc-${idx}`}
                    className="overflow-hidden"
                  >
                    <CardContent className="p-0">
                      <div className="p-4 bg-gray-50 border-b flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-[#F5A623]" />
                          <span className="font-medium">{doc.name}</span>
                        </div>
                        <Badge variant="outline">{doc.type}</Badge>
                      </div>
                      <div className="p-4">
                        <p className="text-sm text-gray-500 mb-3">
                          Related to: {step.title} stage
                        </p>
                        <div className="flex justify-between items-center">
                          <Badge className={getStatusClass(step.status)}>
                            {step.status.charAt(0).toUpperCase() +
                              step.status.slice(1)}
                          </Badge>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-[#F5A623]"
                            asChild
                          >
                            <a
                              href={doc.url}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <Download className="h-4 w-4 mr-1" /> Download
                            </a>
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )),
              )}

              {filteredSteps.flatMap((step) => step.documents || []).length ===
                0 && (
                <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
                  <FileText className="h-12 w-12 text-gray-300 mb-2" />
                  <h3 className="text-lg font-medium text-gray-900">
                    No documents available
                  </h3>
                  <p className="text-gray-500 max-w-md mt-1">
                    {filterStatus
                      ? `No documents found with status: ${filterStatus}`
                      : "Documents will appear here as they become available during the trading process."}
                  </p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="updates" className="mt-0">
            <div className="space-y-4">
              {filteredSteps.flatMap((step) =>
                (step.updates || []).map((update, idx) => (
                  <Card
                    key={`${step.id}-update-${idx}`}
                    className={`border-l-4 ${update.isImportant ? "border-l-[#F5A623]" : "border-l-gray-200"}`}
                  >
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center gap-2">
                            {update.isImportant && (
                              <Badge className="bg-[#F5A623]/20 text-[#F5A623] border-[#F5A623]/30">
                                Important
                              </Badge>
                            )}
                            <h4 className="font-medium">{step.title} Update</h4>
                          </div>
                          <p className="text-gray-600 mt-1">{update.message}</p>
                        </div>
                        <div className="text-sm text-gray-500">
                          {new Date(update.date).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="mt-2 pt-2 border-t border-gray-100 flex justify-between items-center">
                        <Badge className={getStatusClass(step.status)}>
                          {step.status.charAt(0).toUpperCase() +
                            step.status.slice(1)}
                        </Badge>
                        <div className="flex items-center text-sm text-gray-500">
                          <Calendar className="h-3 w-3 mr-1" />
                          {step.estimatedCompletion
                            ? `Est. completion: ${new Date(step.estimatedCompletion).toLocaleDateString()}`
                            : "No estimated completion date"}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )),
              )}

              {filteredSteps.flatMap((step) => step.updates || []).length ===
                0 && (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Bell className="h-12 w-12 text-gray-300 mb-2" />
                  <h3 className="text-lg font-medium text-gray-900">
                    No updates available
                  </h3>
                  <p className="text-gray-500 max-w-md mt-1">
                    {filterStatus
                      ? `No updates found with status: ${filterStatus}`
                      : "Updates will appear here as they become available during the trading process."}
                  </p>
                </div>
              )}
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default TradingProcess;
