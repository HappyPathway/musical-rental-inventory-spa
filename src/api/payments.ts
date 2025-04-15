import apiClient from './client';

// Types for payment data
export interface Payment {
  id: number;
  rental_id: number;
  amount: number;
  payment_type: string;
  reference_number?: string;
  notes?: string;
  payment_date: string;
  created_at: string;
  updated_at: string;
}

export interface PayPalTransaction {
  id: number;
  payment_id: number;
  paypal_order_id: string;
  paypal_payer_id?: string;
  paypal_payer_email?: string;
  payment_completed_at?: string;
  raw_response?: string;
}

export interface StripeTransaction {
  id: number;
  payment_id: number;
  stripe_charge_id: string;
  stripe_customer_id?: string;
  payment_method_id?: string;
  payment_intent_id?: string;
  card_last4?: string;
  card_brand?: string;
  billing_address?: string;
  raw_response?: string;
}

export interface VenmoTransaction {
  id: number;
  payment_id: number;
  venmo_transaction_id: string;
  venmo_user_id?: string;
  venmo_username?: string;
  venmo_email?: string;
  notes?: string;
}

// Get all payments with optional filtering (staff only)
export const getPayments = async (params?: {
  rental_id?: number;
  payment_type?: string;
  skip?: number;
  limit?: number;
}) => {
  const response = await apiClient.get<Payment[]>('/api/payments/', { params });
  return response.data;
};

// Get a specific payment (staff only)
export const getPayment = async (id: number) => {
  const response = await apiClient.get<Payment>(`/api/payments/${id}`);
  return response.data;
};

// Create a new payment (staff only)
export const createPayment = async (paymentData: {
  rental_id: number;
  amount: number;
  payment_type: string;
  reference_number?: string;
  notes?: string;
}) => {
  const response = await apiClient.post<Payment>('/api/payments/', paymentData);
  return response.data;
};

// Update a payment (staff only)
export const updatePayment = async (id: number, paymentData: Partial<Payment>) => {
  const response = await apiClient.put<Payment>(`/api/payments/${id}`, paymentData);
  return response.data;
};

// Delete a payment (staff only)
export const deletePayment = async (id: number) => {
  const response = await apiClient.delete(`/api/payments/${id}`);
  return response.status === 204;
};

// --- PayPal Transactions --- //

// Create a PayPal transaction (staff only)
export const createPayPalTransaction = async (transactionData: {
  payment_id: number;
  paypal_order_id: string;
  paypal_payer_id?: string;
  paypal_payer_email?: string;
  payment_completed_at?: string;
  raw_response?: string;
}) => {
  const response = await apiClient.post<PayPalTransaction>('/api/payments/paypal/', transactionData);
  return response.data;
};

// Get a PayPal transaction by ID (staff only)
export const getPayPalTransaction = async (id: number) => {
  const response = await apiClient.get<PayPalTransaction>(`/api/payments/paypal/${id}`);
  return response.data;
};

// Get a PayPal transaction by payment ID (staff only)
export const getPayPalTransactionByPayment = async (paymentId: number) => {
  const response = await apiClient.get<PayPalTransaction>(`/api/payments/paypal/by-payment/${paymentId}`);
  return response.data;
};

// --- Stripe Transactions --- //

// Create a Stripe transaction (staff only)
export const createStripeTransaction = async (transactionData: {
  payment_id: number;
  stripe_charge_id: string;
  stripe_customer_id?: string;
  payment_method_id?: string;
  payment_intent_id?: string;
  card_last4?: string;
  card_brand?: string;
  billing_address?: string;
  raw_response?: string;
}) => {
  const response = await apiClient.post<StripeTransaction>('/api/payments/stripe/', transactionData);
  return response.data;
};

// Get a Stripe transaction by ID (staff only)
export const getStripeTransaction = async (id: number) => {
  const response = await apiClient.get<StripeTransaction>(`/api/payments/stripe/${id}`);
  return response.data;
};

// Get a Stripe transaction by payment ID (staff only)
export const getStripeTransactionByPayment = async (paymentId: number) => {
  const response = await apiClient.get<StripeTransaction>(`/api/payments/stripe/by-payment/${paymentId}`);
  return response.data;
};

// --- Venmo Transactions --- //

// Create a Venmo transaction (staff only)
export const createVenmoTransaction = async (transactionData: {
  payment_id: number;
  venmo_transaction_id: string;
  venmo_user_id?: string;
  venmo_username?: string;
  venmo_email?: string;
  notes?: string;
}) => {
  const response = await apiClient.post<VenmoTransaction>('/api/payments/venmo/', transactionData);
  return response.data;
};

// Get a Venmo transaction by ID (staff only)
export const getVenmoTransaction = async (id: number) => {
  const response = await apiClient.get<VenmoTransaction>(`/api/payments/venmo/${id}`);
  return response.data;
};

// Get a Venmo transaction by payment ID (staff only)
export const getVenmoTransactionByPayment = async (paymentId: number) => {
  const response = await apiClient.get<VenmoTransaction>(`/api/payments/venmo/by-payment/${paymentId}`);
  return response.data;
};