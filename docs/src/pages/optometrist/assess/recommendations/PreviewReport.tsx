// docs/src/pages/optometrist/assess/recommendations/PreviewReport.tsx
import { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { fetchReportText } from '../../../../api';

export default function PreviewReport() {
  const { id = '' } = useParams<{ id: string }>();
  const { state }   = useLocation() as { state?: { text?: string } };

  const [text, setText] = useState<string>(state?.text ?? '');
  const [err,  setErr]  = useState<string | null>(null);

  /* 若页面刷新或直链而没有带 text，就向后端拉取 */
  useEffect(() => {
    if (text || !id) return;
    fetchReportText(id).then(setText).catch(e => setErr(e.message));
  }, [id, text]);

  if (err)  return <p style={{ color: 'red' }}>Error: {err}</p>;
  if (!text) return <p style={{ padding: '2rem' }}>Loading…</p>;

  return (
    <pre style={{ whiteSpace: 'pre-wrap', lineHeight: 1.4, padding: '2rem' }}>
      {text}
    </pre>
  );
}
