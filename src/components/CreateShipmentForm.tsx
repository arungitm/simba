import React from "react";
import { Loader2, Plus, AlertCircle } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card"; // Assuming CardHeader, CardTitle, CardContent might not be directly used if only form is passed
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";

interface CreateShipmentFormProps {
  newShipmentDisplayId: string;
  setNewShipmentDisplayId: (value: string) => void;
  newShipmentClientId: string;
  setNewShipmentClientId: (value: string) => void;
  newShipmentClientName: string;
  setNewShipmentClientName: (value: string) => void;
  newShipmentClientEmail: string;
  setNewShipmentClientEmail: (value: string) => void;
  newShipmentClientPhone: string;
  setNewShipmentClientPhone: (value: string) => void;
  handleCreateShipment: (e: React.FormEvent) => Promise<void>;
  isCreatingShipment: boolean;
  createShipmentError: string | null;
}

const CreateShipmentForm: React.FC<CreateShipmentFormProps> = ({
  newShipmentDisplayId,
  setNewShipmentDisplayId,
  newShipmentClientId,
  setNewShipmentClientId,
  newShipmentClientName,
  setNewShipmentClientName,
  newShipmentClientEmail,
  setNewShipmentClientEmail,
  newShipmentClientPhone,
  setNewShipmentClientPhone,
  handleCreateShipment,
  isCreatingShipment,
  createShipmentError,
}) => {
  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">Create New Shipment</h2>
      {createShipmentError && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error Creating Shipment</AlertTitle>
          <AlertDescription>{createShipmentError}</AlertDescription>
        </Alert>
      )}
      <form onSubmit={handleCreateShipment} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="newShipmentDisplayIdForm">Shipment ID (Display) *</Label>
            <Input
              id="newShipmentDisplayIdForm" // Changed ID to avoid conflict if parent has same
              value={newShipmentDisplayId}
              onChange={(e) => setNewShipmentDisplayId(e.target.value)}
              placeholder="e.g., SHP-001"
              required
            />
          </div>
          <div>
            <Label htmlFor="newShipmentClientIdForm">Client ID *</Label>
            <Input
              id="newShipmentClientIdForm" // Changed ID
              value={newShipmentClientId}
              onChange={(e) => setNewShipmentClientId(e.target.value)}
              placeholder="Client's unique ID"
              required
            />
          </div>
          <div>
            <Label htmlFor="newShipmentClientNameForm">Client Name *</Label>
            <Input
              id="newShipmentClientNameForm" // Changed ID
              value={newShipmentClientName}
              onChange={(e) => setNewShipmentClientName(e.target.value)}
              placeholder="Client's full name"
              required
            />
          </div>
          <div>
            <Label htmlFor="newShipmentClientEmailForm">Client Email *</Label>
            <Input
              id="newShipmentClientEmailForm" // Changed ID
              type="email"
              value={newShipmentClientEmail}
              onChange={(e) => setNewShipmentClientEmail(e.target.value)}
              placeholder="Client's email"
              required
            />
          </div>
          <div>
            <Label htmlFor="newShipmentClientPhoneForm">Client Phone</Label>
            <Input
              id="newShipmentClientPhoneForm" // Changed ID
              type="tel"
              value={newShipmentClientPhone}
              onChange={(e) => setNewShipmentClientPhone(e.target.value)}
              placeholder="Client's phone number"
            />
          </div>
        </div>
        <Button
          type="submit"
          className="bg-simba-navy hover:bg-simba-darknavy text-white"
          disabled={isCreatingShipment}
        >
          {isCreatingShipment ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Plus className="w-4 h-4 mr-2" />
          )}
          {isCreatingShipment ? "Creating..." : "Create Shipment"}
        </Button>
      </form>
    </Card>
  );
};

export default CreateShipmentForm;
