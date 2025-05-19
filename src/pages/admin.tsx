import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import TradingProcessAdmin from "@/components/TradingProcessAdmin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Product {
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
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("products");
  const [products, setProducts] = useState<Product[]>([]);
  const [newProduct, setNewProduct] = useState<Product>({
    id: "",
    title: "",
    description: "",
    category: "",
    image: "",
    specifications: [],
    certifications: []
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === "admin" && password === "simba2024") {
      setIsLoggedIn(true);
      setError("");
    } else {
      setError("Invalid credentials");
    }
  };

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    setProducts([...products, { ...newProduct, id: Date.now().toString() }]);
    setNewProduct({
      id: "",
      title: "",
      description: "",
      category: "",
      image: "",
      specifications: [],
      certifications: []
    });
  };

  const handleDeleteProduct = (id: string) => {
    setProducts(products.filter(product => product.id !== id));
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
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
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
              onClick={() => setIsLoggedIn(false)}
              className="border-simba-navy text-simba-navy hover:bg-simba-navy hover:text-white"
            >
              Logout
            </Button>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="bg-white">
              <TabsTrigger value="products">Products Management</TabsTrigger>
              <TabsTrigger value="trading">Trading Process</TabsTrigger>
            </TabsList>

            <TabsContent value="products" className="space-y-4">
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
                  <Button type="submit" className="bg-simba-navy hover:bg-simba-darknavy text-white">
                    Add Product
                  </Button>
                </form>
              </Card>

              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">Product List</h2>
                <div className="space-y-4">
                  {products.map((product) => (
                    <div
                      key={product.id}
                      className="flex items-center justify-between p-4 bg-white rounded-lg shadow"
                    >
                      <div>
                        <h3 className="font-semibold">{product.title}</h3>
                        <p className="text-sm text-gray-600">{product.category}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteProduct(product.id)}
                          className="text-red-600 border-red-600 hover:bg-red-50"
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
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