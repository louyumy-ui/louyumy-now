export const exportDomToFigmaSvg = async (targetSelector: string = 'body'): Promise<{ success: boolean; message: string }> => {
  // Capture all potential content containers
  const containers = Array.from(document.querySelectorAll(targetSelector));
  // Also capture modals/portals which usually live outside the main container
  const portals = Array.from(document.querySelectorAll('.fixed, .absolute, [role="dialog"]')).filter(el => {
    const style = window.getComputedStyle(el);
    return style.display !== 'none' && style.visibility !== 'hidden' && style.opacity !== '0';
  });

  const allElements = [...containers, ...portals];
  if (allElements.length === 0) return { success: false, message: '未找到可导出内容' };

  // Calculate the collective bounding box of all visible elements to remove whitespace
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  let hasVisibleContent = false;

  const updateBounds = (el: Element) => {
    const rect = el.getBoundingClientRect();
    const style = window.getComputedStyle(el);
    if (rect.width > 0 && rect.height > 0 && style.display !== 'none' && style.visibility !== 'hidden' && style.opacity !== '0') {
      minX = Math.min(minX, rect.left);
      minY = Math.min(minY, rect.top);
      maxX = Math.max(maxX, rect.right);
      maxY = Math.max(maxY, rect.bottom);
      hasVisibleContent = true;
    }
    Array.from(el.children).forEach(updateBounds);
  };

  allElements.forEach(updateBounds);

  if (!hasVisibleContent) return { success: false, message: '无可捕获的可见内容' };

  // Add a small padding
  const padding = 20;
  minX -= padding;
  minY -= padding;
  maxX += padding;
  maxY += padding;

  const width = maxX - minX;
  const height = maxY - minY;

  const getElementStyles = (el: HTMLElement | SVGElement) => {
    const style = window.getComputedStyle(el);
    return {
      backgroundColor: style.backgroundColor,
      color: style.color,
      fontSize: style.fontSize,
      fontWeight: style.fontWeight,
      fontFamily: style.fontFamily,
      borderRadius: style.borderRadius,
      borderWidth: style.borderWidth,
      borderColor: style.borderColor,
      opacity: style.opacity,
      visibility: style.visibility,
      display: style.display,
      padding: style.padding,
      boxSizing: style.boxSizing
    };
  };

  const domToSvgNested = (element: Element, originX: number, originY: number): string => {
    if (!(element instanceof HTMLElement || element instanceof SVGElement)) return '';
    if (element.getAttribute('data-svg-copy-ignore') === 'true') return '';
    
    const styles = getElementStyles(element);
    if (styles.visibility === 'hidden' || styles.opacity === '0' || styles.display === 'none') return '';
    
    const currentRect = element.getBoundingClientRect();
    if (currentRect.width === 0 || currentRect.height === 0) return '';

    const relX = currentRect.left - originX;
    const relY = currentRect.top - originY;
    
    let currentLevelParts: string[] = [];

    // 1. Background & Borders
    if (!(element instanceof SVGElement)) {
      const hasBackground = styles.backgroundColor !== 'rgba(0, 0, 0, 0)' && styles.backgroundColor !== 'transparent';
      const hasBorder = parseFloat(styles.borderWidth) > 0;
      if (hasBackground || hasBorder) {
        const rx = parseFloat(styles.borderRadius) || 0;
        const fill = hasBackground ? styles.backgroundColor : 'none';
        const stroke = hasBorder ? styles.borderColor : 'none';
        const strokeWidth = hasBorder ? (parseFloat(styles.borderWidth) || 0) : 0;
        currentLevelParts.push(`<rect x="0" y="0" width="${currentRect.width}" height="${currentRect.height}" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" rx="${rx}" fill-opacity="${styles.opacity}" stroke-opacity="${styles.opacity}" />`);
      }
    }

    // 2. SVG / Icons
    if (element instanceof SVGElement && element.tagName.toLowerCase() === 'svg') {
      const clone = element.cloneNode(true) as SVGElement;
      const actualColor = styles.color;
      if (!clone.getAttribute('stroke') || clone.getAttribute('stroke') === 'currentColor') clone.setAttribute('stroke', actualColor);
      if (clone.getAttribute('fill') === 'currentColor') clone.setAttribute('fill', actualColor);
      
      clone.setAttribute('width', currentRect.width.toString());
      clone.setAttribute('height', currentRect.height.toString());
      clone.removeAttribute('x');
      clone.removeAttribute('y');
      clone.style.position = 'static';
      clone.style.transform = 'none';
      
      return `<g transform="translate(${relX}, ${relY})" data-figma-type="icon">${clone.outerHTML}</g>`;
    }

    // 3. Text
    if (element.childNodes.length > 0) {
      const textNode = Array.from(element.childNodes).find(node => node.nodeType === Node.TEXT_NODE && node.textContent?.trim());
      if (textNode) {
        const text = textNode.textContent!.trim();
        const range = document.createRange();
        range.selectNodeContents(textNode);
        const textRect = range.getBoundingClientRect();
        
        if (textRect.width > 0) {
          const fontSize = parseFloat(styles.fontSize);
          const tx = textRect.left - currentRect.left;
          const ty = textRect.top - currentRect.top + fontSize * 0.8;
          
          const safeFontFamily = styles.fontFamily.includes('"') ? styles.fontFamily : `"${styles.fontFamily}"`;
          const safeText = text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
          currentLevelParts.push(`<text x="${tx}" y="${ty}" fill="${styles.color}" font-family='${safeFontFamily}' font-size="${styles.fontSize}" font-weight="${styles.fontWeight}">${safeText}</text>`);
        }
      }
    }

    // 4. Children recursion
    const childrenSvg: string[] = [];
    for (const child of Array.from(element.children)) {
      const svg = domToSvgNested(child, currentRect.left, currentRect.top);
      if (svg) childrenSvg.push(svg);
    }

    const allLines = [...currentLevelParts, ...childrenSvg];
    if (allLines.length === 0) return '';

    const tagName = element.tagName.toLowerCase();
    const idAttr = element.id ? `#${element.id}` : '';
    const className = element.className && typeof element.className === 'string' ? `.${element.className.split(' ')[0]}` : '';

    return `<g transform="translate(${relX}, ${relY})" data-name="${tagName}${idAttr}${className}">
      ${allLines.join('\n')}
    </g>`;
  };

  try {
    const svgParts: string[] = [];
    allElements.forEach(el => {
      const part = domToSvgNested(el, minX, minY);
      if (part) svgParts.push(part);
    });

    const svgContent = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${width}" height="${height}" fill="white" fill-opacity="0" />
  ${svgParts.join('\n')}
</svg>`.trim();

    const blobHtml = new Blob([svgContent], { type: 'text/html' });
    const data = [new ClipboardItem({ 'text/html': blobHtml })];
    await navigator.clipboard.write(data);
    
    return { success: true, message: 'SVG 已精准剪裁并复制到剪贴板！可以直接粘贴到 Figma。' };
  } catch (err) {
    console.error('Export failed:', err);
    return { success: false, message: '复制失败，请检查浏览器权限。' };
  }
};
