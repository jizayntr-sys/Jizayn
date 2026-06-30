import { EDITOR_STORAGE_KEY, EditorPageData } from './types';

export function loadEditorPage(): EditorPageData | null {
  if (typeof window === 'undefined') {
    return null;
  }

  const raw = window.localStorage.getItem(EDITOR_STORAGE_KEY);
  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw) as EditorPageData;
    if (parsed?.version === 1 && Array.isArray(parsed.blocks)) {
      return parsed;
    }
  } catch {
    return null;
  }

  return null;
}

export function saveEditorPage(page: EditorPageData) {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(EDITOR_STORAGE_KEY, JSON.stringify(page));
}
