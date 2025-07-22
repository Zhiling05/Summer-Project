// docs/src/pages/optometrist/assess/PreviewReport.tsx
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchReportText } from '../../../../api' 

export default function PreviewReport() {
  const { id = '' } = useParams<{ id: string }>();
  const [text, setText]   = useState<string>('');
  const [err,  setErr]    = useState<string | null>(null);

  useEffect(() => {
    fetchReportText(id).then(setText).catch(e => setErr(e.message));
  }, [id]);

  if (err)  return <p style={{ color:'red' }}>Error: {err}</p>;
  if (!text) return <p>Loading…</p>;

  return (
    <pre style={{ whiteSpace:'pre-wrap', lineHeight:1.4 }}>{text}</pre>
  );
}
