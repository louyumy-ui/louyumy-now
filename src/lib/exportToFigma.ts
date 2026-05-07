export const exportDomToFigmaSvg = async (targetSelector: string = '#figma-export-container'): Promise<{ success: boolean; message: string }> => {
  const container = document.querySelector(targetSelector) as HTMLElement;
  if (!container) return { success: false, message: '未找到导出目标' };

  const containerRect = container.getBoundingClientRect();
  const width = container.offsetWidth;
  const height = container.offsetHeight;

  const processNode = (el: Element, originX: number, originY: number): string => {
    if (!(el instanceof HTMLElement || el instanceof SVGElement)) return '';
    
    if (el.getAttribute('data-svg-copy-ignore') === 'true') return '';
    const style = window.getComputedStyle(el);
    if (style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0') return '';

    const rect = el.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return '';

    const relX = rect.left - originX;
    const relY = rect.top - originY;
    const items: string[] = [];

    // Background & Borders
    const bg = style.backgroundColor;
    const hasBg = bg !== 'rgba(0, 0, 0, 0)' && bg !== 'transparent';
    const bW = parseFloat(style.borderWidth) || 0;
    const bR = parseFloat(style.borderRadius) || 0;
    
    if (hasBg || bW > 0) {
      items.push(`<rect x="0" y="0" width="${rect.width}" height="${rect.height}" fill="${hasBg ? bg : 'none'}" stroke="${bW > 0 ? style.borderColor : 'none'}" stroke-width="${bW}" rx="${bR}" fill-opacity="${style.opacity}" />`);
    }

    // Icons
    if (el instanceof SVGElement && el.tagName.toLowerCase() === 'svg') {
      const svgNodes = Array.from(el.querySelectorAll('path, circle, rect, polygon, line, polyline')).map(p => {
        const pClone = p.cloneNode(true) as Element;
        ['fill', 'stroke'].forEach(attr => {
          if (pClone.getAttribute(attr) === 'currentColor') pClone.setAttribute(attr, style.color);
        });
        return pClone.outerHTML;
      }).join('');
      
      const viewBox = el.getAttribute('viewBox') || `0 0 ${rect.width} ${rect.height}`;
      return `<g transform="translate(${relX}, ${relY})"><svg width="${rect.width}" height="${rect.height}" viewBox="${viewBox}">${svgNodes}</svg></g>`;
    }

    // High-precision Text Capture
    for (const node of Array.from(el.childNodes)) {
      if (node.nodeType === Node.TEXT_NODE && node.textContent?.trim()) {
        const range = document.createRange();
        range.selectNodeContents(node);
        const tRects = range.getClientRects();
        
        for (const tRect of Array.from(tRects)) {
          const fs = parseFloat(style.fontSize);
          const fw = style.fontWeight;
          const family = style.fontFamily;
          const tx = tRect.left - rect.left;
          const ty = tRect.top - rect.top + fs * 0.85; 
          const safeText = node.textContent?.trim().replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
          if (safeText) {
             items.push(`<text x="${tx}" y="${ty}" fill="${style.color}" font-family="${family}" font-size="${fs}" font-weight="${fw}">${safeText}</text>`);
          }
        }
      }
    }

    // Recursive children
    for (const child of Array.from(el.children)) {
      if (child.tagName.toLowerCase() === 'svg') {
         items.push(processNode(child, rect.left, rect.top));
      } else {
         const childSvg = processNode(child, rect.left, rect.top);
         if (childSvg) items.push(childSvg);
      }
    }

    if (items.length === 0) return '';
    return `<g transform="translate(${relX}, ${relY})" data-tag="${el.tagName.toLowerCase()}">${items.join('')}</g>`;
  };

  try {
    const rawContent = Array.from(container.children)
      .map(c => processNode(c, containerRect.left, containerRect.top))
      .filter(Boolean)
      .join('');

    const svgResult = `
<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="100%" height="100%" fill="transparent" />
  ${rawContent}
</svg>`.trim();

    await navigator.clipboard.writeText(svgResult);
    return { success: true, message: '矢量导出成功 (生产级渲染)' };
  } catch (err) {
    console.error('Export Error:', err);
    return { success: false, message: '导出失败: 无剪贴板权限' };
  }
};
