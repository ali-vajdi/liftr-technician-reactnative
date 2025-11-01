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

