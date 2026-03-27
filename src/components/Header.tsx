import React, { useState } from 'react';
import { Menu, Bell, User, ChevronRight, CheckCircle2, Figma, Check } from 'lucide-react';
import { elementToSVG } from 'dom-to-svg';

interface HeaderProps {
  activeTabLabel: string;
}

const Header: React.FC<HeaderProps> = ({ activeTabLabel }) => {
  const [isExporting, setIsExporting] = useState(false);
  const [showCheck, setShowCheck] = useState(false);

  // 核心资产保护：SVG 导出黑魔法逻辑 (升级版：支持全架构复制与精准定位)
  const handleCopyToFigma = async () => {
    const rootElement = document.getElementById('root');
    if (!rootElement) return;

    setIsExporting(true);

    const getElementStyles = (el: HTMLElement | SVGElement) => {
      const style = window.getComputedStyle(el);
      const rect = el.getBoundingClientRect();
      return {
        width: rect.width,
        height: rect.height,
        backgroundColor: style.backgroundColor,
        color: style.color,
        fill: style.fill,
        stroke: style.stroke,
        strokeWidth: style.strokeWidth,
        fontSize: style.fontSize,
        fontWeight: style.fontWeight,
        fontFamily: style.fontFamily,
        borderRadius: style.borderRadius,
        borderWidth: style.borderWidth,
        borderColor: style.borderColor,
        opacity: style.opacity,
        display: style.display,
        visibility: style.visibility,
      };
    };

    const domToSvg = (element: Element, offsetX = 0, offsetY = 0): string => {
      if (!(element instanceof HTMLElement || element instanceof SVGElement)) return '';
      const styles = getElementStyles(element);
      if (styles.visibility === 'hidden' || styles.opacity === '0' || styles.display === 'none') return '';

      const rect = element.getBoundingClientRect();
      const x = rect.left - offsetX;
      const y = rect.top - offsetY;
      let svgParts: string[] = [];

      // 处理 SVG 图标
      if (element instanceof SVGElement && element.tagName.toLowerCase() === 'svg') {
        const clone = element.cloneNode(true) as SVGElement;
        const actualColor = styles.color || '#000000';
        const currentStroke = clone.getAttribute('stroke');
        const currentFill = clone.getAttribute('fill');
        if (!currentStroke || currentStroke === 'currentColor') clone.setAttribute('stroke', actualColor);
        if (currentFill === 'currentColor') clone.setAttribute('fill', actualColor);
        clone.removeAttribute('class');
        clone.setAttribute('width', rect.width.toString());
        clone.setAttribute('height', rect.height.toString());
        return `<g transform="translate(${x}, ${y})" data-figma-type="icon">${clone.outerHTML}</g>`;
      }

      // 处理背景和边框
      if (element instanceof HTMLElement) {
        const hasBackground = styles.backgroundColor !== 'rgba(0, 0, 0, 0)' && styles.backgroundColor !== 'transparent';
        const hasBorder = parseFloat(styles.borderWidth) > 0;
        if (hasBackground || hasBorder) {
          const rx = parseFloat(styles.borderRadius) || 0;
          const fill = hasBackground ? styles.backgroundColor : 'none';
          const stroke = hasBorder ? styles.borderColor : 'none';
          const strokeWidth = hasBorder ? styles.borderWidth : '0';
          svgParts.push(`<rect width="${styles.width}" height="${styles.height}" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" rx="${rx}" fill-opacity="${styles.opacity}" stroke-opacity="${styles.opacity}" />`);
        }
      }

      // 处理表单元素
      if (element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement) {
        if (element.type === 'checkbox' || element.type === 'radio') {
          const isChecked = (element as HTMLInputElement).checked;
          const boxSize = Math.min(rect.width, rect.height) || 16;
          svgParts.push(`<rect x="0" y="${(rect.height - boxSize)/2}" width="${boxSize}" height="${boxSize}" fill="${isChecked ? '#1890ff' : '#ffffff'}" stroke="#d9d9d9" stroke-width="1" rx="${element.type === 'radio' ? '50%' : '2'}" />`);
        } else {
          const text = element.value || element.placeholder;
          if (text) {
            const fontSize = parseFloat(styles.fontSize);
            const ty = (rect.height / 2) + (fontSize * 0.35);
            const safeText = text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
            svgParts.push(`<text x="8" y="${ty}" fill="${element.value ? styles.color : '#bfbfbf'}" font-family='sans-serif' font-size="${styles.fontSize}" font-weight="${styles.fontWeight}">${safeText}</text>`);
          }
        }
      }

      // 处理文字节点 (Range API 精准定位)
      for (const node of Array.from(element.childNodes)) {
        if (node.nodeType === Node.TEXT_NODE && node.textContent?.trim()) {
          const text = node.textContent.trim().replace(/\s+/g, ' ');
          if (!text) continue;
          const safeText = text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
          const fontSize = parseFloat(styles.fontSize);
          const range = document.createRange();
          range.selectNodeContents(node);
          const textRect = range.getBoundingClientRect();
          if (textRect.width > 0) {
            const tx = textRect.left - rect.left;
            const ty = textRect.top - rect.top + fontSize * 0.8;
            svgParts.push(`<text x="${tx}" y="${ty}" fill="${styles.color}" font-family='sans-serif' font-size="${styles.fontSize}" font-weight="${styles.fontWeight}" text-anchor="start">${safeText}</text>`);
          }
        }
      }

      // 递归子节点
      Array.from(element.children).forEach(child => {
        if (child.getAttribute('data-svg-copy-ignore') === 'true') return;
        svgParts.push(domToSvg(child, rect.left, rect.top));
      });

      return `<g transform="translate(${x}, ${y})">\n${svgParts.join('\n')}\n</g>`;
    };

    try {
      const rect = rootElement.getBoundingClientRect();
      const contentSvg = domToSvg(rootElement, rect.left, rect.top);
      const svgString = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${rect.width}" height="${rect.height}" viewBox="0 0 ${rect.width} ${rect.height}" xmlns="http://www.w3.org/2000/svg">
  <rect width="100%" height="100%" fill="#f0f2f5" />
  ${contentSvg}
</svg>`.trim();

      await navigator.clipboard.writeText(svgString);
      setShowCheck(true);
      setTimeout(() => setShowCheck(false), 2000);
    } catch (err) {
      console.error('Export failed:', err);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <header className="h-16 bg-ant-header border-b border-gray-200 flex items-center justify-between px-6 shrink-0">
      <div className="flex items-center gap-4">
        <button className="text-gray-500 hover:text-gray-700">
          <Menu size={20} />
        </button>
        
        <nav className="flex items-center text-sm text-gray-500 gap-2">
          <span>首页</span>
          <ChevronRight size={14} />
          <span>管理端管理</span>
          <ChevronRight size={14} />
          <span className="text-gray-900 font-medium">{activeTabLabel}</span>
        </nav>
      </div>

      <div className="flex items-center gap-6">
        <button
          onClick={handleCopyToFigma}
          disabled={isExporting}
          data-svg-copy-ignore="true"
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all duration-300 border text-xs font-medium ${
            showCheck 
              ? 'bg-emerald-50 border-emerald-200 text-emerald-600' 
              : 'bg-white text-gray-600 hover:border-ant-blue hover:text-ant-blue border-gray-200 shadow-sm'
          }`}
        >
          {isExporting ? (
            <div className="w-3 h-3 border-2 border-ant-blue/20 border-t-ant-blue rounded-full animate-spin" />
          ) : showCheck ? (
            <Check size={14} />
          ) : (
            <Figma size={14} />
          )}
          <span>{showCheck ? '已复制矢量' : '复制矢量 SVG'}</span>
        </button>

        <div className="flex items-center gap-2 text-emerald-500 text-sm font-medium">
          <CheckCircle2 size={16} />
          <span>超级管理员</span>
        </div>
        
        <div className="flex items-center gap-3 cursor-pointer group">
          <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden border border-gray-300">
            <img 
              src="https://picsum.photos/seed/admin/100/100" 
              alt="Avatar" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-gray-700 group-hover:text-ant-blue transition-colors">Admin</span>
          </div>
        </div>

        <button className="text-gray-500 hover:text-ant-blue relative">
          <Bell size={20} />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>
        
        <button className="text-gray-500 hover:text-ant-blue">
          <User size={20} />
        </button>
      </div>
    </header>
  );
};

export default Header;
