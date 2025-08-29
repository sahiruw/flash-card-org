/**
 * Extracts markdown content from text input
 * @param text The input text that may contain markdown
 * @returns The extracted markdown content
 */
export function extractMarkdown(text: string): string {
  // Look for markdown indicators like headers, lists, tables
  const containsMarkdownSyntax = /^#{1,6}\s|^\s*[-*+]\s|\|.*\|/.test(text);
  
  // Look for the special "---" divider that often indicates markdown content
  const markdownDividers = text.match(/\n---+\s*\n/g);
  
  if (markdownDividers && markdownDividers.length) {
    // Handle multiple sections separated by "---" markers
    const sections: string[] = [];
    
    // Split the text by "---" markers
    const parts = text.split(/\n---+\s*\n/);
    
    parts.forEach(part => {
      const trimmedPart = part.trim();
      if (trimmedPart) {
        // If the part has markdown indicators, add it
        if (/^#{1,6}\s|^\s*[-*+]\s|\|.*\|/.test(trimmedPart)) {
          sections.push(trimmedPart);
        }
      }
    });
    
    if (sections.length > 0) {
      return sections.join('\n\n---\n\n');
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
 * Parses a markdown string into sections based on headers or section dividers
 * @param markdown The markdown content
 * @returns An array of sections with title and content
 */
export function parseMarkdownSections(markdown: string) {
  const lines = markdown.split('\n');
  const sections: { title: string; content: string; level: number }[] = [];
  
  let currentSection: { title: string; content: string; level: number } | null = null;
  let sectionIndex = 0;
  
  lines.forEach((line, index) => {
    // Check if this line is a section divider (---) surrounded by newlines or at document boundaries
    const isSectionDivider = line.trim() === '---' && 
      (index === 0 || lines[index-1].trim() === '') && 
      (index === lines.length-1 || lines[index+1].trim() === '');
    
    const headerMatch = line.match(/^(#{1,6})\s+(.+)$/);
    
    if (isSectionDivider) {
      // If we encounter a section divider, finish the current section
      if (currentSection) {
        sections.push({...currentSection});
        currentSection = null;
      }
    } else if (headerMatch) {
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
      // For multiple sections divided by ---, use numbered introductions
      if (sections.length > 0 && line.trim() !== '') {
        sectionIndex++;
        currentSection = {
          title: `Section ${sectionIndex}`,
          content: line,
          level: 1
        };
      } else if (line.trim() !== '') {
        currentSection = {
          title: 'Introduction',
          content: line,
          level: 1
        };
      }
    }
  });
  
  // Push the last section if exists
  if (currentSection) {
    sections.push(currentSection);
  }
  
  return sections;
}
