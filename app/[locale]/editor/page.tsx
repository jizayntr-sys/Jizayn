import { Metadata } from 'next';
import MvpEditor from '@/components/editor/MvpEditor';

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

export default function EditorPage() {
  return <MvpEditor />;
}
