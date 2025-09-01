// API types and functions for DIPP assessment system

export interface Answer {
  questionId: string;
  question: string;
  answer: string;
}

export type UserRole = 'optometrist' | 'gp' | 'patient';

// Request payload for creating new assessment
export interface CreateAssessmentRequest {
  role: UserRole;
  answers: Answer[];
  recommendation: string;
}

// Assessment data returned from backend
export interface AssessmentDetail {
  id: string;
  role: UserRole;
  answers: Answer[];
  symptoms: string[]; 
  recommendation: string;
  createdAt: string;
}

export interface UsageStatistic {
  role: UserRole;
  count: number;
}

export interface GetUsageStatisticsResponse {
  startDate: string;
  endDate: string;
  data: UsageStatistic[];
}

export type RecommendationType =
  | 'EMERGENCY_DEPARTMENT'
  | 'IMMEDIATE'
  | 'URGENT_TO_OPH'
  | 'URGENT_TO_GP_OR_NEUR'
  | 'TO_GP'
  | 'NO_REFERRAL'
  | 'OTHER_EYE_CONDITIONS_GUIDANCE'

export interface ReferralStatistic {
  recommendation: RecommendationType;
  count: number;
}

export interface GetReferralStatisticsResponse {
  role: UserRole;
  period: '3months' | '6months' | '1year';
  data: ReferralStatistic[];
}

// API base URL configuration with fallback and trailing slash removal
const API_BASE = (import.meta.env.VITE_API_BASE || import.meta.env.VITE_API_BASE_URL || '/api').replace(/\/+$/,'');

// Helper function to join API paths
const pathJoin = (p: string) => `${API_BASE}${p.startsWith('/') ? p : '/' + p}`;

// Generic HTTP function for JSON requests
export async function http<T = any>(path: string, init: RequestInit = {}): Promise<T> {
  const res = await fetch(pathJoin(path), {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...(init.headers || {}) },
    ...init,
  });
  const body = await res.text();
  if (!res.ok) throw new Error(`API ${res.status} ${res.statusText}: ${body}`);
  return body ? (JSON.parse(body) as T) : ({} as T);
}

// HTTP function for text responses (used for report previews)
export async function httpText(path: string, init: RequestInit = {}): Promise<string> {
  const res = await fetch(pathJoin(path), {
    credentials: 'include',
    headers: { ...(init.headers || {}) },
    ...init,
  });
  const body = await res.text();
  if (!res.ok) throw new Error(`API ${res.status} ${res.statusText}: ${body}`);
  return body;
}

// Legacy compatibility: request function alias
const request = <T>(url: string, opts: RequestInit = {}) => http<T>(url, opts);

// Force downgrade to guest user (used when leaving admin mode)
export const ensureGuest = () => http('/guest?force=true', { method: 'POST' });

// Logout and downgrade user privileges (used by admin "Exit" button)
export const logoutAndDowngrade = async () => {
  await http('/guest?force=true', { method: 'POST' });
};

// === API Functions ===

// Create new assessment record
export function createAssessment(
  payload: CreateAssessmentRequest
): Promise<AssessmentDetail> {
  return request<AssessmentDetail>('/assessments', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

// Get single assessment details by ID
export function getAssessment(id: string): Promise<AssessmentDetail> {
  return request<AssessmentDetail>(`/assessments/${id}`);
}

// Fetch report text for preview
export const fetchReportText = (id: string) => httpText(`/assessments/${id}/report`);

// Export assessment report as downloadable file
export async function exportAssessment(
  id: string,
  format: 'txt' | 'docx' = 'txt'
): Promise<Blob> {
  const res = await fetch(
    `${API_BASE}/assessments/${id}/export?format=${format}`,
    {
      credentials: 'include',
    }
  );
  if (!res.ok) throw new Error(`Export failed: ${res.statusText}`);
  return res.blob();
}

// Get filtered list of assessments with pagination
export async function listAssessments(
  limit = 50,
  filters?: {
    riskLevel?: 'high' | 'medium' | 'low' | 'all';
    startDate?: string;
    endDate?: string;
    scope?: 'own'|'all';
  }
): Promise<{
  records: { id: string; date: string; risk: string }[];
}> {
  // Build query parameters
  const params = new URLSearchParams();
  params.append('limit', limit.toString());
  
  if (filters) {
    if (filters.riskLevel && filters.riskLevel !== 'all') {
      params.append('riskLevel', filters.riskLevel);
    }
    if (filters.startDate) {
      params.append('startDate', filters.startDate);
    }
    if (filters.endDate) {
      params.append('endDate', filters.endDate);
    }
    if (filters.scope) {
      params.append('scope', filters.scope);
    }
  }
  
  const json = await http(`/assessments?${params.toString()}`);
  const arr = Array.isArray(json) ? json : json.records;
  
  // Normalize response data structure
  const records = (arr ?? []).map((d: any) => ({
    id: d.id ?? d._id,
    date: d.date ?? d.createdAt,
    risk: d.risk ?? d.recommendation ?? 'no-referral', 
  }));
  
  return { records };
}

// Get risk level statistics for dashboard
export function getRiskLevelStats(): Promise<{
  high: number;
  medium: number;
  low: number;
  total: number;
}> {
  return request<{
    high: number;
    medium: number;
    low: number;
    total: number;
  }>('/statistics/risk-levels');
}

// Extract symptoms from assessment answers
export function extractSymptoms(
  answers: Answer[]
): Promise<string[]> {
  return request<string[]>('/extract-symptoms', {
    method: 'POST',
    body: JSON.stringify({ answers }),
  });
}