import React, { useState } from "react";
import { motion } from "framer-motion";
import { ChevronRight, ChevronLeft, Check, Send, AlertCircle } from "lucide-react";
import { supabase } from "../lib/supabaseClient"; // Import Supabase client

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface RFQFormProps {
  onSubmit?: (formData: FormData) => void;
  className?: string;
}

// FormData and defaultFormData are already exported, which is good.
export type FormData = {
  fullName: string;
  email: string;
  company: string;
  phone: string;
  productCategory: string;
  productSpecifications: string;
  quantity: string;
  unit: string;
  incoterm: string;
  additionalInfo: string;
};

export const defaultFormData: FormData = {
  fullName: "",
  email: "",
  company: "",
  phone: "",
  productCategory: "",
  productSpecifications: "",
  quantity: "",
  unit: "MT",
  incoterm: "",
  additionalInfo: "",
};

const RFQForm: React.FC<RFQFormProps> = ({ onSubmit, className = "" }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<FormData>(defaultFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<
    Partial<Record<keyof FormData, string>>
  >({});

  const steps = [
    { title: "Basic Information", description: "Tell us about yourself" },
    { title: "Product Selection", description: "Select your product category" },
    { title: "Specifications", description: "Provide product details" },
    { title: "Quantity", description: "Specify the amount needed" },
    { title: "Incoterms", description: "Select preferred delivery terms" },
    { title: "Review", description: "Review and submit your request" },
  ];

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  
  // Component's internal validate function that uses the module-scoped one and sets state
  const validateFormAndSetState = (): boolean => {
    const errors = validateRFQForm(formData, currentStep); // Uses the module-scoped validateRFQForm
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const nextStep = () => {
    if (validateFormAndSetState() && currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateFormAndSetState()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    const dataForSupabase = {
      full_name: formData.fullName,
      email: formData.email,
      company: formData.company,
      phone: formData.phone || null, // Ensure optional fields are handled
      product_category: formData.productCategory,
      product_specifications: formData.productSpecifications,
      quantity: formData.quantity,
      unit: formData.unit,
      incoterm: formData.incoterm,
      additional_info: formData.additionalInfo || null, // Ensure optional fields are handled
    };

    try {
      const { error } = await supabase // Corrected: removed trailing underscore
        .from("rfq_submissions")
        .insert([dataForSupabase]);

      if (error) {
        throw error;
      }

      // If Supabase insert is successful
      if (onSubmit) { // Keep existing onSubmit prop call if it's used for other things
        onSubmit(formData);
      }
      setIsSubmitted(true);
    } catch (error: any) {
      console.error("Error submitting RFQ to Supabase:", error);
      setSubmitError(error.message || "Failed to submit RFQ. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const progressPercentage = ((currentStep + 1) / steps.length) * 100;

  if (isSubmitted) {
    return (
      <Card className={`w-full max-w-3xl mx-auto bg-white ${className}`}>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-[#0B1C3F]">
            Request Submitted Successfully!
          </CardTitle>
          <CardDescription>
            Thank you for your interest in Simba Ventura FZE products.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-8">
          <div className="w-16 h-16 rounded-full bg-[#F5A623] flex items-center justify-center mb-4">
            <Check className="w-8 h-8 text-white" />
          </div>
          <p className="text-center text-slate-700 mb-6">
            Our team will review your request and get back to you within 24-48
            business hours with a detailed quote.
          </p>
          <Button
            onClick={() => {
              setIsSubmitted(false);
              setFormData(defaultFormData);
              setCurrentStep(0);
            }}
            className="bg-[#0B1C3F] hover:bg-[#0B1C3F]/90"
          >
            Submit Another Request
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`w-full max-w-3xl mx-auto bg-white ${className}`}>
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-[#0B1C3F]">
          Request For Quote
        </CardTitle>
        <CardDescription>
          Complete the form below to request a quote for our products.
        </CardDescription>
        <div className="mt-4">
          <Progress value={progressPercentage} className="h-2" />
          <div className="flex justify-between mt-2 text-sm text-slate-500">
            <span>
              Step {currentStep + 1} of {steps.length}
            </span>
            <span>{steps[currentStep].title}</span>
          </div>
        </div>
      </CardHeader>

      <form onSubmit={handleSubmit}>
        <CardContent>
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            {currentStep === 0 && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="fullName">Full Name *</Label>
                  <Input
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="John Doe"
                    required
                    className={formErrors.fullName ? "border-red-500" : ""}
                  />
                  {formErrors.fullName && (
                    <p className="text-red-500 text-sm mt-1">
                      {formErrors.fullName}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="john.doe@company.com"
                    required
                    className={formErrors.email ? "border-red-500" : ""}
                  />
                  {formErrors.email && (
                    <p className="text-red-500 text-sm mt-1">
                      {formErrors.email}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="company">Company Name *</Label>
                  <Input
                    id="company"
                    name="company"
                    value={formData.company}
                    onChange={handleInputChange}
                    placeholder="Your Company Ltd."
                    required
                    className={formErrors.company ? "border-red-500" : ""}
                  />
                  {formErrors.company && (
                    <p className="text-red-500 text-sm mt-1">
                      {formErrors.company}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+971 50 123 4567"
                  />
                </div>
              </div>
            )}

            {currentStep === 1 && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="productCategory">Product Category *</Label>
                  <Select
                    value={formData.productCategory}
                    onValueChange={(value) =>
                      handleSelectChange("productCategory", value)
                    }
                    required
                  >
                    <SelectTrigger id="productCategory">
                      <SelectValue placeholder="Select a product category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="petroleum">
                        Petroleum Products
                      </SelectItem>
                      <SelectItem value="coal">Coal</SelectItem>
                      <SelectItem value="minerals">Minerals</SelectItem>
                      <SelectItem value="foodstuffs">Foodstuffs</SelectItem>
                    </SelectContent>
                  </Select>
                  {formErrors.productCategory && (
                    <p className="text-red-500 text-sm mt-1">
                      {formErrors.productCategory}
                    </p>
                  )}
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="productSpecifications">
                    Product Specifications *
                  </Label>
                  <Textarea
                    id="productSpecifications"
                    name="productSpecifications"
                    value={formData.productSpecifications}
                    onChange={handleInputChange}
                    placeholder="Please provide detailed specifications for your product requirements"
                    rows={5}
                    required
                    className={
                      formErrors.productSpecifications ? "border-red-500" : ""
                    }
                  />
                  {formErrors.productSpecifications && (
                    <p className="text-red-500 text-sm mt-1">
                      {formErrors.productSpecifications}
                    </p>
                  )}
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="quantity">Quantity *</Label>
                  <div className="flex gap-2">
                    <Input
                      id="quantity"
                      name="quantity"
                      type="number"
                      value={formData.quantity}
                      onChange={handleInputChange}
                      placeholder="Enter quantity"
                      className={`flex-1 ${formErrors.quantity ? "border-red-500" : ""}`}
                      required
                    />
                    <Select
                      value={formData.unit}
                      onValueChange={(value) =>
                        handleSelectChange("unit", value)
                      }
                    >
                      <SelectTrigger id="unit" className="w-[120px]">
                        <SelectValue placeholder="Unit" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="MT">MT</SelectItem>
                        <SelectItem value="KG">KG</SelectItem>
                        <SelectItem value="Barrels">Barrels</SelectItem>
                        <SelectItem value="Tons">Tons</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {formErrors.quantity && (
                    <p className="text-red-500 text-sm mt-1">
                      {formErrors.quantity}
                    </p>
                  )}
                </div>
              </div>
            )}

            {currentStep === 4 && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="incoterm">Preferred Incoterm *</Label>
                  <Select
                    value={formData.incoterm}
                    onValueChange={(value) =>
                      handleSelectChange("incoterm", value)
                    }
                    required
                  >
                    <SelectTrigger id="incoterm">
                      <SelectValue placeholder="Select an incoterm" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="FOB">FOB (Free On Board)</SelectItem>
                      <SelectItem value="CIF">
                        CIF (Cost, Insurance & Freight)
                      </SelectItem>
                      <SelectItem value="CFR">
                        CFR (Cost and Freight)
                      </SelectItem>
                      <SelectItem value="EXW">EXW (Ex Works)</SelectItem>
                      <SelectItem value="DDP">
                        DDP (Delivered Duty Paid)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  {formErrors.incoterm && (
                    <p className="text-red-500 text-sm mt-1">
                      {formErrors.incoterm}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="additionalInfo">Additional Information</Label>
                  <Textarea
                    id="additionalInfo"
                    name="additionalInfo"
                    value={formData.additionalInfo}
                    onChange={handleInputChange}
                    placeholder="Any additional details or requirements"
                    rows={3}
                  />
                </div>
              </div>
            )}

            {currentStep === 5 && (
              <div className="space-y-6">
                <h3 className="text-lg font-medium">Review Your Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-slate-500">
                      Contact Information
                    </h4>
                    <div className="mt-2 space-y-2">
                      <p>
                        <span className="font-medium">Name:</span>{" "}
                        {formData.fullName}
                      </p>
                      <p>
                        <span className="font-medium">Email:</span>{" "}
                        {formData.email}
                      </p>
                      <p>
                        <span className="font-medium">Company:</span>{" "}
                        {formData.company}
                      </p>
                      <p>
                        <span className="font-medium">Phone:</span>{" "}
                        {formData.phone || "Not provided"}
                      </p>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-slate-500">
                      Product Information
                    </h4>
                    <div className="mt-2 space-y-2">
                      <p>
                        <span className="font-medium">Category:</span>{" "}
                        {formData.productCategory}
                      </p>
                      <p>
                        <span className="font-medium">Quantity:</span>{" "}
                        {formData.quantity} {formData.unit}
                      </p>
                      <p>
                        <span className="font-medium">Incoterm:</span>{" "}
                        {formData.incoterm}
                      </p>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-slate-500">
                    Specifications
                  </h4>
                  <p className="mt-2 whitespace-pre-wrap">
                    {formData.productSpecifications}
                  </p>
                </div>
                {formData.additionalInfo && (
                  <div>
                    <h4 className="text-sm font-medium text-slate-500">
                      Additional Information
                    </h4>
                    <p className="mt-2 whitespace-pre-wrap">
                      {formData.additionalInfo}
                    </p>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </CardContent>

        <CardFooter className="flex justify-between border-t p-6">
          <Button
            type="button"
            onClick={prevStep}
            disabled={currentStep === 0 || isSubmitting}
            variant="outline"
            className="flex items-center gap-1"
          >
            <ChevronLeft className="w-4 h-4" /> Back
          </Button>

          {submitError && (
            <div className="flex items-center text-red-600 mr-auto">
              <AlertCircle className="w-4 h-4 mr-1" />
              <span className="text-sm">{submitError}</span>
            </div>
          )}

          {currentStep < steps.length - 1 ? (
            <Button
              type="button"
              onClick={nextStep}
              className="bg-[#F5A623] hover:bg-[#F5A623]/90 text-white flex items-center gap-1"
            >
              Next <ChevronRight className="w-4 h-4" />
            </Button>
          ) : (
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-[#F5A623] hover:bg-[#F5A623]/90 text-white flex items-center gap-1"
            >
              {isSubmitting ? "Submitting..." : "Submit Request"}
              {isSubmitting ? null : <Send className="w-4 h-4 ml-1" />}
            </Button>
          )}
        </CardFooter>
      </form>
    </Card>
  );
};

// Moved validateFormInternal outside the component to be validateRFQForm at module scope
// and directly exported.
export const validateRFQForm = (
  data: FormData,
  step: number,
): Partial<Record<keyof FormData, string>> => {
  const errors: Partial<Record<keyof FormData, string>> = {};

  // Basic validation (Always applied, but errors shown based on step progression in UI)
  if (!data.fullName.trim()) {
    errors.fullName = "Full name is required";
  }
  if (!data.email.trim()) {
    errors.email = "Email is required";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = "Please enter a valid email address";
  }
  if (!data.company.trim()) {
    errors.company = "Company name is required";
  }

  // Step-specific validation
  if (step >= 1 && !data.productCategory) {
    errors.productCategory = "Please select a product category";
  }
  if (step >= 2 && !data.productSpecifications.trim()) {
    errors.productSpecifications = "Product specifications are required";
  }
  if (step >= 3 && !data.quantity.trim()) {
    errors.quantity = "Quantity is required";
  }
  if (step >= 4 && !data.incoterm) {
    errors.incoterm = "Please select an incoterm";
  }
  return errors;
};

export default RFQForm;