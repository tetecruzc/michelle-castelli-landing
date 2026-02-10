# Supabase – Libros

## 1. Ejecutar el script en Supabase

En el **Dashboard de Supabase** → **SQL Editor**, crea una nueva query y pega el contenido de `migrations/001_create_books.sql`. Luego ejecuta el script.

Esto crea:

- La tabla `books` con RLS (lectura pública).
- El bucket de Storage `book-covers` (público) para portadas e imágenes de libros.

## 2. Variables de entorno en el proyecto

Crea un archivo `.env` en la raíz del proyecto con:

```env
VITE_SUPABASE_URL=https://TU_PROYECTO.supabase.co
VITE_SUPABASE_ANON_KEY=tu_anon_key_aqui
```

- **URL**: en Supabase → Project Settings → API → Project URL.
- **Anon key**: en Project Settings → API → Project API keys → `anon` (public). Es la clave pública/“publishable”.

Si no configuras estas variables, la app seguirá usando los libros definidos en `src/data/books.ts`.

## 3. Portadas en Storage

Después de crear el bucket `book-covers`:

1. En Supabase → **Storage** → bucket **book-covers**, sube las imágenes (por ejemplo `diaspora.jpg`, `autobiografia.jpg`, etc.).
2. En cada fila de la tabla `books`, el campo `cover_url` debe ser la **URL pública** de esa imagen. Puedes copiarla desde Storage (opción “Copy URL” del archivo) o usar la forma:  
   `https://TU_PROYECTO.supabase.co/storage/v1/object/public/book-covers/NOMBRE_ARCHIVO`

## 4. Panel del autor (crear/editar libros)

Para que el autor pueda subir y editar libros desde la web:

1. **Ejecuta la segunda migración (obligatorio)**  
   En **SQL Editor**, ejecuta el contenido de `migrations/002_author_rls.sql`. Sin esto verás *"new row violates row-level security policy"* al añadir un libro o subir una portada. El script da permisos a usuarios autenticados para insertar/actualizar en `books` y en el bucket `book-covers`.

2. **Activa Auth con email**  
   En Supabase → **Authentication** → **Providers**, activa **Email** (y opcionalmente “Confirm email” si quieres verificación).

3. **Crea el usuario del autor**  
   En **Authentication** → **Users** → **Add user** → **Create new user**, crea un usuario con el email y contraseña que usará el autor.

4. **Acceso al panel**  
   En la web, ve a `/autor` (en el footer hay un enlace “Panel del autor”). Inicia sesión con ese usuario. Desde ahí se pueden añadir libros y editar los existentes, incluida la subida de portadas.

## 5. Rellenar la tabla `books`

Puedes insertar los libros desde el **Table Editor** de Supabase, desde el panel del autor (`/autor`) o con SQL. La estructura de cada fila debe coincidir con las columnas de `001_create_books.sql` (id, title, description, cover_url, year, action, buy_links, download_url, images).
