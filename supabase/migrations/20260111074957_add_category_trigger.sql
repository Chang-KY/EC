create or replace function ec.categories_set_path()
returns trigger
language plpgsql
as $$
declare
p_path ltree;
begin
  -- UPDATE에서 "내 자식 밑으로 이동" 같은 순환 참조 방지
  if tg_op = 'UPDATE' and new.parent_id is not null then
    if exists (
      select 1
        from ec.categories p
       where p.id = new.parent_id
         and p.path <@ old.path
    ) then
      raise exception 'Cannot move category % under its descendant %', new.id, new.parent_id;
end if;
end if;

  if new.parent_id is null then
    new.path := text2ltree(new.id::text);
else
select c.path into p_path
from ec.categories c
where c.id = new.parent_id;

if p_path is null then
      raise exception 'Invalid parent_id: %', new.parent_id;
end if;

    new.path := p_path || text2ltree(new.id::text);
end if;

return new;
end;
$$;

drop trigger if exists trg_categories_set_path on ec.categories;
create trigger trg_categories_set_path
    before insert or update of parent_id on ec.categories
    for each row
    execute function ec.categories_set_path();
