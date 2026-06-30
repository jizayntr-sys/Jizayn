'use client';

import { useState } from 'react';
import { Plus, Minus } from 'lucide-react';

type FAQItem = {
  question: string;
  answer: string;
};

export default function ProductFaq({ items }: { items: FAQItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="space-y-3">
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        return (
          <div
            key={index}
            className={`rounded-2xl border overflow-hidden transition-all duration-300 ${
              isOpen
                ? 'border-stone-200 border-l-4 border-l-amber-500 bg-stone-50 shadow-sm'
                : 'border-stone-200 bg-white hover:border-amber-300'
            }`}
          >
            <button
              type="button"
              onClick={() => setOpenIndex(isOpen ? null : index)}
              className="w-full flex items-center justify-between gap-4 p-5 sm:p-6 text-left focus:outline-none"
              aria-expanded={isOpen}
            >
              <span className={`font-semibold text-base sm:text-lg ${isOpen ? 'text-amber-900' : 'text-stone-800'}`}>
                {item.question}
              </span>
              <span
                className={`flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full transition-colors ${
                  isOpen ? 'bg-amber-500 text-white' : 'bg-stone-100 text-stone-500'
                }`}
              >
                {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              </span>
            </button>

            {/* grid-rows tekniği ile yumuşak açılış animasyonu (uzun cevaplarda da çalışır) */}
            <div
              className={`grid transition-all duration-300 ease-out ${
                isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
              }`}
            >
              <div className="overflow-hidden">
                <p className="px-5 sm:px-6 pb-5 sm:pb-6 text-stone-600 leading-relaxed">
                  {item.answer}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
