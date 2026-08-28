import { BookForm } from '@/components/BookForm';
import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';
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
import { useAuth } from '@/contexts/AuthContext';
import type { Book } from '@/data/books';
import { useBooks } from '@/hooks/useBooks';
import { supabase } from '@/lib/supabase';
import { useQueryClient } from '@tanstack/react-query';
import { BookOpen, Loader2, LogOut, Pencil, Plus } from 'lucide-react';
import { useState } from 'react';

export default function Autor() {
  const { user, loading: authLoading, signIn, signOut } = useAuth();
  const { books, isLoading: booksLoading, refetch } = useBooks();
  const queryClient = useQueryClient();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loginSubmitting, setLoginSubmitting] = useState(false);

  const [formOpen, setFormOpen] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);

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
      <div className="bg-background border-b border-border pt-32 pb-8">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary mb-4 text-xs font-semibold tracking-widest uppercase">
                <BookOpen size={14} />
                <span>Administración</span>
              </div>
              <h1 className="font-display text-4xl text-foreground">Panel del autor</h1>
              <p className="text-muted-foreground mt-2 max-w-xl">
                Gestiona tu catálogo literario. Los cambios que realices aquí se reflejarán instantáneamente en la página principal.
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <Button variant="outline" onClick={() => signOut()} className="gap-2 shadow-sm">
                <LogOut className="h-4 w-4" />
                Salir
              </Button>
              <Button onClick={handleOpenCreate} className="gap-2 shadow-md">
                <Plus className="h-4 w-4" />
                Nuevo Libro
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 py-12">
        <div className="container mx-auto px-6 max-w-7xl">
          {booksLoading ? (
            <div className="flex flex-col items-center justify-center py-32 opacity-50">
              <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
              <p className="text-muted-foreground">Cargando catálogo...</p>
            </div>
          ) : books.length === 0 ? (
            /* Premium Empty State */
            <div className="bg-background rounded-2xl border border-border shadow-sm p-12 text-center max-w-2xl mx-auto mt-8 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/40 via-primary to-primary/40" />
              <div className="mx-auto w-24 h-24 bg-primary/5 rounded-full flex items-center justify-center mb-6">
                <BookOpen className="h-10 w-10 text-primary opacity-80" />
              </div>
              <h3 className="text-2xl font-display text-foreground mb-3">Tu catálogo está vacío</h3>
              <p className="text-muted-foreground mb-8 text-lg">
                Comienza a construir tu biblioteca digital. Añade tu primer libro para que los lectores puedan descubrir tus obras.
              </p>
              <Button onClick={handleOpenCreate} size="lg" className="gap-2 shadow-md px-8">
                <Plus className="h-5 w-5" />
                Añadir mi primer libro
              </Button>
            </div>
          ) : (
            /* Books Grid */
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {books.map((book) => (
                <Card key={book.id} className="overflow-hidden group hover:shadow-xl transition-all duration-300 border-border/50 bg-background/50 hover:bg-background">
                  <div className="aspect-[2/3] relative bg-muted overflow-hidden">
                    <img
                      src={book.cover}
                      alt={book.title.es}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                      <Button
                        variant="default"
                        className="w-full gap-2 bg-white text-black hover:bg-white/90"
                        onClick={() => handleOpenEdit(book)}
                      >
                        <Pencil className="h-4 w-4" />
                        Editar Libro
                      </Button>
                    </div>
                  </div>
                  <CardHeader className="py-4 px-5">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-xs font-semibold tracking-widest text-primary mb-1">{book.year}</p>
                        <h3 className="font-display font-medium text-lg leading-tight line-clamp-2 text-foreground group-hover:text-primary transition-colors">
                          {book.title.es}
                        </h3>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
      
      <Footer />

      <Dialog open={formOpen} onOpenChange={(open) => !open && handleFormCancel()}>
        <DialogContent className="max-w-4xl p-0 overflow-hidden border-border shadow-2xl bg-background">
          <DialogHeader className="px-8 pt-8 pb-4 bg-muted/30 border-b border-border/50">
            <DialogTitle className="text-2xl font-display text-foreground flex items-center gap-3">
              {editingBook ? (
                <>
                  <Pencil className="h-5 w-5 text-primary" />
                  Editar: {editingBook.title.es}
                </>
              ) : (
                <>
                  <Plus className="h-5 w-5 text-primary" />
                  Nuevo Libro
                </>
              )}
            </DialogTitle>
          </DialogHeader>
          <div className="px-8 pb-8 pt-4">
            <BookForm
              book={editingBook}
              onSuccess={handleFormSuccess}
              onCancel={handleFormCancel}
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
