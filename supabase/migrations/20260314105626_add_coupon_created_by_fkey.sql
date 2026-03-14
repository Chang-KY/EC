alter table ec.coupons
    add constraint coupons_created_by_fkey
        foreign key (created_by)
            references ec.admins (id)
            on delete set null;