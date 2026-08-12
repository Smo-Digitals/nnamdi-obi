-- ─────────────────────────────────────────────────────────
-- LESSON COMPLETIONS (member course-player progress)
-- ─────────────────────────────────────────────────────────
CREATE TABLE public.lesson_completions (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  course_id     UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  lesson_id     TEXT NOT NULL,
  completed_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, lesson_id)
);

CREATE INDEX lesson_completions_user_course_idx
  ON public.lesson_completions (user_id, course_id);

ALTER TABLE public.lesson_completions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own lesson completions"
  ON public.lesson_completions FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can mark own lesson completions"
  ON public.lesson_completions FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can unmark own lesson completions"
  ON public.lesson_completions FOR DELETE USING (user_id = auth.uid());
