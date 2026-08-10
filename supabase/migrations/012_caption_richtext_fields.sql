alter table public.courses
  alter column what_youd_get drop default,
  alter column what_youd_get type text using array_to_string(what_youd_get, E'\n'),
  alter column what_youd_get set default '',
  alter column what_youd_get set not null;

alter table public.courses
  alter column materials_needed drop default,
  alter column materials_needed type text using array_to_string(materials_needed, E'\n'),
  alter column materials_needed set default '',
  alter column materials_needed set not null;
