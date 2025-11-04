// API Types
export interface Technician {
  id: number;
  phone_number: string;
  name?: string;
  first_name?: string;
  last_name?: string;
  full_name?: string;
  national_id?: string;
  status: boolean;
  has_credentials: boolean;
  organization_id?: number;
  organization_name?: string;
  organization?: Organization;
  organizationUser?: OrganizationUser;
}

export interface Organization {
  id: number;
  name: string;
  [key: string]: any;
}

export interface OrganizationUser {
  id: number;
  [key: string]: any;
}

export interface ProfileResponse {
  data: {
    id: number;
    first_name: string;
    last_name: string;
    full_name: string;
    phone_number: string;
    national_id: string;
    organization_id: number;
    organization_name: string | null;
    organization: {
      id: number;
      name: string;
    } | null;
  };
}

export interface LoginResponse {
  token: string;
  technician: Technician;
  message: string;
}

export interface SendOtpResponse {
  message: string;
  otp_code?: string;
}

export interface ApiErrorResponse {
  message: string;
  errors?: Record<string, string[]>;
}

export interface AssignedBuilding {
  id: number;
  assigned_at_jalali: string;
  building_name: string;
  building_address: string;
  elevators_count: number;
}

export interface AssignedBuildingsResponse {
  success: boolean;
  data: AssignedBuilding[];
}

export interface Elevator {
  id: number;
  building_id: number;
  name: string;
  stops_count: number;
  capacity: number;
  status: boolean;
  created_at: string;
  updated_at: string;
}

export interface Province {
  id: number;
  name: string;
  name_en: string;
  latitude: string;
  longitude: string;
  created_at: string;
  updated_at: string;
}

export interface City {
  id: number;
  province_id: number;
  name: string;
  name_en: string;
  latitude: string;
  longitude: string;
  created_at: string;
  updated_at: string;
}

export interface ServiceBuilding {
  id: number;
  organization_id: number;
  name: string;
  manager_name: string;
  manager_phone: string;
  building_type: string;
  province_id: number;
  city_id: number;
  address: string;
  selected_latitude: string;
  selected_longitude: string;
  service_start_date: number;
  status: boolean;
  created_at: string;
  updated_at: string;
  organization_user_id: number;
  province: Province;
  city: City;
  elevators: Elevator[];
}

export interface ServiceDetail {
  id: number;
  building_id: number;
  technician_id: number;
  service_month: number;
  service_year: number;
  status: string;
  notes: string | null;
  assigned_at: string;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
  status_text: string;
  status_badge_class: string;
  service_date_text: string;
  assigned_at_jalali: string;
  building: ServiceBuilding;
}

export interface ChecklistItem {
  id: number;
  title: string;
  order: number;
}

export interface ServiceDetailResponse {
  success: boolean;
  data: ServiceDetail;
  checklists?: ChecklistItem[];
  description_checklists?: ChecklistItem[];
}

