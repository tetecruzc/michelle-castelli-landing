-- Create articles table
create table "public"."articles" (
    "id" uuid not null default gen_random_uuid(),
    "title" text not null,
    "year" integer,
    "category" text not null default 'otros',
    "pdf_url" text not null,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now()
);

alter table "public"."articles" add primary key (id);

-- Enable RLS
alter table "public"."articles" enable row level security;

-- Policies for public
create policy "Public can read articles"
on "public"."articles"
as permissive
for select
to public
using (true);

-- Policies for authenticated users (the author)
create policy "Authenticated users can insert articles"
on "public"."articles"
as permissive
for insert
to authenticated
with check (true);

create policy "Authenticated users can update articles"
on "public"."articles"
as permissive
for update
to authenticated
using (true)
with check (true);

create policy "Authenticated users can delete articles"
on "public"."articles"
as permissive
for delete
to authenticated
using (true);

-- Create storage bucket for article PDFs if it doesn't exist
insert into storage.buckets (id, name, public) 
values ('article-pdfs', 'article-pdfs', false)
on conflict (id) do nothing;

-- Storage policies for article-pdfs bucket
create policy "Public can read article PDFs"
on storage.objects for select
to public
using (bucket_id = 'article-pdfs');

create policy "Authenticated users can upload article PDFs"
on storage.objects for insert
to authenticated
with check (bucket_id = 'article-pdfs');

create policy "Authenticated users can update article PDFs"
on storage.objects for update
to authenticated
using (bucket_id = 'article-pdfs');

create policy "Authenticated users can delete article PDFs"
on storage.objects for delete
to authenticated
using (bucket_id = 'article-pdfs');
