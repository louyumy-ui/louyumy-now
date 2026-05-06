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

  const width = maxX - minX + 40;
  const height = maxY - minY + 40;
  const offsetX = minX - 20;
  const offsetY = minY - 20;

  const getStyles = (el: Element) => window.getComputedStyle(el);

  const processNode = (el: Element, originX: number, originY: number): string => {
    if (!(el instanceof HTMLElement || el instanceof SVGElement)) return '';
    const style = getStyles(el);
    if (style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0') return '';

    const rect = el.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return '';

    const relX = rect.left - originX;
    const relY = rect.top - originY;
    const items: string[] = [];

    // 1. Background/Border
    const bg = style.backgroundColor;
    const hasBg = bg !== 'rgba(0, 0, 0, 0)' && bg !== 'transparent';
    const borderW = parseFloat(style.borderWidth) || 0;
    if (hasBg || borderW > 0) {
      const rx = parseFloat(style.borderRadius) || 0;
      items.push(`<rect x="0" y="0" width="${rect.width}" height="${rect.height}" fill="${hasBg ? bg : 'none'}" stroke="${borderW > 0 ? style.borderColor : 'none'}" stroke-width="${borderW}" rx="${rx}" fill-opacity="${style.opacity}" />`);
    }

    // 2. Icon (SVG)
    if (el instanceof SVGElement && el.tagName.toLowerCase() === 'svg') {
      const clone = el.cloneNode(true) as SVGElement;
      clone.setAttribute('width', rect.width.toString());
      clone.setAttribute('height', rect.height.toString());
      clone.style.transform = 'none';
      return `<g transform="translate(${relX}, ${relY})">${clone.outerHTML}</g>`;
    }

    // 3. Text
    const textNode = Array.from(el.childNodes).find(n => n.nodeType === Node.TEXT_NODE && n.textContent?.trim());
    if (textNode) {
      const range = document.createRange();
      range.selectNodeContents(textNode);
      const tRect = range.getBoundingClientRect();
      const fs = parseFloat(style.fontSize);
      const tx = tRect.left - rect.left;
      const ty = tRect.top - rect.top + fs * 0.8;
      const safeText = textNode.textContent!.trim().replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
      items.push(`<text x="${tx}" y="${ty}" fill="${style.color}" font-family="Inter, sans-serif" font-size="${fs}" font-weight="${style.fontWeight}">${safeText}</text>`);
    }

    // 4. Children
    for (const child of Array.from(el.children)) {
      const childSvg = processNode(child, rect.left, rect.top);
      if (childSvg) items.push(childSvg);
    }

    if (items.length === 0) return '';
    
    // Grouping rule: Only wrap in <g> if 2+ children or it's a root fragment
    const name = `${el.tagName.toLowerCase()}${el.id ? '#'+el.id : ''}`;
    if (items.length >= 2) {
      return `<g transform="translate(${relX}, ${relY})" data-name="${name}">${items.join('')}</g>`;
    } else {
      // Offset the single item and return it
      const single = items[0];
      if (single.startsWith('<g ')) {
         return single.replace('transform="translate(', `transform="translate(${relX + parseFloat(single.match(/translate\(([\d.-]+)/)![1])}, `);
      }
      return `<g transform="translate(${relX}, ${relY})">${single}</g>`;
    }
  };

  try {
    const content = roots.map(r => processNode(r, offsetX, offsetY)).join('');
    const svg = `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="none" />
      ${content}
    </svg>`.trim();

    await navigator.clipboard.writeText(svg);
    return { success: true, message: 'SVG 矢量代码已写入剪贴板 (text/plain)，请在 Figma 中粘贴。' };
  } catch (err) {
    return { success: false, message: '导出失败' };
  }
};
