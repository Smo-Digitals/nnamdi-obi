'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion, type Variants } from 'framer-motion';
import { ArrowRight, CheckCircle, BookOpen, Users, Lightning, Play, Quotes } from 'phosphor-react';

const features = [
  { icon: BookOpen,  title: 'World-class courses',      desc: 'Practical, no-fluff content built for African entrepreneurs and builders.' },
  { icon: Users,     title: 'Thriving community',        desc: 'Connect with thousands of like-minded people on the same journey as you.' },
  { icon: Lightning, title: 'Direct access to Nnamdi',  desc: 'Ask questions, get feedback, and learn directly from someone doing the work.' },
];

const courses = [
  { title: 'Business Growth Masterclass', tag: 'Business',  members: 240, color: '#DC5B17' },
  { title: 'Tech Foundations',            tag: 'Tech',       members: 180, color: '#22c55e' },
  { title: 'Leadership 101',              tag: 'Leadership', members: 95,  color: '#eab308' },
];

const testimonials = [
  { name: 'Adaeze Okonkwo', role: 'Founder, Lagos',          text: 'This community changed how I think about building. The content is real, not theory.' },
  { name: 'Emeka Nwosu',    role: 'Software Engineer, Abuja', text: 'I went from zero to landing my first tech client in 3 months after joining.' },
  { name: 'Chioma Eze',     role: 'Product Manager',          text: 'Nnamdi teaches in a way that sticks. Best investment I made in myself this year.' },
];

const fadeUp: Variants = {
  hidden:  { opacity: 0, y: 24 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { duration: 0.5, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } }),
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white overflow-x-hidden">

      {/* Nav */}
      <header className="sticky top-0 z-50 border-b border-white/5 bg-[#0a0a0a]/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-[#DC5B17] flex items-center justify-center">
              <span className="text-white text-xs font-bold font-[family-name:var(--font-dm-mono)]">N</span>
            </div>
            <span className="text-white font-semibold text-sm">Nnamdi Obi</span>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm text-[#666]">
            <a href="#courses"      className="hover:text-white transition-colors">Courses</a>
            <a href="#community"    className="hover:text-white transition-colors">Community</a>
            <a href="#testimonials" className="hover:text-white transition-colors">Stories</a>
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/login"  className="text-sm text-[#666] hover:text-white transition-colors">Sign in</Link>
            <Link href="/signup" className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#DC5B17] text-white text-sm font-semibold hover:bg-[#c44f13] transition-colors">
              Join now <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative max-w-6xl mx-auto px-6 pt-24 pb-32 flex flex-col lg:flex-row items-center gap-16">
        {/* Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-[#DC5B17]/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative flex-1 text-center lg:text-left">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#DC5B17]/10 border border-[#DC5B17]/20 text-[#DC5B17] text-xs font-semibold mb-6"
          >
            <Lightning size={12} weight="fill" /> Africa&apos;s future starts here
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.1 }}
            className="text-5xl lg:text-6xl font-bold leading-[1.1] mb-6"
          >
            Build the life<br />
            <span className="text-[#DC5B17]">Africa needs</span><br />
            you to build.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.2 }}
            className="text-[#666] text-lg leading-relaxed max-w-lg mx-auto lg:mx-0 mb-8"
          >
            Join thousands of entrepreneurs, builders, and creators learning from Nnamdi Obi — teacher, founder, and one of Africa&apos;s most intentional thinkers.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center gap-3 justify-center lg:justify-start"
          >
            <Link href="/signup" className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#DC5B17] text-white font-semibold hover:bg-[#c44f13] transition-colors">
              Start for free <ArrowRight size={16} />
            </Link>
            <button className="flex items-center gap-2 px-6 py-3 rounded-xl border border-white/10 text-[#aaa] text-sm font-medium hover:border-white/20 hover:text-white transition-colors">
              <Play size={14} weight="fill" /> Watch intro
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="flex items-center gap-3 mt-8 justify-center lg:justify-start"
          >
            <div className="flex -space-x-2">
              {['A', 'E', 'C', 'T'].map((l, i) => (
                <div key={i} className="w-8 h-8 rounded-full bg-[#DC5B17]/20 border-2 border-[#0a0a0a] flex items-center justify-center text-[#DC5B17] text-xs font-semibold">
                  {l}
                </div>
              ))}
            </div>
            <p className="text-[#555] text-sm">
              <span className="text-white font-semibold">1,200+</span> members already inside
            </p>
          </motion.div>
        </div>

        {/* Photo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative w-full max-w-sm lg:max-w-none lg:w-[420px] shrink-0"
        >
          <div className="relative rounded-3xl overflow-hidden aspect-[4/5] bg-[#111]">
            <Image
              src="/nnamdi.jpg"
              alt="Nnamdi Obi"
              fill
              className="object-cover object-[50%_20%]"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

            {/* Floating stat */}
            <div className="absolute bottom-5 left-5 right-5 flex gap-3">
              <div className="flex-1 bg-black/60 backdrop-blur-md rounded-2xl px-4 py-3 border border-white/10">
                <p className="text-white text-xl font-bold">1,200+</p>
                <p className="text-[#888] text-xs">Active members</p>
              </div>
              <div className="flex-1 bg-black/60 backdrop-blur-md rounded-2xl px-4 py-3 border border-white/10">
                <p className="text-white text-xl font-bold">8</p>
                <p className="text-[#888] text-xs">Live courses</p>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Features */}
      <section className="border-y border-white/5 bg-[#0d0d0d] py-24" id="community">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold mb-3">Everything you need to grow</h2>
            <p className="text-[#555] max-w-md mx-auto text-sm">Not just courses. A full ecosystem built for serious builders.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map(({ icon: Icon, title, desc }, i) => (
              <motion.div
                key={title}
                custom={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="bg-[#111] border border-white/5 rounded-2xl p-6 hover:border-[#DC5B17]/20 transition-colors"
              >
                <div className="w-10 h-10 rounded-xl bg-[#DC5B17]/10 flex items-center justify-center mb-4">
                  <Icon size={20} weight="duotone" className="text-[#DC5B17]" />
                </div>
                <h3 className="text-white font-semibold mb-2">{title}</h3>
                <p className="text-[#555] text-sm leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Courses */}
      <section className="max-w-6xl mx-auto px-6 py-24" id="courses">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="text-3xl font-bold mb-2">Start learning today</h2>
            <p className="text-[#555] text-sm">Courses built from real experience, not textbooks.</p>
          </div>
          <Link href="/signup" className="hidden sm:flex items-center gap-1.5 text-sm text-[#DC5B17] hover:underline underline-offset-2">
            See all courses <ArrowRight size={14} />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {courses.map(({ title, tag, members, color }, i) => (
            <motion.div
              key={title}
              custom={i}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="bg-[#111] border border-white/5 rounded-2xl overflow-hidden hover:border-white/10 transition-all cursor-pointer group"
            >
              <div className="h-36 flex items-center justify-center relative" style={{ background: `${color}15` }}>
                <BookOpen size={40} style={{ color }} weight="duotone" />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
                  <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 backdrop-blur text-white text-sm font-medium">
                    <Play size={13} weight="fill" /> Preview
                  </div>
                </div>
              </div>
              <div className="p-5">
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full mb-3 inline-block" style={{ background: `${color}20`, color }}>{tag}</span>
                <h3 className="text-white font-semibold text-sm mb-3">{title}</h3>
                <div className="flex items-center justify-between">
                  <span className="text-[#555] text-xs">{members} enrolled</span>
                  <div className="flex items-center gap-1 text-[#DC5B17] text-xs font-medium">
                    Join <ArrowRight size={12} />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="border-y border-white/5 bg-[#0d0d0d] py-24" id="testimonials">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold mb-3">Real people. Real results.</h2>
            <p className="text-[#555] text-sm">From the community.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {testimonials.map(({ name, role, text }, i) => (
              <motion.div
                key={name}
                custom={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="bg-[#111] border border-white/5 rounded-2xl p-6"
              >
                <Quotes size={24} weight="fill" className="text-[#DC5B17] mb-4 opacity-60" />
                <p className="text-[#aaa] text-sm leading-relaxed mb-5">{text}</p>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#DC5B17]/20 flex items-center justify-center text-[#DC5B17] text-xs font-semibold">
                    {name[0]}
                  </div>
                  <div>
                    <p className="text-white text-xs font-semibold">{name}</p>
                    <p className="text-[#555] text-[10px]">{role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-6xl mx-auto px-6 py-24 text-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="relative bg-gradient-to-br from-[#DC5B17]/20 via-[#111] to-[#111] border border-[#DC5B17]/20 rounded-3xl px-8 py-16 overflow-hidden"
        >
          <div className="absolute inset-0 bg-[#DC5B17]/5 rounded-3xl blur-3xl pointer-events-none" />
          <h2 className="relative text-4xl font-bold mb-4">Ready to build your future?</h2>
          <p className="relative text-[#666] text-lg mb-8 max-w-md mx-auto">
            Join 1,200+ members already learning, growing, and building with Nnamdi Obi.
          </p>
          <div className="relative flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/signup" className="flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-[#DC5B17] text-white font-semibold hover:bg-[#c44f13] transition-colors">
              Join the community <ArrowRight size={16} />
            </Link>
            <Link href="/login" className="flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl border border-white/10 text-[#aaa] font-medium hover:border-white/20 hover:text-white transition-colors">
              Already a member? Sign in
            </Link>
          </div>
          <div className="relative flex items-center justify-center gap-6 mt-8">
            {['Free to join', 'No credit card', 'Cancel anytime'].map((t) => (
              <div key={t} className="flex items-center gap-1.5 text-xs text-[#555]">
                <CheckCircle size={13} className="text-green-500" weight="fill" /> {t}
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#444]">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-[#DC5B17] flex items-center justify-center">
              <span className="text-white text-[9px] font-bold">N</span>
            </div>
            <span>© 2025 Nnamdi Obi</span>
          </div>
          <div className="flex gap-5">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Support</a>
          </div>
        </div>
      </footer>

    </div>
  );
}
