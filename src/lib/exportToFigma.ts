export const exportDomToFigmaSvg = async (targetId: string = 'figma-export-container'): Promise<boolean> => {
  const rootElement = document.getElementById(targetId);

  if (!rootElement) {
    console.error(`Export container #${targetId} not found`);
    return false;
  }

  // Use offsetWidth/Height for the 1:1 "natural" dimensions
  const width = rootElement.offsetWidth;
  const height = rootElement.offsetHeight;
  
  // Calculate current scale to remove its effect
  const rect = rootElement.getBoundingClientRect();
  const scaleX = rect.width / width;
  const scaleY = rect.height / height;
  const scale = (scaleX + scaleY) / 2; // Assume uniform scale for UI

  const getElementStyles = (el: HTMLElement | SVGElement) => {
    const style = window.getComputedStyle(el);
    return {
      backgroundColor: style.backgroundColor, color: style.color,
      fontSize: style.fontSize, fontWeight: style.fontWeight,
      fontFamily: style.fontFamily, borderRadius: style.borderRadius,
      borderWidth: style.borderWidth, borderColor: style.borderColor,
      opacity: style.opacity, visibility: style.visibility, display: style.display,
    };
  };

  const domToSvgNested = (element: Element, parentRect: DOMRect): string => {
    if (!(element instanceof HTMLElement || element instanceof SVGElement)) return '';
    if (element.getAttribute('data-svg-copy-ignore') === 'true') return '';
    
    const styles = getElementStyles(element);
    if (styles.visibility === 'hidden' || styles.opacity === '0' || styles.display === 'none') return '';
    
    const currentRect = element.getBoundingClientRect();
    if (currentRect.width === 0 || currentRect.height === 0) return '';

    // Calculate logical relative positions (removes scale)
    const relX = (currentRect.left - parentRect.left) / scale;
    const relY = (currentRect.top - parentRect.top) / scale;
    const logicalWidth = currentRect.width / scale;
    const logicalHeight = currentRect.height / scale;
    
    let currentLevelParts: string[] = [];

    // 1. Background and Border
    if (element instanceof HTMLElement) {
      const hasBackground = styles.backgroundColor !== 'rgba(0, 0, 0, 0)' && styles.backgroundColor !== 'transparent';
      const hasBorder = parseFloat(styles.borderWidth) > 0;
      if (hasBackground || hasBorder) {
        const rx = (parseFloat(styles.borderRadius) || 0);
        const fill = hasBackground ? styles.backgroundColor : 'none';
        const stroke = hasBorder ? styles.borderColor : 'none';
        const strokeWidth = hasBorder ? (parseFloat(styles.borderWidth) || 0) : 0;
        currentLevelParts.push(`<rect x="0" y="0" width="${logicalWidth}" height="${logicalHeight}" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" rx="${rx}" fill-opacity="${styles.opacity}" stroke-opacity="${styles.opacity}" />`);
      }
    }

    // 2. SVG Icons
    if (element instanceof SVGElement && element.tagName.toLowerCase() === 'svg') {
      const clone = element.cloneNode(true) as SVGElement;
      const actualColor = styles.color || '#000000';
      if (!clone.getAttribute('stroke') || clone.getAttribute('stroke') === 'currentColor') clone.setAttribute('stroke', actualColor);
      if (clone.getAttribute('fill') === 'currentColor') clone.setAttribute('fill', actualColor);
      
      clone.setAttribute('width', logicalWidth.toString());
      clone.setAttribute('height', logicalHeight.toString());
      clone.removeAttribute('x');
      clone.removeAttribute('y');
      clone.style.position = 'static';
      clone.style.transform = 'none'; // Clear any internal transforms that get computed
      
      return `<g transform="translate(${relX}, ${relY})" data-figma-type="icon">${clone.outerHTML}</g>`;
    }

    // 3. Text content
    for (const node of Array.from(element.childNodes)) {
      if (node.nodeType === Node.TEXT_NODE && node.textContent?.trim()) {
        const text = node.textContent.trim().replace(/\s+/g, ' ');
        if (!text) continue;
        
        const range = document.createRange();
        range.selectNodeContents(node);
        const textRect = range.getBoundingClientRect();
        
        if (textRect.width > 0) {
          const fontSize = parseFloat(styles.fontSize);
          const tx = (textRect.left - currentRect.left) / scale;
          const ty = ((textRect.top - currentRect.top) / scale) + fontSize * 0.8;
          
          const safeFontFamily = styles.fontFamily.includes('"') ? styles.fontFamily : `"${styles.fontFamily}"`;
          const safeText = text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
          
          currentLevelParts.push(`<text x="${tx}" y="${ty}" fill="${styles.color}" font-family='${safeFontFamily}' font-size="${styles.fontSize}" font-weight="${styles.fontWeight}" style="white-space: pre;">${safeText}</text>`);
        }
      }
    }

    // 4. Children recursion
    const childrenSvg: string[] = [];
    for (const child of Array.from(element.children)) {
      const svg = domToSvgNested(child, currentRect);
      if (svg) childrenSvg.push(svg);
    }

    const allLines = [...currentLevelParts, ...childrenSvg];
    if (allLines.length === 0) return '';

    const isRoot = element === rootElement;
    const tagName = element.tagName.toLowerCase();
    const idAttr = element.id ? `#${element.id}` : '';
    const className = element.className && typeof element.className === 'string' ? `.${element.className.split(' ')[0]}` : '';

    return `<g transform="translate(${relX}, ${relY})" data-name="${tagName}${idAttr}${className}">
      ${allLines.join('\n')}
    </g>`;
  };

  try {
    const rootRect = rootElement.getBoundingClientRect();
    const contentSvg = domToSvgNested(rootElement, rootRect);
    
    // Final SVG wrap matching the natural offset dimensions
    const svgContent = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${width}" height="${height}" fill="white" fill-opacity="0" />
  <g transform="translate(0, 0)">
    ${contentSvg}
  </g>
</svg>`.trim();

    const blobHtml = new Blob([svgContent], { type: 'text/html' });
    const blobText = new Blob([svgContent], { type: 'text/plain' });
    const item = new ClipboardItem({ 'text/html': blobHtml, 'text/plain': blobText });
    await navigator.clipboard.write([item]);
    return true;
  } catch (err) {
    console.error('Copy to Figma failed:', err);
    return false;
  }
};
