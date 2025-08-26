// —— Types —— //
export interface Answer {
  questionId: string;
  question: string;
  answer: string;
}

export type UserRole = 'optometrist' | 'gp' | 'patient';

// 评估完成后需要传给后端数据库的字段
export interface CreateAssessmentRequest {
  role: UserRole;
  // patientId: string;  // 不需要记录患者id啊
  answers: Answer[];
  recommendation: string;
}


// 后端返回的评估数据字段
export interface AssessmentDetail {
  id: string;
  role: UserRole;
  answers: Answer[];
  symptoms: string[];   //存储的时候就转换，存症状
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

// // 配合cookie实现用户隔离
// const API = (import.meta.env.VITE_API_BASE || '/api').replace(/\/+$/,''); // '/api'
//
// function join(p: string){ return `${API}${p.startsWith('/')?p:'/'+p}`; }
//
// async function http<T>(path: string, init: RequestInit = {}): Promise<T> {
//   const res = await fetch(join(path), {
//     credentials: 'include',
//     headers: { 'Content-Type':'application/json', ...(init.headers||{}) },
//     ...init
//   });
//   const text = await res.text();
//   if (!res.ok) throw new Error(`API ${res.status} ${res.statusText}: ${text}`);
//   return (text ? JSON.parse(text) : ({} as any)) as T;
// }
//
// export const ensureGuest = () => http('/guest', { method:'POST' });
//
//
//
// const API_BASE = import.meta.env.VITE_API_BASE || import.meta.env.VITE_API_BASE_URL || '/api';
//
//
//
// async function request<T>(url: string, opts: RequestInit = {}): Promise<T> {
//   const res = await fetch(API_BASE + url, {
//     headers: { 'Content-Type': 'application/json' },
//     credentials: 'include',
//     ...opts,
//   });
//   if (!res.ok) {
//     const errorText = await res.text();
//     throw new Error(`API ${res.status} ${res.statusText}: ${errorText}`);
//   }
//   return res.json();
// }

// 统一基础地址：兼容 VITE_API_BASE 与历史 VITE_API_BASE_URL；去掉末尾斜杠
// const API_BASE = (import.meta.env.VITE_API_BASE || import.meta.env.VITE_API_BASE_URL || '/api').replace(/\/+$/,'');
// const base = import.meta.env.VITE_API_BASE || '/api';
const API_BASE = '/api';



// 统一拼接
const pathJoin = (p: string) => `${API_BASE}${p.startsWith('/') ? p : '/' + p}`;

// JSON 封装
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

// 文本封装（报告预览用）
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

// 兼容旧代码：request 等于 http
const request = <T>(url: string, opts: RequestInit = {}) => http<T>(url, opts);

// 强制降级到普通用户（用于离开 admin 时）
export const ensureGuest = () => http('/guest?force=true', { method: 'POST' });

// 退出并降级（admin 界面“退出管理”按钮使用）
export const logoutAndDowngrade = async () => {
  // await http('/logout', { method: 'POST' });
  await http('/guest?force=true', { method: 'POST' });
};


// —— API Functions —— //

// 1. 创建评估记录
export function createAssessment(
  payload: CreateAssessmentRequest
): Promise<AssessmentDetail> {
  return request<AssessmentDetail>('/assessments', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

// 2. 获取单个评估详情
export function getAssessment(id: string): Promise<AssessmentDetail> {
  return request<AssessmentDetail>(`/assessments/${id}`);
}

// // 3. 获取纯文本报告(用于预览)
// export async function fetchReportText(id: string): Promise<string> {
//   const res = await fetch(`${API_BASE}/assessments/${id}/report`, {
//     credentials: 'include',
//   });
//   if (!res.ok) throw new Error(`Fetch report failed: ${res.statusText}`);
//   return res.text();
// }
export const fetchReportText = (id: string) => httpText(`/assessments/${id}/report`);



// 4. 导出评估报告为文件(下载功能)
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

// // 4. 发送报告邮件
// export function sendReport(
//   assessmentId: string,
//   emailTo: string,
//   format: 'txt' | 'docx' = 'txt'
// ): Promise<{ ok: boolean }> {
//   return request<{ ok: boolean }>('/send-report', {
//     method: 'POST',
//     body: JSON.stringify({ assessmentId, emailTo, format }),
//   });
// }

// export function sendReport(
//   assessmentId: string,
//   emailTo: string,
//   format: 'txt' | 'docx' = 'txt'
// ) {
//   return request<{ ok: boolean }>('/send-report', {
//     method: 'POST',
//     body: JSON.stringify({ assessmentId, emailTo, format }),
//   });
// }

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
// export async function listAssessments(limit = 50) {
//   const res = await fetch(`${API_BASE}/assessments?limit=${limit}`, {
//   });
//   if (!res.ok) throw new Error(`List failed: ${res.statusText}`);

//   const json = await res.json();

//   // 兼容后端可能返回数组，或 { records: [...] }
//   const arr = Array.isArray(json) ? json : json.records;

//   const records = (arr ?? []).map((d: any) => ({
//     id:   d.id ?? d._id,                       // 统一为 id
//     date: d.date ?? d.createdAt,               // 统一为 date
//     risk: d.risk ?? d.recommendation ?? 'no-referral', // 统一为 risk
//   }));

//   return { records } as {
//     records: { id: string; date: string; risk: string }[];
//   };
// }

// 4.获取评估列表：把筛选逻辑放在服务器端了
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
  // 构建查询参数
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
  
  // const res = await fetch(`${API_BASE}/assessments?${params.toString()}`, {
  //   credentials: 'include',
  // });
  //
  // if (!res.ok) throw new Error(`List failed: ${res.statusText}`);
  //
  // const json = await res.json();
  const json = await http(`/assessments?${params.toString()}`);
  
  const arr = Array.isArray(json) ? json : json.records;
  
  const records = (arr ?? []).map((d: any) => ({
    id: d.id ?? d._id,
    date: d.date ?? d.createdAt,                         //时间戳createdAt变量名改为date
    risk: d.risk ?? d.recommendation ?? 'no-referral',    // 将转诊建议转为risk
  }));
  
  return { records };
}

// 5. 获取风险级别统计数据
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

// 6. 从答案提取症状
export function extractSymptoms(
  answers: Answer[]
): Promise<string[]> {
  return request<string[]>('/extract-symptoms', {
    method: 'POST',
    body: JSON.stringify({ answers }),
  });
}
// // 5. 统计 - 使用次数
// export function getUsageStatistics(
//   startDate: string,
//   endDate: string
// ): Promise<GetUsageStatisticsResponse> {
//   return request<GetUsageStatisticsResponse>(
//     `/statistics/usage?startDate=${startDate}&endDate=${endDate}`
//   );
// }

// // 6. 统计 - 转诊类型
// export function getReferralStatistics(
//   role: UserRole,
//   period: '3months' | '6months' | '1year'
// ): Promise<GetReferralStatisticsResponse> {
//   return request<GetReferralStatisticsResponse>(
//     `/statistics/referrals?role=${role}&period=${period}`
//   );
// }