import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Card } from "./ui/card"; // Assuming the selector is within a Card
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { Loader2, AlertCircle } from "lucide-react";

// Assuming Shipment interface is similar to the one in TradingProcessAdmin.tsx
interface Shipment {
  id: string; // UUID from Supabase
  shipment_id_display: string; // User-friendly display ID
  client_id: string;
  client_name: string;
  client_email: string;
  client_phone?: string;
  user_id: string;
  created_at: string;
}

interface ShipmentSelectorProps {
  shipments: Shipment[];
  selectedShipmentId: string | null;
  onSelectShipment: (value: string | null) => void; // Allow null if deselecting or placeholder
  isLoadingShipments: boolean;
  loadShipmentsError: string | null;
}

const ShipmentSelector: React.FC<ShipmentSelectorProps> = ({
  shipments,
  selectedShipmentId,
  onSelectShipment,
  isLoadingShipments,
  loadShipmentsError,
}) => {
  if (isLoadingShipments) {
    return (
      <div className="p-6 flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-simba-navy" />
        <span className="ml-2">Loading shipments...</span>
      </div>
    );
  }

  if (loadShipmentsError) {
    return (
      <Alert variant="destructive" className="m-4">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error Loading Shipments</AlertTitle>
        <AlertDescription>{loadShipmentsError}</AlertDescription>
      </Alert>
    );
  }

  if (shipments.length === 0) {
    return (
      <div className="p-6 text-center text-gray-500">
        No shipments available. Please create a new shipment.
      </div>
    );
  }

  return (
    <Card className="p-6">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-4 gap-4">
        <h2 className="text-xl font-semibold whitespace-nowrap">Manage Process for:</h2>
        <Select
          value={selectedShipmentId || ""}
          onValueChange={(value) => onSelectShipment(value === "" ? null : value)}
        >
          <SelectTrigger className="w-full sm:w-[320px]">
            <SelectValue placeholder="Select a shipment" />
          </SelectTrigger>
          <SelectContent>
            {shipments.map((ship) => (
              <SelectItem key={ship.id} value={ship.id}>
                {ship.shipment_id_display} - {ship.client_name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </Card>
  );
};

export type { Shipment }; // Exporting Shipment interface for use in parent if needed
export default ShipmentSelector;
