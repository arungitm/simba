import React, { useState, useEffect, useCallback } from "react";
import Navbar from "@/components/Navbar";
import { supabase } from "../lib/supabaseClient";
import { Loader2, AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import TradingProcessAdmin from "@/components/TradingProcessAdmin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import AddProductForm from "@/components/AddProductForm"; // Import new component
import AdminProductList from "@/components/AdminProductList"; // Import new component

// Export Product interface for child components
export interface Product {
  id: string;
  title: string;
  description: string;
  category: string;
  image: string;
  specifications?: string[];
  certifications?: string[];
}

const AdminPage = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // General auth errors
  const [activeTab, setActiveTab] = useState("products");

  // Product specific states
  const [products, setProducts] = useState<Product[]>([]);
  const [newProduct, setNewProduct] = useState<Product>({
    id: "", // Will be set by Supabase
    title: "",
    description: "",
    category: "",
    image: "",
    specifications: [],
    certifications: []
  });
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);
  const [loadProductsError, setLoadProductsError] = useState<string | null>(null);
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [addProductError, setAddProductError] = useState<string | null>(null);
  const [isDeletingProduct, setIsDeletingProduct] = useState<string | null>(null); // Store ID of product being deleted
  const [deleteProductError, setDeleteProductError] = useState<string | null>(null);


  const fetchProducts = useCallback(async () => {
    if (!isLoggedIn) return;
    setIsLoadingProducts(true);
    setLoadProductsError(null);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated to fetch products.");

      const { data, error: fetchError } = await supabase
        .from("products")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (fetchError) throw fetchError;
      setProducts(data.map(p => ({ ...p, id: p.id.toString() })) || []);
    } catch (err: any) {
      setLoadProductsError(err.message || "Failed to load products.");
      console.error("Error fetching products:", err);
    } finally {
      setIsLoadingProducts(false);
    }
  }, [isLoggedIn]);

  useEffect(() => {
    const checkSessionAndFetchProducts = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const loggedIn = !!session;
      setIsLoggedIn(loggedIn);
      if (loggedIn) {
        fetchProducts();
      }
    };
    checkSessionAndFetchProducts();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        const loggedIn = !!session;
        setIsLoggedIn(loggedIn);
        if (loggedIn) {
          fetchProducts(); // Fetch products when user logs in
        } else {
          setProducts([]); // Clear products when user logs out
        }
      }
    );

    return () => {
      authListener?.unsubscribe();
    };
  }, [fetchProducts]);


  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (signInError) {
        throw signInError;
      }
      if (data.user) {
        setIsLoggedIn(true);
      }
    } catch (signInError: any) {
      setError(signInError.message || "Invalid credentials");
      console.error("Login error:", signInError);
    }
  };

  const handleLogout = async () => {
    setError("");
    try {
      const { error: signOutError } = await supabase.auth.signOut();
      if (signOutError) {
        throw signOutError;
      }
      setIsLoggedIn(false);
    } catch (signOutError: any) {
      setError(signOutError.message || "Failed to logout");
      console.error("Logout error:", signOutError);
    }
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAddingProduct(true);
    setAddProductError(null);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated to add products.");

      // Create a product object for Supabase, excluding client-side 'id'
      const productToInsert = {
        ...newProduct,
        user_id: user.id,
        id: undefined, // Ensure Supabase generates the ID
      };
      // Remove id from the object to be inserted if it's an empty string or null
      if (productToInsert.id === "" || productToInsert.id === null) {
        delete productToInsert.id;
      }


      const { data: insertedProduct, error: insertError } = await supabase
        .from("products")
        .insert(productToInsert)
        .select()
        .single();

      if (insertError) throw insertError;

      if (insertedProduct) {
        setProducts(prevProducts => [{ ...insertedProduct, id: insertedProduct.id.toString() }, ...prevProducts]);
        setNewProduct({ // Reset form
          id: "",
          title: "",
          description: "",
          category: "",
          image: "",
          specifications: [],
          certifications: []
        });
      }
    } catch (err: any) {
      setAddProductError(err.message || "Failed to add product.");
      console.error("Error adding product:", err);
    } finally {
      setIsAddingProduct(false);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    setIsDeletingProduct(id);
    setDeleteProductError(null);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated to delete products.");

      const { error: deleteError } = await supabase
        .from("products")
        .delete()
        .match({ id: id, user_id: user.id }); // Ensure user can only delete their own products

      if (deleteError) throw deleteError;

      setProducts(prevProducts => prevProducts.filter(product => product.id !== id));
    } catch (err: any) {
      setDeleteProductError(err.message || "Failed to delete product.");
      console.error("Error deleting product:", err);
    } finally {
      setIsDeletingProduct(null);
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-[#F5DEB3]/10">
        <Navbar />
        <div className="pt-32 pb-16">
          <div className="container mx-auto px-4">
            <Card className="max-w-md mx-auto p-6 bg-white shadow-lg">
              <h1 className="text-2xl font-bold text-simba-navy mb-6 text-center">Admin Login</h1>
              <form onSubmit={handleLogin}>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  {error && (
                    <p className="text-red-500 text-sm">{error}</p>
                  )}
                  <Button type="submit" className="w-full bg-simba-navy hover:bg-simba-darknavy">
                    Login
                  </Button>
                </div>
              </form>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5DEB3]/10">
      <Navbar />
      <div className="pt-32 pb-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold text-simba-navy">Admin Dashboard</h1>
            <Button
              variant="outline"
              onClick={handleLogout}
              className="border-simba-navy text-simba-navy hover:bg-simba-navy hover:text-white"
            >
              Logout
            </Button>
          </div>
          {error && (
            <p className="text-red-500 text-sm mb-4">{error}</p>
          )}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="bg-white">
              <TabsTrigger value="products">Products Management</TabsTrigger>
              <TabsTrigger value="trading">Trading Process</TabsTrigger>
            </TabsList>

            <TabsContent value="products" className="space-y-4">
              <AddProductForm
                newProduct={newProduct}
                setNewProduct={setNewProduct}
                handleAddProduct={handleAddProduct}
                isAddingProduct={isAddingProduct}
                addProductError={addProductError}
              />
              <AdminProductList
                products={products}
                handleDeleteProduct={handleDeleteProduct}
                isDeletingProduct={isDeletingProduct}
                deleteProductError={deleteProductError}
                isLoadingProducts={isLoadingProducts}
                loadProductsError={loadProductsError}
              />
            </TabsContent>

            <TabsContent value="trading">
              <TradingProcessAdmin isLoggedIn={isLoggedIn} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default AdminPage; 