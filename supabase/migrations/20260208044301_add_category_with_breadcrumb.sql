create or replace view ec.categories_with_breadcrumb as
select
    c.*,
    p.name as parent_name,
    (
        select string_agg(a.name, ' > ' order by nlevel(a.path))
        from ec.categories a
        where a.path @> c.path
    ) as breadcrumb
from ec.categories c
         left join ec.categories p on p.id = c.parent_id;
