export const exportDomToFigmaSvg = async (targetIdOrElement: string | HTMLElement): Promise<boolean> => {
  const rootElement = typeof targetIdOrElement === 'string' 
    ? document.getElementById(targetIdOrElement) 
    : targetIdOrElement;

  if (!rootElement) return false;
  const rootRect = rootElement.getBoundingClientRect();
  
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

  const domToSvgNested = (element: Element, parentRect: { left: number, top: number }): string => {
    if (!(element instanceof HTMLElement || element instanceof SVGElement)) return '';
    if (element.getAttribute('data-svg-copy-ignore') === 'true') return '';
    
    const styles = getElementStyles(element);
    if (styles.visibility === 'hidden' || styles.opacity === '0' || styles.display === 'none') return '';
    
    const rect = element.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return '';

    // Calculate relative to the root capture element
    const relX = rect.left - parentRect.left;
    const relY = rect.top - parentRect.top;
    
    let currentLevelParts: string[] = [];

    // 1. Background and Border
    if (element instanceof HTMLElement) {
      const hasBackground = styles.backgroundColor !== 'rgba(0, 0, 0, 0)' && styles.backgroundColor !== 'transparent';
      const hasBorder = parseFloat(styles.borderWidth) > 0;
      if (hasBackground || hasBorder) {
        const rx = parseFloat(styles.borderRadius) || 0;
        const fill = hasBackground ? styles.backgroundColor : 'none';
        const stroke = hasBorder ? styles.borderColor : 'none';
        const strokeWidth = hasBorder ? styles.borderWidth : '0';
        currentLevelParts.push(`<rect x="0" y="0" width="${rect.width}" height="${rect.height}" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" rx="${rx}" fill-opacity="${styles.opacity}" stroke-opacity="${styles.opacity}" />`);
      }
    }

    // 2. SVG Icons
    if (element instanceof SVGElement && element.tagName.toLowerCase() === 'svg') {
      const clone = element.cloneNode(true) as SVGElement;
      const actualColor = styles.color || '#000000';
      if (!clone.getAttribute('stroke') || clone.getAttribute('stroke') === 'currentColor') clone.setAttribute('stroke', actualColor);
      if (clone.getAttribute('fill') === 'currentColor') clone.setAttribute('fill', actualColor);
      
      clone.setAttribute('width', rect.width.toString());
      clone.setAttribute('height', rect.height.toString());
      clone.removeAttribute('x');
      clone.removeAttribute('y');
      clone.style.position = 'static';
      
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
          const tx = textRect.left - rect.left;
          const ty = textRect.top - rect.top + fontSize * 0.8;
          
          const safeFontFamily = styles.fontFamily.includes('"') ? styles.fontFamily : `"${styles.fontFamily}"`;
          const safeText = text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
          
          currentLevelParts.push(`<text x="${tx}" y="${ty}" fill="${styles.color}" font-family='${safeFontFamily}' font-size="${styles.fontSize}" font-weight="${styles.fontWeight}" style="white-space: pre;">${safeText}</text>`);
        }
      }
    }

    // 4. Inputs/Selects
    if (element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement || element instanceof HTMLSelectElement) {
      let text = '';
      if (element instanceof HTMLSelectElement) {
        text = element.options[element.selectedIndex]?.text || '';
      } else {
        text = (element as HTMLInputElement).value || (element as HTMLInputElement).placeholder || '';
      }
      
      if (text) {
        const fontSize = parseFloat(styles.fontSize);
        const tx = 10;
        const ty = (rect.height / 2) + (fontSize * 0.3);
        const safeFontFamily = styles.fontFamily.includes('"') ? styles.fontFamily : `"${styles.fontFamily}"`;
        const safeText = text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
        currentLevelParts.push(`<text x="${tx}" y="${ty}" fill="${styles.color}" font-family='${safeFontFamily}' font-size="${styles.fontSize}" font-weight="${styles.fontWeight}">${safeText}</text>`);
      }
    }

    // 5. Children recursion
    const childrenSvg: string[] = [];
    for (const child of Array.from(element.children)) {
      const svg = domToSvgNested(child, rect);
      if (svg) childrenSvg.push(svg);
    }

    const allLines = [...currentLevelParts, ...childrenSvg];
    if (allLines.length === 0) return '';

    // Grouping logic: 
    // 1. Root element always wraps.
    // 2. Wrap if 2 or more elements (e.g., Icon + Text).
    // 3. DO NOT wrap if only 1 element (to avoid single-text groups).
    const isRoot = element === rootElement;
    const shouldWrap = allLines.length >= 2 || isRoot;

    const tagName = element.tagName.toLowerCase();
    const id = element.id ? `#${element.id}` : '';
    const className = element.className && typeof element.className === 'string' ? `.${element.className.split(' ')[0]}` : '';

    if (shouldWrap) {
      return `<g transform="translate(${relX}, ${relY})" data-name="${tagName}${id}${className}">
        ${allLines.join('\n')}
      </g>`;
    } else {
      // If we don't wrap, we must still respect the relative position of the single child.
      // Since allLines[0] already contains internal relative coordinates, we just need 
      // to add our relX/relY to it.
      const line = allLines[0];
      if (line.startsWith('<text ') || line.startsWith('<rect ')) {
        return line.replace(/x="([\d.]+)"/, (_, x) => `x="${parseFloat(x) + relX}"`)
                   .replace(/y="([\d.]+)"/, (_, y) => `y="${parseFloat(y) + relY}"`);
      }
      if (line.startsWith('<g transform="translate(')) {
        return line.replace(/transform="translate\(([\d.-]+), ([\d.-]+)\)"/, (_, x, y) => 
          `transform="translate(${parseFloat(x) + relX}, ${parseFloat(y) + relY})"`);
      }
      return line;
    }
  };

  try {
    const width = Math.ceil(rootRect.width);
    const height = Math.ceil(rootRect.height);
    const contentSvg = domToSvgNested(rootElement, rootRect);
    const svgContent = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${width}" height="${height}" fill="white" fill-opacity="0" />
  ${contentSvg}
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
