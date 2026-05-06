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
    // Use targetId as selector if provided, otherwise default to capturing the main container and overlays
    const selector = targetId ? `#${targetId}` : '#figma-export-container';
    const result = await exportDomToFigmaSvg(selector);
    
    if (result.success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
    
    // Add alert feedback as requested
    alert(result.message);
  };

  return (
    <button
      onClick={handleCopy}
      data-svg-copy-ignore="true"
      className={cn(
        "flex items-center gap-2 px-6 py-3 text-[10px] font-black transition-all rounded-xl border cursor-pointer z-50 uppercase tracking-widest",
        copied 
          ? "bg-emerald-50 text-emerald-600 border-emerald-200" 
          : "bg-white text-gray-900 border-gray-100 hover:border-gray-900 shadow-sm",
        className
      )}
    >
      {copied ? "COPIED" : label}
    </button>
  );
};
