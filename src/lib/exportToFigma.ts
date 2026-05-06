export const exportDomToFigmaSvg = async (targetSelector: string = '#figma-export-container'): Promise<{ success: boolean; message: string }> => {
  const container = document.querySelector(targetSelector);
  const portals = Array.from(document.querySelectorAll('.fixed, .absolute, [role="dialog"]')).filter(el => {
    const style = window.getComputedStyle(el);
    return style.display !== 'none' && style.visibility !== 'hidden' && style.opacity !== '0';
  });

  const roots = container ? [container, ...portals] : portals;
  if (roots.length === 0) return { success: false, message: '未找到导出目标' };

  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  const updateBounds = (el: Element) => {
    const rect = el.getBoundingClientRect();
    if (rect.width > 0 && rect.height > 0 && window.getComputedStyle(el).display !== 'none') {
      minX = Math.min(minX, rect.left);
      minY = Math.min(minY, rect.top);
      maxX = Math.max(maxX, rect.right);
      maxY = Math.max(maxY, rect.bottom);
    }
    Array.from(el.children).forEach(updateBounds);
  };
  roots.forEach(updateBounds);

  const padding = 20;
  const width = maxX - minX + padding * 2;
  const height = maxY - minY + padding * 2;
  const offsetX = minX - padding;
  const offsetY = minY - padding;

  const processNode = (el: Element, originX: number, originY: number): string => {
    if (!(el instanceof HTMLElement || el instanceof SVGElement)) return '';
    const style = window.getComputedStyle(el);
    if (style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0') return '';

    const rect = el.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return '';

    const relX = rect.left - originX;
    const relY = rect.top - originY;
    const childrenParts: string[] = [];

    // 1. Bg & Border (Vectors only)
    const bg = style.backgroundColor;
    const hasBg = bg !== 'rgba(0, 0, 0, 0)' && bg !== 'transparent';
    const bW = parseFloat(style.borderWidth) || 0;
    if (hasBg || bW > 0) {
      const rx = parseFloat(style.borderRadius) || 0;
      childrenParts.push(`<rect x="0" y="0" width="${rect.width}" height="${rect.height}" fill="${hasBg ? bg : 'none'}" stroke="${bW > 0 ? style.borderColor : 'none'}" stroke-width="${bW}" rx="${rx}" fill-opacity="${style.opacity}" />`);
    }

    // 2. SVG Path handling (Simplify icons)
    if (el instanceof SVGElement && el.tagName.toLowerCase() === 'svg') {
      const paths = Array.from(el.querySelectorAll('path, circle, rect')).map(p => {
        const pClone = p.cloneNode(true) as Element;
        const pStroke = pClone.getAttribute('stroke');
        if (!pStroke || pStroke === 'currentColor') pClone.setAttribute('stroke', style.color);
        return pClone.outerHTML;
      }).join('');
      return `<g transform="translate(${relX}, ${relY})">${paths}</g>`;
    }

    // 3. Text Nodes
    const text = Array.from(el.childNodes).find(n => n.nodeType === Node.TEXT_NODE && n.textContent?.trim());
    if (text) {
      const range = document.createRange();
      range.selectNodeContents(text);
      const tRect = range.getBoundingClientRect();
      const fs = parseFloat(style.fontSize);
      const tx = tRect.left - rect.left;
      const ty = tRect.top - rect.top + fs * 0.8;
      const safeContent = text.textContent!.trim().replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
      childrenParts.push(`<text x="${tx}" y="${ty}" fill="${style.color}" font-family="Inter, sans-serif" font-size="${fs}" font-weight="${style.fontWeight}">${safeContent}</text>`);
    }

    // 4. Children Recursion
    for (const child of Array.from(el.children)) {
      const childSvg = processNode(child, rect.left, rect.top);
      if (childSvg) childrenParts.push(childSvg);
    }

    if (childrenParts.length === 0) return '';
    
    // Grouping Rule: At least 2 children or root necessity
    const tagName = el.tagName.toLowerCase();
    if (childrenParts.length >= 2) {
      return `<g transform="translate(${relX}, ${relY})" data-name="${tagName}">${childrenParts.join('')}</g>`;
    } else {
      // Offset single node
      const single = childrenParts[0];
      if (single.startsWith('<g ')) {
         const currentX = parseFloat(single.match(/translate\(([\d.-]+)/)?.[1] || '0');
         const currentY = parseFloat(single.match(/translate\([\d.-]+,\s*([\d.-]+)/)?.[1] || '0');
         return single.replace(/transform="translate\([\d.-]+,\s*[\d.-]+\)"/, `transform="translate(${relX + currentX}, ${relY + currentY})"`);
      }
      if (single.startsWith('<rect ') || single.startsWith('<text ')) {
         return single.replace('x="0"', `x="${relX}"`).replace('y="0"', `y="${relY}"`);
      }
      return `<g transform="translate(${relX}, ${relY})">${single}</g>`;
    }
  };

  try {
    const rawContent = roots.map(r => processNode(r, offsetX, offsetY)).join('');
    const svgResult = `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
<rect width="100%" height="100%" fill="none" />
${rawContent}
</svg>`.trim();

    await navigator.clipboard.writeText(svgResult);
    return { success: true, message: 'SVG 矢量代码已成功写入剪贴板 (text/plain)。' };
  } catch (err) {
    return { success: false, message: '复制失败' };
  }
};
