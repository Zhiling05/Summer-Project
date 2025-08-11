// src/utils/api.ts
const API_BASE = import.meta.env.VITE_API_BASE?.replace(/\/$/, '') || '';

async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...(init?.headers || {}) },
    ...init,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`${res.status} ${res.statusText}: ${text}`);
  }
  return res.json() as Promise<T>;
}

// 具体接口示例
export function submitAssessment(data: {
  role: 'optometrist' | 'gp' | 'patient',
  content: string,
  patientId?: string
}) {
  return api('/api/assessments', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function listAssessments() {
  return api('/api/assessments', { method: 'GET' });
}