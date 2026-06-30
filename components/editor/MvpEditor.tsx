'use client';

import { ChangeEvent, useEffect, useMemo, useRef, useState } from 'react';
import EditorRenderer from './EditorRenderer';
import { createBlockId, createDefaultBlock, createDefaultPageData } from '@/lib/editor/default-page';
import { loadEditorPage, saveEditorPage } from '@/lib/editor/storage';
import { EditorBlock, EditorBlockStyle, EditorBlockType, EditorPageData } from '@/lib/editor/types';

const BLOCK_OPTIONS: { value: EditorBlockType; label: string }[] = [
  { value: 'div', label: 'Div' },
  { value: 'heading', label: 'Başlık' },
  { value: 'paragraph', label: 'Paragraf' },
  { value: 'button', label: 'Buton' },
  { value: 'image', label: 'Görsel' },
  { value: 'spacer', label: 'Boşluk' }
];

const FONT_WEIGHTS = ['400', '500', '600', '700'] as const;
const TEXT_ALIGN_OPTIONS = ['left', 'center', 'right'] as const;

function replaceBlock(blocks: EditorBlock[], id: string, updater: (block: EditorBlock) => EditorBlock) {
  return blocks.map((block) => (block.id === id ? updater(block) : block));
}

function moveBlock(blocks: EditorBlock[], fromIndex: number, toIndex: number) {
  if (toIndex < 0 || toIndex >= blocks.length) {
    return blocks;
  }

  const next = [...blocks];
  const [moved] = next.splice(fromIndex, 1);
  next.splice(toIndex, 0, moved);
  return next;
}

export default function MvpEditor() {
  const [page, setPage] = useState<EditorPageData>({
    version: 1,
    name: 'Ana Sayfa - MVP Editor',
    blocks: []
  });
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const saved = loadEditorPage();
    const initial = saved ?? createDefaultPageData();
    setPage(initial);
    setSelectedBlockId(initial.blocks[0]?.id ?? null);
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    saveEditorPage(page);
  }, [page, isHydrated]);

  const selectedBlock = useMemo(
    () => page.blocks.find((block) => block.id === selectedBlockId) ?? null,
    [page.blocks, selectedBlockId]
  );

  function addBlock(type: EditorBlockType) {
    const block = createDefaultBlock(type);
    setPage((prev) => ({ ...prev, blocks: [...prev.blocks, block] }));
    setSelectedBlockId(block.id);
  }

  function removeBlock(id: string) {
    setPage((prev) => {
      const nextBlocks = prev.blocks.filter((block) => block.id !== id);
      return { ...prev, blocks: nextBlocks };
    });

    if (selectedBlockId === id) {
      const nextSelected = page.blocks.find((block) => block.id !== id);
      setSelectedBlockId(nextSelected?.id ?? null);
    }
  }

  function duplicateBlock(id: string) {
    setPage((prev) => {
      const index = prev.blocks.findIndex((block) => block.id === id);
      if (index === -1) {
        return prev;
      }

      const clone = {
        ...prev.blocks[index],
        id: createBlockId()
      } as EditorBlock;

      const nextBlocks = [...prev.blocks];
      nextBlocks.splice(index + 1, 0, clone);
      setSelectedBlockId(clone.id);
      return { ...prev, blocks: nextBlocks };
    });
  }

  function updateBlock(id: string, updater: (block: EditorBlock) => EditorBlock) {
    setPage((prev) => ({
      ...prev,
      blocks: replaceBlock(prev.blocks, id, updater)
    }));
  }

  function updateStyle(id: string, patch: Partial<EditorBlockStyle>) {
    updateBlock(id, (block) => ({
      ...block,
      style: {
        ...block.style,
        ...patch
      }
    }));
  }

  function moveSelected(direction: 'up' | 'down') {
    if (!selectedBlockId) {
      return;
    }

    setPage((prev) => {
      const index = prev.blocks.findIndex((block) => block.id === selectedBlockId);
      if (index === -1) {
        return prev;
      }

      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      return { ...prev, blocks: moveBlock(prev.blocks, index, targetIndex) };
    });
  }

  function resetEditor() {
    const next = createDefaultPageData();
    setPage(next);
    setSelectedBlockId(next.blocks[0]?.id ?? null);
  }

  function exportJson() {
    const blob = new Blob([JSON.stringify(page, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'editor-page.json';
    link.click();
    URL.revokeObjectURL(url);
  }

  function onImportClick() {
    fileInputRef.current?.click();
  }

  function importJson(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result)) as EditorPageData;
        if (parsed.version !== 1 || !Array.isArray(parsed.blocks)) {
          alert('Geçersiz editor JSON dosyası.');
          return;
        }

        setPage(parsed);
        setSelectedBlockId(parsed.blocks[0]?.id ?? null);
      } catch {
        alert('JSON dosyası okunamadı.');
      }
    };
    reader.readAsText(file);
    event.target.value = '';
  }

  return (
    <div className="mx-auto max-w-[1400px] px-4 py-6 md:px-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-slate-900">MVP Görsel Editor</h1>
        <div className="flex flex-wrap items-center gap-2">
          <button onClick={exportJson} className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm hover:bg-slate-50">JSON Export</button>
          <button onClick={onImportClick} className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm hover:bg-slate-50">JSON Import</button>
          <button onClick={resetEditor} className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 hover:bg-red-100">Sıfırla</button>
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="application/json"
        onChange={importJson}
        className="hidden"
        aria-label="JSON dosyası seç"
        title="JSON dosyası seç"
      />

      <div className="grid gap-4 lg:grid-cols-[280px_1fr_340px]">
        <aside className="rounded-xl border border-slate-200 bg-white p-4">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-600">Blok Ekle</h2>
          <div className="grid grid-cols-2 gap-2">
            {BLOCK_OPTIONS.map((option) => (
              <button
                key={option.value}
                onClick={() => addBlock(option.value)}
                className="rounded-md border border-slate-200 bg-slate-50 px-2 py-2 text-sm hover:bg-slate-100"
              >
                {option.label}
              </button>
            ))}
          </div>

          <h3 className="mb-2 mt-6 text-sm font-semibold uppercase tracking-wide text-slate-600">Blok Listesi</h3>
          <div className="space-y-2">
            {page.blocks.map((block, index) => (
              <button
                key={block.id}
                onClick={() => setSelectedBlockId(block.id)}
                className={`flex w-full items-center justify-between rounded-md border px-3 py-2 text-left text-sm ${
                  block.id === selectedBlockId ? 'border-blue-500 bg-blue-50' : 'border-slate-200 bg-white hover:bg-slate-50'
                }`}
              >
                <span>{index + 1}. {block.type}</span>
              </button>
            ))}
          </div>
        </aside>

        <section className="rounded-xl border border-slate-200 bg-white p-4">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-600">Canlı Önizleme</h2>
            {selectedBlock && (
              <div className="flex items-center gap-2">
                <button onClick={() => moveSelected('up')} className="rounded-md border border-slate-300 px-2 py-1 text-xs hover:bg-slate-50">Yukarı</button>
                <button onClick={() => moveSelected('down')} className="rounded-md border border-slate-300 px-2 py-1 text-xs hover:bg-slate-50">Aşağı</button>
                <button onClick={() => duplicateBlock(selectedBlock.id)} className="rounded-md border border-slate-300 px-2 py-1 text-xs hover:bg-slate-50">Kopyala</button>
                <button onClick={() => removeBlock(selectedBlock.id)} className="rounded-md border border-red-200 bg-red-50 px-2 py-1 text-xs text-red-700 hover:bg-red-100">Sil</button>
              </div>
            )}
          </div>

          <div className="min-h-[560px] rounded-lg border border-dashed border-slate-300 bg-slate-50 p-6">
            <EditorRenderer
              page={page}
              selectedBlockId={selectedBlockId}
              onSelectBlock={setSelectedBlockId}
              className="mx-auto max-w-4xl"
            />
          </div>
        </section>

        <aside className="rounded-xl border border-slate-200 bg-white p-4">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-600">Stil Paneli</h2>
          {!selectedBlock && <p className="text-sm text-slate-500">Düzenlemek için bir blok seçin.</p>}

          {selectedBlock && (
            <div className="space-y-3">
              {(selectedBlock.type === 'div' || selectedBlock.type === 'heading' || selectedBlock.type === 'paragraph') && (
                <label className="block text-xs font-medium text-slate-600">
                  Metin
                  <textarea
                    value={selectedBlock.content}
                    onChange={(event) => updateBlock(selectedBlock.id, (block) => ({ ...block, content: event.target.value } as EditorBlock))}
                    className="mt-1 w-full rounded-md border border-slate-300 px-2 py-2 text-sm"
                    rows={4}
                  />
                </label>
              )}

              {selectedBlock.type === 'button' && (
                <>
                  <label className="block text-xs font-medium text-slate-600">
                    Buton Yazısı
                    <input
                      value={selectedBlock.label}
                      onChange={(event) => updateBlock(selectedBlock.id, (block) => ({ ...block, label: event.target.value } as EditorBlock))}
                      className="mt-1 w-full rounded-md border border-slate-300 px-2 py-2 text-sm"
                    />
                  </label>
                  <label className="block text-xs font-medium text-slate-600">
                    Link
                    <input
                      value={selectedBlock.href}
                      onChange={(event) => updateBlock(selectedBlock.id, (block) => ({ ...block, href: event.target.value } as EditorBlock))}
                      className="mt-1 w-full rounded-md border border-slate-300 px-2 py-2 text-sm"
                    />
                  </label>
                </>
              )}

              {selectedBlock.type === 'image' && (
                <>
                  <label className="block text-xs font-medium text-slate-600">
                    Görsel URL
                    <input
                      value={selectedBlock.src}
                      onChange={(event) => updateBlock(selectedBlock.id, (block) => ({ ...block, src: event.target.value } as EditorBlock))}
                      className="mt-1 w-full rounded-md border border-slate-300 px-2 py-2 text-sm"
                    />
                  </label>
                  <label className="block text-xs font-medium text-slate-600">
                    Alt Metni
                    <input
                      value={selectedBlock.alt}
                      onChange={(event) => updateBlock(selectedBlock.id, (block) => ({ ...block, alt: event.target.value } as EditorBlock))}
                      className="mt-1 w-full rounded-md border border-slate-300 px-2 py-2 text-sm"
                    />
                  </label>
                </>
              )}

              <div className="grid grid-cols-2 gap-2">
                <label className="block text-xs font-medium text-slate-600">
                  Yazı Rengi
                  <input
                    type="color"
                    value={selectedBlock.style.textColor ?? '#111827'}
                    onChange={(event) => updateStyle(selectedBlock.id, { textColor: event.target.value })}
                    className="mt-1 h-10 w-full rounded-md border border-slate-300"
                  />
                </label>
                <label className="block text-xs font-medium text-slate-600">
                  Arka Plan
                  <input
                    type="color"
                    value={selectedBlock.style.backgroundColor ?? '#ffffff'}
                    onChange={(event) => updateStyle(selectedBlock.id, { backgroundColor: event.target.value })}
                    className="mt-1 h-10 w-full rounded-md border border-slate-300"
                  />
                </label>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <label className="block text-xs font-medium text-slate-600">
                  Font Size
                  <input
                    type="number"
                    min={8}
                    max={120}
                    value={selectedBlock.style.fontSize ?? 16}
                    onChange={(event) => updateStyle(selectedBlock.id, { fontSize: Number(event.target.value) })}
                    className="mt-1 w-full rounded-md border border-slate-300 px-2 py-2 text-sm"
                  />
                </label>
                <label className="block text-xs font-medium text-slate-600">
                  Font Weight
                  <select
                    value={selectedBlock.style.fontWeight ?? '400'}
                    onChange={(event) => updateStyle(selectedBlock.id, { fontWeight: event.target.value as EditorBlockStyle['fontWeight'] })}
                    className="mt-1 w-full rounded-md border border-slate-300 px-2 py-2 text-sm"
                  >
                    {FONT_WEIGHTS.map((weight) => (
                      <option key={weight} value={weight}>{weight}</option>
                    ))}
                  </select>
                </label>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <label className="block text-xs font-medium text-slate-600">
                  Padding
                  <input
                    type="number"
                    min={0}
                    max={240}
                    value={selectedBlock.style.padding ?? 0}
                    onChange={(event) => updateStyle(selectedBlock.id, { padding: Number(event.target.value) })}
                    className="mt-1 w-full rounded-md border border-slate-300 px-2 py-2 text-sm"
                  />
                </label>
                <label className="block text-xs font-medium text-slate-600">
                  Margin
                  <input
                    type="number"
                    min={0}
                    max={240}
                    value={selectedBlock.style.margin ?? 0}
                    onChange={(event) => updateStyle(selectedBlock.id, { margin: Number(event.target.value) })}
                    className="mt-1 w-full rounded-md border border-slate-300 px-2 py-2 text-sm"
                  />
                </label>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <label className="block text-xs font-medium text-slate-600">
                  Border Width
                  <input
                    type="number"
                    min={0}
                    max={24}
                    value={selectedBlock.style.borderWidth ?? 0}
                    onChange={(event) => updateStyle(selectedBlock.id, { borderWidth: Number(event.target.value) })}
                    className="mt-1 w-full rounded-md border border-slate-300 px-2 py-2 text-sm"
                  />
                </label>
                <label className="block text-xs font-medium text-slate-600">
                  Border Radius
                  <input
                    type="number"
                    min={0}
                    max={120}
                    value={selectedBlock.style.borderRadius ?? 0}
                    onChange={(event) => updateStyle(selectedBlock.id, { borderRadius: Number(event.target.value) })}
                    className="mt-1 w-full rounded-md border border-slate-300 px-2 py-2 text-sm"
                  />
                </label>
              </div>

              <label className="block text-xs font-medium text-slate-600">
                Border Rengi
                <input
                  type="color"
                  value={selectedBlock.style.borderColor ?? '#d1d5db'}
                  onChange={(event) => updateStyle(selectedBlock.id, { borderColor: event.target.value })}
                  className="mt-1 h-10 w-full rounded-md border border-slate-300"
                />
              </label>

              <div className="grid grid-cols-2 gap-2">
                <label className="block text-xs font-medium text-slate-600">
                  Hizalama
                  <select
                    value={selectedBlock.style.textAlign ?? 'left'}
                    onChange={(event) => updateStyle(selectedBlock.id, { textAlign: event.target.value as EditorBlockStyle['textAlign'] })}
                    className="mt-1 w-full rounded-md border border-slate-300 px-2 py-2 text-sm"
                  >
                    {TEXT_ALIGN_OPTIONS.map((align) => (
                      <option key={align} value={align}>{align}</option>
                    ))}
                  </select>
                </label>

                <label className="block text-xs font-medium text-slate-600">
                  Max Width
                  <input
                    type="number"
                    min={0}
                    max={1600}
                    value={selectedBlock.style.maxWidth ?? 0}
                    onChange={(event) => updateStyle(selectedBlock.id, { maxWidth: Number(event.target.value) || undefined })}
                    className="mt-1 w-full rounded-md border border-slate-300 px-2 py-2 text-sm"
                  />
                </label>
              </div>

              {selectedBlock.type === 'spacer' && (
                <label className="block text-xs font-medium text-slate-600">
                  Spacer Height
                  <input
                    type="number"
                    min={0}
                    max={600}
                    value={selectedBlock.style.height ?? 40}
                    onChange={(event) => updateStyle(selectedBlock.id, { height: Number(event.target.value) })}
                    className="mt-1 w-full rounded-md border border-slate-300 px-2 py-2 text-sm"
                  />
                </label>
              )}
            </div>
          )}
        </aside>
      </div>

      <p className="mt-4 text-xs text-slate-500">
        Bu MVP editor localStorage üzerinde çalışır. JSON export/import ile diğer projelere taşıyabilirsiniz.
      </p>
    </div>
  );
}
