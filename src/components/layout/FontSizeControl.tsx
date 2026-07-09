import React, { useState, useEffect } from 'react';
import { ZoomIn, ZoomOut } from 'lucide-react';

let selectedFontSize = 100;

const FontSizeControl: React.FC = () => {
  const [fontSize, setFontSize] = useState<number>(selectedFontSize); // Porcentagem do tamanho original

  useEffect(() => {
    const previousFontSize = document.documentElement.style.fontSize;

    return () => {
      document.documentElement.style.fontSize = previousFontSize;
    };
  }, []);

  useEffect(() => {
    selectedFontSize = fontSize;
    // Aplica o tamanho da fonte ao elemento raiz (html)
    // Isso faz com que todas as unidades 'rem' do site aumentem proporcionalmente
    document.documentElement.style.fontSize = `${fontSize}%`;
  }, [fontSize]);

  const increaseFontSize = () => {
    setFontSize((prev) => Math.min(prev + 10, 180)); // Limite máximo de 175%
  };

  const decreaseFontSize = () => {
    setFontSize((prev) => Math.max(prev - 10, 100)); // Limite mínimo de 100%
  };

  return (
    <div className="fixed right-0 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-2 p-2 bg-white/80 backdrop-blur-sm border-l border-y border-gray-200 rounded-l-xl shadow-lg">
      <button
        onClick={increaseFontSize}
        className="p-2 bg-[#CC141D] text-white rounded-lg hover:bg-[#AF1816] transition-colors shadow-sm flex items-center justify-center"
        title="Aumentar texto"
        aria-label="Aumentar tamanho do texto"
      >
        <ZoomIn size={24} />
      </button>
      <button
        onClick={decreaseFontSize}
        className="p-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors shadow-sm flex items-center justify-center"
        title="Diminuir texto"
        aria-label="Diminuir tamanho do texto"
      >
        <ZoomOut size={24} />
      </button>
    </div>
  );
};

export default FontSizeControl;
