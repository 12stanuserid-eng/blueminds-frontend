import { useState } from 'react';
import { cn } from '../../utils/cn';

interface CodeBlockProps { code: string; language: string; }

const LANG_COLORS: Record<string, string> = {
  javascript: '#f7df1e', typescript: '#3178c6', python: '#3572A5', bash: '#89e051',
  shell: '#89e051', json: '#cb4b16', css: '#563d7c', html: '#e44b23', sql: '#e38c00',
  go: '#00add8', rust: '#dea584', java: '#b07219', cpp: '#f34b7d'
};

export default function CodeBlock({ code, language }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const color = LANG_COLORS[language.toLowerCase()] || '#888';

  return (
    <div className="rounded-xl overflow-hidden border border-white/[0.08] my-2">
      {/* Header */}
      <div className="flex items-center justify-between bg-white/[0.04] px-4 py-2.5 border-b border-white/[0.06]">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
          <span className="text-[11px] font-mono text-white/40 font-medium">{language}</span>
        </div>
        <button onClick={copy}
          className="flex items-center gap-1.5 text-[11px] text-white/35 hover:text-white/65 transition-colors py-0.5 px-2 rounded-md hover:bg-white/[0.05]">
          {copied ? (
            <><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 6L9 17l-5-5"/></svg><span className="text-green-400">Copied!</span></>
          ) : (
            <><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg><span>Copy</span></>
          )}
        </button>
      </div>
      {/* Code */}
      <div className="bg-[#080812] overflow-x-auto">
        <pre className="px-4 py-4 text-[12.5px] font-mono leading-[1.7] text-white/80 whitespace-pre">{code}</pre>
      </div>
    </div>
  );
}
