import React from "react";
import { Product } from "@/pages/admin"; // Assuming Product interface is exported from admin.tsx or moved to a types file
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card"; // Only Card, not CardHeader, etc. if the whole card is moved
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// If Product interface is not exported from admin.tsx, define it here or import from a shared types file
// For now, assuming it will be imported from admin.tsx or a shared location.
// If not, it might be:
// interface Product {
//   id: string;
//   title: string;
//   description: string;
//   category: string;
//   image: string;
//   specifications?: string[];
//   certifications?: string[];
// }

interface AddProductFormProps {
  newProduct: Product;
  setNewProduct: React.Dispatch<React.SetStateAction<Product>>;
  handleAddProduct: (e: React.FormEvent) => Promise<void>;
  isAddingProduct: boolean;
  addProductError: string | null;
}

const AddProductForm: React.FC<AddProductFormProps> = ({
  newProduct,
  setNewProduct,
  handleAddProduct,
  isAddingProduct,
  addProductError,
}) => {
  return (
    <>
      {addProductError && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error Adding Product</AlertTitle>
          <AlertDescription>{addProductError}</AlertDescription>
        </Alert>
      )}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Add New Product</h2>
        <form onSubmit={handleAddProduct} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title">Product Title</Label>
              <Input
                id="title"
                value={newProduct.title}
                onChange={(e) => setNewProduct({ ...newProduct, title: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="category">Category</Label>
              <Select
                value={newProduct.category}
                onValueChange={(value) => setNewProduct({ ...newProduct, category: value })}
                // required - Select doesn't have a native required, handled by form logic if needed
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="petroleum">Petroleum Products</SelectItem>
                  <SelectItem value="coal">Coal & Minerals</SelectItem>
                  <SelectItem value="foodstuffs">Foodstuffs</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={newProduct.description}
              onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
              required
            />
          </div>
          <div>
            <Label htmlFor="image">Image URL</Label>
            <Input
              id="image"
              value={newProduct.image}
              onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
              required
            />
          </div>
          {/* TODO: Add UI for specifications and certifications if they are part of product creation */}
          {/* For example:
          <div>
            <Label htmlFor="specifications">Specifications (comma-separated)</Label>
            <Input
              id="specifications"
              value={newProduct.specifications?.join(', ') || ''}
              onChange={(e) => setNewProduct({ ...newProduct, specifications: e.target.value.split(',').map(s => s.trim()).filter(s => s) })}
            />
          </div>
          */}
          <Button
            type="submit"
            className="bg-simba-navy hover:bg-simba-darknavy text-white flex items-center"
            disabled={isAddingProduct}
          >
            {isAddingProduct ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
            {isAddingProduct ? "Adding..." : "Add Product"}
          </Button>
        </form>
      </Card>
    </>
  );
};

export default AddProductForm;
