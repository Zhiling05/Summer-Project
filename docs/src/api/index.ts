// src/api/index.ts
// —— Types —— //
export interface Answer {
  questionId: string;
   /* ★ 新增：把题干也发给后台，方便导出 / 预览 */
  question: string;
  answer: string;
}

export type UserRole = 'optometrist' | 'gp' | 'patient';

export interface CreateAssessmentRequest {
  role: UserRole;
  patientId: string;
  answers: Answer[];
  recommendation: string;
  content: string; // yj添加：解决500报错
  timestamp?: string;
}

export interface CreateAssessmentResponse {
  id: string;
  createdAt: string;
}

export interface AssessmentDetail {
  id: string;
  role: UserRole;
  patientId: string;
  answers: Answer[];
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
  | 'EmergencyDepartment'
  | 'Immediate'
  | 'NoReferral'
  | 'ToGP'
  | 'UrgentToGpOrNeur'
  | 'UrgentToOph';

export interface ReferralStatistic {
  recommendation: RecommendationType;
  count: number;
}

export interface GetReferralStatisticsResponse {
  role: UserRole;
  period: '3months' | '6months' | '1year';
  data: ReferralStatistic[];
}

// —— Helpers —— //
// const API_BASE = '/api';
//const API_BASE = 'http://localhost:4000/api';
const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api';

async function request<T>(url: string, opts: RequestInit = {}): Promise<T> {
  const res = await fetch(API_BASE + url, {
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    ...opts,
  });
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`API ${res.status} ${res.statusText}: ${errorText}`);
  }
  return res.json();
}

// —— API Functions —— //

// 1. 保存 Assessment
export function createAssessment(
  payload: CreateAssessmentRequest
): Promise<CreateAssessmentResponse> {
  return request<CreateAssessmentResponse>('/assessments', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

// 2. 查询单条
export function getAssessment(id: string): Promise<AssessmentDetail> {
  return request<AssessmentDetail>(`/assessments/${id}`);
}

// 3. 导出（目前 txt，可预留 docx）
export async function exportAssessment(
  id: string,
  format: 'txt' | 'docx' = 'txt'
): Promise<Blob> {
  const res = await fetch(
    `${API_BASE}/assessments/${id}/export?format=${format}`,
    {
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    }
  );
  if (!res.ok) throw new Error(`Export failed: ${res.statusText}`);
  return res.blob();
}

// 3️⃣-b  获取纯文本报告（预览 / 复制）
export async function fetchReportText(id: string): Promise<string> {
  const res = await fetch(`${API_BASE}/assessments/${id}/report`, {
    credentials: 'include',
  });
  if (!res.ok) throw new Error(`Fetch report failed: ${res.statusText}`);
  return res.text();
}

// 4. 发送报告邮件
export function sendReport(
  assessmentId: string,
  emailTo: string,
  format: 'txt' | 'docx' = 'txt'
) {
  return request<{ ok: boolean }>('/send-report', {
    method: 'POST',
    body: JSON.stringify({ assessmentId, emailTo, format }),
  });
}

// export async function listAssessments(limit = 50) {
//   const res = await fetch(`/api/assessments?limit=${limit}`, {
//     credentials: 'include',
//   });
//   if (!res.ok) throw new Error(`List failed: ${res.statusText}`);
//   return res.json() as Promise<{
//     records: { id: string; date: string; risk: string }[];
//   }>;
// }
// docs/src/api/index.ts
export async function listAssessments(limit = 50) {
  const res = await fetch(`${API_BASE}/assessments?limit=${limit}`, {
  });
  if (!res.ok) throw new Error(`List failed: ${res.statusText}`);

  const json = await res.json();

  // 兼容后端可能返回数组，或 { records: [...] }
  const arr = Array.isArray(json) ? json : json.records;

  const records = (arr ?? []).map((d: any) => ({
    id:   d.id ?? d._id,                       // 统一为 id
    date: d.date ?? d.createdAt,               // 统一为 date
    risk: d.risk ?? d.recommendation ?? 'no-referral', // 统一为 risk
  }));

  return { records } as {
    records: { id: string; date: string; risk: string }[];
  };
}


// 5. 统计 - 使用次数
export function getUsageStatistics(
  startDate: string,
  endDate: string
): Promise<GetUsageStatisticsResponse> {
  return request<GetUsageStatisticsResponse>(
    `/statistics/usage?startDate=${startDate}&endDate=${endDate}`
  );
}

// 6. 统计 - 转诊类型
export function getReferralStatistics(
  role: UserRole,
  period: '3months' | '6months' | '1year'
): Promise<GetReferralStatisticsResponse> {
  return request<GetReferralStatisticsResponse>(
    `/statistics/referrals?role=${role}&period=${period}`
  );
}