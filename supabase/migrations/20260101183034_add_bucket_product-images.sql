create
policy "admin upload product objects"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'product-images'
  and true
);

create
policy "admin update product objects"
on storage.objects
for
update
    to authenticated
    using (
    bucket_id = 'product-images'
    and auth.uid() in (
    select a.id
    from ec.admins a
    where a.role = any (array[
    'super_admin'::ec.user_role,
    'admin'::ec.user_role,
    'manager'::ec.user_role
    ])
    )
    )
with check (
    bucket_id = 'product-images'
    );

create
policy "admin delete product objects"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'product-images'
  and auth.uid() in (
    select a.id
    from ec.admins a
    where a.role = any (array[
      'super_admin'::ec.user_role,
      'admin'::ec.user_role,
      'manager'::ec.user_role
    ])
  )
);
