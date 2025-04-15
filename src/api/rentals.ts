import apiClient from './client';

// Types for rental data
export interface Customer {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zip_code: string;
  id_type: string;
  id_number: string;
  notes?: string;
  user_id?: number;
  id_image_path?: string;
  created_at: string;
  updated_at: string;
}

export interface Rental {
  id: number;
  customer_id: number;
  start_date: string;
  end_date: string;
  duration_type: string;
  total_price: number;
  deposit_total: number;
  notes?: string;
  status: string;
  deposit_paid: boolean;
  contract_signed: boolean;
  created_at: string;
  updated_at: string;
}

export interface RentalItem {
  id: number;
  rental_id: number;
  equipment_id: number;
  quantity: number;
  price: number;
  condition_note_checkout?: string;
  condition_note_return?: string;
  returned: boolean;
  returned_date?: string;
}

export interface Contract {
  id: number;
  rental_id: number;
  signature_date: string;
  terms_agreed: boolean;
  ip_address?: string;
  user_agent?: string;
  signature_image_path?: string;
  contract_file_path?: string;
  created_at: string;
}

// Get all customers (staff only)
export const getCustomers = async (params?: { skip?: number; limit?: number }) => {
  const response = await apiClient.get<Customer[]>('/api/rentals/customers/', { params });
  return response.data;
};

// Get a specific customer (staff only)
export const getCustomer = async (id: number) => {
  const response = await apiClient.get<Customer>(`/api/rentals/customers/${id}`);
  return response.data;
};

// Create a new customer (staff only)
export const createCustomer = async (customerData: Omit<Customer, 'id' | 'created_at' | 'updated_at'>) => {
  const response = await apiClient.post<Customer>('/api/rentals/customers/', customerData);
  return response.data;
};

// Update a customer (staff only)
export const updateCustomer = async (id: number, customerData: Partial<Customer>) => {
  const response = await apiClient.put<Customer>(`/api/rentals/customers/${id}`, customerData);
  return response.data;
};

// Delete a customer (staff only)
export const deleteCustomer = async (id: number) => {
  const response = await apiClient.delete(`/api/rentals/customers/${id}`);
  return response.status === 204;
};

// Get all rentals with optional filtering (staff only)
export const getRentals = async (params?: {
  status?: string;
  customer_id?: number;
  skip?: number;
  limit?: number;
}) => {
  const response = await apiClient.get<Rental[]>('/api/rentals/', { params });
  return response.data;
};

// Get a specific rental (staff only)
export const getRental = async (id: number) => {
  const response = await apiClient.get<Rental>(`/api/rentals/${id}`);
  return response.data;
};

// Create a new rental (staff only)
export const createRental = async (rentalData: Omit<Rental, 'id' | 'status' | 'deposit_paid' | 'contract_signed' | 'created_at' | 'updated_at'>) => {
  const response = await apiClient.post<Rental>('/api/rentals/', rentalData);
  return response.data;
};

// Update a rental (staff only)
export const updateRental = async (id: number, rentalData: Partial<Rental>) => {
  const response = await apiClient.put<Rental>(`/api/rentals/${id}`, rentalData);
  return response.data;
};

// Delete a rental (staff only)
export const deleteRental = async (id: number) => {
  const response = await apiClient.delete(`/api/rentals/${id}`);
  return response.status === 204;
};

// Get rental items for a specific rental (staff only)
export const getRentalItems = async (rentalId: number) => {
  const response = await apiClient.get<RentalItem[]>(`/api/rentals/${rentalId}/items/`);
  return response.data;
};

// Add item to a rental (staff only)
export const addRentalItem = async (rentalId: number, itemData: Omit<RentalItem, 'id' | 'returned' | 'returned_date'>) => {
  const response = await apiClient.post<RentalItem>(`/api/rentals/${rentalId}/items/`, itemData);
  return response.data;
};

// Update a rental item (staff only)
export const updateRentalItem = async (itemId: number, itemData: Partial<RentalItem>) => {
  const response = await apiClient.put<RentalItem>(`/api/rentals/items/${itemId}`, itemData);
  return response.data;
};

// Remove item from rental (staff only)
export const deleteRentalItem = async (itemId: number) => {
  const response = await apiClient.delete(`/api/rentals/items/${itemId}`);
  return response.status === 204;
};

// Get contract for a rental (staff only)
export const getRentalContract = async (rentalId: number) => {
  const response = await apiClient.get<Contract>(`/api/rentals/${rentalId}/contract/`);
  return response.data;
};

// Create contract for a rental (staff only)
export const createRentalContract = async (rentalId: number, contractData: Omit<Contract, 'id' | 'rental_id' | 'created_at'>) => {
  const response = await apiClient.post<Contract>(`/api/rentals/${rentalId}/contract/`, contractData);
  return response.data;
};

// Mark rental as returned (staff only)
export const markRentalAsReturned = async (rentalId: number) => {
  const response = await apiClient.post<Rental>(`/api/rentals/${rentalId}/return/`, {});
  return response.data;
};

// Check overdue rentals (staff only)
export const checkOverdueRentals = async () => {
  const response = await apiClient.post<Rental[]>('/api/rentals/check-overdue/');
  return response.data;
};