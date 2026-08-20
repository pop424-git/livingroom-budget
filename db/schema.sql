create table if not exists categories (
  id          serial primary key,
  name        text        not null,
  note        text        not null default '',
  is_included boolean     not null default true,
  sort_order  int         not null default 0,
  created_at  timestamptz not null default now()
);

create table if not exists items (
  id          serial primary key,
  category_id int         not null references categories(id) on delete cascade,
  name        text        not null,
  detail      text        not null default '',
  amount_min  numeric(12,2) not null default 0,
  amount_max  numeric(12,2),
  is_paid     boolean     not null default false,
  is_included boolean     not null default true,
  sort_order  int         not null default 0,
  updated_at  timestamptz not null default now()
);

create index if not exists items_category_idx on items (category_id, sort_order);
