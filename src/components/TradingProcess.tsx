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
  DollarSign, 
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
import { supabase } from "../lib/supabaseClient"; 

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
    delayReason: "Customs documentation pending", 
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
  status: "completed" | "current" | "upcoming" | "delayed" | "partially_completed";
  required_actions?: string[]; 
  completed_actions?: string[];
  delay_reason?: string;
  estimated_completion?: string;
  last_updated?: string;
  start_date?: string;
  documents?: { name: string; type: string; url: string; }[]; 
  updates?: { date: string; message: string; isImportant?: boolean; }[]; 
  notes?: string;
  shipmentId?: string; 
  client?: Client;    
}

interface Shipment { 
  id: string; 
  shipment_id_display: string;
  client_id: string;
  client_name: string;
  client_email: string;
  client_phone?: string;
  notifications_enabled: boolean;
  user_id?: string; 
}


const TradingProcess = () => {
  const [shipmentData, setShipmentData] = useState<Shipment | null>(null);
  const [tradingSteps, setTradingSteps] = useState<TradingStep[]>([]);
  const [inputShipmentId, setInputShipmentId] = useState("");
  const [inputClientName, setInputClientName] = useState("");
  const [inputEmail, setInputEmail] = useState(""); 
  const [showSpecificProcess, setShowSpecificProcess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null); 
  const [activeTab, setActiveTab] = useState("timeline");
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [expandedStep, setExpandedStep] = useState<number | null>(null); 

  const toggleExpand = (stepId: number) => {
    setExpandedStep(expandedStep === stepId ? null : stepId);
  };

  const getStatusIcon = (status: TradingStep["status"]) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "current":
        return <Clock className="h-5 w-5 text-simba-accent animate-pulse" />; 
      case "delayed":
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default: 
        return <Clock className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusClass = (status: TradingStep["status"]) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "current":
        return "bg-simba-accent/20 text-simba-accent"; 
      case "delayed":
        return "bg-red-100 text-red-800";
      case "partially_completed":
        return "bg-yellow-100 text-yellow-800";
      default: 
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleSubmitDetails = async () => {
    if (!inputShipmentId.trim() || !inputClientName.trim()) {
      setError("Please provide both Shipment ID and Client Name.");
      return;
    }
    setIsLoading(true);
    setError(null);
    setShipmentData(null);
    setTradingSteps([]);
    setShowSpecificProcess(false);

    try {
      const { data: shipmentResult, error: shipmentError } = await supabase
        .from("shipments")
        .select("*")
        .eq("shipment_id_display", inputShipmentId.trim())
        .eq("client_name", inputClientName.trim())
        .limit(1)
        .single(); 

      if (shipmentError) {
        if (shipmentError.code === 'PGRST116') { 
          throw new Error("Shipment not found or client name does not match. Please check your details.");
        }
        throw shipmentError;
      }

      if (shipmentResult) {
        setShipmentData(shipmentResult as Shipment);
        
        const { data: stepsFromDb, error: stepsError } = await supabase
          .from("trading_steps")
          .select("*")
          .eq("shipment_record_id", shipmentResult.id) 
          .order("id", { ascending: true }); 

        if (stepsError) throw stepsError;

        const reconstructedSteps = stepsFromDb.map((dbStep: any) => {
          const template = PREDEFINED_STEPS.find(s => s.id === dbStep.id); 
          return {
            ...dbStep, 
            icon: template ? template.icon : AlertCircle,
            title: template ? template.title : "Unknown Step",
            description: template ? template.description : "No description available.",
            shipmentId: shipmentResult.shipment_id_display, 
            client: { 
              id: shipmentResult.client_id,
              name: shipmentResult.client_name,
              email: shipmentResult.client_email,
              phone: shipmentResult.client_phone,
            },
            requiredActions: dbStep.required_actions || (template?.requiredActions || []),
            completedActions: dbStep.completed_actions || [],
            delayReason: dbStep.delay_reason,
            estimatedCompletion: dbStep.estimated_completion,
            lastUpdated: dbStep.last_updated,
            startDate: dbStep.start_date,
            documents: dbStep.documents || [], 
            updates: dbStep.updates || [],
            notes: dbStep.notes,
          };
        });
        setTradingSteps(reconstructedSteps as TradingStep[]);
        setShowSpecificProcess(true);
        const firstNonCompletedStep = reconstructedSteps.find(s => s.status === 'current' || s.status === 'delayed');
        setExpandedStep(firstNonCompletedStep ? firstNonCompletedStep.id : (reconstructedSteps.length > 0 ? reconstructedSteps[0].id : null));

      } else {
         throw new Error("Shipment not found. Please verify your Shipment ID and Client Name.");
      }
    } catch (err: any) {
      console.error("Error fetching shipment details:", err);
      setError(err.message || "An error occurred while fetching shipment details.");
      setShipmentData(null);
      setTradingSteps([]);
      setShowSpecificProcess(false);
    } finally {
      setIsLoading(false);
    }
  };
  
  const filteredSteps = filterStatus
    ? tradingSteps.filter((step) => step.status === filterStatus)
    : tradingSteps;

  const handleClearDetails = () => {
    setShipmentData(null); 
    setInputShipmentId("");
    setInputClientName("");
    setInputEmail("");
    setShowSpecificProcess(false);
    setFilterStatus(null);
    setShowFilters(false);
    setActiveTab("timeline");
    setError(null); 
    setExpandedStep(null);
  };

  const handleToggleNotifications = async () => {
    if (!shipmentData) return;

    const currentStatus = shipmentData.notifications_enabled;
    const newStatus = !currentStatus;

    setShipmentData(prev => prev ? { ...prev, notifications_enabled: newStatus } : null);

    try {
      const { error: updateError } = await supabase
        .from("shipments")
        .update({ notifications_enabled: newStatus })
        .eq("id", shipmentData.id);

      if (updateError) {
        setShipmentData(prev => prev ? { ...prev, notifications_enabled: currentStatus } : null);
        throw updateError;
      }
    } catch (err: any) {
      console.error("Error updating notification status:", err);
      setError(err.message || "Failed to update notification status.");
    }
  };

  const handleExportData = () => {
    console.warn("Feature not implemented: Exporting shipment data as PDF...");
  };

  const handleShareProcess = () => {
    if (shipmentData?.client_email) { 
      console.warn(`Feature not implemented: Sharing process details with ${shipmentData.client_email}`);
    } else {
      console.warn("Feature not implemented: Email not available for sharing.");
    }
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
              checked={shipmentData?.notifications_enabled || false} 
              onChange={handleToggleNotifications} 
            className="h-4 w-4 rounded border-gray-300 text-simba-accent focus:ring-simba-accent"
            />
            <Label htmlFor="notifications" className="text-sm cursor-pointer">
              Enable email notifications (uses input below if provided, or client's email if available)
            </Label>
          </div>
          <Button
            onClick={handleSubmitDetails}
            className="bg-simba-accent hover:bg-simba-darkgold text-white transition-colors duration-300"
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
          {showSpecificProcess && shipmentData && ( 
            <Button
              onClick={handleClearDetails}
              variant="outline"
              disabled={isLoading}
            >
              Clear Details
            </Button>
          )}
        </div>
        {error && (
          <Alert variant="destructive" className="mt-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {shipmentData && showSpecificProcess && ( 
          <div className="mt-4 p-3 bg-simba-lightsand/30 rounded border border-simba-sand">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-sm text-simba-navy">
                <span className="font-semibold">Tracking:</span> Shipment{" "}
                {shipmentData.shipment_id_display} for {shipmentData.client_name}
                {(inputEmail || shipmentData.client_email) && (
                  <span className="ml-1"> (Email: {inputEmail || shipmentData.client_email})</span>
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
                        disabled={!shipmentData} 
                      >
                        <Bell
                          className={`h-4 w-4 ${shipmentData.notifications_enabled ? "text-simba-accent" : "text-gray-400"}`}
                        />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>
                        {shipmentData.notifications_enabled
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
                ? PREDEFINED_STEPS.map((step) => ( 
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
                : filteredSteps.map((step, index) => ( 
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
                                                className="text-left" 
                                              >
                                                <span>{action}</span>
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
                  {PREDEFINED_STEPS.map((step, index) => (
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
              ) : ( // This is the "else" part: showSpecificProcess is true
                <>
                  {/* Timeline line - Render only if there are steps to display */}
                  {filteredSteps.length > 0 && (
                    <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gray-200 transform -translate-x-1/2"></div>
                  )}
                  
                  {/* Timeline steps or empty state */}
                  {filteredSteps.length > 0 && (
                    <div className="space-y-12">
                      {filteredSteps.map((step, index) => (
                        <div
                          key={step.id}
                          className="relative grid grid-cols-2 gap-8 items-center"
                        >
                          {/* Timeline dot with status */}
                          <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
                            <div
                              className={`w-8 h-8 rounded-full flex items-center justify-center bg-gray-200`} // Simplified for debugging
                            >
                              {getStatusIcon(step.status)}
                            </div>
                          </div>

                          {/* Content positioning based on even/odd */}
                          <div className={`contents`}>
                           {/* Simplified content for debugging */}
                          <div className={`${index % 2 === 0 ? "col-start-1 pr-12 text-right" : "col-start-2 pl-12"}`}>
                            <p>{step.title}</p>
                          </div>
                            <div
                              className={`${index % 2 === 0 ? "col-start-2" : "col-start-1"}`}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  {filteredSteps.length === 0 && showSpecificProcess && !isLoading && !loadStepsError && (
                    <div className="text-center py-10 col-span-2"> {/* Ensure it spans both columns if timeline is not drawn */}
                      <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-700">No Trading Steps Found</h3>
                      <p className="text-gray-500">No trading steps have been recorded for this shipment yet.</p>
                    </div>
                  )}
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
// The file has no content beyond this line.
