import { describe, it, expect, vi } from 'vitest';
import {
  validateRFQForm,
  type FormData,
  defaultFormData,
} from './RFQForm'; // Adjust path if necessary

// Mock the supabase client to prevent errors about missing ENV VARS
vi.mock('../lib/supabaseClient', () => ({
  supabase: {
    from: vi.fn(() => ({
      insert: vi.fn().mockResolvedValue({ error: null }),
    })),
    // Add any other Supabase client methods used by RFQForm if necessary,
    // though for validateRFQForm, the client itself isn't directly used by the validation logic.
  },
}));

describe('RFQForm validation (validateRFQForm)', () => {
  // --- Step 0: Basic Information ---
  describe('Step 0: Basic Information', () => {
    const currentStep = 0;

    it('should pass with valid data', () => {
      const formData: FormData = {
        ...defaultFormData,
        fullName: 'John Doe',
        email: 'john.doe@example.com',
        company: 'Example Corp',
      };
      const errors = validateRFQForm(formData, currentStep);
      expect(Object.keys(errors).length).toBe(0);
    });

    it('should fail if fullName is missing', () => {
      const formData: FormData = {
        ...defaultFormData,
        email: 'john.doe@example.com',
        company: 'Example Corp',
      };
      const errors = validateRFQForm(formData, currentStep);
      expect(errors.fullName).toBe('Full name is required');
    });

    it('should fail if email is missing', () => {
      const formData: FormData = {
        ...defaultFormData,
        fullName: 'John Doe',
        company: 'Example Corp',
      };
      const errors = validateRFQForm(formData, currentStep);
      expect(errors.email).toBe('Email is required');
    });

    it('should fail if email format is invalid', () => {
      const formData: FormData = {
        ...defaultFormData,
        fullName: 'John Doe',
        email: 'john.doe',
        company: 'Example Corp',
      };
      const errors = validateRFQForm(formData, currentStep);
      expect(errors.email).toBe('Please enter a valid email address');
    });

    it('should fail if company is missing', () => {
      const formData: FormData = {
        ...defaultFormData,
        fullName: 'John Doe',
        email: 'john.doe@example.com',
      };
      const errors = validateRFQForm(formData, currentStep);
      expect(errors.company).toBe('Company name is required');
    });
  });

  // --- Step 1: Product Selection ---
  describe('Step 1: Product Selection', () => {
    const currentStep = 1;
    const baseValidData: FormData = {
      ...defaultFormData,
      fullName: 'John Doe',
      email: 'john.doe@example.com',
      company: 'Example Corp',
    };

    it('should fail if productCategory is missing when currentStep >= 1', () => {
      const formData: FormData = { ...baseValidData, productCategory: '' };
      const errors = validateRFQForm(formData, currentStep);
      expect(errors.productCategory).toBe('Please select a product category');
    });

    it('should pass if productCategory is present when currentStep >= 1', () => {
      const formData: FormData = { ...baseValidData, productCategory: 'petroleum' };
      const errors = validateRFQForm(formData, currentStep);
      expect(errors.productCategory).toBeUndefined();
    });
  });

  // --- Step 2: Specifications ---
  describe('Step 2: Specifications', () => {
    const currentStep = 2;
    const baseValidData: FormData = {
      ...defaultFormData,
      fullName: 'John Doe',
      email: 'john.doe@example.com',
      company: 'Example Corp',
      productCategory: 'petroleum',
    };

    it('should fail if productSpecifications is missing when currentStep >= 2', () => {
      const formData: FormData = { ...baseValidData, productSpecifications: ' ' };
      const errors = validateRFQForm(formData, currentStep);
      expect(errors.productSpecifications).toBe('Product specifications are required');
    });

    it('should pass if productSpecifications is present when currentStep >= 2', () => {
      const formData: FormData = { ...baseValidData, productSpecifications: 'Detailed specs' };
      const errors = validateRFQForm(formData, currentStep);
      expect(errors.productSpecifications).toBeUndefined();
    });
  });

  // --- Step 3: Quantity ---
  describe('Step 3: Quantity', () => {
    const currentStep = 3;
    const baseValidData: FormData = {
      ...defaultFormData,
      fullName: 'John Doe',
      email: 'john.doe@example.com',
      company: 'Example Corp',
      productCategory: 'petroleum',
      productSpecifications: 'Detailed specs',
    };

    it('should fail if quantity is missing when currentStep >= 3', () => {
      const formData: FormData = { ...baseValidData, quantity: '' };
      const errors = validateRFQForm(formData, currentStep);
      expect(errors.quantity).toBe('Quantity is required');
    });

    it('should pass if quantity is present when currentStep >= 3', () => {
      const formData: FormData = { ...baseValidData, quantity: '1000' };
      const errors = validateRFQForm(formData, currentStep);
      expect(errors.quantity).toBeUndefined();
    });
  });

  // --- Step 4: Incoterms ---
  describe('Step 4: Incoterms', () => {
    const currentStep = 4;
    const baseValidData: FormData = {
      ...defaultFormData,
      fullName: 'John Doe',
      email: 'john.doe@example.com',
      company: 'Example Corp',
      productCategory: 'petroleum',
      productSpecifications: 'Detailed specs',
      quantity: '1000',
    };

    it('should fail if incoterm is missing when currentStep >= 4', () => {
      const formData: FormData = { ...baseValidData, incoterm: '' };
      const errors = validateRFQForm(formData, currentStep);
      expect(errors.incoterm).toBe('Please select an incoterm');
    });

    it('should pass if incoterm is present when currentStep >= 4', () => {
      const formData: FormData = { ...baseValidData, incoterm: 'FOB' };
      const errors = validateRFQForm(formData, currentStep);
      expect(errors.incoterm).toBeUndefined();
    });
  });

  // --- Boundary Conditions ---
  describe('Boundary Conditions', () => {
    it('should not require productCategory at currentStep = 0', () => {
      const currentStep = 0;
      const formData: FormData = {
        ...defaultFormData,
        fullName: 'John Doe',
        email: 'john.doe@example.com',
        company: 'Example Corp',
        productCategory: '', // Empty but not required at this step
      };
      const errors = validateRFQForm(formData, currentStep);
      expect(errors.productCategory).toBeUndefined();
    });

    it('should not require productSpecifications at currentStep = 1', () => {
      const currentStep = 1;
      const formData: FormData = {
        ...defaultFormData,
        fullName: 'John Doe',
        email: 'john.doe@example.com',
        company: 'Example Corp',
        productCategory: 'petroleum',
        productSpecifications: '', // Empty but not required at this step
      };
      const errors = validateRFQForm(formData, currentStep);
      expect(errors.productSpecifications).toBeUndefined();
    });

    it('should not require quantity at currentStep = 2', () => {
      const currentStep = 2;
      const formData: FormData = {
        ...defaultFormData,
        fullName: 'John Doe',
        email: 'john.doe@example.com',
        company: 'Example Corp',
        productCategory: 'petroleum',
        productSpecifications: 'Detailed specs',
        quantity: '', // Empty but not required at this step
      };
      const errors = validateRFQForm(formData, currentStep);
      expect(errors.quantity).toBeUndefined();
    });

    it('should not require incoterm at currentStep = 3', () => {
      const currentStep = 3;
      const formData: FormData = {
        ...defaultFormData,
        fullName: 'John Doe',
        email: 'john.doe@example.com',
        company: 'Example Corp',
        productCategory: 'petroleum',
        productSpecifications: 'Detailed specs',
        quantity: '1000',
        incoterm: '', // Empty but not required at this step
      };
      const errors = validateRFQForm(formData, currentStep);
      expect(errors.incoterm).toBeUndefined();
    });
  });
});
