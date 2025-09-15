import { ComponentMetadata } from '@/types';

/**
 * Default component library for the website builder
 */
export const defaultComponents: ComponentMetadata[] = [
  {
    id: 'text',
    name: 'Text',
    category: 'Basic',
    description: 'Simple text element',
    icon: '📝',
    version: '1.0.0',
    author: 'Website Builder',
    tags: ['text', 'content', 'basic']
  },
  {
    id: 'heading',
    name: 'Heading',
    category: 'Basic',
    description: 'Heading element (h1-h6)',
    icon: '📑',
    version: '1.0.0',
    author: 'Website Builder',
    tags: ['heading', 'title', 'basic']
  },
  {
    id: 'image',
    name: 'Image',
    category: 'Media',
    description: 'Image element',
    icon: '🖼️',
    version: '1.0.0',
    author: 'Website Builder',
    tags: ['image', 'media', 'visual']
  },
  {
    id: 'button',
    name: 'Button',
    category: 'Interactive',
    description: 'Clickable button element',
    icon: '🔘',
    version: '1.0.0',
    author: 'Website Builder',
    tags: ['button', 'interactive', 'action']
  },
  {
    id: 'container',
    name: 'Container',
    category: 'Layout',
    description: 'Container for other elements',
    icon: '📦',
    version: '1.0.0',
    author: 'Website Builder',
    tags: ['container', 'layout', 'wrapper']
  },
  {
    id: 'form',
    name: 'Form',
    category: 'Interactive',
    description: 'Form container',
    icon: '📋',
    version: '1.0.0',
    author: 'Website Builder',
    tags: ['form', 'input', 'interactive']
  },
  {
    id: 'input',
    name: 'Input',
    category: 'Interactive',
    description: 'Text input field',
    icon: '📝',
    version: '1.0.0',
    author: 'Website Builder',
    tags: ['input', 'form', 'text']
  },
  {
    id: 'video',
    name: 'Video',
    category: 'Media',
    description: 'Video player element',
    icon: '🎥',
    version: '1.0.0',
    author: 'Website Builder',
    tags: ['video', 'media', 'player']
  },
  {
    id: 'audio',
    name: 'Audio',
    category: 'Media',
    description: 'Audio player element',
    icon: '🎵',
    version: '1.0.0',
    author: 'Website Builder',
    tags: ['audio', 'media', 'sound']
  }
];

/**
 * Component categories
 */
export const componentCategories = [
  'Basic',
  'Layout',
  'Interactive',
  'Media',
  'Custom'
] as const;