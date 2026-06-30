import { EditorBlock, EditorPageData } from '@/lib/editor/types';

interface EditorRendererProps {
  page: EditorPageData;
  selectedBlockId?: string | null;
  onSelectBlock?: (id: string) => void;
  className?: string;
}

function toCssRule(block: EditorBlock) {
  const style = block.style;
  const declarations: string[] = ['line-height: 1.5;', 'cursor: pointer;'];

  if (style.backgroundColor) declarations.push(`background-color: ${style.backgroundColor};`);
  if (style.textColor) declarations.push(`color: ${style.textColor};`);
  if (style.fontSize) declarations.push(`font-size: ${style.fontSize}px;`);
  if (style.fontWeight) declarations.push(`font-weight: ${style.fontWeight};`);
  if (style.textAlign) declarations.push(`text-align: ${style.textAlign};`);
  if (style.padding !== undefined) declarations.push(`padding: ${style.padding}px;`);
  if (style.margin !== undefined) declarations.push(`margin: ${style.margin}px 0;`);
  if (style.borderWidth !== undefined) declarations.push(`border-width: ${style.borderWidth}px;`);
  if (style.borderWidth) declarations.push('border-style: solid;');
  if (style.borderColor) declarations.push(`border-color: ${style.borderColor};`);
  if (style.borderRadius !== undefined) declarations.push(`border-radius: ${style.borderRadius}px;`);
  if (style.maxWidth) declarations.push(`max-width: ${style.maxWidth}px;`);
  if (style.height) declarations.push(`height: ${style.height}px;`);
  if (block.type === 'image') declarations.push('width: 100%;');
  if (block.type === 'button') declarations.push('display: inline-block;');

  return `.editor-block-${block.id}{${declarations.join('')}}`;
}

function wrapClassNames(isSelected: boolean) {
  return [
    'transition-all',
    'outline-none',
    isSelected ? 'ring-2 ring-blue-500 ring-offset-2' : 'hover:ring-1 hover:ring-slate-300'
  ].join(' ');
}

export default function EditorRenderer({ page, selectedBlockId, onSelectBlock, className }: EditorRendererProps) {
  const styleSheet = page.blocks.map((block) => toCssRule(block)).join('\n');

  return (
    <div className={className}>
      <style>{styleSheet}</style>
      {page.blocks.map((block) => {
        const isSelected = block.id === selectedBlockId;
        const blockClassName = `${wrapClassNames(isSelected)} editor-block-${block.id}`;

        if (block.type === 'heading') {
          return (
            <h2
              key={block.id}
              className={blockClassName}
              onClick={() => onSelectBlock?.(block.id)}
            >
              {block.content}
            </h2>
          );
        }

        if (block.type === 'paragraph') {
          return (
            <p
              key={block.id}
              className={blockClassName}
              onClick={() => onSelectBlock?.(block.id)}
            >
              {block.content}
            </p>
          );
        }

        if (block.type === 'button') {
          return (
            <a
              key={block.id}
              href={block.href}
              className={blockClassName}
              onClick={(event) => {
                event.preventDefault();
                onSelectBlock?.(block.id);
              }}
            >
              {block.label}
            </a>
          );
        }

        if (block.type === 'image') {
          return (
            <img
              key={block.id}
              src={block.src}
              alt={block.alt || 'Görsel'}
              className={blockClassName}
              onClick={() => onSelectBlock?.(block.id)}
            />
          );
        }

        if (block.type === 'spacer') {
          return (
            <div
              key={block.id}
              className={blockClassName}
              onClick={() => onSelectBlock?.(block.id)}
            />
          );
        }

        return (
          <div
            key={block.id}
            className={blockClassName}
            onClick={() => onSelectBlock?.(block.id)}
          >
            {block.content}
          </div>
        );
      })}
    </div>
  );
}
