import React from "react";
import { Product } from "@/pages/admin"; // Assuming Product interface is exported from admin.tsx or moved
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card"; // Only Card, not CardHeader, etc. if the whole card is moved
import { Loader2, AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// If Product interface is not exported from admin.tsx, define it here or import from a shared types file
// For now, assuming it will be imported from admin.tsx or a shared location.
// interface Product {
//   id: string;
//   title: string;
//   description: string; // Not displayed in list, but part of the model
//   category: string;
//   image: string;
//   specifications?: string[];
//   certifications?: string[];
// }

interface AdminProductListProps {
  products: Product[];
  handleDeleteProduct: (id: string) => Promise<void>;
  isDeletingProduct: string | null; // ID of product being deleted
  deleteProductError: string | null;
  isLoadingProducts: boolean;
  loadProductsError: string | null;
}

const AdminProductList: React.FC<AdminProductListProps> = ({
  products,
  handleDeleteProduct,
  isDeletingProduct,
  deleteProductError,
  isLoadingProducts,
  loadProductsError,
}) => {
  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">Product List</h2>
      {loadProductsError && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error Loading Products</AlertTitle>
          <AlertDescription>{loadProductsError}</AlertDescription>
        </Alert>
      )}
      {deleteProductError && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error Deleting Product</AlertTitle>
          <AlertDescription>{deleteProductError}</AlertDescription>
        </Alert>
      )}
      {isLoadingProducts ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-simba-navy" />
          <span className="ml-2">Loading products...</span>
        </div>
      ) : products.length === 0 && !loadProductsError ? (
        <p>No products found. Add a new product to get started.</p>
      ) : (
        <div className="space-y-4">
          {products.map((product) => (
            <div
              key={product.id}
              className="flex items-center justify-between p-4 bg-white rounded-lg shadow"
            >
              <div className="flex items-center gap-4">
                {product.image && (
                  <img
                    src={product.image}
                    alt={product.title}
                    className="w-16 h-16 object-cover rounded"
                  />
                )}
                <div>
                  <h3 className="font-semibold">{product.title}</h3>
                  <p className="text-sm text-gray-600">{product.category}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDeleteProduct(product.id)}
                  className="text-red-600 border-red-600 hover:bg-red-50 flex items-center"
                  disabled={isDeletingProduct === product.id}
                >
                  {isDeletingProduct === product.id ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : null}
                  {isDeletingProduct === product.id ? "Deleting..." : "Delete"}
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
};

export default AdminProductList;
