/**
 * Extracts markdown content from text input
 * @param text The input text that may contain markdown
 * @returns The extracted markdown content
 */
export function extractMarkdown(text: string): string {
  // Look for markdown indicators like headers, lists, tables
  const containsMarkdownSyntax = /^#{1,6}\s|^\s*[-*+]\s|\|.*\|/.test(text);
  
  // Look for the special "---" divider that often indicates markdown content
  const markdownDivider = text.includes("---");
  
  if (markdownDivider) {
    // Find content between "---" markers, which typically indicates markdown content
    const matches = text.match(/---\s*([\s\S]*?)(\s*---\s*|$)/);
    if (matches && matches[1]) {
      return matches[1].trim();
    }
  }
  
  // If we found markdown syntax, return the whole text as it's likely all markdown
  if (containsMarkdownSyntax) {
    return text;
  }
  
  // Default case - extract anything that looks like markdown
  return text.replace(/^\s*(?:Here is|Below is).*?\:\s*/, '').trim();
}

/**
 * Parses a markdown string into sections based on headers
 * @param markdown The markdown content
 * @returns An array of sections with title and content
 */
export function parseMarkdownSections(markdown: string) {
  const lines = markdown.split('\n');
  const sections: { title: string; content: string; level: number }[] = [];
  
  let currentSection: { title: string; content: string; level: number } | null = null;
  
  lines.forEach(line => {
    const headerMatch = line.match(/^(#{1,6})\s+(.+)$/);
    
    if (headerMatch) {
      // If we were building a section, push it to the sections array
      if (currentSection) {
        sections.push({...currentSection});
      }
      
      // Start a new section
      currentSection = {
        title: headerMatch[2].trim(),
        content: '',
        level: headerMatch[1].length
      };
    } else if (currentSection) {
      // Add the line to the current section content
      currentSection.content += (currentSection.content ? '\n' : '') + line;
    } else {
      // If no current section but we have content, create a default section
      currentSection = {
        title: 'Introduction',
        content: line,
        level: 1
      };
    }
  });
  
  // Push the last section if exists
  if (currentSection) {
    sections.push(currentSection);
  }
  
  return sections;
}
