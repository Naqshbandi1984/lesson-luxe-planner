-- Pickup address (students = latest, bookings = snapshot at booking time) +
-- "bookings never disappear" admin-dashboard safeguards.
--
-- Tested end-to-end on a throwaway Supabase project built to match this
-- project's live schema exactly (same tables/constraints/indexes/RPCs/ACLs,
-- fake seed data only). Full checklist, all passing:
--   - Old 9-arg calls to book_lesson/create_bank_transfer_booking (both
--     positional and named) still succeed, leave address columns NULL -
--     backward compatible with an in-flight Stripe checkout session
--     created before this deploys (metadata fixed at session-creation time).
--   - New calls with address params write to BOTH students (upsert/latest)
--     and bookings (snapshot) correctly.
--   - Exactly one overload each of book_lesson/create_bank_transfer_booking/
--     get_booking_for_notification/cancel_booking after migrating (no
--     leftover old-signature overload causing ambiguous-call errors).
--   - prosecdef/proconfig and ACLs (proacl) on every touched or new
--     function verified against production's actual values - not assumed.
--   - list_all_bookings is NOT touched here at all (kept for the live site
--     between this migration landing and the new dashboard code deploying)
--     and still works identically afterward.
--   - cancel_booking sets cancelled_at and the booking stays visible via
--     list_bookings_admin's status filter.
--   - DELETE on bookings is blocked by default (clear error) and the
--     SET LOCAL app.allow_booking_delete = 'true' bypass works.
--   - anon/authenticated lose INSERT/UPDATE/DELETE/TRUNCATE on
--     bookings/students but keep SELECT/REFERENCES/TRIGGER (nothing
--     legitimate ever used direct table access - every real read/write goes
--     through these SECURITY DEFINER RPCs).
--   - Non-admin calls to every admin-gated RPC (cancel_booking,
--     list_bookings_admin, list_bookings_for_student, list_students_admin)
--     are rejected; a simulated admin session succeeds on all of them.
--
-- Idempotent: safe to re-run. Wrapped in one transaction - fails clean.

begin;

-- === Pickup address columns =================================================

alter table public.students add column if not exists address_line1 text;
alter table public.students add column if not exists town text;
alter table public.students add column if not exists postcode text;

-- Snapshot on the booking itself: the address as it was AT BOOKING TIME,
-- independent of whatever the student's "latest" address becomes later.
alter table public.bookings add column if not exists address_line1 text;
alter table public.bookings add column if not exists town text;
alter table public.bookings add column if not exists postcode text;

alter table public.bookings add column if not exists cancelled_at timestamptz;

-- === book_lesson / create_bank_transfer_booking =============================
--
-- New params DEFAULT NULL: an in-flight Stripe checkout session created
-- before this deploys has its metadata fixed at creation time with no
-- address fields, and the webhook calls this RPC without them.
--
-- A different parameter list is a NEW overload under CREATE OR REPLACE, not
-- a replacement - confirmed this the hard way in testing (ended up with two
-- co-existing overloads, which produces an ambiguous-call error on an
-- old-style positional call). The old 9-arg signature must be dropped
-- explicitly first so exactly one overload of each exists afterward.

drop function if exists public.book_lesson(text, text, text, date, time, time, numeric, text, text);
drop function if exists public.create_bank_transfer_booking(text, text, text, date, time, time, numeric, text, text);

create or replace function public.book_lesson(
  p_phone text, p_name text, p_lesson_type_slug text, p_date date,
  p_start_time time, p_end_time time, p_price numeric,
  p_notes text default null, p_email text default null,
  p_address_line1 text default null, p_town text default null, p_postcode text default null
) returns uuid
language plpgsql security definer set search_path = public as $$
declare
  v_student_id uuid;
  v_booking_id uuid;
begin
  if exists (
    select 1 from public.availability a
    where a.date = p_date
      and (a.start_time is null or a.start_time < p_end_time)
      and (a.end_time is null or a.end_time > p_start_time)
  ) then
    raise exception 'That slot is not available.';
  end if;

  if exists (
    select 1 from public.bookings b
    where b.date = p_date and b.start_time = p_start_time and b.status = 'confirmed'
  ) then
    raise exception 'That slot has just been booked by someone else.';
  end if;

  insert into public.students (phone, name, email, address_line1, town, postcode)
    values (p_phone, p_name, p_email, p_address_line1, p_town, p_postcode)
  on conflict (phone) do update
    set name = coalesce(excluded.name, public.students.name),
        email = coalesce(excluded.email, public.students.email),
        address_line1 = coalesce(excluded.address_line1, public.students.address_line1),
        town = coalesce(excluded.town, public.students.town),
        postcode = coalesce(excluded.postcode, public.students.postcode)
  returning id into v_student_id;

  insert into public.bookings
    (student_id, lesson_type_slug, date, start_time, end_time, price, notes, status, payment_method,
     address_line1, town, postcode)
    values
    (v_student_id, p_lesson_type_slug, p_date, p_start_time, p_end_time, p_price, p_notes, 'confirmed', 'card',
     p_address_line1, p_town, p_postcode)
  returning id into v_booking_id;

  return v_booking_id;
end;
$$;

create or replace function public.create_bank_transfer_booking(
  p_phone text, p_name text, p_lesson_type_slug text, p_date date,
  p_start_time time, p_end_time time, p_price numeric,
  p_notes text default null, p_email text default null,
  p_address_line1 text default null, p_town text default null, p_postcode text default null
) returns uuid
language plpgsql security definer set search_path = public as $$
declare
  v_student_id uuid;
  v_booking_id uuid;
begin
  if exists (
    select 1 from public.availability a
    where a.date = p_date
      and (a.start_time is null or a.start_time < p_end_time)
      and (a.end_time is null or a.end_time > p_start_time)
  ) then
    raise exception 'That slot is not available.';
  end if;

  if exists (
    select 1 from public.bookings b
    where b.date = p_date and b.start_time = p_start_time and b.status = 'confirmed'
  ) then
    raise exception 'That slot has just been booked by someone else.';
  end if;

  insert into public.students (phone, name, email, address_line1, town, postcode)
    values (p_phone, p_name, p_email, p_address_line1, p_town, p_postcode)
  on conflict (phone) do update
    set name = coalesce(excluded.name, public.students.name),
        email = coalesce(excluded.email, public.students.email),
        address_line1 = coalesce(excluded.address_line1, public.students.address_line1),
        town = coalesce(excluded.town, public.students.town),
        postcode = coalesce(excluded.postcode, public.students.postcode)
  returning id into v_student_id;

  insert into public.bookings
    (student_id, lesson_type_slug, date, start_time, end_time, price, notes, status, payment_method,
     address_line1, town, postcode)
    values
    (v_student_id, p_lesson_type_slug, p_date, p_start_time, p_end_time, p_price, p_notes, 'pending_payment', 'bank_transfer',
     p_address_line1, p_town, p_postcode)
  returning id into v_booking_id;

  return v_booking_id;
end;
$$;

-- Both are public-facing (booking happens before any login) - explicit
-- grants matching production's existing ACL for these two exactly.
grant execute on function public.book_lesson(
  text, text, text, date, time, time, numeric, text, text, text, text, text
) to anon, authenticated, service_role;
grant execute on function public.create_bank_transfer_booking(
  text, text, text, date, time, time, numeric, text, text, text, text, text
) to anon, authenticated, service_role;

-- === get_booking_for_notification ===========================================
--
-- Returns the BOOKING's own address snapshot, not the student's possibly-
-- since-changed latest address, so calendar/notifications reflect what was
-- true for that specific booking. The input signature (p_booking_id uuid)
-- is unchanged, but the RETURN TABLE's column list grew - Postgres refuses
-- CREATE OR REPLACE across an OUT-parameter row-type change ("cannot change
-- return type of existing function"), so this one genuinely needs DROP+CREATE.

drop function if exists public.get_booking_for_notification(uuid);

create or replace function public.get_booking_for_notification(p_booking_id uuid) returns table (
  booking_id uuid, date date, end_time time, lesson_type_name text, lesson_type_slug text,
  payment_method text, price numeric, start_time time, status text,
  student_email text, student_name text, student_phone text,
  address_line1 text, town text, postcode text
)
language sql security definer set search_path = public as $$
  select
    b.id, b.date, b.end_time, lt.name, b.lesson_type_slug,
    b.payment_method, b.price, b.start_time, b.status,
    s.email, s.name, s.phone,
    b.address_line1, b.town, b.postcode
  from public.bookings b
  join public.students s on s.id = b.student_id
  join public.lesson_types lt on lt.slug = b.lesson_type_slug
  where b.id = p_booking_id;
$$;

grant execute on function public.get_booking_for_notification(uuid) to anon, authenticated, service_role;

-- === cancel_booking - now also sets cancelled_at ============================
--
-- Same signature as before, so CREATE OR REPLACE genuinely replaces in
-- place and its existing ACL (admin-only - no anon/PUBLIC) is preserved
-- automatically. No GRANT needed here.

create or replace function public.cancel_booking(p_booking_id uuid) returns text
language plpgsql security definer set search_path = public as $$
declare
  v_calendar_event_id text;
begin
  if not exists (select 1 from public.admins where user_id = auth.uid()) then
    raise exception 'Not authorized.';
  end if;

  update public.bookings
  set status = 'cancelled', cancelled_at = now()
  where id = p_booking_id and status in ('pending_payment', 'confirmed')
  returning calendar_event_id into v_calendar_event_id;

  if not found then
    raise exception 'Booking not found or already cancelled/completed.';
  end if;

  return v_calendar_event_id;
end;
$$;

-- === New admin RPCs ==========================================================
--
-- list_all_bookings is deliberately left completely untouched here - it
-- hard-filters to `date >= current_date`, hiding every past booking, but
-- the OLD admin dashboard code (still live until the new dashboard deploys)
-- calls it by name. Dropping or renaming it now would break the live site
-- in the gap between this migration landing and the code deploy. It can be
-- retired in a later cleanup migration once the new dashboard is confirmed
-- live and working.

create or replace function public.list_bookings_admin(
  p_status text default null,
  p_from date default null,
  p_to date default null,
  p_limit integer default 200,
  p_offset integer default 0
) returns table (
  booking_id uuid, status text, payment_method text, date date, start_time time, end_time time,
  price numeric, lesson_type_slug text, notes text,
  student_id uuid, student_name text, student_phone text, student_email text,
  address_line1 text, town text, postcode text,
  calendar_event_id text, created_at timestamptz, cancelled_at timestamptz,
  total_count bigint
)
language plpgsql security definer set search_path = public as $$
begin
  if not exists (select 1 from public.admins where user_id = auth.uid()) then
    raise exception 'Not authorized.';
  end if;

  return query
  select
    b.id, b.status, b.payment_method, b.date, b.start_time, b.end_time, b.price,
    b.lesson_type_slug, b.notes,
    s.id, s.name, s.phone, s.email,
    b.address_line1, b.town, b.postcode,
    b.calendar_event_id, b.created_at, b.cancelled_at,
    count(*) over() as total_count
  from public.bookings b
  join public.students s on s.id = b.student_id
  where (p_status is null or b.status = p_status)
    and (p_from is null or b.date >= p_from)
    and (p_to is null or b.date <= p_to)
  order by b.date, b.start_time
  limit p_limit offset p_offset;
end;
$$;

create or replace function public.list_bookings_for_student(p_student_id uuid) returns table (
  booking_id uuid, status text, payment_method text, date date, start_time time, end_time time,
  price numeric, lesson_type_slug text, notes text,
  address_line1 text, town text, postcode text,
  calendar_event_id text, created_at timestamptz, cancelled_at timestamptz
)
language plpgsql security definer set search_path = public as $$
begin
  if not exists (select 1 from public.admins where user_id = auth.uid()) then
    raise exception 'Not authorized.';
  end if;

  return query
  select b.id, b.status, b.payment_method, b.date, b.start_time, b.end_time, b.price,
    b.lesson_type_slug, b.notes, b.address_line1, b.town, b.postcode,
    b.calendar_event_id, b.created_at, b.cancelled_at
  from public.bookings b
  where b.student_id = p_student_id
  order by b.date desc, b.start_time desc;
end;
$$;

create or replace function public.list_students_admin(p_search text default null) returns table (
  student_id uuid, name text, phone text, email text,
  address_line1 text, town text, postcode text,
  total_lessons bigint, last_lesson_date date, next_lesson_date date
)
language plpgsql security definer set search_path = public as $$
begin
  if not exists (select 1 from public.admins where user_id = auth.uid()) then
    raise exception 'Not authorized.';
  end if;

  return query
  select
    s.id, s.name, s.phone, s.email, s.address_line1, s.town, s.postcode,
    count(b.id) as total_lessons,
    max(b.date) filter (where b.date <= current_date) as last_lesson_date,
    min(b.date) filter (where b.date > current_date) as next_lesson_date
  from public.students s
  left join public.bookings b on b.student_id = s.id and b.status <> 'cancelled'
  where p_search is null or p_search = ''
    or s.name ilike '%' || p_search || '%'
    or s.phone ilike '%' || p_search || '%'
    or s.email ilike '%' || p_search || '%'
  group by s.id
  order by s.name nulls last;
end;
$$;

-- These three are brand new, so Postgres's implicit function default
-- (PUBLIC has EXECUTE) applies unless explicitly revoked - confirmed this
-- the hard way in testing. Match the existing admin-only pattern
-- (cancel_booking / list_all_bookings): no anon/PUBLIC access, and an
-- explicit re-grant to authenticated/service_role, since revoking from
-- PUBLIC on a function that only had the implicit default strips
-- everyone's access, not just PUBLIC's.
revoke execute on function public.list_bookings_admin(text, date, date, integer, integer) from public;
revoke execute on function public.list_bookings_for_student(uuid) from public;
revoke execute on function public.list_students_admin(text) from public;
grant execute on function public.list_bookings_admin(text, date, date, integer, integer) to authenticated, service_role;
grant execute on function public.list_bookings_for_student(uuid) to authenticated, service_role;
grant execute on function public.list_students_admin(text) to authenticated, service_role;

-- === Delete-blocking trigger, with a deliberate bypass =======================
--
-- Fires for every role including the table owner (BEFORE triggers aren't
-- bypassed by SECURITY DEFINER or RLS) unless a session explicitly opts in
-- for a single transaction - for a genuine GDPR erasure request or
-- test-data cleanup.

create or replace function public.prevent_booking_delete() returns trigger
language plpgsql as $$
begin
  if coalesce(current_setting('app.allow_booking_delete', true), 'false') <> 'true' then
    raise exception 'Bookings cannot be deleted - this is a deliberate safeguard so no booking record is ever lost. Cancel it instead (cancel_booking sets status=cancelled), or for a genuine GDPR erasure request or test-data cleanup run: SET LOCAL app.allow_booking_delete = ''true''; before the DELETE, in the same transaction.';
  end if;
  return old;
end;
$$;

-- Postgres 14+ supports CREATE OR REPLACE TRIGGER directly - no DROP needed.
create or replace trigger bookings_prevent_delete
before delete on public.bookings
for each row execute function public.prevent_booking_delete();

-- === Revoke raw table grants =================================================
--
-- Nothing legitimate touches these tables directly - every real read/write
-- goes through the SECURITY DEFINER RPCs above, which run as the function
-- owner regardless of the caller's grants (confirmed: zero `.from("bookings")`
-- / `.from("students")` calls anywhere in the client code). These direct
-- grants were dead weight; revoking them removes a real exposure if RLS
-- were ever disabled. SELECT/REFERENCES/TRIGGER are intentionally left
-- alone - only the write/destructive privileges go.

revoke insert, update, delete, truncate on public.bookings from anon, authenticated;
revoke insert, update, delete, truncate on public.students from anon, authenticated;

commit;
