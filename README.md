# Fora_App

## Requirements
- Install the [Expo CLI](https://docs.expo.io/get-started/installation/)

## Setup & run locally
### 1. Create new project
Sign up to Supabase - https://app.supabase.io and create a new project. Wait for your database to start.

### 2. Get the URL and Key
Go to the Project Settings (the cog icon), open the API tab, and find your API URL and anon key, you'll need these in the next step.

Create a .env file with the following
```bash
# Update these with your Supabase details from your project settings > API
REACT_NATIVE_SUPABASE_URL=
REACT_NATIVE_SUPABASE_ANON_KEY=
```
Set `REACT_NATIVE_SUPABASE_URL` and `REACT_NATIVE_SUPABASE_ANON_KEY`.

### 3. Install the dependencies & run the project:

Install the dependencies:

```bash
npm i
```

Run the project:

```bash
npm start
```

## About Backend
The following are the sql code for creating the tables used in supa base.

### 1. profiles table
```bash
-- Create a table for Public Profiles
create table profiles (
  id uuid references auth.users not null,
  updated_at timestamp with time zone,
  username text unique,
  avatar_url text,
  user_points bigint default 100,

  primary key (id),
  unique(username),
  constraint username_length check (char_length(username) >= 3)
);

alter table profiles
  enable row level security;

create policy "Public profiles are viewable by everyone." on profiles
  for select using (true);

create policy "Users can insert their own profile." on profiles
  for insert with check (auth.uid() = id);

create policy "Users can update own profile." on profiles
  for update using (auth.uid() = id);

-- Set up Realtime!
begin;
  drop publication if exists supabase_realtime;
  create publication supabase_realtime;
commit;
alter publication supabase_realtime
  add table profiles;

-- Set up Storage!
insert into storage.buckets (id, name)
  values ('avatars', 'avatars');

create policy "Avatar images are publicly accessible." on storage.objects
  for select using (bucket_id = 'avatars');

create policy "Anyone can upload an avatar." on storage.objects
  for insert with check (bucket_id = 'avatars');

create policy "Anyone can update an avatar." on storage.objects
  for update with check (bucket_id = 'avatars');
```

### 2. handle new users
```bash
-- inserts a row into public.users
create or replace function public.handle_new_user() 
returns trigger 
language plpgsql 
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, username)
  values (new.id, new.email, new.raw_user_meta_data->>'username');
  return new;
end;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created on auth.users;
-- trigger the function every time a user is created
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
```

### 3. questions table
```bash
create table questions (
  question_id bigint generated by default as identity primary key,
  category text check (char_length(category) > 3),
  question text check (char_length(category) > 3),
  description text,
  image text,
  created_at timestamp default timezone('utc'::text, now()) not null,
  expire_at timestamp,
  choice bigint,
  points bigint
);
```

### 4. choices table
```bash
create table choices (
  choice_id uuid,
  votes bigint,
  choice text,
  question_id bigint references questions (question_id) on delete cascade,

  primary key (choice_id)
);
```


### 5. votes table
```bash
create table votes (
  vote_id uuid,
  voter_id uuid references profiles (id) on delete cascade,
  choice_id uuid references choices (choice_id) on delete cascade,
  created_at timestamp with time zone,
  question_id bigint references questions (question_id) on delete cascade,

  primary key (vote_id)
);
```

### 6. deduct points function
```bash
create or replace function deduct_points(question_points_input bigint)
returns bigint 
language plpgsql
as $$
	declare
                current_points bigint;
	begin
        --lookup user current points
        select user_points
        into current_points
        from public.profiles
        where id = auth.uid();
        --deduct
        current_points = current_points - question_points_input;
        --update
        update public.profiles
        set user_points = current_points
        where id = auth.uid();
        --return new user point
        return current_points;
	end;
$$;

```












