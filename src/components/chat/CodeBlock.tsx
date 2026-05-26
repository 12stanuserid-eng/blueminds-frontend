import { useState } from 'react';
import { Copy, Check, Play, Terminal } from 'lucide-react';
import { toast } from 'sonner';
import api from '../../services/api';

interface Props { code: string; language?: string; }

export default function CodeBlock({ code, language = 'text' }: Props) {
  const [copied, setCopied] = useState(false);
  const [running, setRunning] = useState(false);
  const [output, setOutput] = useState<string | null>(null);

  const copy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success('Copied!');
  };

  const run = async () => {
    const runnable = ['javascript', 'js', 'typescript', 'ts', 'python', 'py', 'bash', 'sh'];
    if (!runnable.includes(language.toLowerCase())) { toast.error(`Cannot run ${language} directly`); return; }
    setRunning(true); setOutput(null);
    try {
      const langMap: Record<string, string> = { js: 'javascript', ts: 'typescript', py: 'python', sh: 'bash' };
      const lang = langMap[language] || language;
      const res = await api.post('/api/execute/code', { language: lang, code });
      setOutput(res.data.output || res.data.error || 'No output');
    } catch (err: any) {
      setOutput(`Error: ${err.message}`);
    } finally { setRunning(false); }
  };

  return (
    <div className="my-3 rounded-xl overflow-hidden border border-surface-700 bg-surface-950">
      <div className="flex items-center justify-between px-4 py-2 bg-surface-800/80 border-b border-surface-700">
        <span className="text-xs text-surface-400 font-mono font-medium">{language}</span>
        <div className="flex items-center gap-1">
          {['javascript', 'js', 'typescript', 'ts', 'python', 'py', 'bash', 'sh'].includes(language.toLowerCase()) && (
            <button onClick={run} disabled={running} className="flex items-center gap-1.5 px-2.5 py-1 text-xs bg-green-600/20 hover:bg-green-600/30 text-green-400 rounded-md transition-colors disabled:opacity-50">
              {running ? <div className="w-3 h-3 border border-green-400 border-t-transparent rounded-full animate-spin" /> : <Play size={11} />}
              Run
            </button>
          )}
          <button onClick={copy} className="flex items-center gap-1.5 px-2.5 py-1 text-xs bg-surface-700 hover:bg-surface-600 text-surface-300 rounded-md transition-colors">
            {copied ? <Check size={11} className="text-green-400" /> : <Copy size={11} />}
            {copied ? 'Copied' : 'Copy'}
          </button>
        </div>
      </div>
      <pre className="!m-0 !rounded-none overflow-x-auto p-4 text-sm leading-relaxed text-surface-100 bg-surface-950">
        <code className="font-mono">{code}</code>
      </pre>
      {output !== null && (
        <div className="border-t border-surface-700 bg-surface-900 p-3">
          <div className="flex items-center gap-2 mb-2">
            <Terminal size={12} className="text-surface-400" />
            <span className="text-xs text-surface-400 font-medium">Output</span>
          </div>
          <pre className="text-xs text-green-300 font-mono whitespace-pre-wrap overflow-x-auto max-h-48 overflow-y-auto">{output}</pre>
        </div>
      )}
    </div>
  );
}
