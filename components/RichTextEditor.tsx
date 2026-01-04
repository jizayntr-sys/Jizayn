'use client';

import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

interface RichTextEditorProps {
  name: string;
  value?: string;
  placeholder?: string;
  required?: boolean;
  onChange?: (value: string) => void;
}

export default function RichTextEditor({ 
  name, 
  value = '', 
  placeholder = 'Metin girin...',
  required = false,
  onChange
}: RichTextEditorProps) {
  const [editorValue, setEditorValue] = useState(value);
  const hiddenInputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setEditorValue(value);
  }, [value]);

  const handleChange = (content: string) => {
    setEditorValue(content);
    if (hiddenInputRef.current) {
      hiddenInputRef.current.value = content;
    }
    onChange?.(content);
  };

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'indent': '-1'}, { 'indent': '+1' }],
      ['link'],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'align': [] }],
      ['clean']
    ],
  };

  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'list', 'bullet', 'indent',
    'link',
    'color', 'background',
    'align'
  ];

  return (
    <div className="relative">
      <ReactQuill
        theme="snow"
        value={editorValue}
        onChange={handleChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
        className="bg-white"
        style={{ minHeight: '200px' }}
      />
      <textarea
        ref={hiddenInputRef}
        name={name}
        value={editorValue}
        required={required}
        className="hidden"
        readOnly
      />
    </div>
  );
}
