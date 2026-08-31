import { createClient } from '@supabase/supabase-js';
import fs from 'fs/promises';
import path from 'path';
import { config } from 'dotenv';
import WebSocket from 'ws';

(global as any).WebSocket = WebSocket;
config({ path: '.env.local' });

// Initialize Supabase Client
const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
// We use the anon key for simplicity, assuming RLS allows it or we have service_role
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_PUBLISHABLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing VITE_SUPABASE_URL or VITE_SUPABASE_PUBLISHABLE_KEY");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const BASE_DIR = '/Users/stephaniecruz/Documents/NONNO OBRAS - RESPALDO/OBRAS';
const BUCKET_COVERS = 'book-covers';
const BUCKET_FILES = 'book-covers'; // Or change to 'book-files' if you created it

// Provided books data
const booksData = [
    {
        id: 35,
        name: 'Michele Castelli - Autobiografía',
        filter: 'inedit',
        categories: ['italian'],
        description: [{text: `books.id35.description[0].text`}],
        top: true
    },
    {
        id: 29,
        name: 'Dieci fiabe per i miei nipotini',
        filter: 'inedit',
        categories: ['italian'],
        description: [{text: `books.id29.description[0].text`}],
        top: true
    },
    {
        id: 30,
        name: 'IL TESORO SFUMATO',
        filter: 'inedit',
        categories: ['italian'],
        ignoreDownload: false,
        description: [{text: `books.id30.description[0].text`}],
        top: true
    },
    {
        id: 28,
        name: 'DIÁSPORA. Cuentos de emigración. Versión en español',
        filter: 'published',
        categories: ['spanish'],
        ignoreDownload: true,
        buyLink: 'https://a.co/d/i1w8PYA',
        description: [{text: `books.id28.description[0].text`}],
        top: true
    },
    {
        id: 33,
        name: 'DIÁSPORA. Cuentos de emigración. Versión en italiano',
        filter: 'published',
        categories: ['italian'],
        ignoreDownload: false,
        description: [{text: `books.id28.description[0].text`}],
        top: true
    },
    {
        id: 34,
        name: 'DIÁSPORA. Cuentos de emigración. Versión en Portugués.',
        filter: 'published',
        categories: ['translated'],
        ignoreDownload: true,
        buyLink: 'https://a.co/d/0nZ6GGu',
        description: [{text: `books.id28.description[0].text`}],
        top: true
    },
    {
        id: 31,
        name: 'Con los ojos de Agnese',
        filter: 'published',
        categories: ['spanish','translated'],
        ignoreDownload: true,
        buyLink: 'Amazon.com/author/rita-frattolillo',
        description: [{text: `books.id31.description[0].text`}],
        top: true
    },
    {
        id: 32,
        name: 'C’era una volta... Giuseppe',
        filter: 'inedit',
        categories: ['italian'],
        description: [{text: `books.id32.description[0].text`}],
        top: true
    },
    {
        id:10,
        filter: 'published',
        name: 'Curso de fonética del español de Venezuela',
        categories: ['spanish'],
        top: true,
        description: [{text: 'books.id10.description[0].text'}, {text: 'books.id10.description[1].text'}],
    },
    {
        id: 15,
        filter: 'published',
        name: 'Antologia Poetica Dialectale, di Raffaele Caprigliore',
        categories: ['dialecto'],
        top: true,
        description: [{text: 'books.id15.description[0].text'}],
    },
    {
        id: 6,
        name: 'Il lessico Santacrocese',
        filter: 'published',
        top: true,
        categories: ['dialecto'],
        description: [{text: `books.id6.description[0].text`}],
    },
    {
        id: 9,
        name: 'Cuentos de inmigrantes',
        filter: 'published',
        categories: ['spanish'],
        top: true,
        description: [{text: `books.id9.description[0].text`}],
    },
    {
        id: 16,
        filter: 'published',
        top: true,
        name: `"Italiani mata burros" e altre storie di migranti in Venezuela`,
        categories: ['italian'],
        description: [{text: 'books.id16.description[0].text'}, {text: 'books.id16.description[1].text'}],
    },
    {
        id: 5,
        filter: 'published',
        name: 'Hámichel. Nicola Iacobacci',
        categories: ['translated'],
        description: [{text: `books.id5.description[0].text`}],
        top: true,
    },
    {
        id: 24,
        name: 'Grammatica comparata italiano-santacrocese',
        filter: 'published',
        categories: ['dialecto'],
        description: [{text: 'books.id24.description[0].text'}],
    },
    {
        id: 1,
        filter: 'published',
        categories: ['italian'],
        name: 'La presenza dei molisani in venezuela',
        top: false,
        description: [{text: 'books.id1.description[0].text'}],
    },
    {
        id:2,
        filter: 'published',
        name: 'La vida fantástica de Corrado Galzio',
        categories: ['spanish'],
        top: false,
        description: [{text: 'books.id2.description[0].text'}],
    },
    {
        id: 3,
        name: 'In nome del padre (C’era una vola... Giuseppe)',
        filter: 'published',
        categories: ['italian'],
        top: false,
        description: [{text: 'books.id3.description[0].text'}],
    },
    {
        id: 4,
        name: 'Le poesie dialettali di Pietro Mastrangelo',
        top: false,
        filter: 'published',
        categories: ['dialecto'],
        description: [{text: 'books.id4.description[0].text'}],
    },
    {
        id: 7,
        name: 'Cuentos de mi vida',
        filter: 'published',
        categories: ['spanish'],
        top: false,
        description: [{text: `books.id7.description[0].text`}],
    },
    {
        id: 8,
        name: 'Erase una vez Giuseppe',
        filter: 'inedit',
        categories: ['spanish'],
        noDigitized: true,
        top: false,
        description: [{text: `books.id8.description[0].text`}],
    },
    {
        id: 11,
        name: 'Novelle Scelte di Hector Mujica',
        filter: 'published',
        noDigitized: false,
        categories: ['translated'],
        description: [{text: `books.id11.description[0].text`}],
    },
    {
        id: 12,
        name: `Poesías. Nicola Iacobacci`,
        noDigitized: true,
        categories: ['translated'],
        filter: 'published',
        description: [{text: `books.id12.description[0].text`}],
    },
    {
        id: 13,
        name: `La rampicante. Romulo Gallegos`,
        noDigitized: false,
        filter: 'published',
        categories: ['translated'],
        description: [{text:`books.id13.description[0].text`}],
    },
    {
        id: 17,
        filter: 'published',
        name: `Poesie e canzoni inedite di Pietro Mastrangelo`,
        categories: ['dialecto'],
        description: [{text: `books.id17.description[0].text`}, {text: `books.id17.description[1].text`}],
    },
    {
        id: 18,
        filter: 'inedit',
        name: `Poesie dialetali scelte di Francesco Cocco`,
        categories: ['dialecto'],
        description: [{text: `books.id18.description[0].text`}],
    },
    {
        id: 19,
        filter: 'inedit',
        name: `Cómo leer y escribir el italiano`,
        categories :['spanish'],
        description: [{text: `books.id19.description[0].text`}],
    },
    {
        id: 20,
        filter: 'inedit',
        name: `Racconti di vita. Prima parte`,
        categories: ['italian'],
        description: [{text:`books.id20.description[0].text`}],
    },
    {
        id: 36,
        filter: 'inedit',
        name: `Racconti di vita. Seconda parte`,
        categories: ['italian'],
        noDigitized: true,
    },
    {
        id: 21,
        filter: 'inedit',
        name: `Modi di dire, espressioni, indovinelli, giochi, filastrocche, metafore ed altro del dialetto di Santa Croce di Magliano`,
        categories: ['dialecto'],
        description: [{text: `books.id21.description[0].text`}],
    },
    {
        id: 22,
        filter: 'inedit',
        name: 'Cuentos de mi vida. Parte II',
        categories: ['spanish'],
        description: [{text: 'books.id22.description[0].text'}],
    },
    {
        id: 23,
        name: 'Ce stéve na vòte',
        filter: 'published',
        categories: ['dialecto'],
        description: [{text: 'books.id23.description[0].text'}],
    },
    {
        id: 25,
        name: `Nove poesie dialettali di Italo D'onofrio`,
        filter: 'inedit',
        categories: ['dialecto'],
        description: [{text: `books.id25.description[0].text`}],
    },
    {
        id: 26,
        name: 'Il poeta del molise: Nicola Iacobacci vita e opere',
        filter: 'published',
        noDigitized: true,
        categories: ['italian'],
        description: [{text: `books.id26.description[0].text`}],
    },
    {
        id: 27,
        name: 'Dizionario essenziale Italiano-Santacrocese',
        filter: 'published',
        categories: ['dialecto'],
        description: [
            {text: `books.id27.description[0].text`},
            {text: `books.id27.description[1].text`},
            {text: `books.id27.description[2].text`},
            {text: `books.id27.description[3].text`},
        ]
    }
];

const generateSlug = (text: string) => {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-');
};

const getContentType = (filename: string) => {
  const ext = path.extname(filename).toLowerCase();
  if (ext === '.png') return 'image/png';
  if (ext === '.jpg' || ext === '.jpeg') return 'image/jpeg';
  if (ext === '.pdf') return 'application/pdf';
  return 'application/octet-stream';
};

async function uploadFile(filePath: string, bucket: string, destPath: string) {
  try {
    const fileData = await fs.readFile(filePath);
    const contentType = getContentType(filePath);
    
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(destPath, fileData, {
        contentType,
        upsert: true
      });
      
    if (error) {
      console.error(`Error uploading ${filePath}:`, error.message);
      return null;
    }
    
    // For public buckets, we might just use the path. The frontend will resolve it.
    return destPath;
  } catch (err: any) {
    if (err.code === 'ENOENT') {
      return null; // File doesn't exist, which is fine
    }
    console.error(`Failed to read/upload ${filePath}:`, err);
    return null;
  }
}

async function run() {
  console.log("Starting import...");
  
  for (const book of booksData) {
    console.log(`\nProcessing Book ID: ${book.id} - ${book.name}`);
    const slug = generateSlug(book.name);
    const bookDir = path.join(BASE_DIR, String(book.id));
    
    let coverUrl = '';
    let downloadUrl: string | null = null;
    let galleryImages: { src: string; caption: { es: string; it: string } }[] = [];
    
    try {
      // Check if folder exists
      await fs.access(bookDir);
      
      // Read directory to find files
      const files = await fs.readdir(bookDir);
      
      // Upload Cover
      const coverFile = files.find(f => f === `${book.id}.png` || f === `${book.id}.jpg`);
      if (coverFile) {
        console.log(`Uploading cover: ${coverFile}`);
        const dest = `${slug}-cover-${Date.now()}${path.extname(coverFile)}`;
        const uploadedPath = await uploadFile(path.join(bookDir, coverFile), BUCKET_COVERS, dest);
        if (uploadedPath) coverUrl = uploadedPath;
      }
      
      // Upload PDF
      const pdfFile = files.find(f => f === `${book.id}.pdf`);
      if (pdfFile) {
        console.log(`Uploading PDF: ${pdfFile}`);
        const dest = `${slug}-file-${Date.now()}.pdf`;
        const uploadedPath = await uploadFile(path.join(bookDir, pdfFile), BUCKET_FILES, dest);
        if (uploadedPath) {
          // Get public URL for PDF if bucket is public, or just store path if frontend resolves it.
          // The frontend expects download_url to be an absolute URL in most cases, 
          // let's just create a public URL string.
          const { data } = supabase.storage.from(BUCKET_FILES).getPublicUrl(dest);
          downloadUrl = data.publicUrl;
        }
      }
      
      // Upload Gallery Images
      const galleryFiles = files.filter(f => f.includes('-GALLERY-'));
      for (let i = 0; i < galleryFiles.length; i++) {
        const file = galleryFiles[i];
        console.log(`Uploading gallery image: ${file}`);
        const dest = `${slug}-gallery-${i}-${Date.now()}${path.extname(file)}`;
        const uploadedPath = await uploadFile(path.join(bookDir, file), BUCKET_COVERS, dest);
        if (uploadedPath) {
          galleryImages.push({
            src: uploadedPath,
            caption: { es: '', it: '' } // Legacy didn't seem to have captions directly linked to files here
          });
        }
      }
      
    } catch (err: any) {
      if (err.code === 'ENOENT') {
        console.log(`Folder for book ${book.id} not found. Skipping files.`);
      } else {
        console.error(`Error processing folder for book ${book.id}:`, err);
      }
    }
    
    // Determine action
    let action = 'not-digitized';
    if (book.buyLink) {
      action = 'buy';
    } else if (downloadUrl || book.ignoreDownload === false) {
      action = 'download';
    } else if (book.noDigitized) {
      action = 'not-digitized';
    } else if (book.filter === 'published') {
      action = 'buy'; // fallback
    }

    // Build Row
    const row = {
      id: slug,
      title: { es: book.name, it: book.name }, // Legacy data just has name
      description: { 
        es: book.description ? book.description.map(d => d.text).join('\n') : '', 
        it: book.description ? book.description.map(d => d.text).join('\n') : ''
      },
      cover_url: coverUrl || '',
      year: new Date().getFullYear(), // Legacy doesn't have year
      action: action,
      buy_links: book.buyLink ? { usd: book.buyLink, ves: '' } : null,
      download_url: downloadUrl,
      images: galleryImages.length > 0 ? galleryImages : null,
      categories: book.categories || []
    };
    
    // Insert/Upsert
    console.log(`Inserting/Upserting ${slug}...`);
    const { error } = await supabase.from('books').upsert(row);
    if (error) {
      console.error(`Failed to upsert book ${book.id}:`, error.message);
    } else {
      console.log(`Successfully migrated book ${book.id}`);
    }
  }
  
  console.log("Migration complete.");
}

run();
