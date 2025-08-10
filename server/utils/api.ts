// utils/api.ts
export async function submitAssessment(data: {
  role: 'optometrist' | 'gp' | 'patient',
  content: string,
  patientId?: string
}) {
  const response = await fetch('http://localhost:4000/api/assessments', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });

  if (!response.ok) {
    throw new Error('提交失败');
  }

  return await response.json();
}

export { submitAssessment as createAssessment };
