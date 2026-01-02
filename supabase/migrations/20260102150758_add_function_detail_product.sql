create or replace function ec.get_product_detail(p_id bigint)
returns jsonb
language sql
security invoker
set search_path = ec, public
as $$
select jsonb_build_object(
               'product', to_jsonb(p),
               'images', coalesce(
                       (
                           select jsonb_agg(to_jsonb(pi) order by pi.role, pi.sort_order)
                           from ec.product_images pi
                           where pi.product_id = p.id
                       ),
                       '[]'::jsonb
                         ),
               'like_count',
               (
                   select count(*)
                   from ec.product_likes pl
                   where pl.product_id = p.id
               )
       )
from ec.products p
where p.id = p_id;
$$;
