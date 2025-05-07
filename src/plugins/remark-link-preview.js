import { visit } from 'unist-util-visit';

/**
 * A remark plugin to transform standalone URLs in paragraphs to LinkPreview components
 * This will detect URLs that are alone in a paragraph and replace them with the LinkPreview component
 */
export function remarkLinkPreview() {
  // URL regex pattern
  const urlPattern = /^(https?:\/\/[^\s<>]+)$/;
  
  return (tree) => {
    // Find paragraphs that contain a single text node with just a URL
    visit(tree, 'paragraph', (paragraph, paragraphIndex, parent) => {
      // Check if paragraph has only one child and it's a text node
      if (paragraph.children.length === 1 && paragraph.children[0].type === 'text') {
        const textNode = paragraph.children[0];
        const text = textNode.value.trim();
        
        // Check if the text is just a URL
        if (urlPattern.test(text)) {
          const url = text;
          
          // Replace the paragraph with an mdxJsxFlowElement representing our LinkPreview
          parent.children[paragraphIndex] = {
            type: 'mdxJsxFlowElement',
            name: 'LinkPreview',
            attributes: [
              {
                type: 'mdxJsxAttribute',
                name: 'url',
                value: url
              }
            ],
            children: [],
            data: { _mdxExplicitJsx: true }
          };
        }
      }
    });
  };
}

export default remarkLinkPreview;