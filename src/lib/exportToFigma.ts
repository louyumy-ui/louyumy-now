export const exportDomToFigmaSvg = async (targetSelector: string = '#figma-export-container'): Promise<{ success: boolean; message: string }> => {
  const container = document.querySelector(targetSelector) as HTMLElement;
  if (!container) return { success: false, message: '未找到导出目标' };

  // 1. Force the container to a clean state for measurement
  const originalScrollTop = container.scrollTop;
  const originalScrollLeft = container.scrollLeft;
  
  // Get pure dimensions
  const width = container.offsetWidth;
  const height = container.offsetHeight;

  const processNode = (el: Element, originX: number, originY: number): string => {
    if (!(el instanceof HTMLElement || el instanceof SVGElement)) return '';
    const style = window.getComputedStyle(el);
    if (style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0') return '';

    const nodeRect = el.getBoundingClientRect();
    if (nodeRect.width === 0 || nodeRect.height === 0) return '';

    const relX = nodeRect.left - originX;
    const relY = nodeRect.top - originY;
    const items: string[] = [];

    // Backgrounds / Borders
    const bg = style.backgroundColor;
    const hasBg = bg !== 'rgba(0, 0, 0, 0)' && bg !== 'transparent';
    const bW = parseFloat(style.borderWidth) || 0;
    if (hasBg || bW > 0) {
      const rx = parseFloat(style.borderRadius) || 0;
      items.push(`<rect x="0" y="0" width="${nodeRect.width}" height="${nodeRect.height}" fill="${hasBg ? bg : 'none'}" stroke="${bW > 0 ? style.borderColor : 'none'}" stroke-width="${bW}" rx="${rx}" fill-opacity="${style.opacity}" />`);
    }

    // SVG Icons
    if (el instanceof SVGElement && el.tagName.toLowerCase() === 'svg') {
      const paths = Array.from(el.querySelectorAll('path, circle, rect, polygon, line, polyline')).map(p => {
        const pClone = p.cloneNode(true) as Element;
        const pStroke = pClone.getAttribute('stroke');
        const pFill = pClone.getAttribute('fill');
        if (pStroke === 'currentColor') pClone.setAttribute('stroke', style.color);
        if (pFill === 'currentColor') pClone.setAttribute('fill', style.color);
        return pClone.outerHTML;
      }).join('');
      return `<g transform="translate(${relX}, ${relY})">${paths}</g>`;
    }

    // Text Nodes
    const text = Array.from(el.childNodes).find(n => n.nodeType === Node.TEXT_NODE && n.textContent?.trim());
    if (text) {
      const range = document.createRange();
      range.selectNodeContents(text);
      const tRect = range.getBoundingClientRect();
      const fs = parseFloat(style.fontSize);
      const fw = style.fontWeight;
      const tx = tRect.left - nodeRect.left;
      const ty = tRect.top - nodeRect.top + fs * 0.8;
      const safeContent = text.textContent!.trim().replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
      items.push(`<text x="${tx}" y="${ty}" fill="${style.color}" font-family="Inter, sans-serif" font-size="${fs}" font-weight="${fw}">${safeContent}</text>`);
    }

    // Recursion
    for (const child of Array.from(el.children)) {
      const childSvg = processNode(child, nodeRect.left, nodeRect.top);
      if (childSvg) items.push(childSvg);
    }

    if (items.length === 0) return '';
    
    // Grouping
    if (items.length >= 2) {
      return `<g transform="translate(${relX}, ${relY})" data-tag="${el.tagName.toLowerCase()}">${items.join('')}</g>`;
    } else {
      const single = items[0];
      if (single.startsWith('<g ')) {
         const currentX = parseFloat(single.match(/translate\(([\d.-]+)/)?.[1] || '0');
         const currentY = parseFloat(single.match(/translate\([\d.-]+,\s*([\d.-]+)/)?.[1] || '0');
         return single.replace(/transform="translate\([\d.-]+,\s*[\d.-]+\)"/, `transform="translate(${relX + currentX}, ${relY + currentY})"`);
      }
      return `<g transform="translate(${relX}, ${relY})">${single}</g>`;
    }
  };

  try {
    // Measurement phase
    const rect = container.getBoundingClientRect();
    const rawContent = Array.from(container.children).map(c => processNode(c, rect.left, rect.top)).join('');

    const svgResult = `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
<rect width="100%" height="100%" fill="none" />
${rawContent}
</svg>`.trim();

    await navigator.clipboard.writeText(svgResult);
    return { success: true, message: '矢量导出成功 (已校准分辨率与偏移)。' };
  } catch (err) {
    return { success: false, message: '导出失败' };
  }
};
