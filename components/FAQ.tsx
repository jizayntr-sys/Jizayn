'use client';

import { useState } from 'react';
import { Plus, Minus } from 'lucide-react';

type FAQItem = {
  question: string;
  answer: string;
};

type Props = {
  items: FAQItem[];
  title: string;
};

export default function FAQ({ items, title }: Props) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="max-w-3xl mx-auto">
      <h2 className="text-3xl font-bold text-gray-900 mb-10 text-center">{title}</h2>
      <div className="space-y-4">
        {items.map((item, index) => (
          <div 
            key={index} 
            className={`border border-gray-200 rounded-2xl overflow-hidden transition-all duration-300 ${openIndex === index ? 'bg-gray-50 border-gray-300 shadow-sm' : 'bg-white hover:border-gray-300'}`}
          >
            <button
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
            >
              <span className="font-semibold text-gray-900 text-lg">{item.question}</span>
              {openIndex === index ? <Minus className="w-5 h-5 text-indigo-600 flex-shrink-0" /> : <Plus className="w-5 h-5 text-gray-400 flex-shrink-0" />}
            </button>
            
            <div className={`px-6 text-gray-600 leading-relaxed overflow-hidden transition-all duration-300 ${openIndex === index ? 'max-h-96 pb-6 opacity-100' : 'max-h-0 opacity-0'}`}>
              {item.answer}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}