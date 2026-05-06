import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { exportDomToFigmaSvg } from '../lib/exportToFigma'; 
import { cn } from '../lib/utils';

interface SvgCopyButtonProps {
  targetId?: string;
  className?: string;
  label?: string;
}

export const SvgCopyButton: React.FC<SvgCopyButtonProps> = ({ 
  targetId, 
  className, 
  label = "复制矢量图层" 
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    // Default to document.body if no targetId provided
    const target = targetId ? targetId : (document.body as any);
    const success = await exportDomToFigmaSvg(target);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <button
      onClick={handleCopy}
      data-svg-copy-ignore="true"
      className={cn(
        "flex items-center gap-2 px-3 py-1.5 text-xs font-bold transition-all rounded-lg border cursor-pointer z-50",
        copied 
          ? "bg-emerald-50 text-emerald-600 border-emerald-200" 
          : "bg-white text-slate-600 border-slate-200 hover:border-blue-400 hover:text-blue-600 shadow-sm",
        className
      )}
    >
      {copied ? <Check size={14} /> : <Copy size={14} />}
      {copied ? "已复制" : label}
    </button>
  );
};
