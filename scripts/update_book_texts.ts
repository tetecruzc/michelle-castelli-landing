import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import WebSocket from 'ws';

(global as any).WebSocket = WebSocket;
config({ path: '.env.local' });

// Initialize Supabase Client
const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_PUBLISHABLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing VITE_SUPABASE_URL or VITE_SUPABASE_PUBLISHABLE_KEY");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const esTranslations: any = {
  id1: {
    description: [
      {
        text:
          "Es una investigación promovida por el Centro Estudios sobre migraciones de la provincia de Campobasso (Molise) acerca de la comunidad ítalo-venezolana y tiene como propósito reconstruir el asentamiento, la colocación territorial y la movilidad social de los “molisani” en su nueva patria de adopción. El estudio de campo conducido sobre la base de escrupulosas metodologías cualitativas, ha permitido reconstruir la evolución que han vivido cuatro generaciones desde el momento de su llegada hasta el logro de una condición social y cultural más elevada. Ha permitido, además, precisar la consistencia cuantitativa de la comunidad “molisana”, seguir la progresiva superación de la práctica endogámica y la apertura a otras componentes étnicas, registrar las formas de transición lingüística y observar el decidido progreso hacia la escolarización y la profesionalización de las nuevas generaciones, relevar la persistencia de los nexos a través de la memoria familiar, la gastronomía, los viajes a los lugares de origen.  ",
      },
    ],
    gallery: [
      {
        text: `La obra fue presentada en la Sala de Conferencias de la Biblioteca Provincial de
        Campobasso por Giovanni Mascia, con palabras introductorias de Vincenzo Lombardi, Director de
        la Biblioteca`,
      },
    ],
  },
  id2: {
    description: [
      {
        text:
          "El Maestro Corrado Galzio, siciliano de origen, fue uno de los músicos más prestigiosos que en el lejano 1947 desde Italia llega a Venezuela, junto con el violinista Alberto Flamini. Permaneció en la tierra di Bolívar hasta un año antes de su fallecimiento, acaecido el 19 de abril de 2020. Con su famoso “Cuarteto” ha viajado por el mundo haciendo apreciar, además, a los principales autores e intérpretes de la música de cámara de Venezuela. En   esta obra, como se deduce del título, Michele Castelli, su amigo entrañable, más que describir sus proezas musicales con juicios críticos sobre  su virtuosismo, se dedica a narrar su vida “fantástica”, rica di aventuras y situaciones que dejarán fascinado al lector. Es un justo homenaje al hombre y al artista orgullo de la colectividad italiana en Venezuela.",
      },
    ],
    gallery: [
      {
        text:
          "Con el Maestro CORRADO GALZIO el día de la presentación de la obra en el Centro Italiano Venezolano de Caracas",
      },
      {
        text: `De izquierda a derecha con el Dr. Giovanni Di Stefano, docente universitario y Presidente fundador de la Casa d'Italia; el Maestro Corrado Galzio y el legendario periodista Gaetano Bafile, Director fundador de La Voce d'Italia`,
      },
      {
        text: `De izquierda a derecha el Autor con el Dr. Salvatore Pluchino, Docente universitario y ex Presidente por más períodos del Centro Italiano Venezolano de Caracas; el Presidente de la Orquesta Sinfónica Municipal de Caracas; el Maestro Rodolfo Saglimbeni, Director de la Orquesta Sinfónica Municipal de Caracas, el Maestro Corrado Galzio y un invitado al Concierto `,
      },
    ],
  },
  id3: {
    description: [
      {
        text:
          "Este volumen recoge tres historias de vida, diferentes por ambientación y escritura, pero unidas por evidentes hilos conductores. Son historias de padres escritas por hijos que, a través de referencias a sus vicisitudes, no solo tocan con sugestión la delicada y misteriosa relación entre padres e hijos, sino que reconstruyen contextos históricos como los de Argentina, Venezuela y el Norte América. Son historias de emigración que se basan en el común paradigma del abandono de la tierra de origen y de la reconstrucción de sus vidas en el ambiente de la tierra de acogida. Son situaciones existenciales cuyas lecturas en paralelo permiten constatar el carácter complejo y dinámico de la emigración. Michele Castelli narra la vida de Giuseppe, su padre, con emotivas pinceladas y con algunos elementos de añadidura más allá de sus vivencias reales, para elevarlo a símbolo de toda la masiva inmigración de los años ’50 en Venezuela. Se trata, en realidad, de la versión italiana de Érase una vez… Giuseppe a cargo de Giovanni Mascia.  ",
      },
    ],
  },
  id4: {
    description: [
      {
        text:
          "Pietro Mastrangelo es un artista “santacrocese” que cultivó con la misma belleza e intensidad la pintura y la poesía dialectal, o en lengua italiana. Su poesía, de todas formas, debe ser leída siempre en relación con su arte pictórica, de la cual es un maestro y un ejemplo. Ella integra y completa un desarrollo artístico cuyo motivo referencial es el pasado con todas sus consecuencias. Un largo ir atraviesa toda su producción poética, un recorrido nostálgico, que a menudo también deviene retórico pero casi nunca patético. Poesía y pintura se funden en un enredo simbólico que es testimonio auténtico de un mundo vivido y amado cotidianamente. No es el académico que se asoma del balcón, no es el burgués que contempla un mundo, sino que es un hombre del pueblo que habla de sí mismo. En fin, un acto de amor sincero y verdadero con diversas variantes: nostálgica, conmovedora pero también antropológica y de estudio de las tradiciones populares. Michele Castelli y Pasquale Licursi que tuvieron a su cargo la obra, recogen cualquier detalle que se asoma entre líneas y a través de sus comentarios revelan cosas, en todo caso inocuas, que el autor no se atreve a decir directamente por temor de herir susceptibilidades. En este libro, publicado bajo el auspicio de la Administración comunal de Santa di Magliano, están presentes todos los textos seleccionados personalmente por el autor y ofrecidos en fotocopias. Sin embargo, desde aquel momento, ya se tenía la certeza que faltaban muchísimos otros que finalmente después de su muerte aparecieron y vieron la luz. ",
      },
    ],
    gallery: [{ text: `Pietro Mastrangelo, pintor y poeta dialectal “santacrocese”.` }],
  },
  id5: {
    description: [
      {
        text:
          "Hámichel es la historia conmovedora y poética de un jovencito marginal que, sin padres, sin familia, sin nadie, vive en una cueva, experimenta en el arco de unos pocos días la fuerza arrolladora de los sentimientos. Primero hace amistad con un ratón, que sacrifica por él su libertad, se enamora luego de una compañera de clases de ojos grandes, de trenzas negras y zarcillos de marfil; finalmente es agredido y golpeado brutalmente por el odio de quienes no soportan que un joven semisalvaje haya tenido el atrevimiento de fijarse en una muchacha del lugar... El escenario de la trama es una supuesta costa albanés, sin embargo en ella podrían reconocerse todas aquellas realidades que, en diferentes latitudes, todavía no se han librado de la tenaza de la miseria y del retraso... Para el crítico Giorgio Bàrberi Squarotti los protagonistas de la novela viven, actúan, piensan, pero no hablan. Y cuando hablan sus palabras no tienen sonido... En una carta al Autor, el crítico le confiesa que quedó profundamente sorprendido por esa capacidad de contar junto la luz y la corporeidad. Y remata diciéndole no conocer ninguna obra que en ese sentido puede acercarse a la suya... La traducción al español de Michele Castelli ha logrado mantener en la otra lengua aquellos detalles lingüísticos que caracterizan la obra.",
      },
    ],
    gallery: [
      {
        text: `Nicola Iacobacci, nació en Toro (CB) y es considerado la máxima expresión poética contemporánea del Molise. Además de novelas como La tela dei giorni, L'albero dei briganti, L'unghia incarnita y Hámichel, las cuales son definidas más bien por algunos críticos como "grandes poemas líricos", es autor de un sinnúmero de libros de poemas entre los cuales destacan Sotto il barbacane, Il passo dello scorpione, La pietra turchina, il Diavolo senza corne, La baia delle tortore, etc. Famosos son también su drama Il lupo tra le lamiere, la obra teatral La giacca a doppio petto y el volumen de monólogos Le radici del silenzio. Ha sido traducido al francés, al español y al griego.`,
      },
      {
        text: `La versión italiana de la obra estuvo a cargo del ensayista y crítico literario Giovanni Mascia, quien al igual que Iacobacci, también nació en Toro, ciudadela de la provincia de Campobasso (Molise). Cultiva esencialmente el ensayo histórico, antropológico, lingüístico y literario. Ha publicado varios libros sobre estos géneros entre los cuales destacan A tavele de Ture (La tavola di Toro), La Chiesa del Santissimo Salvatore a Toro y sobre todo Le tenebre nel Molise, obra que recibió elogios públicos del gran lingüista italiano Gian Luigi Beccaria. Tuvo a su cargo, además de Hámichel de Iacobaccl, la versión italiana de mi novela-ensayo Érase una vez... Giuseppe, tradujo los Cuentos de mi vida y tuvo a su cargo la Introducción de Il Lessico santacrocese.        `,
      },
      {
        text: `Presentación de la obra en el Centro Italiano de Caracas, con la actuación de la Orquesta Sinfónica Juvenil dirigida por el Director Domenico Lombardi, de origen molisano`,
      },
      { text: `Con Giovanni Mascia, en un encuentro en Campobasso.` },
    ],
  },
  id6: {
    description: [
      {
        text:
          "La obra de Michele Castelli “seria y rigurosa” es al mismo tiempo un viaje curioso y divertido por el mundo dialectal de una comunidad “molisana” y al mismo tiempo una importante y fundamental contribución para el desarrollo de los estudios de dialectología. La investigación tiene el gran mérito de tutelar la memoria en un contexto social que “comienza a ser víctima de la inexorable, lógica prevalencia del italiano”. La salvaguarda de la terminología dialectal, de los modos de decir, de las alegorías sirve, por lo tanto, para preservar a las generaciones futuras del olvido de la lengua de los padres y de los abuelos, contaminada como es de neologismos, jergas televisivos y otras cosas más. El autor, si bien en ningún momento se aleja del riguroso método científico, busca en profundidad, en su alma y en sus recuerdos, la vía para compilar un repertorio dialectal que puede leerse como una novela, rico de perlas de sapiencia popular, de pragmatismo campesino y de retornos a la cotidianidad, codificados a través de una consolidada cultura oral que corre el riesgo, sin embargo, tarde o temprano de desaparecer…",
      },
    ],
    gallery: [
      {
        text:
          "Con el Sr. Daniel Morais, Agregado Cultural de la Embajada de Portugal en Venezuela, en ocasión de la presentación en Caracas de la Primera Edición de Il lessico santacrocese",
      },
      {
        text: `Presentación de la Segunda Edición en la Sala del Consejo Comunal de Santa Croce di
        Magliano. En el presídium, a mi derecha, Giovanni Mascia, autor de la Presentación y Enzo Nocera
        el editor. A la izquierda, Salvatore Mascia, el alcalde de Santa Croce y Norberto Lombardi
        presentador del libro.`,
      },
      {
        text: `Con Gianni Mucci, diseñador y caricaturista, autor de la portada de la tercera edición.`,
      },
    ],
  },
  id7: {
    description: [
      {
        text:
          "Cuentos de mi vida, como lo dice el título, es una obra autobiográfica escrita en breves capítulos, en momentos distintos, que narran experiencias de vida desde la infancia hasta la edad madura del autor. Cada capítulo es una historia finita que sin embargo se conecta al siguiente para dar continuidad a la narración. Desde el punto de vista estilístico la novedad es que el escritor interviene en primera o tercera persona, en un mismo párrafo, lo que le da especial dinamismo al cuento. Por otra parte, tal como él mismo lo advierte en la Prefacio, a menudo se borra el límite entre la realidad, seguramente predominante, y la fantasía puntual. Si no fuera así, no estaríamos frente a unos cuentos de vida sino a un diario como muchos otros, sin ninguna intención literaria. Los Cuentos  (primera parte) de Michele Castelli merecen ser leídos, pues de su enriquecedora experiencia se pueden extraer ejemplos de cómo el hombre no puede pasar inadvertido en su recorrido de vida si quiere ocupar un puesto, aunque sea modesto, en cualquier peldaño de la historia. No sabemos cuándo y quién tendrá la suerte de leer la segunda parte de la obra que, obviamente, debe estar en pleno desarrollo... Sin embargo, los casi sesenta años narrados en este libro ya constituyen un largo trecho que da la dimensión del personaje. ",
      },
    ],
  },
  id8: {
    description: [
      {
        text:
          "Es la historia de Giuseppe, próspero comerciante y padre del escritor quien en 1950, después de varias vicisitudes durante y después de la segunda guerra mundial, es obligado a dejar patria y familia para escapar de la miseria en la que había caído por la muerte repentina de un rico mayorista de víveres a quien le había firmado una fianza comercial, cuyos herederos desconocieron, y como tal estuvo obligado a pagar so pena incluso de parar en la cárcel. Llega a Venezuela apenas con su maleta de cartón y la angustia en el corazón. Sin embargo, en pocos años logra una excelente estabilidad económica, reúne a la familia y se convierte en un industrial de las arepas primero, y de las hallaquitas después. A pesar de que la vida le fue dura también en la patria de adopción, logra en los últimos 15 años de su vida una paz interior que le permite acudir con amor a la familia y los nietos en particular, y hacer muchos viajes de placer con su esposa María, especialmente a su tierra de origen. La obra, publicada por el Vicerrectorado de la UCV tuvo muy buena acogida, tanto que la edición se agotó en pocas semanas sin que nunca el autor se preocupara de proponer nuevas ediciones.",
      },
    ],
    gallery: [{ text: `Giuseppe y Maria, mis padres, protagonistas de esta historia` }],
  },
  id9: {
    description: [
      {
        text:
          "En Cuentos de Inmigrantes, cuya primera edición vio la luz en Caracas (Venezuela) en 2005, Michele Castelli narra 25 historias que escuchó de la viva voz de sus protagonistas - o de personas que fueron testigo de aquellos hechos - retocadas con corolarios de fantasía que justifican la obra literaria. A las tramas de los cuentos, cautivadoras por los azares y las vicisitudes de los pioneros italianos que sembraron sus raíces en la tierra generosa de Bolívar, se une un toque de mágica poesía con la que se exaltan los paisajes venezolanos dentro de los cuales se mueven los personajes. Recientemente, bajo los auspicios de la Universidad de Nápoles, la obra fue traducida magistralmente por el profesor Salvatore Orlando y publicada en Italia con el título de “Italiani mata burros” e altre storie di migranti in Venezuela.",
      },
    ],
    gallery: [
      {
        text: `El día de la presentación de la obra, con el prologuista Dr. Fabrizio Colaceci, Cónsul General de la República de Italia en Venezuela.`,
      },
      {
        text: `Con mis cuatro nietos (de izquierda a derecha) José Manuel, Valentina, Manuel Andrés y Stephanie quienes bautizaron con pétalos de rosas el libro`,
      },
      {
        text: `Reporte del evento en La Voce d’Italia, a cargo de la periodista Anna Maria Tiziano`,
      },
    ],
  },
  id10: {
    description: [
      {
        text:
          "…En Venezuela los hermanos Esteban Emilio y Jorge Mosonyi y Michele Castelli figuran como los más consecuentes y acuciosos estudiosos de la fonética y la fonología. El primero y el último de ellos acaban de publicar un valioso libro, CURSO DEL ESPAÑOL DE VENEZUELA, fruto de sus experiencias como docentes en este campo en nuestra primera casa de estudios. Experiencia que no se ha limitado a la adquirida directamente en las aulas, ya de por sí muy valiosa y rica cuando la docencia se ejerce con vocación pedagógica y con entusiasmo e interés científico, como es su caso, sino que igualmente procede de sus propias investigaciones, tanto de biblioteca y gabinete, como de campo. Es la primera vez - y esto ya es un mérito innegable - que se publica entre nosotros un libro de esta naturaleza, en que se planteen como  es debido los problemas y demás aspectos esenciales de una disciplina que no solo es de importancia primordial para el conocimiento de nuestra lengua, y a través de ella de nuestra cultura, sino que es, además, fascinante…",
      },
      {
        text:
          "(texto extraído de un artículo de Alexis Márquez Rodríguez, miembro de número de la Academia de la Lengua de Venezuela)",
      },
    ],
    gallery: [
      {
        text:
          "El bautizo del libro estuvo a cargo del ilustre fonólogo venezolano Godsuno Chela Flores y de la profesora Rosario Alonso de León, en ese momento Directora de la Escuela de Idiomas Modernos. A mi derecha en la foto el lingüista y antropólogo Esteban E. Mosonyi, coautor del libro.",
      },
    ],
  },
  id11: {
    description: [
      {
        text:
          "Héctor Mujica nace en Carora el 10 de abril de 1927 y aquí transcurre su infancia. En 1944 se transfiere a Caracas donde inicia sus estudios universitarios y su actividad política como militante del PCV. Se gradúa de periodista pero ya a partir de 1952 se convierte en un perseguido político probando muchas veces la amargura del encarcelamiento. Después de 1958 se dedica a la docencia en la UCV, escribe sus mejores obras pero nunca abandona la vida política tanto que, entre otros cargos, en 1978 el Partido lo escoge como su candidato a la presidencia de la República. En 1999, decepcionado por los acontecimientos del país y por la manera de conducir Hugo Chávez las riendas del Estado, se retira en la tranquilidad de la ciudad de Mérida donde muere serenamente en febrero del 2002. En 1980 Michele Castelli y Stefania Ajó, ambos miembros del cuerpo docente del Departamento de Italiano de la Escuela de Idiomas Modernos de la UCV, le rinden un sentido homenaje traduciendo una selección de sus mejores cuentos que pronto, por interés del conocido dirigente del Partito Comunista Italiano (PCI) Giuliano Pajetta, fueron divulgados con gran éxito también en Italia. ",
      },
    ],
    gallery: [
      {
        text: `Con mi amigo Héctor Mujica en una foto del 1980 tomada por el Prof. Carlos Abreu, uno de mis alumnos predilectos en los cursos de italiano de aquella época`,
      },
    ],
  },
  id12: {
    description: [
      {
        text:
          "En los años ’70, cuando Michele Castelli inicia aún muy joven su carrera universitaria, se estrena también como escritor. Sin embargo, ante que medirse con creaciones propias, por obvios motivos de inseguridad, se dedica a traducir obras magistrales de autores conocidos, en italiano y en español. Uno de ellos fue el poeta y amigo Nicola Iacobacci que comenzaba a afirmarse en Molise, su tierra de origen, y en toda Italia. Castelli traduce así una selección de sus líricas con la complicidad de sus alumnos de italiano, e inesperadamente la editorial VIS de Caracas se ofrece para la publicación. La obra se difundió con rapidez sobre todo en los círculos culturales de la Universidad y su aceptación hizo que se animara a continuar por un tiempo más a las traducciones hasta atreverse a experimentar con temas de lingüística de su especialidad y más tarde con creaciones literarias. Poesías, gracias también al interés del poeta Iacobacci, circuló bastante en Italia y fue reseñada por críticos literarios con benevolencia.",
      },
    ],
    gallery: [{ text: `Unica foto conocida del gran poeta molisano Nicola Iacobacci` }],
  },
  id13: {
    description: [
      {
        text:
          "La Rampicante, título italiano de La Trepadora, famosa novela del escritor venezolano Rómulo Gallegos, es la primera experiencia de Michele Castelli como traductor, iniciada en la ciudad de Bari (Italia) cuando todavía frecuentaba el último año de universidad, y concluida y publicada en Venezuela en 1973. También fue la segunda novela de Gallegos traducida al italiano, después de Doña Bárbara a cargo del escritor y crítico literario Carlo Bo. A pesar de lo juicios bastante positivos de los lectores, y sobre todo del entusiasmo demostrado por la profesora Marisa Vannini, quien tuvo a su cargo la presentación del libro, Castelli siempre ha considerado esta obra como su “pecado de juventud”.",
      },
    ],
    gallery: [{ text: `Foto autografiada del Maestro Rómulo Gallegos` }],
  },
  id15: {
    description: [
      {
        text:
          "Esta obra constituye la primera colección poética del ilustre escritor y médico “santacrocese” Raffaele Capriglione. Fue publicada en Caracas (Venezuela) en una pequeña edición artesanal en 1990 pero su inesperado éxito obligó, dos años más tarde, a presentar una nueva versión totalmente revisada en offset de 1000 ejemplares, distribuida en Venezuela por una Asociación Civil Regional Molisana, la cual se encargó de enviar una buena cantidad a Molise. Finalmente, en 2018, ve la luz la tercera edición en Italia por EBS Print Edizioni. Michele Castelli, además de reunir los manuscritos ofrecidos por parientes del poeta y descendientes de amigos personales de Capriglione, traduce cada lírica dialectal en italiano y comenta cada una de ellas. En Apéndice, luego, propone un Glosario de todos los términos dialectales que constituyen la obra, y un Índice de nombres que identifica los casi 150 personajes reales descritos en sus coloridos sobrenombres. Tal vez el aporte más importante en esta obra es la transcripción de los textos a través de una escritura razonada y universal del dialecto de Santa Croce, y por lo tanto aplicable a cualquier otro dialecto de la Región o de Italia en general.",
      },
    ],
    gallery: [{ text: "Raffaele Capriglione médico y poeta dialectal “santacrocese”." }],
  },
  id16: {
    description: [
      {
        text:
          "…Los protagonistas de esta obra son los “mata burros”, los musiúes... Con estos apelativos se referían con desprecio a los inmigrantes italianos en Venezuela en aquellos años ’50 de presencia masiva... En este libro Michele Castelli narra las historias de aquellos hombres que para huir de una realidad deteriorada por el hambre causada por una guerra absurda, o simplemente para probar fortuna en otras latitudes, traspasan el océano para dirigirse a un país que auspiciaba la fuerza y la laboriosidad de brazos extranjeros para acelerar el progreso de una nación potencialmente rica de recursos naturales... Escritor acucioso, delicado y sensible, con puntuales referencias poéticas ricas de imágenes repletas de una fuerte carga expresiva, Michele Castelli toca en el libro varias temáticas relacionadas con la diáspora italiana en Venezuela del siglo pasado. Las historias, todas verídicas como lo declara él mismo en la premisa, están enriquecidas de corolarios de fantasía y pinceladas estilistiche personales que le confieren a la obra un notable valor literario…",
      },
      { text: "Savatore Orlando" },
    ],
    gallery: [
      { text: `Salvatore Orlando, quien tuvo a su cargo la versión italiana de la obra` },
      {
        text: `El día de la presentación de la obra, con el prologuista Dr. Fabrizio Colaceci, Cónsul General de la República de Italia en Venezuela.`,
      },
      { text: "Adolfo Torre, autor de la postfacio" },
    ],
  },
  id17: {
    description: [
      {
        text: `Después de 13 años de la publicación de una antología comentada de Pietro Mastrangelo, a cargo de Michele Castelli y Pasquale Licursi, que contiene 88 líricas en dialecto, en ocasión de la inauguración de una Sala en su honor en la Biblioteca Comunal de Santa Croce di Magliano que recoge solo una parte de su conspicua producción pictórica, aparecieron 21 cuadernos manuscritos que testimonian la poliédrica actividad artística de Mastrangelo, la cual toca de manera significativa también el género literario. De hecho, además de una serie de poesías inéditas en dialecto y 43 en italiano, aparecieron también 22 Canciones algunas de ellas conocidas por los habitantes del pueblo pero probablemente sin saber de su autoría.`,
      },
      {
        text: `Presentamos todo en este volumen, con la certeza de haber recogido, junto con el volumen previamente publicado, la producción completa en dialecto y en italiano del insigne artista “santacrocese”.`,
      },
    ],
  },
  id18: {
    description: [
      {
        text:
          "Con Francesco Cocco se cierra el ciclo de poesía dialectal “santacrocese”, que inicia con Raffaele Capriglione y continúa con Pietro Mastrangelo. Más de cien años ricos de inspiración lirica pero también de cuentos de vida local que permiten reconstruir porciones de historia local que de otra manera hubieran desaparecidos con sus protagonistas. Historias reales de personajes, situaciones, tradiciones, fiestas patronales y también migraciones hacia destinos menos hostiles para la supervivencia. Francesco Cocco es el último de esta estirpe, ya sea en términos cronológicos que por la inevitable, natural extinción que dentro de muy poco tocará a nuestros dialectos. En sus textos, de hecho, es evidente la presencia de voces modernas imposibles de encontrar en la lengua de los abuelos, y que parecen dialectales solo por la shwa que sustituye algunas vocales átonas. En cuanto a las temáticas, además de las acostumbradas descripciones de algunas manifestaciones populares como la bendición de los animales en ocasión de los festejos de la Virgen “Incoronata”, el paseo campestre en el santuario de Santa Elena, la bendición de las palmas durante las celebraciones de la semana santa – de todas maneras todas ellas ya descritas con maestría por los autores citados que lo precedieron – hay un sujeto recurrente particularmente amado por el poeta, que es la tradicional festividad de San Antonio de Padua. Se puede concluir con un juicio positivo acerca de este primer poemario de Francesco Cocco, seleccionado entre más de doscientas líricas entregadas en fotocopias por el autor.",
      },
    ],
    gallery: [
      { text: `Con Francesco Cocco, poeta dialectal y animador cultural “santacrocese”.` },
      {
        text: `Prof. Paolo Mastrangelo, colaborador de esta obra, cuya intervención fue determinante
        no solo por la revisión de los textos sino sobre todo por la redacción de algunas notas.`,
      },
    ],
  },
  id19: {
    description: [
      {
        text:
          "Estas Guías de lectura y escritura del italiano, son el resultado de la experiencia en el salón de clase con un grupo de alumnos del primer año de  la Escuela de Idiomas Modernos de la Universidad Central de Venezuela. Son las respuestas a una serie de interrogantes de los estudiantes de italiano para superar una serie de dificultades en contraste con la lengua maternal. Respuestas sencillas pero siempre sustentadas en argumentaciones científicas de cómo leer con propiedad la sílaba tónica de las palabras en italiano por no existir los acentos gráficos como en español; cuándo se usan en la lengua las dobles consonantes más allá de saberlas identificar en los dictados porque el profesor exagera su reforzamiento; cómo poder distinguir los fonos sordos y sonoros de algunas consonantes; y así sucesivamente con otros elementos fonológicos, gramaticales y sintácticos. Son, en síntesis, la construcción de un volumen a través de centenares de hojas sueltas olvidadas aquí y allá, dividido en varias unidades muy útiles para  complementar los materiales formalmente utilizados por un profesor de italiano en cualquiera de sus cursos. La única salvedad es que la primera unidad debe estar destinada a los profesores y a los alumnos avanzados pues el conocimiento teórico de la fonética y la fonología es indispensable para comprender en su esencia el uso de la lengua madre, y de la lengua extranjera objeto de estudio. ",
      },
    ],
  },
  id20: {
    description: [
      {
        text:
          "Es la versión italiana de Cuentos de mi vida (Parte I) a cargo de Giovanni Mascia ya lista para la publicación por la “Casa Editrice Cosmo Iannone” de Isernia (CB – Italia) en la Colana I Memoriali, pero que el autor mandó a suspender porque se pretendía adecuar la obra a una normal biografía modificando su arquitectura de narración. Para los comentarios sobre el contenido y las vicisitudes sorteadas a lo largo de un recorrido de vida que va desde el nacimiento hasta el 2002, año del terrible terremoto que golpeó a Santa Croce di Magliano y otras zonas de Molise, puede consultarse la obra original en español. Se trata por lo tanto de recuerdos de la infancia en el pueblo de origen, los años de vida estudiantil hasta el doctorado en la universidad de Bari (Italia), su residencia definitiva en Caracas y la carrera profesional en la Universidad Central de Venezuela.",
      },
    ],
    gallery: [
      {
        text: `Con Giovanni Mascia responsable de la versión italiana de Cuentos de mi vida (inedito).`,
      },
    ],
  },
  id21: {
    description: [
      {
        text:
          "Con este volumen se hace entrega a los estudiosos de la dialectología, y en particular al pueblo de Santa Croce di Magliano (CB-Italia) que ha dado pruebas fehacientes del interés por la preservación de su propio patrimonio lingüístico y cultural, una nueva contribución a la lengua de los antepasados que con el pasar inclemente de los tiempos se va cancelando del habla cotidiana. En realidad, no se trata de una “nueva” obra. Para facilitarle la consulta a los lectores, el autor se ha limitado a extrapolar del Lessico santacroces aquellas voces, en orden alfabético, que contienen modos de decir, expresiones, adivinanzas, metáforas, juegos, traslados, onomatopeyas, rimas infantiles y mucho más que constituyen el elemento de civilización que no solo constituye el aspecto fundamental de una determinada lengua, sino que la enriquece en el tiempo gracias a la espontánea sabiduría popular.  ",
      },
    ],
  },
  id22: {
    description: [
      {
        text:
          "La segunda parte de los Cuentos de mi vida, tiene otra dimensión. Es sin duda la continuación de la historia de un recorrido de vida, sin embargo ya no son los recuerdos del pasado, aquellos que venían a flote entre bancos de neblina y que por ende daban motivos para vuelos a veces imaginarios, como corolarios de la verdad indiscutible, con los cuales se pretendía crear alguna sensación de prosa poética. Ni siquiera el estilo es el mismo. Ya no se encontrará al escritor que narra en tercera persona y que a trechos se confunde con un protagonista que actúa con su nombre de pila. Ahora es el cuento tal como se vive a diario. Es la realidad que brinca a la vista cruda y amarga, esa realidad injusta y traicionera que te corroe el alma, y de la que sientes, sin embargo, la impotencia de no poder derrotar. Bueno, claro, también aparecerá uno que otro resumen de vivencias alegres. Pero en general el dolor de habernos cruzado con los tiempos más oscuros de este país hermoso víctima de las palabras de un triste predicador − engañosas como las medusas que te cautivan por sus colores  y formas cuando las ves en procesión en las aguas cristalinas pero que te arden las manos y el cuerpo si te rozan − han despertado en la pluma del escritor más la intención del prosador que hace la crónica poniéndose como protagonista, que la del poeta que llora sobre el recuerdo de un pasado que, si bien azaroso a veces, fue en todo caso maravilloso, pues siempre tal es el ímpetu de la juventud avasallante cuando se vive en toda su intensidad.",
      },
    ],
  },
  id23: {
    description: [
      {
        text:
          "Esta es la única obra de Michele Castelli escrita por él en el dialecto de su aldea de origen, Santa Croce di Magliano. Trata de episodios, personajes y situaciones locales mayoritariamente enfocados en sus recuerdos de los años ’50 y ’60, además de una que otra referencia histórica de importancia en la vida de esa población. Cada episodio se narra bajo forma de fábula – de allí el título – no solo para hacer más atractivos los contenidos con pinceladas fantasiosas, sino también con el objeto de que la obra pueda ser introducida en las escuelas para que las nuevas generaciones se enteren de aquellos eventos curiosos vividos por los abuelos, y sobre todo para retardar la inevitable extinción del dialecto ya en extrema agonía.",
      },
    ],
  },
  id24: {
    description: [
      {
        text:
          "Con este trabajo realizado en conjunto entre Michele Castelli y Paolo Mastrangelo concluye el ciclo sobre el dialecto santacrocese, conscientes los autores de las limitaciones de la investigación pero al mismo tiempo con la certeza que de esta fuente podrán alimentarse los futuros estudiosos de la dialectología local, y más allá. A ellos pues está dedicado el esfuerzo, el cual ha sido posible concretizar gracias al ejército de informantes desinteresados que en las últimas dos décadas han permitido reconstruir en buena medida el largo recorrido histórico y cultural de más de diez siglos de presencia de nuestros ancestros en el territorio. ",
      },
    ],
  },
  id25: {
    description: [
      {
        text:
          "La producción poética dialectal de Italo d’Onofrio está compuesta por solo nueve poemas, escritos entre 1951 y 1972, surgidos a menudo de momentos de nostalgia vinculados a sus regresos a su pueblo natal, Santa Croce di Magliano. Los temas van desde el amor juvenil hasta la reflexión sobre el tiempo y la condición humana, manteniendo siempre un tono poético sencillo pero cargado de significado. Aunque con algunas limitaciones técnicas, d’Onofrio demuestra sensibilidad y talento al poetizar lo cotidiano. El dialecto es utilizado con precisión, aunque influenciado por italianismos y términos modernos. Su último poema es una sátira política que cierra con ligereza su trayectoria poética.",
      },
    ],
  },
  id26: {
    description: [
      {
        text:
          "Estudio monográfico sobre la vida y las obras del principal poeta “molisano” contemporáneo Nicola Iacobacci, a cargo de Giovanni Mascia y Michele Castelli, amigos personales del poeta y estudiosos atentos de su desarrollo artístico. El volumen comprende el análisis de sus líricas y novelas en prosa, los artículos publicados por el autor en las diferentes revistas literarias y los comentarios a sus obras por los críticos más destacados de Molise y de Italia. La premisa está a cargo de Giambattista Faralli, uno de los críticos “molisanos” más agudos. ",
      },
    ],
  },
  id27: {
    description: [
      {
        text: `L’idea di compilare un Dizionario Essenziale Italiano Santacrocese sorge nello stesso momento in cui inizia la raccolta del Lessico perché sin da quegli ormai lontani anni Ottanta del secolo scorso quando comincia a maturare l’interesse per il dialetto santacrocese - già da allora in una fase di accelerata estinzione - eravamo convinti della necessità, per il futuro fruitore, di partire dalla sua lingua d’uso per la ricerca delle voci dialettali di interesse. Ma fin qui, solo con questo proposito. Per l’approfondimento sarebbe stato in ogni caso indispensabile ricorrere al volume che parte invece dal dialetto perché è lì che abbiamo imprigionato la storia e la civiltà dei nostri avi attraverso gli innumerevoli e coloriti modi di dire, espressioni, proverbi, indovinelli e quant’altro. Per questo, dunque, il titolo di Dizionario Essenziale.`,
      },
      {
        text: `Nella stessa selezione lessicale ci siamo limitati ai termini corrispettivi del dialetto di massima presenti nel primo volume, costruiti sia attraverso la nostra parlata quotidiana perché il dialetto santacrocese ci appartiene come lingua madre, sia attingendo dal poeta massimo Raffaele Capriglione e dal resto della letteratura scritta che per fortuna a Santa Croce di Magliano non è rara come altrove. Si potrà notare, inoltre, che abbondano le voci relative ai mestieri e ai loro arnesi di lavoro, come pure quelle che descrivono la vita contadina e la coltivazione del campo, attività primordiali che hanno caratterizzato nei secoli l’economia del paese.`,
      },
      {
        text: `La scelta del lemma italiano per la traduzione fedele di alcuni oggetti, o della flora in particolare, non è stata semplice in certi casi. Per esempio, nel nostro percorso di ricerca degli anni passati la maggior parte dei nomi di piante e di erbe in dialetto sono state fornite da un pastore che governava il suo gregge per i tratturi della periferia, nella cui compagnia abbiamo trascorso lunghe e ripetute giornate. Non si poteva, allora, che trascrivere e descrivere i nomi pittoreschi del dialetto che ci indicava il volenteroso informatore lasciando intenzionalmente per dopo, come in effetti successe in parte, la ricerca più meticolosa della nomenclatura italiana affidandoci alla collaborazione degli amici e conoscenti del posto, specialisti in agraria e in botanica, ma soprattutto attingendo da un erbario illustrato che per caso è caduto nelle nostre mani, per delucidare i legittimi dubbi che ci perseguivano. Non è stato possibile, tuttavia, identificare il cento per cento del materiale raccolto tanto che per sette o otto voci non abbiamo trovato miglior forma che registrarle sotto il nome generico di ERBE rimandando alla consulta del Lessico per una sintetica descrizione delle loro caratteristiche. Anche per quanto riguarda la grammatica ci siamo limitati all’essenziale, riportando appena la categoria del lemma italiano in esponente, che di solito coincide con il corrispondente in dialetto. Solo nel caso dei sostantivi abbiamo optato nel santacrocese per l’uso degli articoli con il fine di precisarne il genere e il numero. Per i verbi irregolari delle voci dialettali, finalmente, si è indicato, accanto all’infinito, il participio passato.`,
      },
      {
        text: `Con questo nuovo volume poniamo punto finale alla raccolta lessicale del santacrocese co- sciente di aver lasciato, sicuramente, un materiale prezioso nel dimenticatoio. Ma non si poteva fare di più a quasi diecimila chilometri di distanza... La speranza è che partendo da questa fonte, e prima che scompaiano gli ultimi superstiti di questa nostra ricca civiltà alimentata dalla saggezza dei nonni, uno o più studiosi volenterosi del posto s’impegnino nel riscatto di quanto sia potuto sfuggire alla nostra penna.`,
      },
    ],
  },
  id28: {
    description: [
      {
        text: `Se trata de tres relatos que exploran la huella profunda y duradera de la inmigración italiana en
Venezuela, desde mediados del siglo XX hasta la actualidad. El primero, titulado Tonio, el niño que
quería ser presidente, narra la historia de un humilde bracero que emigra a Venezuela en los años
50. Con tesón y sacrificio, logra establecer una hacienda agrícola donde incluso incursiona con éxito
en la producción de vinos y espumantes. Su único hijo, Tonio, sueña desde la infancia con llegar a la
presidencia de la República. En su adolescencia se involucra activamente en un partido político, pero
su destino da un giro inesperado: impedido de comenzar sus estudios universitarios en Italia, llega
a Venezuela para reencontrase con su padre. Desencantado y en busca de un ideal, se une a las
guerrillas comunistas en Nicaragua, donde finalmente muere combatiendo en una brigada
internacional junto al ejército sandinista contra la dictadura de Somoza. El segundo relato, La viuda
blanca, sigue la historia de otro emigrante oriundo del mismo pueblo, Santa Croce. Llega también a
Venezuela en busca de un futuro mejor, pero se ve envuelto involuntariamente en hechos delictivos
que lo llevan a perder el contacto con su familia y a pasar veinte años en prisión. Enfermo y
desamparado, solicita finalmente la repatriación a Italia. Solo al final de su vida, logra el perdón de
su esposa, quien lo acompaña en sus últimos momentos. El último relato, El legado, presenta a tres
hermanos venezolanos, hijos de un inmigrante italiano que llegó al país siendo aún un niño. Cada
uno de ellos se destaca en su ámbito: uno como empresario exitoso, otro como político con gran
proyección, y el tercero como investigador de renombre internacional. Sus historias reflejan el fruto
del esfuerzo y la dedicación de una comunidad que, tras décadas de trabajo silencioso, ha llegado a
integrarse plenamente al país que los acogió. Este relato es un homenaje a la herencia de la
inmigración italiana en Venezuela, que ha contribuido de forma decisiva a su desarrollo y
prosperidad.`,
      },
    ],
  },
  id29: {
    description: [
      {
        text: `La fábula es una forma literaria que resiste al paso del tiempo, siempre vigente en su capacidad de hablar al corazón humano. Su uso nunca es superfluo, especialmente cuando se trata de educar en las emociones. Es tanto más poderosa cuanto más logra nutrir las mentes y los corazones de los más pequeños, en quienes la moraleja encuentra un terreno fértil para echar raíces y hacer crecer la frágil pero prometedora plantita de la vida. En estas diez fábulas, escritas por el autor cuando sus primeros nietos se asomaban a la adolescencia, se abordan temas cruciales de nuestra época: la libertad, el acoso escolar, el horror de la guerra, los prejuicios de género, entre otros. Son, sí, cuentos para niños, pero tampoco les vendrían mal a los adultos: también ellos, quizás ahora más que nunca, necesitarían extraer de ellos enseñanzas para calmar prejuicios antiguos y profundamente arraigados.`,
      },
    ],
  },
  id30: {
    description: [
      {
        text: `El relato se sitúa a principios de los años cincuenta, en una Italia que acaba de convertirse en República y está llena de esperanzas. En Santa Croce di Magliano, Flaviano, un campesino arrendatario, es desalojado tras la venta del terreno en el que trabaja. Un descubrimiento inesperado —un mapa del tesoro hallado por su hijo— parece cambiar el destino de la familia, pero el hallazgo atrae a numerosos interesados, entre ellos el propietario, el maestro, algunos parientes y autoridades. Al final, Flaviano y su esposa se quedan sin nada y comprenden que solo el trabajo honesto y libre puede ofrecerles un futuro mejor.`,
      },
    ],
  },
  id31: {
    description: [
      {
        text: `En esta novela, Rita Frattolillo investiga el misterio en torno a Bernardino Musenga, el arquitecto encargado de la reconstrucción del Molise tras el terremoto de 1805, cuya muerte a los 49 años, quedó envuelta entre rumores de suicidio y un prolongado silencio histórico. El hallazgo del nombre de Agnese lleva a la Autora a reconstruir la historia de su esposa, una mujer apasionada y valiente que enfrentó el exilio en Marsella junto a él, perseguido por sus convicciones antiborbónicas. Agnese emerge como una mujer de fortaleza inquebrantable, decidida a permanecer al lado de Bernardino hasta el final. Su destino se entrelaza con las luchas de los liberales contra la represión borbónica, ofreciendo un retrato vibrante de la época. El retorno a Molise, la titánica labor de reconstrucción y el trágico desenlace del arquitecto, junto con la delicada figura de su esposa, se relatan con pasión, componiendo un fresco histórico intenso tan fascinante como desgarrador. La versión en español trata en lo posible de mantener el estilo sobrio pero riguroso del texto original.`,
      },
    ],
  },
  id32: {
    description: [
      {
        text: `Esta es la versión italiana, preparada por el ensayista y escritor molisano Giovanni Mascia, del original en español Érase una vez... Giuseppe, ya publicado en los Quaderni sull’Emigrazione, dirigidos por Norberto Lombardi y editados por Cosmo Iannone Editore (Isernia, 1999), con el título En nombre del padre, junto a los textos de Torquato S. Di Tella y Giose Rimanelli. Se trata de tres relatos de vida, distintos por inspiración, ambientación y estilo ‒ como subraya Lombardi en el Prólogo ‒ pero unidos por un mismo hilo conductor: «historias de padres escritas por hijos que, a través del relato de sus propias vivencias, no solo exploran con intensidad la delicada y misteriosa relación entre padres e hijos, sino que también reconstruyen contextos históricos y dinámicas sociales que continúan alimentando nuestro imaginario cultural y orientando nuestro recorrido existencial y civil». Esta, en particular, es la historia de Giuseppe, padre del autor, obligado a emigrar a Venezuela tras un fracaso comercial. En su nueva patria logra reconstruir su vida a través de acontecimientos extraordinarios y aventureros. El texto, ahora cuidadosamente revisado, si presenta como un volumen independiente dirigido al público lector italiano.`,
      },
    ],
  },
  id35: {
    description: [
      {
        text: `Testo extraído de la obra ALTROVE, de Norberto Lombardi, en la que el autore recoge veinte entrevistas efectuadas en circunstancias, ambientes y tiempos diferentes a personalidades de origen “molisano”, que dejaron una huella profunda y reconocible en los campos de la literatura, del arte, de la ensayística, del compromiso social y cívico o que todavía están activos en las redes globales de la ciencia y de la investigación. El hilo que los une es una intensa cultura del Altrove (de otros sitios), vivida y concebida no como lejanía y separación, sino como oportunidades, enriquecimientos e intercambios, y en la diversidad de la experiencia afloran numerosos los motivos de reflexión y de elaboración que pueden ayudarnos a comprender algunos rasgos sobresalientes de la contemporaneidad”. Entre los entrevistados Michele Castelli, originario de Santa Croce di Magliano (CB), residenciado en Caracas, Venezuela.`,
      },
    ],
  },
};

const itTranslations: any = {
  id32: {
    description: [
      {
        text: `Questa è la versione italiana, curata dal saggista e scrittore molisano Giovanni Mascia, dell’originale in spagnolo Érase una vez... Giuseppe, già pubblicato nei Quaderni sull’Emigrazione, diretti da Norberto Lombardi e editi da Cosmo Iannone Editore (Isernia, 1999), con il titolo In nome del padre, insieme ai testi di Torquato S. Di Tella e Giose Rimanelli. Si tratta di tre storie di vita, diverse per ispirazione, ambientazione e stile ‒ come sottolinea Lombardi nella Premessa ‒ ma accomunate da un medesimo filo conduttore: «storie di padri scritte da figli che, attraverso il racconto delle proprie vicende, non solo esplorano con intensità il delicato e misterioso rapporto tra genitori e figli, ma ricostruiscono anche contesti storici e dinamiche sociali che continuano ad alimentare il nostro immaginario culturale e a orientare il nostro percorso esistenziale e civile». Questa, in particolare, è la storia di Giuseppe, padre dell’autore, costretto a emigrare in Venezuela in seguito a un fallimento commerciale. Nella nuova patria ricostruisce la propria esistenza attraverso eventi straordinari e avventurosi. Il testo, ora accuratamente rivisto, si presenta come un volume autonomo dedicato ai lettori italiani.`,
      },
    ],
  },
  id31: {
    description: [
      {
        text: `In questo romanzo, Rita Frattolillo indaga sul mistero che circonda Bernardino Musenga, l’architetto incaricato della ricostruzione del Molise dopo il terremoto del 1805, la cui morte, avvenuta a 49 anni, rimase avvolta tra voci di suicidio e un lungo silenzio storico. Il ritrovamento del nome di Agnese spinge l’Autrice a ricostruire la storia di sua moglie, una donna appassionata e coraggiosa che affrontò l’esilio a Marsiglia insieme a lui, perseguitato per le sue convinzioni antiborboniche. Agnese emerge come una donna di incrollabile forza, decisa a rimanere al fianco di Bernardino fino alla fine. Il suo destino si intreccia con le lotte dei liberali contro la repressione borbonica, offrendo un ritratto vivido dell’epoca. Il ritorno in Molise, l’immane impresa della ricostruzione e il tragico epilogo dell’architetto, insieme alla delicata figura della moglie, vengono raccontati con passione, componendo un affresco storico intenso, tanto affascinante quanto struggente. La versione in spagnolo cerca, per quanto possibile, di mantenere lo stile sobrio ma rigoroso del testo originale.`,
      },
    ],
  },
  id30: {
    description: [
      {
        text: `Il racconto si svolge nei primi anni Cinquanta, in un’Italia appena diventata Repubblica e carica di speranze. A Santa Croce di Magliano, Flaviano, un mezzadro, viene sfrattato dopo la vendita del terreno su cui lavora. Un’improvvisa scoperta – una mappa del tesoro trovata dal figlio – sembra cambiare le sorti della famiglia, ma il ritrovamento attira numerosi pretendenti, tra cui il padrone, il maestro, parenti e autorità. Alla fine, Flaviano e sua moglie restano senza nulla e comprendono che solo il lavoro onesto e libero può offrire un futuro migliore.`,
      },
    ],
  },
  id29: {
    description: [
      {
        text: `La favola è una forma letteraria che resiste al tempo, sempre attuale nella sua capacità di parlare al cuore dell’uomo. Il suo uso non è mai superfluo, soprattutto quando si tratta di educare alle emozioni. È tanto più potente quanto più riesce a nutrire le menti e i cuori dei più piccoli, nei quali la morale trova terreno fertile per attecchire e far crescere la fragile ma promettente pianticella della vita. In queste dieci favole, scritte dall’autore quando i primi nipoti si affacciavano all’adolescenza, si affrontano temi cruciali della nostra epoca: la libertà, il bullismo, l’orrore della guerra, i pregiudizi di genere e altri ancora. Si tratta, sì, di racconti per bambini, ma che non farebbero male neppure agli adulti: anche loro, forse più che mai, avrebbero bisogno di trarne insegnamenti per placare pregiudizi antichi e radicati.`,
      },
    ],
  },
  id28: {
    description: [
      {
        text: `Si tratta di tre racconti che esplorano l’impronta profonda e duratura dell’emigrazione italiana in
Venezuela, dalla metà del XX secolo fino ai giorni nostri. Il primo, intitolato Tonio, il ragazzo che
voleva diventare presidente, narra la storia di un umile bracciante che emigra in Venezuela negli
anni ’50. Con tenacia e sacrificio riesce a fondare una tenuta agricola dove sperimenta con successo
anche la produzione di vini e spumanti. Il suo unico figlio, Tonio, sogna sin da piccolo di diventare
presidente della Repubblica. Durante l’adolescenza si impegna attivamente in un partito politico,
ma il suo destino prende una piega inaspettata: impossibilitato a iniziare gli studi universitari in
Italia, torna in Venezuela per ricongiungersi con il padre. Deluso e alla ricerca di un ideale, si unisce
alla guerriglia comunista in Nicaragua, dove muore combattendo in una brigata internazionale
accanto all’esercito sandinista contro la dittatura di Somoza. Il secondo racconto, La vedova in
bianco, segue la vicenda di un altro emigrante originario dello stesso paese, Santa Croce. Anche lui
parte per il Venezuela in cerca di un futuro migliore, ma si ritrova coinvolto, suo malgrado, in eventi
criminosi che lo portano a perdere i contatti con la famiglia e a trascorrere vent’anni in carcere.
Malato e senza risorse, chiede infine il rimpatrio in Italia. Solo negli ultimi momenti della sua vita
ottiene il perdono della moglie, che lo accompagna fino alla fine. Il terzo racconto, L’eredità,
presenta tre fratelli venezuelani, figli di un immigrato italiano giunto nel paese da bambino. Ognuno
di loro si distingue nel proprio campo: uno come imprenditore di successo, un altro come politico di
grande proiezione, e il terzo come ricercatore di fama internazionale. Le loro storie rappresentano
il frutto dell’impegno e della dedizione di una comunità che, dopo decenni di lavoro silenzioso, si è
ormai integrata pienamente nel paese che l’ha accolta. Questo racconto è un omaggio all’eredità
dell’emigrazione italiana in Venezuela, che ha contribuito in modo decisivo al suo sviluppo e alla sua
prosperità`,
      },
    ],
  },
  id1: {
    description: [
      {
        text:
          "È una ricerca promossa dal Centro Studi sulle migrazioni della provincia di Campobasso sulla comunità italo-venezuelana ed è rivolta a ricostruire l’insediamento, la collocazione territoriale e la mobilità sociale dei molisani nella loro nuova patria di adozione. L’indagine, condotta sul campo in base a scrupolose metodologie qualitative, ha consentito di ricostruire l’evoluzione che quattro generazioni hanno vissuto, dal momento del loro insediamento al raggiungimento di una condizione sociale e culturale più elevata. Essa ha permesso di precisare la consistenza quantitativa della comunità molisana, di seguire il progressivo superamento della pratica endogamica e l’apertura alle altre componenti etniche, di registrare le forme di transizione linguistica e di cogliere il deciso progresso verso la scolarizzazione e la professionalizzazione delle nuove generazioni, di rilevare la persistenza dei legami attraverso la memoria familiare, il cibo, i viaggi nei luoghi di origine. ",
      },
    ],
    gallery: [
      {
        text: `L'opera è stata presentata nella Sala Conferenze della Biblioteca Provinciale di Campobasso da Giovanni Mascia (primo a sinistra), con parole introduttive di Vincenzo Lombardi, Direttore della Biblioteca`,
      },
    ],
  },
  id2: {
    description: [
      {
        text:
          "Il Maestro Corrado Galzio, siciliano d’origine, è stato uno dei musicisti più prestigiosi che dall’Italia, nel lontano 1947, è arrivato in Venezuela, accompagnato dal violinista Alberto Flamini. È rimasto nella terra di Bolívar fino ad un anno prima del suo decesso, avvenuto il 19 aprile 2020. Con il suo famoso Quartetto ha viaggiato per il mondo facendo conoscere, inoltre, i principali autori e interpreti della musica da camera del Venezuela. In quest’opera, come si capisce dal titolo, Michele Castelli, suo amico e confidente, più che descrivere le sue prodezze musicali con giudizi critici sul suo virtuosismo, si dedica a narrare in particolare la sua vita “fantastica”, ricca di avventure e situazioni che affascinano il lettore. È un giusto omaggio all’uomo e all’artista simbolo di orgoglio della presenza italiana in Venezuela.  ",
      },
      {
        text: `Con il Maestro Corrado Galzio il giorno della presentazione dell’opera. Con noi il dott.
                    Giovanni De Stefano ex presidente della Casa d’Italia di Caracas, e il giornalista Gaetano Bafile,
                    Direttore de La Voce d’Italia.`,
      },
      {
        text: `Da sinistra a destra l’autore con il dott. Salvatore Pluchino, docente universitario e più
                    volte presidente del Centro Italiano Venezolano di Caracas; il Presidente dell’Orchestra Sinfonica
                    Municipale di Caracas; il Maestro Direttore dell’Orchestra, Rodolfo Saglimbeni; il Maestro Corrado
                    Galzio e uno degli invitati al Concerto settimanale nel Centro Culturale Monte Sacro.`,
      },
    ],
    gallery: [
      {
        text: `L'Autore con il Maestro Corrado Galzio, il giorno della presentazione dell'opera nel Centro Italiano Venezuelano (CIV) di Caracas.`,
      },
      {
        text: `Da sinistra a destra 'Autore con il dott. Giovanni Di Stefano docente universitario e co-fondatore della Casa d'Italia; il Maestro Corrado Galzio e il giornalista Gaetano Bafile, leggendario direttore-fondatore de La Voce d'Italia.`,
      },
      {
        text: `Da sinistra a destra l'Autore con il dott. Salvatore Pluchino docente universitario ed ex presidente in piú periodi del Centro Italiano Venezuelano (CIV) di Caracas; il presidente dell'Orchestra Sinfonica Municipale di Caracas; il Maestro Rodolfo Saglimbeni direttore dell'Orhestra Sinfonica Municipale di Caracas; il Maestro Corrado Galzio e un invitato al Concerto.`,
      },
    ],
  },
  id3: {
    description: [
      {
        text: `Questo volume raccoglie tre storie di vita, diverse per ambientazione e scrittura, ma unite da fili evidenti e molteplici. Sono storie di padri scritte da figli che, attraverso il riferimento alle loro vicende, non solo toccano con suggestione il delicato e misterioso rapporto tra genitori e figli, ma ricostruiscono contesti storici quali l'Argentina, il Venezuela e il Nord America. Sono storie d'emigrazione che poggiano sul comune paradigma di ogni percorso di abbandono della terra d'origine e di reinsediamento nell'ambiente di accoglimento, vicende di vita la cui lettura in parallelo consente di poter constatare il carattere complesso e dinamico dell'emigrazione. Michele Castelli narra la vita di Giuseppe, suo padre, con emotive pennellate e con alcuni elementi aggiuntivi scaturiti dalla sua fantasia per farne un símbolo di tutta la masiva immigrazione degli anni Cinquanta in Venezuela. Si tratta, in realtà, della versione italiana di Érase una vez… Giuseppe a cura di Giovanni Mascia.  `,
      },
    ],
  },
  id4: {
    description: [
      {
        text:
          "Pietro Mastrangelo è un artista santacrocese che coltivó con la stessa bellezza e intensità sia la pittura che la poesia vernacolare o in lingua italiana. La sua poesia, comunque, va letta sempre in rapporto alla sua arte pittorica, dove è un maestro ed un esempio. Essa integra e completa un percorso artistico il cui punto di riferimento è il passato con tutto quello che ne consegue. Un respiro lungo attraversa tutta la sua produzione poetica, un respiro nostalgico che molto spesso diventa anche retorico, ma quasi mai patetico. Poesia e pittura si fondono in un unico groviglio simbolico che è testimonianza autentica di un mondo vissuto e amato quotidianamente. Non è l’accademico che si affaccia al balcone, non è il borghese che contempla un mondo, ma è un uomo del popolo che parla di sé stesso. In sostanza, un atto d’amore vero e sanguigno con diverse varianti: nostalgica, struggente, ma anche antropologica e di studio delle tradizioni popolari. I curatori, Michele Castelli e Pasquali Licursi, colgono ogni sfumatura attraverso commenti che svelano anche cose, comunque del tutto innocue, che l’autore non osa dire direttamente per timore di ferire suscettibilità. In questa raccolta, pubblicata sotto il patrocinio dell’Amministrazione Comunale di Santa Croce di Magliano, sono presenti tutti i testi offerti in fotocopie dal poeta, ma sin d’allora c’era la certezza che mancavano moltissimi testi che finalmente negli anni a venire, dopo la sua morte, vedranno la luce.",
      },
    ],
    gallery: [{ text: `Pietro Mastrngelo pittore e poeta dialettale santacrocese` }],
  },
  id5: {
    description: [
      {
        text:
          "Hàmichel è la storia commovente e poetica di un ragazzo emarginato che, senza genitori, senza famiglia, senza nessuno, vive in una caverna, sperimenta nel breve volgere di un paio di giorni la forza dirompente dei sentimenti. Fa prima amicizia con un topo che per lui sacrifica la libertà; s’innamora poi di una compagna di scuola con gli occhi grandi, le trecce nere e gli orecchini di avorio; infine è aggredito e picchiato brutalmente dall’odio di chi non sopporta l’idea che un giovane semiselvaggio possa avere avuto l’ardito di alzare gli occhi su una ragazza del luogo… Lo scenario della trama è un’ipotetica costa albanese, ma potrebbero ricomporsi in quelli delle coste dei tanti paesi del mondo chiusi ancora nella morsa della povertà e del sottosviluppo... Per il critico Giogio Bárberi Squarotti i protagonisti del romanzo vivono, agiscono, pensano, ma non parlano. E quando parlano le loro parole non hanno senso… In una lettera all’autore, il critico gli confessa che è rimasto profundamente colpito da questa capacità di raccontare insieme la luce e la corporeità. E conclude dicendogli che non consce nessun’altra opera che si possa avvicinare alla sua… La traduzione in spagnolo di Michele Castelli ha avuto il merito di mantenere tutti quei dettagli stilistici che caratterizzano l’opera.",
      },
    ],
    gallery: [
      {
        text: `Nicola Iacobacci nato a Toro (CB) è considerato la massima espressione poetica
                    contemporanea del Molise. Oltre ai romanzi La tela dei giorni, L’albero dei briganti, L’unghia
                    incarnita e Hàmichel, che da alcuni critici sono definiti piuttosto “grandi poemi lirici”, è autore di
                    diversi volumi di liriche tra le quali si citano Sotto il barbacane, Il passo dello scorpione, La pietra
                    turchina, il Diavolo senza corna, La baia delle tortore, ecc. Famosos sono anche il dramma Il lupo tra
                    le lamiere, l’opera teatrale La giacca a doppio petto e il volume di monologhi Le radici del silenzio.
                    È stato tradotto al francese, allo spagnolo e al greco.`,
      },
      {
        text: `La versione italiana dell’opera è stata a cura del saggista e critico letterario Giovanni
                    Mascia nativo anche lui, come Iacobacci, di Toro, paesino della provincia di Campobasso (Molise).
                    Si dedica essenzialmente al saggio storico, antropologico, linguistico e letterario. Ha pubblicato
                    vari libri tra i quali A tavele de Ture (La tavola di Toro), La Chiesa del Santissimo Salvatore a Toro e
                    Le tenebre nel Molise, opera che ha ricevuto gli elogi pubblici dal grande linguista italiano Gian
                    Luigi Beccaria. Oltre ad Hàmichel di Iacobacci ha curato la versione italiana del mio romanzo-
                    saggio Érase una vez… Giuseppe, ha tradotto i Racconti di vita (ancora inedito) e ha scritto la
                    presentazione de Il lessico santacrocese.`,
      },
      {
        text: `Presentazione dell’opera nel Centro Italiano Venezolano di Caracas, con la
                    presentazione dell’Orchestra Sinfonica Giovanile, diretta dal Direttore Domenico Lombardi,
                    originario del Molise.`,
      },
      { text: `Con Giovanni Mascia in un incontro a Campobasso.` },
    ],
  },
  id6: {
    description: [
      {
        text:
          "L'opera di Michele Castelli 'seria e rigorosa' è allo stesso tempo sia un viaggio curioso e divertente nel mondo dialettale di una comunità molisana sia un importante e dovizioso contributo per l'avanzamento degli studi di dialettologia. La ricerca ha il grande pregio di porsi come presidio della memoria in un contesto sociale che 'comincia ad essere vittima dell'inesorabile, logica prevalenza dell'italiano'. Il recupero della terminologia dialettale, dei modi dire, delle allegorie serve, quindi, a preservare le generazioni future dall'oblio della lingua dei padri e dei nonni, contaminata com'è da neologismi, slang televisivo e quant'altro. L'autore pur senza mai discostarsi da un accurato metodo scientifico, ha voluto scandagliare in profondità nel suo animo e nei suoi ricordi compilando, infine, un repertorio dialettale che può leggersi come un romanzo, ricco di perle di saggezza popolare, di pragmatismo contadino e di rimandi al quotidiano, codificati attraverso una consolidata cultura orale che rischia, però, presto o tardi di scomparire...",
      },
    ],
    gallery: [
      {
        text: `Con il signor Daniel Morais, Aggregato culturale della Ambasciata del Portogallo in
                    Venezuela, nella presentazione a Caracas della prima edizione del Lessico santacrocese.`,
      },
      {
        text: `Presentazione della Seconda Edizione nella Sala Consiliare del Comune di Santa Croce di Magliano. Nel presidium, alla mia destra, Giovanni Mascia, autore della Presentazione, Enzo Nocera l'Editore. Alla mia sinistra Salvatore Mascia Sindaco e Norberto Lombardi presentatore dell'opera`,
      },
      {
        text: `Con Gianni Mucci, disegnatore e caricaturista, autore della copertina del Lessico Santacrocese (terza edizione)`,
      },
    ],
  },
  id7: {
    description: [
      {
        text:
          "Cuentos de mi vida, come dice il titolo, è un’opera autobiografica scritta in brevi capitoli, in momenti diversi, che narrano esperienze di vita dall’infanzia all’età matura dell’autore. Ogni capitolo è una storia a sé che tuttavia si collega al seguente per dare continuità alla narrazione. Dal punto di vista stilistico la novità è che lo scrittore interviene in prima o terza persona, in uno stesso paragrafo e ciò offre speciale dinamiso al racconto. D’altra parte, come lui stesso avverte nella Premessa, spesso si annulla il limite tra la realtà, sicuramente predominante, e la fantasia puntuale. Se non fosse stato così non staremmo di fronte a dei racconti di vita bensì ad un diario come tanti altri, senza alcuna intenzione letteraria. I Cuentos  (prima parte) de Michele Castelli meritano di essere letti perché dalla sua esperienza si potranno estrarre esempi su come l’uomo non può passare inosservato durante il percorso di vita se desidera occupare un posto, anche modesto, nella storia piccola o grande dell’umanità. Non sappiamo chi avrà la fortuna, e quando, di leggere la seconda parte dell’opera la quale, ovviamente, già deve stare in pieno svolgimento... Tuttavia, i quasi sessant’anni narrati in questo libro già costituiscono per sé un lungo tragitto di vita che può offrire la dimensione del personaggio. ",
      },
    ],
  },
  id8: {
    description: [
      {
        text:
          "È la storia di Giuseppe, prospero commerciante e padre dello scrittore che nel 1950, dopo varie vicissitudini durante e dopo la seconda guerra mondiale, fu costretto a lasciare patria e famiglia per fuggire dalla miseria nella quale era caduto a causa della morte improvvisa di un ricco grossista alimentare cui aveva firmato una fideiussione commerciale che gli eredieri non vollero riconoscere, costringendolo quindi a farsene carico. Giunge in Venezuela senza nessun sostegno, solo con la sua valigia di cartone e l’angoscia nel cuore. Tuttavia, in pochi anni riesce a consolidare un’ottima posizione economica come industriale delle “arepas” prima, e delle “hallaquitas” dopo. Nonostante avesse dovuto far fronte a momenti difficili anche nella patria di adozione, negli ultimi 15 anni di vita riesce a trovare la pace interiore che gli permette di dedicarsi con amore alla famiglia e ai nipoti in particolare, oltre che realizzare i tantissimi viaggi insieme alla moglie Maria, specialmente di reincontri nella terra d’origine. L’opera, pubblicata dal Vicerettorato della Università Centrale del Venezuela (UCV), ebbe notevole successo tanto che in poche settimane si esaurì. L’autore comunque non dimostrò mai interesse per farne nuove edizioni. ",
      },
    ],
    gallery: [{ text: "Giuseppe e Maria, i miei genitori, protagonista di questa storia." }],
  },
  id9: {
    description: [
      {
        text:
          "In Cuentos de Inmigrantes, la cui prima edizione ha visto la luce a Caracas (Venezuela) nel 2005, Michele Castelli narra 25 storie ascoltate dalla viva voce dei suoi protagonisti – o comunque da persone che furono testimoni di quei fatti – ritoccate con corollari di fantasia che per l’appunto giustificano l’opera letteraria. Alle trame dei racconti, che incantano per le sorprese e le vicissitudini dei pionieri italiani che hanno seminato le loro radici nella terra generosa di Bolívar, si unisce un tocco di magica poesia con la quale si esaltano i paesaggi venezuelani nella cui cornice si muovono i personaggi. Recentemente, sotto gli auspici dell’Università di Napoli, l’opera è stata magistralmente tradotta dal profesor Salvatore Orlando e pubblicata in Italia con il titolo “Italiani mata burros” e altre storie di migranti in Venezuela.",
      },
    ],
    gallery: [
      {
        text: `Il giorno della presentazione dell’opera, con el prologhista Dott. Fabrizio Colaceci,
                    Console Generale della Repubblica Italiana in Venezuela`,
      },
      {
        text: `Con i miei nipotini (da sinistra a destra) José Manuel, Valentina, Manuel Andrés e
                    Srephanie che hanno battezzato il libro con petali di rosa.`,
      },
      {
        text: `Cronaca dell’evento su La Voce d’Italia a cura della giornalista Anna Maria
                    Tiziano`,
      },
    ],
  },
  id10: {
    description: [
      {
        text:
          "…In Venezuela i fratelli Esteban Emilio e Jorge Mosonyi e Michele Castelli sono considerati i più acuziosi studiosi della fonetica e della fonologia. Il primo e l’ultimo hanno appena pubblicato un importantissimo libro, CURSO DEL ESPAÑOL DE VENEZUELA, frutto della loro esperienza come docenti in questo campo nella nostra prima casa di studi. Esperienza che non si è limitata a quella acquisita direttamente nelle aule, già di per sé pregevole e ricca quando la docenza si esercita con vocazione pedagogica e con entusiasmo e interesse scientifico, come nel loro caso, ma che proviene anche da profonde ricerche sia in biblioteca e laboratorio, che sul campo. È la prima volta – e ciò è già un merito notevole – che si pubblica da noi un libro di questa natura, nel quale si espongono nella giusta misura i problemi e quant’altri aspetti essenziali di una disciplina che non solo è di un’importanza fondamentale per la conoscenza della nostra lingua, ma che è anche affascinante... ",
      },
      {
        text:
          "(testo estratto da un articolo di Alexis Márquez Rodríguez, membro di numero della Accademia della Lingua del Venezuela)                ",
      },
    ],
    gallery: [
      {
        text: `Il libro è stato presentato dall’illustre fonologo venezuelano Godsuno Chela
                    Flores e dalla prof.ssa Rosario Alonso de León, all’epoca preside della Facoltà di Lingue Moderne
                    della UCV. Alla mia destra nella foto il linguista e antropologo Esteban Emilio Mosonyi, coautore
                    dell’opera.`,
      },
    ],
  },
  id11: {
    description: [
      {
        text:
          "Héctor Mujica nasce a Carora (Venezuela) il 10 aprile 1927 e qui trascorre la sua infanzia. Nel 1944 si trasferisce a Caracas dove inizia i suoi studi universitari e la sua attività politica nelle file del Partito Comunista del Venezuela (PCV). Si laurea in giornalismo ma già nel 1952 viene persiguitato e arrestato più volte dagli sbirri della dittatura. Dopo il 1958 si dedica alla docenza nella UCV, scrive le sue migliori opere ma non abbandona mai la politica, tanto che nel 1978 il Partito lo lancia candidato alla presidenza della Repubblica. Nel 1999, deluso dagli avvenimenti nel paese e dal modo di condurre Hugo Chávez le sorti dello Stato, si ritira nella pacifica città di Mérida e qui muore serenamente nel febbraio del 2002. Nel 1980 Michele Castelli e Stefania Ajó, entrambi docenti del Dipartimento d’Italiano della Scuola di Lingue Moderne della UCV, gli rendono un meritato tributo traducendo una selezione delle sue migliori novelle che grazie all’interessamento del conosciuto dirigente político del Partito Comunista Italiano (PCI) On. Giuliano Pajetta, suo amico personale, varcano la soglia del Venezuela e riscuotono grande successo anche in Italia.  ",
      },
    ],
    gallery: [
      {
        text: `Con il mio amico Héctor Mujica in una foto del 1980 scattata dal prof. Carlos Abreu,
                    uno dei miei alunni prediletti nei corsi d’italiano di quell’epoca.`,
      },
    ],
  },
  id12: {
    description: [
      {
        text:
          "Negli anni Settanta, quando Michele Castelli inizia ancora giovanissimo la sua carriera universitaria, debutta anche come scrittore. Tuttavia, invece di misurarsi con creazioni proprie, per ovvi motivi di insicurezza, si dedica a tradurre le opere magistrali di alcuni autori conosciuti, in italiano e spagnolo. Uno di questi fu il poeta e amico Nicola Iacobacci che cominciava ad affermarsi nel suo Molise, e in tutta l’Italia. Castelli traduce così una selezione delle sue liriche con i suoi alunni d’italiano e, per fortuna, l’editorial VIS di Caracas si offre per la pubblicazione. L’opera si è diffusa rapidamente soprattutto nei circoli culturali dell’università e i giudizi positivi lo animano a continuare ancora sulla strada delle traduzioni prima di azzardarsi a sperimentare con i temi linguistici della sua specializzazione, e più tardi anche con la creazione letteraria. Poesías, grazie anche all’interesse del poeta Iacobacci è circolata notevolmente in Italia ed è stata recensita con benevolenza da numerosi critici letterari.",
      },
    ],
    gallery: [{ text: `Unica foto conosciuta del grande poeta molisano Nicola Iacobacci.` }],
  },
  id13: {
    description: [
      {
        text:
          "La Rampicante, titolo italiano de La Trepadora, famoso romanzo dello scrittore venezuelano Rómulo Gallegos, è la prima esperienza di Michele Castelli come traduttore, iniziata a Bari quando frequentava ancora l’ultimo anno di università, e terminata e pubblicata in Venezuela nel 1972. È stato anche il secondo romanzo di Gallegos tradotto in italiano, dopo la Doña Bárbara a cura di Carlo Bo. Nonostante i giudizi abbastanza positivi dei lettori, e soprattutto l’entusiasmo dimostrato dalla professoressa Marisa Vannini, che ha tenuto a suo carico la presentazione del libro, Castelli ha considerato sempre quest’opera come il suo “peccato di goventù”.",
      },
    ],
    gallery: [{ text: `Foto autografata del Maestro Rómulo Gallegos.` }],
  },
  id15: {
    description: [
      {
        text:
          "Quest’opera costituisce la prima raccolta poetica dell’illustre scrittore e medico santacrocese Raffaele Capriglione. Fu pubblicata a Caracas (Venezuela) in una piccola edizione artigianale nel 1990, ma fu tanto il successo che due anni dopo si dicese di fare una nuova versione, completamente riveduta, in offset di 1000 copie distribuita da un’Associazione Molisana in loco, che si occupò anche di farla arrivare in grande quantità in Molise. Finalmente, in Italia, nel 2018, vede la luce la terza edizione per i tipi di EBS Print Edizioni. Il curatore Michele Castelli, oltre a riunire i manoscritti sparsi qua e là, fa la traduzione in prosa delle liriche e opportuni commenti ad ognuno di esse. In Appendice propone un Glossario con tutte le voci vernacolari usate dal poeta, e un Indice di nomi che identifica gli oltre 150 personaggi reali descritti nei loro coloriti soprannomi. Ma forse la parte più importante a carico del curatore è la trascrizione dei testi in cui propone per la prima volta una scrittura ragionata e universale del dialetto di Santa Croce, perciò applicabile a qualsiasi altro dialetto della Regione e dell’Italia.",
      },
    ],
    gallery: [{ text: "Raffaele Capriglione medico e poeta dialettale santacrocese" }],
  },
  id16: {
    description: [
      {
        text:
          "…I protagonisti di quest’opera sono i “mata burros”, i musiú... Così erano chiamati con disprezzo gli immigrati italiani in Venezuela in quegli anni Cinquanta di presenza masiva... In questa raccolta Michele Castelli narra le storie di quegli uomini che per fuggire da una realtà deteriorata dalla fame causata dalla guerra assurda, o semplicemente per tentare la sorte altrove, si dirigono oltreoceano, in un paese che faceva appello alle braccia straniere con lo scopo di accelerare il progresso di una nazione potenzialmente ricca di risorse naturali... Scrittore attento, delicato e sensibile, con puntuali chiose poetiche ricche di immagini dalla forte carica espressiva, Michele Castelli affronta nel libro diverse tematiche legate alla diaspora italiana in Venezuela del secolo scorso. Le storie, tutte vere come dichiara egli stesso nella premessa, sono arricchite da corollari di fantasia e pennellate stilistiche personali che conferiscono all’opera una valenza letteraria di spessore…",
      },
      { text: "Salvatore Orlando" },
    ],
    gallery: [
      {
        text: `Salvatore Orlando. Il curatore di questa versione italiana di Cuentos de Inmigrantes`,
      },
      {
        text: `Il giorno della presentazione dell’opera, con el prologhista Dott. Fabrizio Colaceci,
                    Console Generale della Repubblica Italiana in Venezuela`,
      },
      { text: `Adolfo Torre, autore della postfazione` },
    ],
  },
  id17: {
    description: [
      {
        text: `Dopo 13 anni dalla pubblicazione di un’antologia commentata di Pietro Mastrangelo, a cura di Michele Castelli e Pasquale Licursi, che contiene ben 88 liriche in dialetto, in occasione dell’apertura di una Sala in suo onore nella Biblioteca Comunale di Santa Croce di Magliano che accoglie soprattutto un piccolo saggio della cospicua produzione pittorica, sono apparsi ben 21 quaderni manoscritti che testimoniano la poliedrica attività artistica del Mastrangelo, la quale tocca in maniera significativa anche il genere letterario. Infatti, oltre che una serie di poesie inedite in dialetto, e 43 in italiano, sono presenti 22 Canzoni alcune delle quali canticchiate dai santacrocesi però probabilmente ignari della loro paternità.`,
      },
      {
        text: `Le presentiamo in questo volume, con la certezza di aver raccolto, con il volumen previamente pubblicato, tutta la produzione in dialetto e in lingua dell'insigne santacrocese.`,
      },
    ],
  },
  id18: {
    description: [
      {
        text:
          "Con Francesco Cocco si chiude il ciclo di un secolo di poesia dialettale santacrocese, iniziato con Raffaele Capriglione e continuato con Pietro Mastrangelo.  Oltre cent’anni ricchi d’ispirazione lirica ma anche di racconti di vita paesana che permettono di ricostruire spaccati di storia locale che altrimenti sarebbero scomparsi con i loro protagonisti. Storie reali di personaggi, situazioni, tradizioni, feste patronali e spesso migrazioni verso destini meno ostili per la sopravvivenza. Francesco Cocco è l’ultimo di questa stirpe, sia in termini cronologici, sia per l’inevitabile, naturale estinzione che a breve toccherà al nostro dialetto, e non solo. Nei suoi testi, infatti, è palese la presenza di voci moderne impossibili da riscontrare nella lingua dei nonni, e che sembrano dialettali solo per la shwa che sostituisce alcune vocali atone. Per quanto riguarda le tematiche, oltre alle solite descrizioni di alcune manifestazioni popolari come la benedizione degli animali in occasione dei festeggiamenti della Madonna dell’Incoronata, la scampagnata nel santuario di Sant’Elena, la benedizione delle palme durante le celebrazioni pasquali, ecc., del resto già cantate con maestria dagli autori citati che l’hanno precceduto, c’è un soggetto ricorrente particolarmente caro al Cocco, quello della festa patronale di Sant’Antonio. Nell’insieme, si può concludere con un giudizio positivo su questa prima raccolta poetica di Francesco Cocco, la quale è stata selezionata tra oltre duecento componimenti messi a disposizione dall’autore.",
      },
    ],
    gallery: [
      {
        text: `Il curatore dell'opera con Francesco Cocco, poeta dialettale e animatore culturale santacrocese`,
      },
      {
        text: `Prof. Paolo Mastrangelo, collaboratore di quest'opera, il cui intervento è risultato determinante non solo per la revisione dei testi ma soprattutto per la stesura di alcune note`,
      },
    ],
  },
  id19: {
    description: [
      {
        text:
          "Queste dispense di lettura e scrittura dell’italiano, sono il risultado dell’esperienza in aula con un gruppo di alunni del primo anno della Scuola di Lingue Moderne della Universidad Central de Venezuela. Sono le risposte a interrogativi degli studenti d’italiano per superare una serie di difficoltà in contrasto con la lingua materna. Risposte semplici ma sempre supportate da argomenti scientifici su come leggere con proprietà la sillaba tonica delle parole in italiano perché inesistente l’uso degli accenti grafici come invece avviene per lo spagnolo; quando si usano nella lingua le doppie consonanti che solo si riescono a identificare nei dettati perché il professore per esigenze didattiche esagera i loro rafforzamenti; como si distinguono i foni sordi e quelli sonori di alcune consonanti; e così di seguito con altri elementi fonologici, grammaticali e sintattici. Sono, in sintesi, la costruzione di un volume attraverso centenaia di fogli sciolti dimenticati qua e là, divisi en varie unità assai utili per complementare i materiali formalmente utilizzati da un professore d’italiano in qualsiasi corso. L’unica raccomandazione è che la prima unità dev’essere destinata ai professori e agli alunni avanzati perché la conoscenza teorica della fonetica y della fonologia è indispensabile per comprendere nella sua essenza l’uso della lingua madre, e quindi dell’italiano nel caso specifico.",
      },
    ],
  },
  id20: {
    description: [
      {
        text:
          "È questa la versione italiana di Cuentos de mi vida (Parte I) a cura di Giovanni Mascia che doveva vedere la luce per i tipi della Casa Editrice Cosmo Iannone di Isernia (CB – Italia) nella Collana I Memoriali ma che poi l’autore fece sospendere la pubblicazione perché si pretendeva di adeguare l’opera a una vera e propria biografia modificandone l’architettura della narrazione. Per i commenti sul contenuto, e le vicissitudini narrate lungo un percorso avvincente che va dalla nascita fino al 2002, anno del triste terremoto che colpì Santa Croce di Magliano e altre zone del Molise, si rimanda all’opera originale in spagnolo. Si tratta quindi di ricordi dell’infanzia nel villaggio d’origine, gli anni dello studentato fino alla laurea presso l’università degli studi di Bari, la residenza definitiva a Caracas e la carriera universitaria nell’Università Centrale del Venezuela (UCV).",
      },
    ],
    gallery: [
      { text: `2015. Con Giovanni Mascia, curatore della versione italiana dell'opera` },
    ],
  },
  id21: {
    description: [
      {
        text:
          "Con questo volume si vuole consegnare agli studiosi della dialettologia, e in particolare alla gente di Santa Croce di Magliano (CB) che ha dato mostra convincente e sincera dell’interesse per la preservazione del proprio patrimonio linguistico e culturale, un nuovo contributo alla lingua dei nonni che il trascorrere inclemente del tempo si appresta a cancellare dalla parlata quotidiana. Non si tratta, in realtà, di una “nuova” opera. Per comodità del lettore, l’autore si è limitato a estrapolare dal Lessico santacrocese quelle voci, in ordine alfabetico, che contengono modi dire, espressioni, indovinelli, metafore, giochi, traslati, onomatopee, filastrocche ed altro che costituiscono l’elemento di civiltà che non solo è alla base di una determinata lingua, ma che l’arricchisce nel tempo tramite l’originale e spontanea saggezza popolare.",
      },
    ],
  },
  id22: {
    description: [
      {
        text:
          "La seconda parte dei Racconti di vita, ha un’altra dimensione. È certamente la storia di un percorso di vita ma non si tratta più dei ricordi del passato, quelli che affioravano tra banchi di nebbia e che perciò erano motivo di voli anche immaginari, quali corallari della verità indiscutibile mediante i quali si pretendeva creare qualche sensazione di prosa poetica. Nemmeno lo stile è lo stesso. Non è più lo scrittore che narra in terza persona e che a tratti s’intreccia con un protagonista che appare con il suo nome di battesimo. Ora il racconto è quasi la stesura di un diario. È la realtà che balza alla vista cruda e amara, quella realtà ingiusta e traditrice che corrode l’anima e di cui sentí l’impotenza di non poter sconfiggere. Certo, non mancherà qualche episodio di allegria. Ma in genere il dolore di aver vissuto uno dei periodi più bui della storia contemporanea di questo paese meraviglioso vittima delle parole viperine di un triste predicatore – ingannevoli come le meduse che affascinano per la belleza delle loro forme e colori quando si scorgono in processione a filo d’acqua cristallina nei mari,  ma che poi ti bruciano le mani e il corpo se ti toccano – hanno  acceso nella penna dello scrittore più l’intenzione del prosatore che fa la cronaca da protagonista, anziché quella del poeta che piange sul ricordo di un passato che è stato senza dubbio spesso colmo di imprevisti ma comunque predominantemente incantevole perché l’impeto della gioventù è sempre travolgente quando si vive in tutta la sua intensità. ",
      },
    ],
  },
  id23: {
    description: [
      {
        text:
          "L’unica opera di Michele Castelli da lui scritta nel dialetto del suo paese di nascita, Santa Croce di Magliano. Si tratta di episodi, personaggi e situazioni locali incentrati nei suoi ricordi  degli anni Cinquanta e Sessanta, oltre che accenni a qualche spunto storico di rilievo nella vita di altri tempi del santacrocese. Ogni evento è narrato sotto forma di favola – da qui il titolo – non solo per rendere attrattivi i contenuti con qualche pennellata di fantasia, ma anche con lo scopo che l’opera possa essere proposta come materiale didattico nelle scuole per far conoscere alle nuove generazioni quegli eventi curiosi vissuti dai nonni, e soprattutto per ritardare l’inevitabile estinzione del dialetto già in estrema agonía.  ",
      },
    ],
  },
  id24: {
    description: [
      {
        text:
          "Con questo lavoro scritto in collaborazione tra Micheele Castelli e Paolo Mastrangelo si conclude il ciclo sullo studio linguistico del santacrocese, consapevoli gli autori dei limiti della ricerca e allo stesso tempo coscienti che da questa fonte potranno attingere i futuri studiosi della dialettologia locale, e di quella in generale. A loro dunque si dedica lo sforzo, che si è potuto concretizzare grazie all’esercito di informatori disinteressati che nelle ultime due decade hanno consentito di ricostruire in buona misura il lungo spaccato storico e culturale di oltre dieci secoli di presenza dei nostri avi nel territorio.",
      },
    ],
  },
  id25: {
    description: [
      {
        text: `La produzione poetica dialettale di Italo d’Onofrio è composta da sole nove liriche, scritte tra il 1951 e il 1972, nate spesso da momenti di nostalgia legati ai ritorni nel suo paese natale, Santa Croce di Magliano. I temi spaziano dall’amore giovanile alla riflessione sul tempo e la condizione umana, mantenendo sempre un tono poetico semplice, ma carico di significato. Pur con qualche limite tecnico, d’Onofrio dimostra sensibilità e talento nel rendere poetico anche il quotidiano. Il dialetto è usato con accuratezza, sebbene influenzato da italianismi e termini moderni. La sua ultima poesia è una satira politica che chiude con leggerezza il suo percorso poetico.`,
      },
    ],
  },
  id26: {
    description: [
      {
        text:
          "Studio monografico sulla vita e le opere del massimo poeta molisano contemporaneo Nicola Iacobacci, a cura di Giovanni Mascia e Michele Castelli, amici personali del poeta e studiosi attenti del suo percorso artistico. Il volume comprende oltre che l’analisi delle liriche e i romanzi in prosa dello Iacobacci, i suoi articoli pubblicati sulle diverse riviste letterarie e le recensioni dei principali critici italiani sulla sua vasta produzione. La premessa del libro è stata stilata da Giambattista Faralli, uno dei critici molisani più acutí.",
      },
    ],
  },
  id27: {
    description: [
      {
        text: `L’idea di compilare un Dizionario Essenziale Italiano Santacrocese sorge nello stesso momento in cui inizia la raccolta del Lessico perché sin da quegli ormai lontani anni Ottanta del secolo scorso quando comincia a maturare l’interesse per il dialetto santacrocese - già da allora in una fase di accelerata estinzione - eravamo convinti della necessità, per il futuro fruitore, di partire dalla sua lingua d’uso per la ricerca delle voci dialettali di interesse. Ma fin qui, solo con questo proposito. Per l’approfondimento sarebbe stato in ogni caso indispensabile ricorrere al volume che parte invece dal dialetto perché è lì che abbiamo imprigionato la storia e la civiltà dei nostri avi attraverso gli innumerevoli e coloriti modi di dire, espressioni, proverbi, indovinelli e quant’altro. Per questo, dunque, il titolo di Dizionario Essenziale.`,
      },
      {
        text: `Nella stessa selezione lessicale ci siamo limitati ai termini corrispettivi del dialetto di massima presenti nel primo volume, costruiti sia attraverso la nostra parlata quotidiana perché il dialetto santacrocese ci appartiene come lingua madre, sia attingendo dal poeta massimo Raffaele Capriglione e dal resto della letteratura scritta che per fortuna a Santa Croce di Magliano non è rara come altrove. Si potrà notare, inoltre, che abbondano le voci relative ai mestieri e ai loro arnesi di lavoro, come pure quelle che descrivono la vita contadina e la coltivazione del campo, attività primordiali che hanno caratterizzato nei secoli l’economia del paese.`,
      },
      {
        text: `La scelta del lemma italiano per la traduzione fedele di alcuni oggetti, o della flora in particolare, non è stata semplice in certi casi. Per esempio, nel nostro percorso di ricerca degli anni passati la maggior parte dei nomi di piante e di erbe in dialetto sono state fornite da un pastore che governava il suo gregge per i tratturi della periferia, nella cui compagnia abbiamo trascorso lunghe e ripetute giornate. Non si poteva, allora, che trascrivere e descrivere i nomi pittoreschi del dialetto che ci indicava il volenteroso informatore lasciando intenzionalmente per dopo, come in effetti successe in parte, la ricerca più meticolosa della nomenclatura italiana affidandoci alla collaborazione degli amici e conoscenti del posto, specialisti in agraria e in botanica, ma soprattutto attingendo da un erbario illustrato che per caso è caduto nelle nostre mani, per delucidare i legittimi dubbi che ci perseguivano. Non è stato possibile, tuttavia, identificare il cento per cento del materiale raccolto tanto che per sette o otto voci non abbiamo trovato miglior forma che registrarle sotto il nome generico di ERBE rimandando alla consulta del Lessico per una sintetica descrizione delle loro caratteristiche. Anche per quanto riguarda la grammatica ci siamo limitati all’essenziale, riportando appena la categoria del lemma italiano in esponente, che di solito coincide con il corrispondente in dialetto. Solo nel caso dei sostantivi abbiamo optato nel santacrocese per l’uso degli articoli con il fine di precisarne il genere e il numero. Per i verbi irregolari delle voci dialettali, finalmente, si è indicato, accanto all’infinito, il participio passato.`,
      },
      {
        text: `Con questo nuovo volume poniamo punto finale alla raccolta lessicale del santacrocese co- sciente di aver lasciato, sicuramente, un materiale prezioso nel dimenticatoio. Ma non si poteva fare di più a quasi diecimila chilometri di distanza... La speranza è che partendo da questa fonte, e prima che scompaiano gli ultimi superstiti di questa nostra ricca civiltà alimentata dalla saggezza dei nonni, uno o più studiosi volenterosi del posto s’impegnino nel riscatto di quanto sia potuto sfuggire alla nostra penna.`,
      },
    ],
  },
  id35: {
    description: [
      {
        text: `Testo ripreso dal volume ALTROVE, di Norberto Lombardi, in cui l’autore raccoglie venti interviste effettuate in circostanze, ambienti e tempi diversi a personalità, di origine molisana, che hanno lasciato un segno profondo e riconoscibile nei campi della letteratura, dell’arte, della saggistica, dell’impegno sociale e civile o che sono tutt’ora attive nelle reti globali della scienza e della ricerca. Il filo che le congiunge è un’intensa cultura dell’Altrove, vissuta e concepita non come lontananza e separazione, ma come opportunità, arricchimento e scambio, e nella diversità delle esperienze affiorano numerosi i motivi di riflessione e di elaborazione che possono aiutarci a leggere alcuni tratti salienti della contemporaneità”. Tra gli intervistati Michele Castelli, originario di Santa Croce di Magliano (CB), residente a Caracas, Venezuela.`,
      },
    ],
  },
};

const booksData = [
  { id: 35, name: 'Michele Castelli - Autobiografía' },
  { id: 29, name: 'Dieci fiabe per i miei nipotini' },
  { id: 30, name: 'IL TESORO SFUMATO' },
  { id: 28, name: 'DIÁSPORA. Cuentos de emigración. Versión en español' },
  { id: 33, name: 'DIÁSPORA. Cuentos de emigración. Versión en italiano' },
  { id: 34, name: 'DIÁSPORA. Cuentos de emigración. Versión en Portugués.' },
  { id: 31, name: 'Con los ojos de Agnese' },
  { id: 32, name: 'C’era una volta... Giuseppe' },
  { id: 10, name: 'Curso de fonética del español de Venezuela' },
  { id: 15, name: 'Antologia Poetica Dialectale, di Raffaele Caprigliore' },
  { id: 6, name: 'Il lessico Santacrocese' },
  { id: 9, name: 'Cuentos de inmigrantes' },
  { id: 16, name: `"Italiani mata burros" e altre storie di migranti in Venezuela` },
  { id: 5, name: 'Hámichel. Nicola Iacobacci' },
  { id: 24, name: 'Grammatica comparata italiano-santacrocese' },
  { id: 1, name: 'La presenza dei molisani in venezuela' },
  { id: 2, name: 'La vida fantástica de Corrado Galzio' },
  { id: 3, name: 'In nome del padre (C’era una vola... Giuseppe)' },
  { id: 4, name: 'Le poesie dialettali di Pietro Mastrangelo' },
  { id: 7, name: 'Cuentos de mi vida' },
  { id: 8, name: 'Erase una vez Giuseppe' },
  { id: 11, name: 'Novelle Scelte di Hector Mujica' },
  { id: 12, name: `Poesías. Nicola Iacobacci` },
  { id: 13, name: `La rampicante. Romulo Gallegos` },
  { id: 17, name: `Poesie e canzoni inedite di Pietro Mastrangelo` },
  { id: 18, name: `Poesie dialetali scelte di Francesco Cocco` },
  { id: 19, name: `Cómo leer y escribir el italiano` },
  { id: 20, name: `Racconti di vita. Prima parte` },
  { id: 36, name: `Racconti di vita. Seconda parte` },
  { id: 21, name: `Modi di dire, espressioni, indovinelli, giochi, filastrocche, metafore ed altro del dialetto di Santa Croce di Magliano` },
  { id: 22, name: 'Cuentos de mi vida. Parte II' },
  { id: 23, name: 'Ce stéve na vòte' },
  { id: 25, name: `Nove poesie dialettali di Italo D'onofrio` },
  { id: 26, name: 'Il poeta del molise: Nicola Iacobacci vita e opere' },
  { id: 27, name: 'Dizionario essenziale Italiano-Santacrocese' }
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

async function run() {
  console.log("Starting text updates...");

  for (const book of booksData) {
    const slug = generateSlug(book.name);
    const key = `id${book.id}`;
    const esData = esTranslations[key];
    const itData = itTranslations[key];

    let descriptionObj = { es: '', it: '' };
    
    // Description text processing
    if (esData && esData.description) {
      descriptionObj.es = esData.description.map((d: any) => d.text).join('\n\n');
    }
    if (itData && itData.description) {
      descriptionObj.it = itData.description.map((d: any) => d.text).join('\n\n');
    }

    // Fetch existing book to update images captions
    const { data: existingBook } = await supabase.from('books').select('images').eq('id', slug).single();
    
    let updatedImages = existingBook?.images;
    if (updatedImages && Array.isArray(updatedImages)) {
      updatedImages = updatedImages.map((img: any, idx: number) => {
        let esCaption = '';
        let itCaption = '';

        if (esData && esData.gallery && esData.gallery[idx]) {
          esCaption = esData.gallery[idx].text;
        }
        if (itData && itData.gallery && itData.gallery[idx]) {
          itCaption = itData.gallery[idx].text;
        }

        return {
          ...img,
          caption: {
            es: esCaption,
            it: itCaption
          }
        };
      });
    }

    console.log(`Updating book: ${slug}`);
    
    const updatePayload: any = {};
    if (descriptionObj.es || descriptionObj.it) {
       updatePayload.description = descriptionObj;
    }
    if (updatedImages) {
       updatePayload.images = updatedImages;
    }

    if (Object.keys(updatePayload).length > 0) {
      const { error } = await supabase.from('books').update(updatePayload).eq('id', slug);
      if (error) {
        console.error(`Error updating ${slug}:`, error.message);
      } else {
        console.log(`Successfully updated ${slug}`);
      }
    } else {
       console.log(`No updates for ${slug}`);
    }
  }

  console.log("Text updates complete.");
}

run();
