# OGP Link Preview Implementation

This document explains how the OGP (Open Graph Protocol) link preview functionality was implemented in this blog.

## Implementation Details

1. **LinkPreview Component** (`src/components/LinkPreview.astro`)
   - This component fetches OGP data from a URL using the `ogp-parser` library
   - Displays a rich preview card with title, description, image, and site name
   - Falls back to a plain link if fetching OGP data fails

2. **Remark Plugin** (`src/plugins/remark-link-preview.js`)
   - A custom remark plugin that transforms standalone URLs in Markdown to LinkPreview components
   - Only transforms URLs that are alone in a paragraph
   - Regular links with text labels are not transformed

3. **Configuration**
   - Added necessary packages: `ogp-parser` and `unist-util-visit`
   - Updated Astro configuration to use the plugin for both Markdown and MDX
   - Created MDX component mappings for MDX support

## How to Use

Simply paste a URL on its own line in a Markdown or MDX file:

```markdown
Here is some regular text.

https://example.com

More text after the link.
```

The URL will be automatically transformed into a rich preview card. Links that are part of regular text or have a custom label won't be transformed:

```markdown
[This is a regular link](https://example.com) that won't be transformed.
```

## Example

A test page has been created at `src/content/blog/ogp-test.md` that shows examples of the OGP link preview functionality.