import apiClient from './client';

// Types for inventory data
export interface Category {
  id: number;
  name: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface Equipment {
  id: number;
  name: string;
  description: string;
  category_id: number;
  brand: string;
  model_number?: string;
  serial_number?: string;
  purchase_date?: string;
  purchase_price?: number;
  rental_price_daily: number;
  rental_price_weekly: number;
  rental_price_monthly: number;
  deposit_amount: number;
  replacement_value?: number;
  status: string;
  condition?: string;
  notes?: string;
  quantity: number;
  manual_title?: string;
  qr_uuid: string;
  created_at: string;
  updated_at: string;
}

export interface EquipmentAttachment {
  id: number;
  equipment_id: number;
  title: string;
  description?: string;
  file_type: string;
  file_path: string;
  created_at: string;
}

export interface MaintenanceRecord {
  id: number;
  equipment_id: number;
  maintenance_type: string;
  description: string;
  cost?: number;
  performed_by: string;
  maintenance_date: string;
  resolved: boolean;
  resolution_notes?: string;
  created_at: string;
  updated_at: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total_count: number;
  page: number;
  total_pages: number;
}

// Get all categories
export const getCategories = async () => {
  const response = await apiClient.get<Category[]>('/api/inventory/categories/');
  return response.data;
};

// Get a specific category
export const getCategory = async (id: number) => {
  const response = await apiClient.get<Category>(`/api/inventory/categories/${id}`);
  return response.data;
};

// Get all equipment with optional filtering
export const getEquipment = async (params?: {
  category_id?: number;
  status?: string;
  page?: number;
  limit?: number;
  search?: string;
  sort_by?: string;
}) => {
  const response = await apiClient.get<PaginatedResponse<Equipment>>('/api/inventory/equipment/', { params });
  return response.data;
};

// Get a specific equipment item
export const getEquipmentItem = async (id: number) => {
  const response = await apiClient.get<Equipment>(`/api/inventory/equipment/${id}`);
  return response.data;
};

// Get attachments for an equipment item
export const getEquipmentAttachments = async (equipmentId: number) => {
  const response = await apiClient.get<EquipmentAttachment[]>(
    `/api/inventory/equipment/${equipmentId}/attachments/`
  );
  return response.data;
};

// Get maintenance records for an equipment item
export const getMaintenanceRecords = async (equipmentId: number) => {
  const response = await apiClient.get<MaintenanceRecord[]>(
    `/api/inventory/equipment/${equipmentId}/maintenance/`
  );
  return response.data;
};

// For staff only - Create new equipment
export const createEquipment = async (equipmentData: Omit<Equipment, 'id' | 'qr_uuid' | 'created_at' | 'updated_at'>) => {
  const response = await apiClient.post('/api/inventory/equipment/', equipmentData);
  return response.data;
};

// For staff only - Update equipment
export const updateEquipment = async (id: number, equipmentData: Partial<Equipment>) => {
  const response = await apiClient.put(`/api/inventory/equipment/${id}`, equipmentData);
  return response.data;
};

// For staff only - Delete equipment
export const deleteEquipment = async (id: number) => {
  const response = await apiClient.delete(`/api/inventory/equipment/${id}`);
  return response.status === 204;
};