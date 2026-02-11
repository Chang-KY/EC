create or replace function ec.get_category_subtree(_id bigint)
returns table (
  id bigint,
  name text,
  slug text,
  parent_id bigint,
  path public.ltree,
  depth int,
  rel_depth int
)
language sql
stable
as $$
  with root as (
    select id, path from ec.categories where id = _id
  )
select
    c.id, c.name, c.slug, c.parent_id, c.path,
    nlevel(c.path) as depth,
    nlevel(c.path) - nlevel(r.path) as rel_depth
from ec.categories c
         join root r on c.path <@ r.path
order by nlevel(c.path), c.name;
$$;
