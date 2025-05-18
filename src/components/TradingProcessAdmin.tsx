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
import { TradingStep } from "../hooks/useTradingProcess";

interface TradingProcessAdminProps {
  isAdmin?: boolean;
}

const TradingProcessAdmin = ({ isAdmin = false }: TradingProcessAdminProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("steps");
  const [shipmentId, setShipmentId] = useState("");
  const [clientName, setClientName] = useState("");

  // Mock trading steps data
  const [tradingSteps, setTradingSteps] = useState<TradingStep[]>([
    {
      id: 1,
      title: "Enquiry",
      description:
        "Submit your product requirements and specifications through our RFQ form.",
      icon: "MessageSquare",
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
  ]);

  const [editingStep, setEditingStep] = useState<TradingStep | null>(null);
  const [expandedStepId, setExpandedStepId] = useState<number | null>(null);
  const [newUpdate, setNewUpdate] = useState({
    message: "",
    isImportant: false,
  });
  const [newAction, setNewAction] = useState("");
  const [newDocument, setNewDocument] = useState({
    name: "",
    type: "PDF",
    url: "#",
  });
  const [successMessage, setSuccessMessage] = useState("");

  // Mock admin credentials
  const adminCredentials = {
    username: "admin",
    password: "simba123",
  };

  const handleLogin = () => {
    setIsLoading(true);
    setLoginError("");

    // Simulate API delay
    setTimeout(() => {
      if (
        username === adminCredentials.username &&
        password === adminCredentials.password
      ) {
        setIsAuthenticated(true);
        setLoginError("");
      } else {
        setLoginError("Invalid username or password");
      }
      setIsLoading(false);
    }, 1000);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUsername("");
    setPassword("");
  };

  const toggleExpandStep = (stepId: number) => {
    setExpandedStepId(expandedStepId === stepId ? null : stepId);
  };

  const startEditingStep = (step: TradingStep) => {
    setEditingStep({ ...step });
  };

  const cancelEditingStep = () => {
    setEditingStep(null);
  };

  const saveEditingStep = () => {
    if (editingStep) {
      setTradingSteps((prev) =>
        prev.map((step) => (step.id === editingStep.id ? editingStep : step)),
      );
      setEditingStep(null);
      showSuccessMessage("Step updated successfully");
    }
  };

  const addUpdateToStep = (stepId: number) => {
    if (newUpdate.message.trim()) {
      const update = {
        date: new Date().toISOString().split("T")[0],
        message: newUpdate.message,
        isImportant: newUpdate.isImportant,
      };

      setTradingSteps((prev) =>
        prev.map((step) => {
          if (step.id === stepId) {
            return {
              ...step,
              updates: [...(step.updates || []), update],
            };
          }
          return step;
        }),
      );

      setNewUpdate({ message: "", isImportant: false });
      showSuccessMessage("Update added successfully");
    }
  };

  const addActionToStep = (stepId: number) => {
    if (newAction.trim()) {
      setTradingSteps((prev) =>
        prev.map((step) => {
          if (step.id === stepId) {
            return {
              ...step,
              requiredActions: [...(step.requiredActions || []), newAction],
            };
          }
          return step;
        }),
      );

      setNewAction("");
      showSuccessMessage("Action added successfully");
    }
  };

  const removeActionFromStep = (stepId: number, actionIndex: number) => {
    setTradingSteps((prev) =>
      prev.map((step) => {
        if (step.id === stepId && step.requiredActions) {
          const updatedActions = [...step.requiredActions];
          updatedActions.splice(actionIndex, 1);
          return {
            ...step,
            requiredActions: updatedActions,
          };
        }
        return step;
      }),
    );
    showSuccessMessage("Action removed successfully");
  };

  const addDocumentToStep = (stepId: number) => {
    if (newDocument.name.trim()) {
      setTradingSteps((prev) =>
        prev.map((step) => {
          if (step.id === stepId) {
            return {
              ...step,
              documents: [...(step.documents || []), { ...newDocument }],
            };
          }
          return step;
        }),
      );

      setNewDocument({ name: "", type: "PDF", url: "#" });
      showSuccessMessage("Document added successfully");
    }
  };

  const removeDocumentFromStep = (stepId: number, documentIndex: number) => {
    setTradingSteps((prev) =>
      prev.map((step) => {
        if (step.id === stepId && step.documents) {
          const updatedDocuments = [...step.documents];
          updatedDocuments.splice(documentIndex, 1);
          return {
            ...step,
            documents: updatedDocuments,
          };
        }
        return step;
      }),
    );
    showSuccessMessage("Document removed successfully");
  };

  const showSuccessMessage = (message: string) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  const handleSaveShipment = () => {
    if (shipmentId && clientName) {
      // In a real app, this would save to a database
      showSuccessMessage(
        `Shipment ${shipmentId} for ${clientName} saved successfully`,
      );
      setShipmentId("");
      setClientName("");
    }
  };

  // If not authenticated and not pre-authorized as admin, show login form
  if (!isAuthenticated && !isAdmin) {
    return (
      <div className="w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
        <div className="flex justify-center mb-6">
          <Lock className="h-12 w-12 text-[#0B1C3F]" />
        </div>
        <h2 className="text-2xl font-bold text-center text-[#0B1C3F] mb-6">
          Trading Process Admin
        </h2>

        {loginError && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{loginError}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-4">
          <div>
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter admin username"
            />
          </div>

          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter admin password"
            />
          </div>

          <Button
            className="w-full bg-[#0B1C3F] hover:bg-[#0B1C3F]/90"
            onClick={handleLogin}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Logging in...
              </>
            ) : (
              "Login"
            )}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto p-6 bg-white">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-[#0B1C3F]">
          Trading Process Administration
        </h2>
        <div className="flex items-center gap-4">
          <div className="flex items-center">
            <User className="h-5 w-5 text-[#0B1C3F] mr-2" />
            <span className="text-sm font-medium">
              {isAdmin ? "Admin User" : adminCredentials.username}
            </span>
          </div>
          <Button variant="outline" size="sm" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </div>

      {successMessage && (
        <Alert className="mb-4 bg-green-50 border-green-200">
          <Check className="h-4 w-4 text-green-600" />
          <AlertTitle className="text-green-800">Success</AlertTitle>
          <AlertDescription className="text-green-700">
            {successMessage}
          </AlertDescription>
        </Alert>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="steps">Process Steps</TabsTrigger>
          <TabsTrigger value="shipments">Shipments</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="steps" className="mt-6">
          <div className="space-y-6">
            {tradingSteps.map((step) => (
              <Card key={step.id} className="overflow-hidden">
                <CardHeader className="bg-gray-50 p-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Badge
                        className={`${step.status === "completed" ? "bg-green-100 text-green-800" : step.status === "current" ? "bg-blue-100 text-blue-800" : step.status === "delayed" ? "bg-red-100 text-red-800" : "bg-gray-100 text-gray-800"}`}
                      >
                        {step.status.charAt(0).toUpperCase() +
                          step.status.slice(1)}
                      </Badge>
                      <CardTitle className="text-lg">{step.title}</CardTitle>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => startEditingStep(step)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleExpandStep(step.id)}
                      >
                        {expandedStepId === step.id ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </CardHeader>

                {expandedStepId === step.id && (
                  <CardContent className="p-4">
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium mb-2">Description</h4>
                        <p className="text-gray-600">{step.description}</p>
                      </div>

                      <div>
                        <h4 className="font-medium mb-2">Required Actions</h4>
                        {step.requiredActions &&
                        step.requiredActions.length > 0 ? (
                          <ul className="list-disc pl-5 space-y-1">
                            {step.requiredActions.map((action, idx) => (
                              <li
                                key={idx}
                                className="flex items-center justify-between"
                              >
                                <span>{action}</span>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 w-6 p-0 text-red-500"
                                  onClick={() =>
                                    removeActionFromStep(step.id, idx)
                                  }
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-gray-500 italic">
                            No actions required
                          </p>
                        )}

                        <div className="flex gap-2 mt-2">
                          <Input
                            placeholder="Add new action"
                            value={newAction}
                            onChange={(e) => setNewAction(e.target.value)}
                            className="flex-1"
                          />
                          <Button
                            onClick={() => addActionToStep(step.id)}
                            disabled={!newAction.trim()}
                          >
                            <Plus className="h-4 w-4 mr-1" /> Add
                          </Button>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium mb-2">Updates</h4>
                        {step.updates && step.updates.length > 0 ? (
                          <div className="space-y-2">
                            {step.updates.map((update, idx) => (
                              <div
                                key={idx}
                                className={`p-2 rounded-md ${update.isImportant ? "bg-amber-50 border border-amber-100" : "bg-gray-50 border border-gray-100"}`}
                              >
                                <div className="flex justify-between items-start">
                                  <div>
                                    <p className="text-sm">{update.message}</p>
                                    {update.isImportant && (
                                      <Badge className="bg-amber-100 text-amber-800 mt-1">
                                        Important
                                      </Badge>
                                    )}
                                  </div>
                                  <span className="text-xs text-gray-500">
                                    {update.date}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-gray-500 italic">No updates yet</p>
                        )}

                        <div className="mt-2 space-y-2">
                          <Textarea
                            placeholder="Add update message"
                            value={newUpdate.message}
                            onChange={(e) =>
                              setNewUpdate({
                                ...newUpdate,
                                message: e.target.value,
                              })
                            }
                          />
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                id={`important-${step.id}`}
                                checked={newUpdate.isImportant}
                                onChange={(e) =>
                                  setNewUpdate({
                                    ...newUpdate,
                                    isImportant: e.target.checked,
                                  })
                                }
                                className="mr-2"
                              />
                              <Label htmlFor={`important-${step.id}`}>
                                Mark as important
                              </Label>
                            </div>
                            <Button
                              onClick={() => addUpdateToStep(step.id)}
                              disabled={!newUpdate.message.trim()}
                            >
                              <Plus className="h-4 w-4 mr-1" /> Add Update
                            </Button>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium mb-2">Documents</h4>
                        {step.documents && step.documents.length > 0 ? (
                          <div className="space-y-2">
                            {step.documents.map((doc, idx) => (
                              <div
                                key={idx}
                                className="flex items-center justify-between p-2 bg-gray-50 rounded-md"
                              >
                                <div className="flex items-center">
                                  <FileText className="h-4 w-4 mr-2 text-[#F5A623]" />
                                  <span>{doc.name}</span>
                                  <Badge variant="outline" className="ml-2">
                                    {doc.type}
                                  </Badge>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 w-6 p-0 text-red-500"
                                  onClick={() =>
                                    removeDocumentFromStep(step.id, idx)
                                  }
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-gray-500 italic">
                            No documents attached
                          </p>
                        )}

                        <div className="grid grid-cols-3 gap-2 mt-2">
                          <Input
                            placeholder="Document name"
                            value={newDocument.name}
                            onChange={(e) =>
                              setNewDocument({
                                ...newDocument,
                                name: e.target.value,
                              })
                            }
                          />
                          <Select
                            value={newDocument.type}
                            onValueChange={(value) =>
                              setNewDocument({ ...newDocument, type: value })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="PDF">PDF</SelectItem>
                              <SelectItem value="XLSX">Excel</SelectItem>
                              <SelectItem value="DOCX">Word</SelectItem>
                              <SelectItem value="JPG">Image</SelectItem>
                            </SelectContent>
                          </Select>
                          <Button
                            onClick={() => addDocumentToStep(step.id)}
                            disabled={!newDocument.name.trim()}
                          >
                            <Plus className="h-4 w-4 mr-1" /> Add
                          </Button>
                        </div>
                      </div>

                      {step.estimatedCompletion && (
                        <div>
                          <h4 className="font-medium mb-2">
                            Estimated Completion
                          </h4>
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                            <span>{step.estimatedCompletion}</span>
                          </div>
                        </div>
                      )}

                      {step.delayReason && (
                        <div>
                          <h4 className="font-medium mb-2 text-red-600">
                            Delay Reason
                          </h4>
                          <p className="text-red-500">{step.delayReason}</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="shipments" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Manage Shipments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="shipmentId">Shipment ID</Label>
                    <Input
                      id="shipmentId"
                      value={shipmentId}
                      onChange={(e) => setShipmentId(e.target.value)}
                      placeholder="Enter shipment ID"
                    />
                  </div>
                  <div>
                    <Label htmlFor="clientName">Client Name</Label>
                    <Input
                      id="clientName"
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      placeholder="Enter client name"
                    />
                  </div>
                </div>
                <Button
                  onClick={handleSaveShipment}
                  disabled={!shipmentId.trim() || !clientName.trim()}
                >
                  <Save className="h-4 w-4 mr-2" /> Save Shipment
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Admin Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500">
                Configure notification settings, user permissions, and system
                preferences.
              </p>
              <div className="mt-4">
                <Alert className="bg-blue-50 border-blue-200">
                  <AlertCircle className="h-4 w-4 text-blue-600" />
                  <AlertTitle className="text-blue-800">Information</AlertTitle>
                  <AlertDescription className="text-blue-700">
                    This is a demo version. In a production environment, this
                    section would contain user management, notification
                    settings, and system configuration options.
                  </AlertDescription>
                </Alert>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Edit Step Dialog */}
      <Dialog
        open={!!editingStep}
        onOpenChange={(open) => !open && cancelEditingStep()}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Process Step</DialogTitle>
          </DialogHeader>

          {editingStep && (
            <div className="space-y-4 py-4">
              <div>
                <Label htmlFor="step-title">Title</Label>
                <Input
                  id="step-title"
                  value={editingStep.title}
                  onChange={(e) =>
                    setEditingStep({ ...editingStep, title: e.target.value })
                  }
                />
              </div>

              <div>
                <Label htmlFor="step-description">Description</Label>
                <Textarea
                  id="step-description"
                  value={editingStep.description}
                  onChange={(e) =>
                    setEditingStep({
                      ...editingStep,
                      description: e.target.value,
                    })
                  }
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="step-status">Status</Label>
                <Select
                  value={editingStep.status}
                  onValueChange={(
                    value: "completed" | "current" | "upcoming" | "delayed",
                  ) => setEditingStep({ ...editingStep, status: value })}
                >
                  <SelectTrigger id="step-status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="current">Current</SelectItem>
                    <SelectItem value="upcoming">Upcoming</SelectItem>
                    <SelectItem value="delayed">Delayed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {editingStep.status === "delayed" && (
                <div>
                  <Label htmlFor="delay-reason">Delay Reason</Label>
                  <Input
                    id="delay-reason"
                    value={editingStep.delayReason || ""}
                    onChange={(e) =>
                      setEditingStep({
                        ...editingStep,
                        delayReason: e.target.value,
                      })
                    }
                    placeholder="Reason for delay"
                  />
                </div>
              )}

              <div>
                <Label htmlFor="estimated-completion">
                  Estimated Completion
                </Label>
                <Input
                  id="estimated-completion"
                  type="date"
                  value={editingStep.estimatedCompletion || ""}
                  onChange={(e) =>
                    setEditingStep({
                      ...editingStep,
                      estimatedCompletion: e.target.value,
                    })
                  }
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={cancelEditingStep}>
                  <X className="h-4 w-4 mr-1" /> Cancel
                </Button>
                <Button onClick={saveEditingStep}>
                  <Save className="h-4 w-4 mr-1" /> Save Changes
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TradingProcessAdmin;
