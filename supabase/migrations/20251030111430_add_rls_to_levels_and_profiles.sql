alter table "public"."levels" enable row level security;

alter table "public"."profiles" enable row level security;


  create policy "Allow anyone to insert items"
  on "public"."levels"
  as permissive
  for insert
  to public
with check (true);



  create policy "Allow anyone to read all items"
  on "public"."levels"
  as permissive
  for select
  to public
using (true);



  create policy "Users can delete their own levels"
  on "public"."levels"
  as permissive
  for delete
  to public
using ((auth.uid() = author));



  create policy "Users can edit their own levels"
  on "public"."levels"
  as permissive
  for update
  to public
using ((auth.uid() = author));



  create policy "Allow anyone to insert items"
  on "public"."profiles"
  as permissive
  for insert
  to public
with check (true);



  create policy "Allow anyone to read items"
  on "public"."profiles"
  as permissive
  for select
  to public
using (true);



  create policy "Users can delete their own profile"
  on "public"."profiles"
  as permissive
  for delete
  to public
using ((auth.uid() = id));



  create policy "Users can edit their own profile"
  on "public"."profiles"
  as permissive
  for update
  to public
using ((auth.uid() = id));



