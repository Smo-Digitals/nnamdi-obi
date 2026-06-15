import Link from 'next/link';

export const metadata = { title: 'Terms of Service — Nnamdi Obi' };

const LAST_UPDATED = 'June 15, 2026';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Nav */}
      <header className="border-b border-white/5">
        <div className="max-w-4xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-[#DC5B17] flex items-center justify-center">
              <span className="text-white text-[10px] font-bold">N</span>
            </div>
            <span className="text-sm font-semibold">Nnamdi Obi</span>
          </Link>
          <Link href="/" className="text-xs text-[#666] hover:text-white transition-colors">← Back to home</Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-16">
        <p className="text-xs text-[#555] mb-4">Last updated: {LAST_UPDATED}</p>
        <h1 className="text-4xl font-bold mb-4">Terms of Service</h1>
        <p className="text-[#666] mb-12 text-lg leading-relaxed">
          These Terms of Service (&quot;Terms&quot;) govern your use of the Nnamdi Obi platform at <span className="text-white">nnamdiobi.com</span>. By creating an account or accessing the platform, you agree to these Terms.
        </p>

        <Section title="1. About the Platform">
          <p>
            Nnamdi Obi is an online learning and community platform that provides courses, community discussions, and educational content. The platform is operated by Nnamdi Obi (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;).
          </p>
        </Section>

        <Section title="2. Eligibility">
          <p>You must be at least 13 years old to use this platform. By using it, you confirm you meet this requirement and that all information you provide is accurate and truthful.</p>
        </Section>

        <Section title="3. Account Registration">
          <ul>
            <li>You are responsible for maintaining the confidentiality of your login credentials.</li>
            <li>You are responsible for all activity that occurs under your account.</li>
            <li>You must notify us immediately of any unauthorised use of your account.</li>
            <li>You may not share your account with others or create accounts for others without permission.</li>
          </ul>
        </Section>

        <Section title="4. Memberships and Payments">
          <ul>
            <li>Some content requires a paid membership or one-time purchase.</li>
            <li>All payments are processed securely via Paystack.</li>
            <li>Prices are listed in Nigerian Naira (₦) unless otherwise stated.</li>
            <li>Subscription fees are billed on a recurring basis until cancelled.</li>
            <li>Refunds are handled on a case-by-case basis — contact us within 7 days of purchase if you are unsatisfied.</li>
          </ul>
        </Section>

        <Section title="5. Acceptable Use">
          <p>You agree not to:</p>
          <ul>
            <li>Share, resell, or redistribute paid course content.</li>
            <li>Use the platform for any unlawful purpose.</li>
            <li>Harass, abuse, or harm other members of the community.</li>
            <li>Post spam, unsolicited promotions, or misleading content.</li>
            <li>Attempt to gain unauthorised access to any part of the platform.</li>
            <li>Use automated tools to scrape or extract content.</li>
          </ul>
          <p>We reserve the right to suspend or terminate accounts that violate these rules.</p>
        </Section>

        <Section title="6. Intellectual Property">
          <p>
            All content on the platform — including courses, videos, articles, and materials — is owned by Nnamdi Obi or licensed to us. You may access content for personal, non-commercial use only. You may not copy, reproduce, distribute, or create derivative works without our prior written permission.
          </p>
          <p>Content you post in community discussions remains yours. By posting, you grant us a non-exclusive licence to display it on the platform.</p>
        </Section>

        <Section title="7. Disclaimer of Warranties">
          <p>
            The platform is provided &quot;as is&quot; without warranties of any kind. We do not guarantee uninterrupted access, error-free performance, or specific results from using the content. Educational content is for informational purposes and does not constitute professional financial, legal, or medical advice.
          </p>
        </Section>

        <Section title="8. Limitation of Liability">
          <p>
            To the fullest extent permitted by applicable law, Nnamdi Obi shall not be liable for any indirect, incidental, or consequential damages arising from your use of the platform. Our total liability shall not exceed the amount you paid us in the 12 months prior to the claim.
          </p>
        </Section>

        <Section title="9. Termination">
          <p>
            You may cancel your account at any time by contacting us. We may suspend or terminate your access at any time for violation of these Terms or for any other reason at our discretion. Upon termination, your right to access the platform ceases immediately.
          </p>
        </Section>

        <Section title="10. Changes to These Terms">
          <p>We may update these Terms from time to time. We will notify you of material changes by email or via a notice on the platform. Continued use after changes constitutes acceptance of the revised Terms.</p>
        </Section>

        <Section title="11. Governing Law">
          <p>These Terms are governed by the laws of the Federal Republic of Nigeria. Any disputes shall be resolved in the courts of Lagos State, Nigeria.</p>
        </Section>

        <Section title="12. Contact Us">
          <p>
            For questions about these Terms, please contact us at:<br />
            <a href="mailto:hello@nnamdiobi.com" className="text-[#DC5B17] hover:underline">hello@nnamdiobi.com</a>
          </p>
        </Section>
      </main>

      <footer className="border-t border-white/5 py-8 mt-8">
        <div className="max-w-4xl mx-auto px-6 flex items-center justify-between text-xs text-[#444]">
          <span>© 2026 Nnamdi Obi</span>
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
            <Link href="/terms"   className="hover:text-white transition-colors">Terms</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-10">
      <h2 className="text-lg font-bold mb-4 text-white">{title}</h2>
      <div className="text-[#888] text-sm leading-relaxed space-y-3 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1.5 [&_strong]:text-[#bbb] [&_a]:transition-colors">
        {children}
      </div>
    </div>
  );
}
