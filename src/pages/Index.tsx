import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';
import { FeaturedBook } from '@/components/FeaturedBook';
import { About } from '@/components/About';
import { BooksCarousel } from '@/components/BooksCarousel';
import { Interviews } from '@/components/Interviews';
import { Contact } from '@/components/Contact';
import { Footer } from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Hero />
        <FeaturedBook />
        <About />
        <BooksCarousel />
        <Interviews />
        <Contact />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
