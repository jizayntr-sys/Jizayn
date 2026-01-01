'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { FaqItem } from '@/types/product';

interface FaqAccordionProps {
  items?: FaqItem[];
  title: string;
}

export default function FaqAccordion({ items, title }: FaqAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const handleToggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  if (!items || items.length === 0) {
    return null;
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };

  return (
    <div className="mt-16 border-t border-gray-200 pt-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <h2 className="text-2xl font-bold text-gray-900 mb-8">{title}</h2>
      <div className="space-y-4">
        {items.map((item, index) => (
          <div key={index} className="border border-gray-200 rounded-lg overflow-hidden bg-white">
            <button
              onClick={() => handleToggle(index)}
              className="w-full flex justify-between items-center p-5 text-left font-medium text-gray-900 hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-inset"
              aria-expanded={openIndex === index}
              aria-controls={`faq-answer-${index}`}
            >
              <span>{item.question}</span>
              <ChevronDown
                className={`w-5 h-5 transition-transform duration-300 ${openIndex === index ? 'rotate-180' : ''}`}
              />
            </button>
            {openIndex === index && (
              <div id={`faq-answer-${index}`} className="p-5 pt-0 text-gray-600 leading-relaxed">
                <p>{item.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}