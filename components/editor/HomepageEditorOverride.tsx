'use client';

import { ReactNode, useEffect, useState } from 'react';
import EditorRenderer from '@/components/editor/EditorRenderer';
import { loadEditorPage } from '@/lib/editor/storage';
import { EditorPageData } from '@/lib/editor/types';

interface HomepageEditorOverrideProps {
  children: ReactNode;
}

export default function HomepageEditorOverride({ children }: HomepageEditorOverrideProps) {
  const [hydrated, setHydrated] = useState(false);
  const [customPage, setCustomPage] = useState<EditorPageData | null>(null);

  useEffect(() => {
    setHydrated(true);
    setCustomPage(loadEditorPage());
  }, []);

  if (!hydrated || !customPage || customPage.blocks.length === 0) {
    return <>{children}</>;
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 md:px-8">
      <div className="mx-auto mb-6 max-w-5xl rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
        Bu ana sayfa local editor verisi ile gösteriliyor. Düzenlemek için /tr/editor sayfasını kullanabilirsiniz.
      </div>
      <div className="mx-auto max-w-5xl rounded-xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
        <EditorRenderer page={customPage} className="space-y-1" />
      </div>
    </main>
  );
}
