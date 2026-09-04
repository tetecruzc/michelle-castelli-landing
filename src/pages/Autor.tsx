import { ArticleForm } from '@/components/ArticleForm';
import { BookForm } from '@/components/BookForm';
import { Footer } from '@/components/Footer';
import { GalleryForm } from '@/components/GalleryForm';
import { Header } from '@/components/Header';
import { InterviewForm } from '@/components/InterviewForm';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import type { Article } from '@/data/articles';
import type { Book } from '@/data/books';
import type { Interview } from '@/data/interviews';
import { useArticles } from '@/hooks/useArticles';
import { toggleFeaturedBook, updateBooksOrder, useBooks } from '@/hooks/useBooks';
import { useGallery, updateGalleryOrder, type GalleryPhoto } from '@/hooks/useGallery';
import { useInterviews } from '@/hooks/useInterviews';
import { useMessages } from '@/hooks/useMessages';
import { supabase } from '@/lib/supabase';
import { closestCenter, DndContext, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, rectSortingStrategy, SortableContext, sortableKeyboardCoordinates, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useQueryClient } from '@tanstack/react-query';
import { Reorder } from 'framer-motion';
import { BookOpen, Calendar, Download, FileText, GripVertical, ImageIcon, Loader2, LogOut, Mail, MessageSquare, Pencil, Plus, Star, Youtube } from 'lucide-react';
import { useEffect, useState } from 'react';

function SortableBookCard({ book, onEdit, onToggleFeatured }: { book: Book; onEdit: (book: Book) => void; onToggleFeatured: (book: Book) => void }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: book.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
    opacity: isDragging ? 0.8 : 1,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <Card className="overflow-hidden group hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 border-border/40 bg-card/60 backdrop-blur-md rounded-xl flex flex-col relative h-full">
        {/* Drag handle */}
        <div 
          className="absolute top-3 right-3 z-20 p-2 bg-black/60 hover:bg-black/90 backdrop-blur-sm rounded-md cursor-grab active:cursor-grabbing text-white transition-colors"
          {...attributes}
          {...listeners}
        >
          <GripVertical size={18} />
        </div>

        {/* Featured toggle */}
        <div className="absolute top-3 left-3 z-20">
          <Button 
            variant="ghost" 
            size="icon" 
            title="Destacar en Inicio"
            className={`h-9 w-9 rounded-full transition-colors ${book.is_featured ? 'text-yellow-500 hover:text-yellow-600 bg-white/90 shadow-sm' : 'text-white/80 hover:bg-white/90 hover:text-yellow-500 bg-black/40 backdrop-blur-sm'}`} 
            onClick={(e) => { e.stopPropagation(); onToggleFeatured(book); }}
          >
            <Star className="h-4 w-4" fill={book.is_featured ? 'currentColor' : 'none'} />
          </Button>
        </div>
        
        <div className="aspect-[2/3] relative bg-muted overflow-hidden">
          <img
            src={book.cover}
            alt={book.title.es}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-6 translate-y-4 group-hover:translate-y-0 pointer-events-none">
            <Button
              variant="default"
              className="w-full gap-2 bg-white text-black hover:bg-gray-100 shadow-xl rounded-full h-11 font-medium transition-transform pointer-events-auto"
              onClick={() => onEdit(book)}
            >
              <Pencil className="h-4 w-4" />
              Editar Obra
            </Button>
          </div>
        </div>
        <CardHeader className="py-5 px-6 flex-1">
          <div className="flex flex-col gap-1.5 h-full">
            <p className="text-xs font-bold tracking-widest text-primary uppercase">{book.year}</p>
            <h3 className="font-display font-medium text-lg leading-tight line-clamp-2 text-foreground group-hover:text-primary transition-colors duration-300">
              {book.title.es}
            </h3>
          </div>
        </CardHeader>
      </Card>
    </div>
  );
}

function SortableGalleryCard({ photo, onEdit }: { photo: GalleryPhoto; onEdit: (photo: GalleryPhoto) => void }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: photo.id });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
    opacity: isDragging ? 0.8 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="break-inside-avoid">
      <Card className="relative overflow-hidden group hover:shadow-xl transition-all duration-300 border-border/40 bg-card/60 backdrop-blur-md rounded-xl flex flex-col hover:-translate-y-1">
        <div 
          className="absolute top-3 right-3 z-20 p-2 bg-black/60 hover:bg-black/90 backdrop-blur-sm rounded-md cursor-grab active:cursor-grabbing text-white transition-colors"
          {...attributes}
          {...listeners}
        >
          <GripVertical size={18} />
        </div>
        <div className="relative">
          <img 
            src={photo.image_url} 
            alt="Gallery item" 
            className="w-full h-auto object-cover"
          />
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
             <Button 
               variant="secondary"
               size="sm"
               className="gap-2 shadow-xl"
               onClick={(e) => { e.stopPropagation(); onEdit(photo); }}
             >
               <Pencil className="h-4 w-4" />
               Editar Foto
             </Button>
          </div>
        </div>
        <div className="p-4 border-t border-border/40">
           <p className="text-sm text-foreground line-clamp-3 leading-relaxed">
             {photo.text}
           </p>
        </div>
      </Card>
    </div>
  );
}

const getYoutubeVideoId = (url: string) => {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
};

export default function Autor() {
  const { user, loading: authLoading, signIn, signOut } = useAuth();
  const { books, isLoading: booksLoading, refetch } = useBooks();
  const { interviews, loading: interviewsLoading, updateOrder, setFeaturedInterview, refresh: refetchInterviews } = useInterviews();
  const { articles, isLoading: articlesLoading, refetch: refetchArticles } = useArticles();
  const { photos: galleryPhotos, isLoading: galleryLoading, refetch: refetchGallery } = useGallery();
  const { messages, isLoading: messagesLoading, unreadCount, markAsRead } = useMessages();

  const queryClient = useQueryClient();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loginSubmitting, setLoginSubmitting] = useState(false);

  const [activeTab, setActiveTab] = useState('libros');

  const [formOpen, setFormOpen] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);

  const [interviewFormOpen, setInterviewFormOpen] = useState(false);
  const [editingInterview, setEditingInterview] = useState<Interview | null>(null);

  const [articleFormOpen, setArticleFormOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  
  const [articleCategoryFilter, setArticleCategoryFilter] = useState<string>('todos');

  const [galleryFormOpen, setGalleryFormOpen] = useState(false);
  const [editingGalleryPhoto, setEditingGalleryPhoto] = useState<GalleryPhoto | null>(null);
  const [galleryCategoryFilter, setGalleryCategoryFilter] = useState<number>(1);

  const [selectedMessage, setSelectedMessage] = useState<any>(null);

  const [orderedInterviews, setOrderedInterviews] = useState<Interview[]>([]);
  const [orderedBooks, setOrderedBooks] = useState<Book[]>([]);
  const [orderedGallery, setOrderedGallery] = useState<GalleryPhoto[]>([]);
  
  useEffect(() => {
    setOrderedInterviews(interviews);
  }, [interviews]);

  useEffect(() => {
    setOrderedBooks(books);
  }, [books]);

  useEffect(() => {
    setOrderedGallery(galleryPhotos);
  }, [galleryPhotos]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEndBooks = async (event: any) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      setOrderedBooks((items) => {
        const oldIndex = items.findIndex((i) => i.id === active.id);
        const newIndex = items.findIndex((i) => i.id === over.id);
        const newArray = arrayMove(items, oldIndex, newIndex);
        
        // Update database in background
        const updates = newArray.map((b, idx) => ({ id: b.id, position: idx }));
        updateBooksOrder(updates).catch(console.error);
        
        return newArray;
      });
    }
  };

  const handleDragEndGallery = async (event: any) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      setOrderedGallery((items) => {
        const oldIndex = items.findIndex((i) => i.id === active.id);
        const newIndex = items.findIndex((i) => i.id === over.id);
        const newArray = arrayMove(items, oldIndex, newIndex);
        
        // Update database in background
        const updates = newArray.map((p, idx) => ({ id: p.id, original_id: idx }));
        updateGalleryOrder(updates).catch(console.error);
        
        return newArray;
      });
    }
  };

  const handleToggleFeatured = async (book: Book) => {
    try {
      await toggleFeaturedBook(book.id, !book.is_featured);
      refetch();
    } catch (err) {
      console.error('Error toggling featured:', err);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setLoginSubmitting(true);
    const { error } = await signIn(email, password);
    setLoginSubmitting(false);
    if (error) {
      setLoginError(error.message || 'Error al iniciar sesión.');
      return;
    }
  };

  const handleOpenCreate = () => {
    setEditingBook(null);
    setFormOpen(true);
  };

  const handleOpenEdit = (book: Book) => {
    setEditingBook(book);
    setFormOpen(true);
  };

  const handleFormSuccess = () => {
    setFormOpen(false);
    setEditingBook(null);
    queryClient.invalidateQueries({ queryKey: ['books'] });
    refetch();
  };

  const handleFormCancel = () => {
    setFormOpen(false);
    setEditingBook(null);
  };

  const handleOpenCreateInterview = () => {
    setEditingInterview(null);
    setInterviewFormOpen(true);
  };

  const handleOpenEditInterview = (interview: Interview) => {
    setEditingInterview(interview);
    setInterviewFormOpen(true);
  };

  const handleInterviewFormSuccess = () => {
    setInterviewFormOpen(false);
    setEditingInterview(null);
    refetchInterviews();
  };

  const handleInterviewFormCancel = () => {
    setInterviewFormOpen(false);
    setEditingInterview(null);
  };

  const handleOpenCreateArticle = () => {
    setEditingArticle(null);
    setArticleFormOpen(true);
  };

  const handleOpenEditArticle = (article: Article) => {
    setEditingArticle(article);
    setArticleFormOpen(true);
  };

  const handleArticleFormSuccess = () => {
    setArticleFormOpen(false);
    setEditingArticle(null);
    refetchArticles();
  };

  const handleArticleFormCancel = () => {
    setArticleFormOpen(false);
    setEditingArticle(null);
  };

  const handleOpenCreateGallery = () => {
    setEditingGalleryPhoto(null);
    setGalleryFormOpen(true);
  };

  const handleOpenEditGallery = (photo: GalleryPhoto) => {
    setEditingGalleryPhoto(photo);
    setGalleryFormOpen(true);
  };

  const handleGalleryFormSuccess = () => {
    setGalleryFormOpen(false);
    setEditingGalleryPhoto(null);
    refetchGallery();
  };

  const handleGalleryFormCancel = () => {
    setGalleryFormOpen(false);
    setEditingGalleryPhoto(null);
  };

  const handleReorder = (newOrder: Interview[]) => {
    setOrderedInterviews(newOrder);
  };

  const handleDragEnd = async () => {
    await updateOrder(orderedInterviews.map(i => i.id));
  };

  if (!supabase) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="pt-28 pb-16 container mx-auto px-6">
          <p className="text-muted-foreground text-center py-12">
            Configura Supabase (VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY) para usar el panel del autor.
          </p>
        </main>
        <Footer />
      </div>
    );
  }

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col md:flex-row bg-background">
        {/* Left Panel - Visual/Quote */}
        <div className="hidden md:flex md:w-1/2 bg-hero text-hero-foreground flex-col justify-between p-12 relative overflow-hidden">
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/40 via-transparent to-transparent" />
          
          <div className="relative z-10 flex items-center gap-3 animate-fade-in-up">
            <span className="font-display text-xl font-semibold tracking-wider uppercase">Michele Castelli</span>
          </div>

          <div className="relative z-10 max-w-md animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <div className="mb-8 opacity-90">
              <BookOpen className="h-12 w-12 text-primary" />
            </div>
            <h2 className="font-display text-4xl lg:text-5xl leading-tight mb-6">
              "Lo más bonito que hay en la vida es perdonar"
            </h2>
            <p className="text-lg opacity-80 font-light text-body">
              Panel de administración exclusivo para la gestión del catálogo literario y obras publicadas.
            </p>
          </div>

          <div className="relative z-10 text-sm opacity-60 text-body animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            &copy; {new Date().getFullYear()} Michele Castelli. Todos los derechos reservados.
          </div>
        </div>

        {/* Right Panel - Login Form */}
        <div className="flex-1 flex flex-col justify-center items-center p-8 md:p-12 relative bg-section-alt/30">
          {/* Mobile Header */}
          <div className="md:hidden absolute top-8 left-8 flex items-center gap-2">
             <BookOpen className="h-5 w-5 text-primary" />
             <span className="font-display text-lg font-semibold uppercase">Michele Castelli</span>
          </div>

          <div className="w-full max-w-md space-y-8 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            <div className="text-center md:text-left">
              <h1 className="font-display text-3xl font-bold text-foreground mb-2">Bienvenido de nuevo</h1>
              <p className="text-muted-foreground">
                Inicia sesión en tu cuenta de autor para continuar.
              </p>
            </div>

            <Card className="border-border/50 shadow-2xl bg-card/60 backdrop-blur-xl">
              <CardContent className="pt-8">
                <form onSubmit={handleLogin} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="autor-email" className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                      Correo Electrónico
                    </Label>
                    <Input
                      id="autor-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="tu@email.com"
                      required
                      autoComplete="email"
                      className="h-12 bg-background/80 border-border focus:ring-primary transition-all duration-300"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="autor-password" className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                      Contraseña
                    </Label>
                    <Input
                      id="autor-password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      autoComplete="current-password"
                      className="h-12 bg-background/80 border-border focus:ring-primary transition-all duration-300"
                    />
                  </div>
                  
                  {loginError && (
                    <div className="p-3 rounded-md bg-destructive/10 border border-destructive/20 flex items-start gap-2 animate-in fade-in slide-in-from-top-2">
                      <span className="text-sm text-destructive font-medium">
                        {loginError}
                      </span>
                    </div>
                  )}

                  <Button 
                    type="submit" 
                    className="w-full h-12 text-md font-medium tracking-wide shadow-lg hover:shadow-primary/25 transition-all duration-300" 
                    disabled={loginSubmitting}
                  >
                    {loginSubmitting ? (
                      <span className="flex items-center gap-2">
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Entrando...
                      </span>
                    ) : (
                      'Acceder al Panel'
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            <div className="text-center md:text-left mt-8">
              <a href="/" className="text-sm text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-2 group">
                <span className="group-hover:-translate-x-1 transition-transform duration-300">&larr;</span> Volver a la página principal
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-section-alt/30">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full flex-1 flex flex-col">
        {/* Dashboard Header */}
        <div className="relative bg-hero text-hero-foreground pt-10 overflow-hidden shadow-lg">
          <div className="absolute inset-0 opacity-30 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/50 via-transparent to-transparent" />
          <div className="container mx-auto px-6 max-w-7xl relative z-10 pb-8">
            
            {/* Top Bar Navigation */}
            <div className="flex justify-end items-center gap-6 mb-8 animate-fade-in-up">
              <a href="/" className="text-sm font-medium text-white/60 hover:text-white flex items-center gap-2 transition-colors">
                <BookOpen className="h-4 w-4" />
                Ir a página inicial
              </a>
              <button onClick={() => signOut()} className="text-sm font-medium text-white/60 hover:text-white flex items-center gap-2 transition-colors">
                <LogOut className="h-4 w-4" />
                Cerrar sesión
              </button>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-8">
              <div className="animate-fade-in-up">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/20 text-primary-foreground mb-6 text-xs font-semibold tracking-widest uppercase border border-primary/30 backdrop-blur-md shadow-sm">
                  <BookOpen size={14} />
                  <span>Administración</span>
                </div>
                <h1 className="font-display text-4xl sm:text-5xl font-bold mb-4 tracking-tight">Panel del Autor</h1>
                <p className="text-hero-foreground/80 max-w-2xl text-lg font-light leading-relaxed">
                  Gestiona tu catálogo literario de forma centralizada. Los cambios que realices aquí se reflejarán instantáneamente en la página principal para todos tus lectores.
                </p>
              </div>
              
              <div className="flex flex-wrap items-center gap-4 animate-fade-in-up" style={{ animationDelay: '0.15s' }}>
                {activeTab === 'libros' ? (
                  <Button onClick={handleOpenCreate} className="gap-2 shadow-lg shadow-primary/25 bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-300 h-11 px-6 rounded-full">
                    <Plus className="h-5 w-5" />
                    Nueva obra
                  </Button>
                ) : activeTab === 'entrevistas' ? (
                  <Button onClick={handleOpenCreateInterview} className="gap-2 shadow-lg shadow-primary/25 bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-300 h-11 px-6 rounded-full">
                    <Plus className="h-5 w-5" />
                    Nueva entrevista
                  </Button>
                ) : activeTab === 'articulos' ? (
                  <Button onClick={handleOpenCreateArticle} className="gap-2 shadow-lg shadow-primary/25 bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-300 h-11 px-6 rounded-full">
                    <Plus className="h-5 w-5" />
                    Nuevo artículo
                  </Button>
                ) : activeTab === 'galeria' ? (
                  <Button onClick={handleOpenCreateGallery} className="gap-2 shadow-lg shadow-primary/25 bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-300 h-11 px-6 rounded-full">
                    <Plus className="h-5 w-5" />
                    Nueva foto
                  </Button>
                ) : null}
              </div>
            </div>
          </div>
          
          <div className="border-t border-white/10 bg-black/20 backdrop-blur-md relative z-10">
            <div className="container mx-auto px-6 max-w-7xl overflow-x-auto no-scrollbar">
              <TabsList className="bg-transparent p-0 h-14 flex items-center gap-6 justify-start border-none rounded-none">
                <TabsTrigger value="libros" className="rounded-none border-b-2 border-transparent data-[state=active]:border-white data-[state=active]:bg-transparent data-[state=active]:shadow-none py-4 px-2 text-sm font-medium text-white/70 data-[state=active]:text-white hover:text-white transition-all">Obras</TabsTrigger>
                <TabsTrigger value="entrevistas" className="rounded-none border-b-2 border-transparent data-[state=active]:border-white data-[state=active]:bg-transparent data-[state=active]:shadow-none py-4 px-2 text-sm font-medium text-white/70 data-[state=active]:text-white hover:text-white transition-all">Entrevistas</TabsTrigger>
                <TabsTrigger value="articulos" className="rounded-none border-b-2 border-transparent data-[state=active]:border-white data-[state=active]:bg-transparent data-[state=active]:shadow-none py-4 px-2 text-sm font-medium text-white/70 data-[state=active]:text-white hover:text-white transition-all">Artículos</TabsTrigger>
                <TabsTrigger value="galeria" className="rounded-none border-b-2 border-transparent data-[state=active]:border-white data-[state=active]:bg-transparent data-[state=active]:shadow-none py-4 px-2 text-sm font-medium text-white/70 data-[state=active]:text-white hover:text-white transition-all">Galería</TabsTrigger>
                <TabsTrigger value="mensajes" className="rounded-none border-b-2 border-transparent data-[state=active]:border-white data-[state=active]:bg-transparent data-[state=active]:shadow-none py-4 px-2 text-sm font-medium text-white/70 data-[state=active]:text-white hover:text-white transition-all flex items-center gap-1.5">
                  Mensajes 
                  {unreadCount > 0 && <span className="bg-primary text-primary-foreground text-[9px] font-bold h-4 min-w-[16px] px-1 rounded-full flex items-center justify-center">{unreadCount}</span>}
                </TabsTrigger>
              </TabsList>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <main className="flex-1 py-10">
          <div className="container mx-auto px-6 max-w-7xl">

            <TabsContent value="libros" className="mt-0 focus-visible:outline-none">
              {booksLoading ? (
                <div className="flex flex-col items-center justify-center py-32 opacity-50">
                  <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
                  <p className="text-muted-foreground animate-pulse">Cargando tu biblioteca...</p>
                </div>
              ) : books.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 px-4 text-center animate-fade-in-up">
                  <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center mb-6 shadow-inner">
                    <BookOpen className="h-8 w-8 text-primary/70 group-hover:text-primary transition-colors duration-300" strokeWidth={1.5} />
                  </div>
                  <h3 className="text-xl font-display font-medium text-foreground mb-2">No tienes obras publicadas</h3>
                  <p className="text-muted-foreground text-sm max-w-[280px] mb-6">
                    Añade tu primera obra para que los visitantes puedan conocer tu trabajo.
                  </p>
                  <Button variant="outline" className="border-border shadow-sm font-medium h-10" onClick={handleOpenCreate}>
                    <Plus className="mr-2 h-4 w-4" />
                    Añadir mi primer libro
                  </Button>
                </div>
              ) : (
                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEndBooks}>
                  <SortableContext items={orderedBooks.map(b => b.id)} strategy={rectSortingStrategy}>
                    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 animate-fade-in-up">
                      {orderedBooks.map((book) => (
                        <SortableBookCard key={book.id} book={book} onEdit={handleOpenEdit} onToggleFeatured={handleToggleFeatured} />
                      ))}
                    </div>
                  </SortableContext>
                </DndContext>
              )}
            </TabsContent>

            <TabsContent value="entrevistas" className="mt-0 focus-visible:outline-none">
              {interviewsLoading ? (
                <div className="flex flex-col items-center justify-center py-32 opacity-50">
                  <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
                  <p className="text-muted-foreground animate-pulse">Cargando entrevistas...</p>
                </div>
              ) : interviews.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 px-4 text-center animate-fade-in-up">
                  <div className="w-20 h-20 bg-background border border-border/50 rounded-2xl flex items-center justify-center mb-8 shadow-sm group hover:border-primary/30 transition-colors duration-300">
                    <Youtube className="h-8 w-8 text-primary/70 group-hover:text-red-500 transition-colors duration-300" strokeWidth={1.5} />
                  </div>
                  <h3 className="text-2xl font-display text-foreground mb-3">No hay entrevistas</h3>
                  <p className="text-muted-foreground mb-10 text-lg max-w-md mx-auto font-light">
                    Añade videos y entrevistas donde hayas participado para mostrarlos al público.
                  </p>
                  <Button onClick={handleOpenCreateInterview} variant="outline" className="gap-2 shadow-sm rounded-full px-8 h-12 text-base border-border hover:border-primary/50 hover:bg-primary/5 transition-all duration-300">
                    <Plus className="h-5 w-5" />
                    Añadir entrevista
                  </Button>
                </div>
              ) : (
                <Reorder.Group axis="y" values={orderedInterviews} onReorder={handleReorder} className="flex flex-col gap-4 animate-fade-in-up max-w-5xl mx-auto">
                  {orderedInterviews.map((interview, index) => (
                    <Reorder.Item key={interview.id} value={interview} onDragEnd={handleDragEnd} className="cursor-grab active:cursor-grabbing">
                      <Card className="group hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border-border/40 bg-card/60 backdrop-blur-md rounded-2xl flex flex-row items-stretch md:items-center p-3 gap-3 md:gap-5">
                        <div className="w-8 shrink-0 flex flex-col items-center justify-center text-muted-foreground/30 transition-colors group-hover:text-foreground/70">
                          <GripVertical size={20} />
                        </div>
                        
                        {getYoutubeVideoId(interview.youtube_url) && (
                          <div className="hidden sm:block w-40 aspect-video shrink-0 bg-muted rounded-xl relative overflow-hidden shadow-sm border border-border/50">
                            <img 
                              src={`https://img.youtube.com/vi/${getYoutubeVideoId(interview.youtube_url)}/mqdefault.jpg`}
                              alt={interview.title.es}
                              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors flex items-center justify-center">
                              <Youtube className="w-8 h-8 text-white opacity-80 drop-shadow-md" />
                            </div>
                          </div>
                        )}

                        <div className="flex-1 flex flex-col md:flex-row gap-4 md:gap-6 items-start md:items-center min-w-0 py-2">
                          <div className="flex-1 flex flex-col min-w-0 w-full">
                            <div className="flex items-center justify-between mb-1.5">
                              <div className="flex items-center gap-2">
                                <Youtube className="text-red-500 h-4 w-4" />
                                <span className="text-[11px] font-bold tracking-wider text-muted-foreground uppercase">{interview.date_month_year}</span>
                              </div>
                              <span className="text-[10px] font-bold text-muted-foreground/50 uppercase tracking-widest md:hidden">
                                Orden: {index + 1}
                              </span>
                            </div>
                            <h3 className="font-display font-semibold text-lg leading-tight truncate text-foreground mb-1 group-hover:text-primary transition-colors">
                              {interview.title.es}
                            </h3>
                            <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                              {interview.description.es}
                            </p>
                          </div>
                          
                          <div className="flex w-full md:w-auto items-center justify-between md:justify-end gap-3 md:border-l border-border/50 md:pl-5 shrink-0">
                            <span className="text-[10px] font-bold text-muted-foreground/50 uppercase tracking-widest hidden md:inline-block mr-2">
                              Orden: {index + 1}
                            </span>
                            <div className="flex items-center gap-2">
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                title="Destacar en Inicio"
                                className={`h-10 w-10 rounded-full transition-colors ${interview.is_featured ? 'text-yellow-500 hover:text-yellow-600 bg-yellow-500/10' : 'text-muted-foreground hover:bg-yellow-500/10 hover:text-yellow-500'}`} 
                                onClick={(e) => { e.stopPropagation(); setFeaturedInterview(interview.id); }}
                              >
                                <Star className="h-4 w-4" fill={interview.is_featured ? 'currentColor' : 'none'} />
                              </Button>
                              
                              <Button
                                variant="outline"
                                className="gap-2 shadow-sm rounded-full h-10 px-5 font-medium border-border/50 hover:bg-primary/5 hover:border-primary/30 transition-all duration-300"
                                onClick={(e) => { e.stopPropagation(); handleOpenEditInterview(interview); }}
                              >
                                <Pencil className="h-3.5 w-3.5" />
                                Editar
                              </Button>
                            </div>
                          </div>
                        </div>
                      </Card>
                    </Reorder.Item>
                  ))}
                </Reorder.Group>
              )}
            </TabsContent>

            <TabsContent value="articulos" className="mt-0 focus-visible:outline-none">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <h2 className="text-2xl font-display font-bold">Artículos y publicaciones</h2>
                
                <div className="flex bg-muted/40 p-1 rounded-xl">
                  <button 
                    onClick={() => setArticleCategoryFilter('todos')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${articleCategoryFilter === 'todos' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                  >
                    Todos
                  </button>
                  <button 
                    onClick={() => setArticleCategoryFilter('la_voce_d_italia')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${articleCategoryFilter === 'la_voce_d_italia' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                  >
                    La voce d'Italia
                  </button>
                  <button 
                    onClick={() => setArticleCategoryFilter('otros')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${articleCategoryFilter === 'otros' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                  >
                    Otros
                  </button>
                </div>
              </div>

              {articlesLoading ? (
                <div className="flex flex-col items-center justify-center py-32 opacity-50">
                  <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
                  <p className="text-muted-foreground animate-pulse">Cargando artículos...</p>
                </div>
              ) : articles.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 px-4 text-center animate-fade-in-up">
                  <div className="w-20 h-20 bg-background border border-border/50 rounded-2xl flex items-center justify-center mb-8 shadow-sm group hover:border-primary/30 transition-colors duration-300">
                    <FileText className="h-8 w-8 text-primary/70 group-hover:text-primary transition-colors duration-300" strokeWidth={1.5} />
                  </div>
                  <h3 className="text-2xl font-display text-foreground mb-3">No hay artículos</h3>
                  <p className="text-muted-foreground mb-10 text-lg max-w-md mx-auto font-light">
                    Sube tus primeros documentos PDF para compartirlos con tus lectores.
                  </p>
                  <Button onClick={handleOpenCreateArticle} variant="outline" className="gap-2 shadow-sm rounded-full px-8 h-12 text-base border-border hover:border-primary/50 hover:bg-primary/5 transition-all duration-300">
                    <Plus className="h-5 w-5" />
                    Añadir artículo
                  </Button>
                </div>
              ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 animate-fade-in-up">
                  {articles.filter(a => articleCategoryFilter === 'todos' || a.category === articleCategoryFilter).map((article) => (
                    <Card key={article.id} className="overflow-hidden group hover:shadow-xl transition-all duration-300 border-border/40 bg-card/60 backdrop-blur-md rounded-2xl flex flex-col h-full hover:-translate-y-1">
                      <CardHeader className="py-6 px-6 flex-1 flex flex-col items-start gap-4">
                        <div className="w-12 h-12 bg-red-500/10 text-red-500 rounded-xl flex items-center justify-center shrink-0">
                          <FileText className="h-6 w-6" />
                        </div>
                        
                        <div className="flex-1 min-w-0 w-full space-y-2">
                          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                            {article.year && <span>{article.year}</span>}
                            {article.year && <span>&bull;</span>}
                            <span className="text-primary truncate">
                              {article.category === 'la_voce_d_italia' ? "La voce d'Italia" : "Otros"}
                            </span>
                          </div>
                          
                          <h3 className="font-display font-semibold text-xl leading-tight text-foreground group-hover:text-primary transition-colors line-clamp-3">
                            {article.title}
                          </h3>
                        </div>
                      </CardHeader>
                      
                      <div className="p-4 bg-muted/20 border-t border-border/40 flex items-center justify-between gap-3 mt-auto shrink-0">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="text-muted-foreground hover:text-white hover:bg-primary/90 transition-colors gap-1.5 px-3 h-9"
                          onClick={() => handleOpenEditArticle(article)}
                        >
                          <Pencil className="h-3.5 w-3.5" />
                          Editar
                        </Button>
                        
                        <Button 
                          variant="secondary"
                          size="sm" 
                          className="gap-2 h-9 rounded-full shadow-sm"
                          asChild
                        >
                          <a href={article.pdf_url} target="_blank" rel="noopener noreferrer">
                            Abrir PDF
                            <Download className="h-3.5 w-3.5" />
                          </a>
                        </Button>
                      </div>
                    </Card>
                  ))}
                  
                  {articles.filter(a => articleCategoryFilter === 'todos' || a.category === articleCategoryFilter).length === 0 && (
                    <div className="col-span-full py-12 text-center text-muted-foreground">
                      No hay artículos en esta categoría.
                    </div>
                  )}
                </div>
              )}
            </TabsContent>

            <TabsContent value="galeria" className="mt-0 focus-visible:outline-none">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <h2 className="text-2xl font-display font-bold">Gestión de galería</h2>
                
                <div className="flex bg-muted/40 p-1 rounded-xl overflow-x-auto max-w-full">
                  {[
                    { id: 1, name: 'Homenajes' },
                    { id: 2, name: 'Mi familia' },
                    { id: 3, name: 'Vida universitaria' },
                    { id: 4, name: 'Mis viajes' },
                    { id: 5, name: 'Varios' },
                    { id: 6, name: 'Condecoraciones' }
                  ].map(cat => (
                    <button 
                      key={cat.id}
                      onClick={() => setGalleryCategoryFilter(cat.id)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${galleryCategoryFilter === cat.id ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>

              {galleryLoading ? (
                <div className="flex flex-col items-center justify-center py-32 opacity-50">
                  <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
                  <p className="text-muted-foreground animate-pulse">Cargando galería...</p>
                </div>
              ) : orderedGallery.filter(p => p.category_id === galleryCategoryFilter).length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 px-4 text-center animate-fade-in-up">
                  <div className="w-20 h-20 bg-background border border-border/50 rounded-2xl flex items-center justify-center mb-8 shadow-sm group hover:border-primary/30 transition-colors duration-300">
                    <FileText className="h-8 w-8 text-primary/70 group-hover:text-primary transition-colors duration-300" strokeWidth={1.5} />
                  </div>
                  <h3 className="text-2xl font-display text-foreground mb-3">No hay fotos en esta categoría</h3>
                  <p className="text-muted-foreground mb-10 text-lg max-w-md mx-auto font-light">
                    Sube tus primeras fotos para enriquecer el álbum.
                  </p>
                  <Button onClick={handleOpenCreateGallery} variant="outline" className="gap-2 shadow-sm rounded-full px-8 h-12 text-base border-border hover:border-primary/50 hover:bg-primary/5 transition-all duration-300">
                    <Plus className="h-5 w-5" />
                    Añadir foto
                  </Button>
                </div>
              ) : (
                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEndGallery}>
                  <SortableContext items={orderedGallery.filter(p => p.category_id === galleryCategoryFilter).map(p => p.id)} strategy={rectSortingStrategy}>
                    <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-6 space-y-6">
                      {orderedGallery.filter(p => p.category_id === galleryCategoryFilter).map((photo) => (
                        <SortableGalleryCard key={photo.id} photo={photo} onEdit={handleOpenEditGallery} />
                      ))}
                    </div>
                  </SortableContext>
                </DndContext>
              )}
            </TabsContent>

            <TabsContent value="mensajes" className="mt-0 focus-visible:outline-none">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <h2 className="text-2xl font-display font-bold">Mensajes de contacto</h2>
              </div>

              {messagesLoading ? (
                <div className="flex flex-col items-center justify-center py-32 opacity-50">
                  <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
                  <p className="text-muted-foreground animate-pulse">Cargando mensajes...</p>
                </div>
              ) : messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 px-4 text-center animate-fade-in-up">
                  <div className="w-20 h-20 bg-background border border-border/50 rounded-2xl flex items-center justify-center mb-8 shadow-sm group hover:border-primary/30 transition-colors duration-300">
                    <MessageSquare className="h-8 w-8 text-primary/70 group-hover:text-primary transition-colors duration-300" strokeWidth={1.5} />
                  </div>
                  <h3 className="text-2xl font-display text-foreground mb-3">No hay mensajes aún</h3>
                  <p className="text-muted-foreground text-lg max-w-md mx-auto font-light">
                    Cuando los visitantes te envíen un mensaje desde el formulario de contacto, aparecerán aquí.
                  </p>
                </div>
              ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 animate-fade-in-up">
                  {messages.map((msg) => (
                    <Card 
                      key={msg.id} 
                      onClick={() => {
                        setSelectedMessage(msg);
                        if (!msg.is_read) markAsRead(msg.id);
                      }}
                      className={`overflow-hidden group hover:shadow-xl transition-all duration-300 border-border/40 backdrop-blur-md rounded-2xl flex flex-col h-full hover:-translate-y-1 p-6 cursor-pointer relative ${!msg.is_read ? 'bg-primary/5 shadow-md border-primary/20' : 'bg-card/60'}`}
                    >
                      {!msg.is_read && (
                        <div className="absolute top-4 right-4 w-2.5 h-2.5 bg-primary rounded-full shadow-[0_0_8px_rgba(var(--primary),0.8)]" />
                      )}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1 min-w-0 pr-6">
                          <h3 className={`font-display font-semibold text-lg truncate ${!msg.is_read ? 'text-foreground' : 'text-foreground/80'}`}>{msg.name}</h3>
                          <div className="text-sm text-primary flex items-center gap-1.5 mt-1 truncate">
                            <Mail className="h-3.5 w-3.5 shrink-0" />
                            <span className="truncate">{msg.email}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-xs text-muted-foreground flex items-center gap-1.5 mb-4 border-b border-border/40 pb-4 shrink-0">
                        <Calendar className="h-3.5 w-3.5 shrink-0" />
                        {new Intl.DateTimeFormat('es-ES', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(msg.created_at))}
                      </div>
                      <div className="text-sm leading-relaxed flex-1 break-words line-clamp-3 text-muted-foreground group-hover:text-foreground/80 transition-colors">
                        {msg.message}
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </div>
        </main>
      </Tabs>
      
      <Footer />

      {/* Modal for viewing message */}
      <Dialog open={!!selectedMessage} onOpenChange={(open) => !open && setSelectedMessage(null)}>
        <DialogContent aria-describedby={undefined} className="max-w-2xl p-0 overflow-hidden border-border shadow-2xl bg-background sm:rounded-[2rem] flex flex-col max-h-[90vh]">
          {selectedMessage && (
            <>
              <DialogHeader className="px-8 pt-8 pb-6 bg-muted/10 border-b border-border/50 shrink-0">
                <DialogTitle className="text-2xl font-display text-foreground flex items-center gap-4">
                  <span className="truncate">Mensaje de {selectedMessage.name}</span>
                </DialogTitle>
                <div className="mt-4 flex flex-col sm:flex-row sm:items-center gap-4 text-sm text-muted-foreground">
                  <a href={`mailto:${selectedMessage.email}`} className="flex items-center gap-2 text-primary hover:underline">
                    <Mail className="h-4 w-4 shrink-0" />
                    <span className="truncate">{selectedMessage.email}</span>
                  </a>
                  <div className="hidden sm:block">&bull;</div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 shrink-0" />
                    {new Intl.DateTimeFormat('es-ES', { dateStyle: 'long', timeStyle: 'short' }).format(new Date(selectedMessage.created_at))}
                  </div>
                </div>
              </DialogHeader>
              <div className="px-8 overflow-y-auto">
                <p className="text-base text-foreground/90 leading-relaxed whitespace-pre-wrap">
                  {selectedMessage.message}
                </p>
              </div>
              <div className="p-6 bg-muted/20 border-t border-border/50 flex justify-end shrink-0">
                <Button variant="outline" onClick={() => setSelectedMessage(null)} className="rounded-full px-6 hover:bg-muted hover:text-foreground">
                  Cerrar
                </Button>
                <Button 
                  onClick={() => window.location.href = `mailto:${selectedMessage.email}`}
                  className="ml-3 rounded-full px-6 gap-2 border border-primary/20 shadow-sm"
                >
                  <Mail className="h-4 w-4" />
                  Responder por correo
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={formOpen} onOpenChange={(open) => !open && handleFormCancel()}>
        <DialogContent aria-describedby={undefined} className="max-w-5xl p-0 overflow-hidden border-border shadow-2xl bg-background sm:rounded-[2rem] flex flex-col max-h-[90vh]">
          <DialogHeader className="px-8 pt-8 pb-5 bg-muted/10 border-b border-border/50 shrink-0">
            <DialogTitle className="text-3xl font-display text-foreground flex items-center gap-4">
              {editingBook ? (
                <>
                  <div className="p-2.5 bg-primary/10 rounded-xl">
                    <Pencil className="h-6 w-6 text-primary" />
                  </div>
                  Editar obra
                </>
              ) : (
                <>
                  <div className="p-2.5 bg-primary/10 rounded-xl">
                    <Plus className="h-6 w-6 text-primary" />
                  </div>
                  Añadir nueva obra
                </>
              )}
            </DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-hidden flex flex-col">
            <BookForm
              book={editingBook}
              onSuccess={handleFormSuccess}
              onCancel={handleFormCancel}
            />
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal for Interviews */}
      <Dialog open={interviewFormOpen} onOpenChange={(open) => !open && handleInterviewFormCancel()}>
        <DialogContent aria-describedby={undefined} className="max-w-5xl p-0 overflow-hidden border-border shadow-2xl bg-background sm:rounded-[2rem] flex flex-col max-h-[90vh]">
          <DialogHeader className="px-8 pt-8 pb-5 bg-muted/10 border-b border-border/50 shrink-0">
            <DialogTitle className="text-3xl font-display text-foreground flex items-center gap-4">
              {editingInterview ? (
                <>
                  <div className="p-2.5 bg-primary/10 rounded-xl">
                    <Pencil className="h-6 w-6 text-primary" />
                  </div>
                  Editar entrevista
                </>
              ) : (
                <>
                  <div className="p-2.5 bg-primary/10 rounded-xl">
                    <Youtube className="h-6 w-6 text-red-500" />
                  </div>
                  Añadir nueva entrevista
                </>
              )}
            </DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-hidden flex flex-col">
            <InterviewForm
              interview={editingInterview}
              onSuccess={handleInterviewFormSuccess}
              onCancel={handleInterviewFormCancel}
            />
          </div>
        </DialogContent>
      </Dialog>
      {/* Modal for Articles */}
      <Dialog open={articleFormOpen} onOpenChange={(open) => !open && handleArticleFormCancel()}>
        <DialogContent aria-describedby={undefined} className="max-w-md p-0 overflow-hidden border-border shadow-2xl bg-background sm:rounded-[2rem] flex flex-col max-h-[90vh]">
          <DialogHeader className="px-8 pt-8 pb-5 bg-muted/10 border-b border-border/50 shrink-0">
            <DialogTitle className="text-2xl font-display text-foreground flex items-center gap-4">
              {editingArticle ? (
                <>
                  <div className="p-2.5 bg-primary/10 rounded-xl">
                    <Pencil className="h-5 w-5 text-primary" />
                  </div>
                  Editar artículo
                </>
              ) : (
                <>
                  <div className="p-2.5 bg-primary/10 rounded-xl">
                    <FileText className="h-6 w-6 text-primary" />
                  </div>
                  Añadir nuevo artículo
                </>
              )}
            </DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-hidden flex flex-col">
            <ArticleForm
              article={editingArticle}
              onSuccess={handleArticleFormSuccess}
              onCancel={handleArticleFormCancel}
            />
          </div>
        </DialogContent>
      </Dialog>
      {/* Modal for Gallery */}
      <Dialog open={galleryFormOpen} onOpenChange={(open) => !open && handleGalleryFormCancel()}>
        <DialogContent aria-describedby={undefined} className="max-w-5xl p-0 overflow-hidden border-border shadow-2xl bg-background sm:rounded-[2rem] flex flex-col max-h-[90vh]">
          <DialogHeader className="px-8 pt-8 pb-5 bg-muted/10 border-b border-border/50 shrink-0">
            <DialogTitle className="text-3xl font-display text-foreground flex items-center gap-4">
              {editingGalleryPhoto ? (
                <>
                  <div className="p-2.5 bg-primary/10 rounded-xl">
                    <Pencil className="h-6 w-6 text-primary" />
                  </div>
                  Editar foto de galería
                </>
              ) : (
                <>
                  <div className="p-2.5 bg-primary/10 rounded-xl">
                    <ImageIcon className="h-6 w-6 text-primary" />
                  </div>
                  Nueva foto de galería
                </>
              )}
            </DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-hidden flex flex-col">
            <GalleryForm
              photo={editingGalleryPhoto}
              onSuccess={handleGalleryFormSuccess}
              onCancel={handleGalleryFormCancel}
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
