import { createContext, useContext, useState, ReactNode } from 'react';
import { translations, type Language } from './translations';

type TranslationSet = {
  [K in keyof typeof translations['es']]: {
    [P in keyof typeof translations['es'][K]]: string;
  };
};

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: TranslationSet;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Language>('es');

  return (
    <LanguageContext.Provider value={{ lang, setLang, t: translations[lang] }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within LanguageProvider');
  return context;
}
