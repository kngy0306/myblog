import type { MDXComponents } from 'mdx/types';
import LinkPreview from './src/components/LinkPreview.astro';

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    // Make LinkPreview available in all MDX files
    LinkPreview,
    // Preserve any components that were passed
    ...components,
  };
}