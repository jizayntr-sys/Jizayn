import { EditorBlock, EditorBlockType, EditorPageData } from './types';

export function createBlockId() {
  return `block_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

export function createDefaultBlock(type: EditorBlockType): EditorBlock {
  const id = createBlockId();

  switch (type) {
    case 'heading':
      return {
        id,
        type: 'heading',
        content: 'Yeni Başlık',
        style: {
          fontSize: 36,
          fontWeight: '700',
          textAlign: 'left',
          margin: 12,
          textColor: '#111827'
        }
      };
    case 'paragraph':
      return {
        id,
        type: 'paragraph',
        content: 'Açıklama metnini buraya yazın.',
        style: {
          fontSize: 16,
          fontWeight: '400',
          textAlign: 'left',
          margin: 8,
          textColor: '#374151'
        }
      };
    case 'button':
      return {
        id,
        type: 'button',
        label: 'Buton',
        href: '#',
        style: {
          fontSize: 16,
          fontWeight: '600',
          textAlign: 'center',
          margin: 8,
          padding: 12,
          borderRadius: 10,
          backgroundColor: '#8B4513',
          textColor: '#ffffff'
        }
      };
    case 'image':
      return {
        id,
        type: 'image',
        src: '/images/placeholder.jpg',
        alt: 'Görsel açıklaması',
        style: {
          margin: 8,
          borderRadius: 12,
          maxWidth: 640
        }
      };
    case 'spacer':
      return {
        id,
        type: 'spacer',
        style: {
          height: 40,
          margin: 0
        }
      };
    default:
      return {
        id,
        type: 'div',
        content: 'Yeni div bloğu',
        style: {
          fontSize: 16,
          fontWeight: '400',
          margin: 8,
          padding: 16,
          borderWidth: 1,
          borderColor: '#d1d5db',
          borderRadius: 10,
          backgroundColor: '#ffffff',
          textColor: '#111827'
        }
      };
  }
}

export function createDefaultPageData(): EditorPageData {
  return {
    version: 1,
    name: 'Ana Sayfa - MVP Editor',
    blocks: [
      createDefaultBlock('heading'),
      createDefaultBlock('paragraph'),
      createDefaultBlock('button')
    ]
  };
}
