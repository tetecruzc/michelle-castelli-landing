import bookAutobiografia from '@/assets/book-autobiografia.jpg';
import bookDiaspora from '@/assets/book-diaspora.jpg';
import bookFiabe from '@/assets/book-fiabe.jpg';

export type BookAction = 'buy' | 'download' | 'not-digitized';

export interface BookImage {
  src: string;
  caption: { es: string; it: string };
}

export interface Book {
  id: string;
  title: { es: string; it: string };
  description: { es: string; it: string };
  cover: string;
  /** Storage path inside the `book-covers` bucket, if uploaded via the panel. */
  coverPath?: string;
  year: number;
  action: BookAction;
  buyLinks?: {
    ves?: string;
    usd?: string;
  };
  downloadUrl?: string;
  images?: BookImage[];
}

/** Fila de la tabla `books` en Supabase */
export interface BookRow {
  id: string;
  title: { es: string; it: string };
  description: { es: string; it: string };
  cover_url: string;
  year: number;
  action: BookAction;
  buy_links?: { ves?: string; usd?: string } | null;
  download_url?: string | null;
  images?: BookImage[] | null;
}

/** Convierte una fila de Supabase en el tipo Book de la app */
export function mapBookRowToBook(row: BookRow): Book {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    cover: row.cover_url,
    coverPath: row.cover_url,
    year: row.year,
    action: row.action,
    buyLinks: row.buy_links ?? undefined,
    downloadUrl: row.download_url ?? undefined,
    images: row.images ?? undefined,
  };
}

export const books: Book[] = [
  {
    id: 'diaspora-es',
    title: {
      es: 'Diáspora – Cuentos de Emigración',
      it: 'Diaspora – Racconti di Emigrazione',
    },
    description: {
      es: 'Tres relatos que reflejan el impacto de la inmigración italiana en Venezuela, entre sueños, sacrificios y legado. Una conmovedora historia sobre la diáspora italiana a Venezuela en los años 50, narrada con sensibilidad y profundidad por Michele Castelli.',
      it: 'Tre racconti che riflettono l\'impatto dell\'immigrazione italiana in Venezuela, tra sogni, sacrifici e eredità. Una commovente storia sulla diaspora italiana in Venezuela negli anni \'50, narrata con sensibilità e profondità da Michele Castelli.',
    },
    cover: bookDiaspora,
    year: 2020,
    action: 'buy',
    buyLinks: {
      ves: 'https://amazon.com',
      usd: 'https://amazon.com',
    },
    images: [
      { src: bookDiaspora, caption: { es: 'Portada edición en español', it: 'Copertina edizione in spagnolo' } },
    ],
  },
  {
    id: 'diaspora-pt',
    title: {
      es: 'Diaspora – Versão em Português',
      it: 'Diaspora – Versione in Portoghese',
    },
    description: {
      es: 'Versión en portugués de los relatos de emigración italiana a Venezuela. Três relatos que refletem o impacto da imigração italiana na Venezuela, entre sonhos, sacrifícios e legado.',
      it: 'Versione in portoghese dei racconti di emigrazione italiana in Venezuela. Tre racconti che riflettono l\'impatto dell\'immigrazione italiana in Venezuela.',
    },
    cover: bookDiaspora,
    year: 2021,
    action: 'buy',
    buyLinks: {
      ves: 'https://amazon.com',
      usd: 'https://amazon.com',
    },
  },
  {
    id: 'autobiografia',
    title: {
      es: 'Autobiografía',
      it: 'Autobiografia',
    },
    description: {
      es: 'Un recorrido íntimo por la vida de Michele Castelli, desde su infancia en Santa Croce di Magliano hasta su carrera académica en Venezuela. Memorias, reflexiones y vivencias que marcaron su trayectoria como escritor y lingüista.',
      it: 'Un percorso intimo nella vita di Michele Castelli, dalla sua infanzia a Santa Croce di Magliano alla sua carriera accademica in Venezuela. Memorie, riflessioni e esperienze che hanno segnato il suo percorso come scrittore e linguista.',
    },
    cover: bookAutobiografia,
    year: 2018,
    action: 'buy',
    buyLinks: {
      ves: 'https://amazon.com',
      usd: 'https://amazon.com',
    },
    images: [
      { src: bookAutobiografia, caption: { es: 'Portada del libro', it: 'Copertina del libro' } },
    ],
  },
  {
    id: 'fiabe',
    title: {
      es: 'Dieci Fiabe per i miei Nipotini',
      it: 'Dieci Fiabe per i miei Nipotini',
    },
    description: {
      es: 'Diez fábulas escritas con cariño para sus nietos. Historias llenas de imaginación, valores y la tradición oral italiana, adaptadas para las nuevas generaciones.',
      it: 'Dieci fiabe scritte con affetto per i suoi nipotini. Storie piene di immaginazione, valori e tradizione orale italiana, adattate per le nuove generazioni.',
    },
    cover: bookFiabe,
    year: 2015,
    action: 'download',
    downloadUrl: '#',
  },
  {
    id: 'tesoro-sfumato',
    title: {
      es: 'Il Tesoro Sfumato',
      it: 'Il Tesoro Sfumato',
    },
    description: {
      es: 'Una novela que explora las raíces y tradiciones de los pueblos del sur de Italia, entrelazando historia y ficción en una narrativa cautivadora sobre tesoros perdidos y memorias ancestrales.',
      it: 'Un romanzo che esplora le radici e le tradizioni dei paesi del sud Italia, intrecciando storia e finzione in una narrativa avvincente su tesori perduti e memorie ancestrali.',
    },
    cover: bookDiaspora,
    year: 2012,
    action: 'buy',
    buyLinks: {
      usd: 'https://amazon.com',
    },
  },
  {
    id: 'santa-croce',
    title: {
      es: 'Santa Croce di Magliano: Historia y Memoria',
      it: 'Santa Croce di Magliano: Storia e Memoria',
    },
    description: {
      es: 'Un estudio profundo sobre el pueblo natal del autor, sus costumbres, su gente y la historia que moldeó generaciones de emigrantes italianos.',
      it: 'Uno studio approfondito sul paese natale dell\'autore, le sue usanze, la sua gente e la storia che ha plasmato generazioni di emigranti italiani.',
    },
    cover: bookAutobiografia,
    year: 2008,
    action: 'not-digitized',
  },
  {
    id: 'dialetti-molisani',
    title: {
      es: 'Dialectos Molisanos en Venezuela',
      it: 'Dialetti Molisani in Venezuela',
    },
    description: {
      es: 'Investigación sociolingüística sobre la evolución y preservación de los dialectos molisanos en las comunidades italianas de Venezuela. Un trabajo académico de referencia.',
      it: 'Ricerca sociolinguistica sull\'evoluzione e la preservazione dei dialetti molisani nelle comunità italiane del Venezuela. Un lavoro accademico di riferimento.',
    },
    cover: bookFiabe,
    year: 2005,
    action: 'not-digitized',
  },
  {
    id: 'poeti-dialettali',
    title: {
      es: 'Poetas Dialectales del Molise',
      it: 'Poeti Dialettali del Molise',
    },
    description: {
      es: 'Antología y estudio crítico de los poetas dialectales de la región del Molise, rescatando voces literarias que forman parte del patrimonio cultural italiano.',
      it: 'Antologia e studio critico dei poeti dialettali della regione Molise, recuperando voci letterarie che fanno parte del patrimonio culturale italiano.',
    },
    cover: bookDiaspora,
    year: 2000,
    action: 'download',
    downloadUrl: '#',
  },
  {
    id: 'fonetica-comparada',
    title: {
      es: 'Fonética Comparada: Italiano-Español',
      it: 'Fonetica Comparata: Italiano-Spagnolo',
    },
    description: {
      es: 'Manual académico de fonética y fonología comparada entre el italiano y el español, resultado de décadas de investigación y enseñanza universitaria.',
      it: 'Manuale accademico di fonetica e fonologia comparata tra italiano e spagnolo, risultato di decenni di ricerca e insegnamento universitario.',
    },
    cover: bookFiabe,
    year: 1995,
    action: 'not-digitized',
  }
];
