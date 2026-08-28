import { BookForm } from '@/components/BookForm';
import { Footer } from '@/components/Footer';
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
import type { Book } from '@/data/books';
import type { Interview } from '@/data/interviews';
import { useBooks } from '@/hooks/useBooks';
import { useInterviews } from '@/hooks/useInterviews';
import { supabase } from '@/lib/supabase';
import { useQueryClient } from '@tanstack/react-query';
import { ArrowDown, ArrowUp, BookOpen, Loader2, LogOut, Pencil, Plus, Youtube, Star } from 'lucide-react';
import { useState } from 'react';

export default function Autor() {
  const { user, loading: authLoading, signIn, signOut } = useAuth();
  const { books, isLoading: booksLoading, refetch } = useBooks();
  const { interviews, loading: interviewsLoading, updateOrder, setFeaturedInterview, refresh: refetchInterviews } = useInterviews();

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

  const handleMoveUp = async (index: number) => {
    if (index === 0) return;
    const newOrder = [...interviews];
    [newOrder[index - 1], newOrder[index]] = [newOrder[index], newOrder[index - 1]];
    await updateOrder(newOrder.map(i => i.id));
  };

  const handleMoveDown = async (index: number) => {
    if (index === interviews.length - 1) return;
    const newOrder = [...interviews];
    [newOrder[index + 1], newOrder[index]] = [newOrder[index], newOrder[index + 1]];
    await updateOrder(newOrder.map(i => i.id));
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
      <Header />
      
      {/* Dashboard Header */}
      <div className="relative bg-hero text-hero-foreground pt-36 pb-16 overflow-hidden shadow-lg">
        <div className="absolute inset-0 opacity-30 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/50 via-transparent to-transparent" />
        <div className="container mx-auto px-6 max-w-7xl relative z-10">
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
              <Button variant="outline" onClick={() => signOut()} className="gap-2 shadow-sm border-white/20 text-foreground bg-white/90 hover:bg-white hover:text-black transition-all duration-300 h-11 px-6 rounded-full">
                <LogOut className="h-4 w-4" />
                Salir
              </Button>
              {activeTab === 'libros' ? (
                <Button onClick={handleOpenCreate} className="gap-2 shadow-lg shadow-primary/25 bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-300 h-11 px-6 rounded-full">
                  <Plus className="h-5 w-5" />
                  Nuevo Libro
                </Button>
              ) : (
                <Button onClick={handleOpenCreateInterview} className="gap-2 shadow-lg shadow-primary/25 bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-300 h-11 px-6 rounded-full">
                  <Plus className="h-5 w-5" />
                  Nueva Entrevista
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 py-6">
        <div className="container mx-auto px-6 max-w-7xl">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="flex justify-center md:justify-start mb-10">
              <TabsList className="bg-muted/40 p-1.5 rounded-2xl inline-flex h-auto">
                <TabsTrigger value="libros" className="rounded-xl py-3 px-8 text-sm font-medium data-[state=active]:shadow-sm">Libros y Obras</TabsTrigger>
                <TabsTrigger value="entrevistas" className="rounded-xl py-3 px-8 text-sm font-medium data-[state=active]:shadow-sm">Entrevistas</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="libros" className="mt-0 focus-visible:outline-none">
              {booksLoading ? (
                <div className="flex flex-col items-center justify-center py-32 opacity-50">
                  <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
                  <p className="text-muted-foreground animate-pulse">Cargando tu biblioteca...</p>
                </div>
              ) : books.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 px-4 text-center animate-fade-in-up">
                  <div className="w-20 h-20 bg-background border border-border/50 rounded-2xl flex items-center justify-center mb-8 shadow-sm group hover:border-primary/30 transition-colors duration-300">
                    <BookOpen className="h-8 w-8 text-primary/70 group-hover:text-primary transition-colors duration-300" strokeWidth={1.5} />
                  </div>
                  <h3 className="text-2xl font-display text-foreground mb-3">Tu catálogo está vacío</h3>
                  <p className="text-muted-foreground mb-10 text-lg max-w-md mx-auto font-light">
                    Aún no has añadido ninguna obra. Comienza a construir tu biblioteca digital para tus lectores.
                  </p>
                  <Button onClick={handleOpenCreate} variant="outline" className="gap-2 shadow-sm rounded-full px-8 h-12 text-base border-border hover:border-primary/50 hover:bg-primary/5 transition-all duration-300">
                    <Plus className="h-5 w-5" />
                    Añadir mi primer libro
                  </Button>
                </div>
              ) : (
                <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 animate-fade-in-up">
                  {books.map((book) => (
                    <Card key={book.id} className="overflow-hidden group hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 border-border/40 bg-card/60 backdrop-blur-md hover:-translate-y-1.5 rounded-xl flex flex-col">
                      <div className="aspect-[2/3] relative bg-muted overflow-hidden">
                        <img
                          src={book.cover}
                          alt={book.title.es}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-6 translate-y-4 group-hover:translate-y-0">
                          <Button
                            variant="default"
                            className="w-full gap-2 bg-white text-black hover:bg-gray-100 shadow-xl rounded-full h-11 font-medium transition-transform active:scale-95"
                            onClick={() => handleOpenEdit(book)}
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
                  ))}
                </div>
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
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 animate-fade-in-up">
                  {interviews.map((interview, index) => (
                    <Card key={interview.id} className="overflow-hidden group hover:shadow-xl transition-all duration-500 border-border/40 bg-card/60 backdrop-blur-md rounded-2xl flex flex-col">
                      <div className="p-4 bg-muted/20 border-b border-border/40 flex items-center justify-between">
                        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
                          Orden: {index + 1}
                        </span>
                        <div className="flex items-center gap-1">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            title="Destacar en Inicio"
                            className={`h-7 w-7 rounded-full transition-colors ${interview.is_featured ? 'text-yellow-500 hover:text-yellow-600 bg-yellow-500/10' : 'hover:bg-background text-muted-foreground'}`} 
                            onClick={() => setFeaturedInterview(interview.id)}
                          >
                            <Star className="h-3.5 w-3.5" fill={interview.is_featured ? 'currentColor' : 'none'} />
                          </Button>
                          <div className="w-px h-4 bg-border mx-1" />
                          <Button variant="ghost" size="icon" className="h-7 w-7 rounded-full hover:bg-background" disabled={index === 0} onClick={() => handleMoveUp(index)}>
                            <ArrowUp className="h-3.5 w-3.5" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-7 w-7 rounded-full hover:bg-background" disabled={index === interviews.length - 1} onClick={() => handleMoveDown(index)}>
                            <ArrowDown className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </div>
                      <CardHeader className="py-5 px-6 flex-1 flex flex-col">
                        <div className="flex items-center gap-2 mb-3">
                          <Youtube className="text-red-500 h-5 w-5" />
                          <span className="text-xs font-semibold text-muted-foreground">{interview.date_month_year}</span>
                        </div>
                        <h3 className="font-display font-medium text-lg leading-tight line-clamp-2 text-foreground mb-2">
                          {interview.title.es}
                        </h3>
                        <p className="text-sm text-muted-foreground line-clamp-3 mb-6 flex-1">
                          {interview.description.es}
                        </p>
                        
                        <Button
                          variant="outline"
                          className="w-full gap-2 shadow-sm rounded-full h-10 font-medium"
                          onClick={() => handleOpenEditInterview(interview)}
                        >
                          <Pencil className="h-4 w-4" />
                          Editar
                        </Button>
                      </CardHeader>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />

      <Dialog open={formOpen} onOpenChange={(open) => !open && handleFormCancel()}>
        <DialogContent className="max-w-5xl p-0 overflow-hidden border-border shadow-2xl bg-background sm:rounded-[2rem] flex flex-col max-h-[90vh]">
          <DialogHeader className="px-8 pt-8 pb-5 bg-muted/10 border-b border-border/50 shrink-0">
            <DialogTitle className="text-3xl font-display text-foreground flex items-center gap-4">
              {editingBook ? (
                <>
                  <div className="p-2.5 bg-primary/10 rounded-xl">
                    <Pencil className="h-6 w-6 text-primary" />
                  </div>
                  Editar: {editingBook.title.es}
                </>
              ) : (
                <>
                  <div className="p-2.5 bg-primary/10 rounded-xl">
                    <Plus className="h-6 w-6 text-primary" />
                  </div>
                  Añadir Nuevo Libro
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
        <DialogContent className="max-w-5xl p-0 overflow-hidden border-border shadow-2xl bg-background sm:rounded-[2rem] flex flex-col max-h-[90vh]">
          <DialogHeader className="px-8 pt-8 pb-5 bg-muted/10 border-b border-border/50 shrink-0">
            <DialogTitle className="text-3xl font-display text-foreground flex items-center gap-4">
              {editingInterview ? (
                <>
                  <div className="p-2.5 bg-primary/10 rounded-xl">
                    <Pencil className="h-6 w-6 text-primary" />
                  </div>
                  Editar Entrevista
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
    </div>
  );
}
