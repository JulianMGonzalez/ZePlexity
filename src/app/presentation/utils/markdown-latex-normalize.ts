export function normalizeLatexDelimiters(markdown: string): string {
  if (!markdown) {
    return '';
  }

  // Convertir bloques tipo `[ \frac{...}{...} ]` a `$$...$$` para KaTeX auto-render
  return markdown.replace(/\[\s*([\s\S]*?)\s*\]/g, (match, inner: string) => {
    if (/\\[a-zA-Z]/.test(inner)) {
      return `\n$$${inner.trim()}$$\n`;
    }
    return match;
  });
}
