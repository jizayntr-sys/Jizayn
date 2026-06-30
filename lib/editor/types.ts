export type EditorBlockType = 'div' | 'heading' | 'paragraph' | 'button' | 'image' | 'spacer';

export interface EditorBlockStyle {
  backgroundColor?: string;
  textColor?: string;
  fontSize?: number;
  fontWeight?: '400' | '500' | '600' | '700';
  textAlign?: 'left' | 'center' | 'right';
  padding?: number;
  margin?: number;
  borderWidth?: number;
  borderColor?: string;
  borderRadius?: number;
  maxWidth?: number;
  height?: number;
}

interface EditorBlockBase {
  id: string;
  type: EditorBlockType;
  style: EditorBlockStyle;
}

export interface DivBlock extends EditorBlockBase {
  type: 'div';
  content: string;
}

export interface HeadingBlock extends EditorBlockBase {
  type: 'heading';
  content: string;
}

export interface ParagraphBlock extends EditorBlockBase {
  type: 'paragraph';
  content: string;
}

export interface ButtonBlock extends EditorBlockBase {
  type: 'button';
  label: string;
  href: string;
}

export interface ImageBlock extends EditorBlockBase {
  type: 'image';
  src: string;
  alt: string;
}

export interface SpacerBlock extends EditorBlockBase {
  type: 'spacer';
}

export type EditorBlock = DivBlock | HeadingBlock | ParagraphBlock | ButtonBlock | ImageBlock | SpacerBlock;

export interface EditorPageData {
  version: 1;
  name: string;
  blocks: EditorBlock[];
}

export const EDITOR_STORAGE_KEY = 'jizayn:mvp-editor:home';
