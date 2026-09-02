import fs from 'fs/promises';
import path from 'path';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_PUBLISHABLE_KEY;
const BUCKET = 'book-covers';

const mapping = {
    "35": "Michele Castelli - Autobiografía",
    "29": "Dieci fiabe per i miei nipotini",
    "30": "IL TESORO SFUMATO",
    "28": "DIÁSPORA. Cuentos de emigración. Versión en español",
    "33": "DIÁSPORA. Cuentos de emigración. Versión en italiano",
    "34": "DIÁSPORA. Cuentos de emigración. Versión en Portugués.",
    "31": "Con los ojos de Agnese",
    "32": "C’era una volta... Giuseppe",
    "10": "Curso de fonética del español de Venezuela",
    "15": "Antologia Poetica Dialectale, di Raffaele Caprigliore",
    "6": "Il lessico Santacrocese",
    "9": "Cuentos de inmigrantes",
    "16": "\"Italiani mata burros\" e altre storie di migranti in Venezuela",
    "5": "Hámichel. Nicola Iacobacci",
    "24": "Grammatica comparata italiano-santacrocese",
    "1": "La presenza dei molisani in venezuela",
    "2": "La vida fantástica de Corrado Galzio",
    "3": "In nome del padre (C’era una vola... Giuseppe)",
    "4": "Le poesie dialettali di Pietro Mastrangelo",
    "7": "Cuentos de mi vida",
    "8": "Erase una vez Giuseppe",
    "11": "Novelle Scelte di Hector Mujica",
    "12": "Poesías. Nicola Iacobacci",
    "13": "La rampicante. Romulo Gallegos",
    "17": "Poesie e canzoni inedite di Pietro Mastrangelo",
    "18": "Poesie dialetali scelte di Francesco Cocco",
    "19": "Cómo leer y escribir el italiano",
    "20": "Racconti di vita. Prima parte",
    "36": "Racconti di vita. Seconda parte",
    "21": "Modi di dire, espressioni, indovinelli, giochi, filastrocche, metafore ed altro del dialetto di Santa Croce di Magliano",
    "22": "Cuentos de mi vida. Parte II",
    "23": "Ce stéve na vòte",
    "25": "Nove poesie dialettali di Italo D'onofrio",
    "26": "Il poeta del molise: Nicola Iacobacci vita e opere",
    "27": "Dizionario essenziale Italiano-Santacrocese"
};

const generateSlug = (text) => {
    return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-');
};

const uploadPdf = async (filePath, bookId) => {
    const ext = path.extname(filePath);
    const storagePath = `${bookId}-pdf-${Date.now()}${ext}`;
    
    const fileBuffer = await fs.readFile(filePath);

    const uploadUrl = `${SUPABASE_URL}/storage/v1/object/${BUCKET}/${encodeURIComponent(storagePath)}`;
    const res = await fetch(uploadUrl, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${SUPABASE_KEY}`,
            'apikey': SUPABASE_KEY,
            'Content-Type': 'application/pdf',
            'x-upsert': 'true'
        },
        body: fileBuffer
    });

    if (!res.ok) {
        const text = await res.text();
        throw new Error(`Failed to upload ${filePath}: ${res.status} ${text}`);
    }

    return storagePath;
};

const updateBook = async (bookId, downloadUrl) => {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/books?id=eq.${bookId}`, {
        method: 'PATCH',
        headers: {
            'Authorization': `Bearer ${SUPABASE_KEY}`,
            'apikey': SUPABASE_KEY,
            'Content-Type': 'application/json',
            'Prefer': 'return=minimal'
        },
        body: JSON.stringify({ download_url: downloadUrl })
    });

    if (!res.ok) {
        const text = await res.text();
        throw new Error(`Failed to update book ${bookId}: ${res.status} ${text}`);
    }
};

const main = async () => {
    if (!SUPABASE_URL || !SUPABASE_KEY) {
        console.error("Missing SUPABASE credentials");
        return;
    }

    const baseDir = '/Users/stephaniecruz/Documents/NONNO OBRAS - RESPALDO/OBRAS';
    const entries = await fs.readdir(baseDir, { withFileTypes: true });

    let successCount = 0;
    for (const entry of entries) {
        if (entry.isDirectory()) {
            const folderName = entry.name;
            const match = folderName.match(/^(\d+)/);
            if (!match) continue;

            const folderNum = match[1];
            const bookName = mapping[folderNum];

            if (!bookName) {
                console.warn(`No mapping found for folder ${folderName} (ID: ${folderNum})`);
                continue;
            }

            const bookId = generateSlug(bookName);
            const folderPath = path.join(baseDir, folderName);
            
            const files = await fs.readdir(folderPath);
            const pdfFile = files.find(f => f.toLowerCase().endsWith('.pdf'));

            if (!pdfFile) {
                console.warn(`No PDF found in folder ${folderName}`);
                continue;
            }

            console.log(`Uploading PDF for ${bookName} (${bookId})...`);
            try {
                const pdfPath = path.join(folderPath, pdfFile);
                const storagePath = await uploadPdf(pdfPath, bookId);
                await updateBook(bookId, storagePath);
                console.log(`✅ Success: ${bookName}`);
                successCount++;
            } catch (err) {
                console.error(`❌ Error processing ${folderName}: ${err.message}`);
            }
        }
    }
    
    console.log(`\nCompleted! Successfully uploaded ${successCount} PDFs.`);
};

main();
