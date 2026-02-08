import { motion } from 'framer-motion';
import authorPortrait from '@/assets/author-portrait.jpg';
import { useLanguage } from '@/i18n/LanguageContext';

const bioSections = {
  es: [
    'Profesor de lingüística y dialectología comparada (italiano-español) en la Facultad de Humanidades y Educación de la Universidad Central de Venezuela desde 1972, se especializa luego en Fonética y fonología, y se inicia en el estudio del Método Verbo-Tonal para la rehabilitación de los sordomudos, bajo la dirección de su fundador Petar Guberina.',
    'Fue fundador del Departamento de Italiano y del Instituto de Investigaciones Lingüísticas (Unidad de Investigación) y luego en 1985 de Núcleo, revista científica de la Escuela de Idiomas Modernos de la cual fue Director hasta 1996. De 1990 a 1996 se desempeñó también como Director de la Escuela.',
    'Actualmente Michele Castelli, además de estudiar y difundir poetas y escritores dialectales de su país de origen, continúa con sus estudios de investigación sociolingüística en relación con los comportamientos lingüísticos de las segundas y terceras generaciones de italianos en Venezuela.',
  ],
  it: [
    'Professore di linguistica e dialettologia comparata (italiano-spagnolo) presso la Facoltà di Scienze Umane e dell\'Educazione dell\'Università Centrale del Venezuela dal 1972, si specializza poi in Fonetica e fonologia, e inizia lo studio del Metodo Verbo-Tonale per la riabilitazione dei sordomuti, sotto la direzione del suo fondatore Petar Guberina.',
    'Fu fondatore del Dipartimento di Italiano e dell\'Istituto di Ricerche Linguistiche (Unità di Ricerca) e poi nel 1985 di Núcleo, rivista scientifica della Scuola di Lingue Moderne della quale fu Direttore fino al 1996. Dal 1990 al 1996 ricoprì anche il ruolo di Direttore della Scuola.',
    'Attualmente Michele Castelli, oltre a studiare e diffondere poeti e scrittori dialettali del suo paese d\'origine, continua con i suoi studi di ricerca sociolinguistica in relazione ai comportamenti linguistici delle seconde e terze generazioni di italiani in Venezuela.',
  ],
};

export function About() {
  const { lang, t } = useLanguage();

  return (
    <section id="sobre-mi" className="py-24 bg-section-alt">
      <div className="container mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
          <span className="text-sm tracking-widest uppercase text-muted-foreground mb-4 block">{t.about.label}</span>
          <h2 className="font-display text-3xl md:text-5xl text-primary mb-4">{t.about.title}</h2>
          <p className="text-muted-foreground max-w-3xl mx-auto">{t.about.intro}</p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16 items-start max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="relative mx-auto lg:mx-0">
            <div className="photo-frame inline-block">
              <img src={authorPortrait} alt="Michele Castelli" className="w-full max-w-md rounded shadow-2xl grayscale" />
            </div>
          </motion.div>

          <div className="space-y-8">
            {bioSections[lang].map((text, index) => (
              <motion.div key={index} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: index * 0.2 }}>
                {index === 0 && (
                  <div className="flex items-center gap-4 mb-6">
                    <span className="w-12 h-px bg-primary" />
                    <span className="quote-mark text-5xl font-display">"</span>
                    <span className="w-12 h-px bg-primary" />
                  </div>
                )}
                <p className="text-muted-foreground leading-relaxed text-center lg:text-left">{text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
