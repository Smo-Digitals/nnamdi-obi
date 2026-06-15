import Link from 'next/link';

export const metadata = { title: 'Privacy Policy — Nnamdi Obi' };

const LAST_UPDATED = 'June 15, 2026';

export default function PrivacyPage() {
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
        <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
        <p className="text-[#666] mb-12 text-lg leading-relaxed">
          This policy explains how Nnamdi Obi (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) collects, uses, and protects your personal information when you use our platform at <span className="text-white">nnamdiobi.com</span>.
        </p>

        <Section title="1. Information We Collect">
          <p>We collect information you provide directly, including:</p>
          <ul>
            <li><strong>Account information:</strong> your name and email address when you register or sign in with Google.</li>
            <li><strong>Profile information:</strong> any additional details you choose to add to your profile.</li>
            <li><strong>Usage data:</strong> pages visited, content accessed, and time spent on the platform.</li>
            <li><strong>Payment information:</strong> processed securely via Paystack; we do not store card details.</li>
          </ul>
          <p>When you sign in with Google, we receive your name, email address, and profile picture from Google in accordance with the permissions you grant.</p>
        </Section>

        <Section title="2. How We Use Your Information">
          <ul>
            <li>To create and manage your account.</li>
            <li>To provide access to courses, community features, and content.</li>
            <li>To send you important service updates and, where you opt in, newsletters.</li>
            <li>To process payments and manage subscriptions.</li>
            <li>To improve the platform based on usage patterns.</li>
            <li>To respond to your questions and support requests.</li>
          </ul>
          <p>We do not sell your personal information to third parties.</p>
        </Section>

        <Section title="3. Information Sharing">
          <p>We share your data only in these limited circumstances:</p>
          <ul>
            <li><strong>Service providers:</strong> Supabase (database and authentication), Cloudflare (storage), Paystack (payments). Each is bound by their own privacy policies and only processes data as needed.</li>
            <li><strong>Legal requirements:</strong> if required by law or to protect our legal rights.</li>
            <li><strong>With your consent:</strong> for any other purpose with your explicit permission.</li>
          </ul>
        </Section>

        <Section title="4. Google OAuth Data">
          <p>
            When you choose to sign in with Google, we request access to your basic profile information (name, email address, profile picture) only. We use this data solely to create and authenticate your account. We do not access your Google Drive, Gmail, contacts, or any other Google services.
          </p>
          <p>
            You can revoke our access to your Google account at any time via your <a href="https://myaccount.google.com/permissions" target="_blank" rel="noopener noreferrer" className="text-[#DC5B17] hover:underline">Google Account settings</a>.
          </p>
        </Section>

        <Section title="5. Data Storage and Security">
          <p>
            Your data is stored securely using Supabase infrastructure hosted on AWS in the EU West region. We use industry-standard encryption in transit (HTTPS/TLS) and at rest. Access to user data is restricted to authorised personnel only.
          </p>
          <p>While we take reasonable precautions, no system is completely secure. We encourage you to use a strong password and keep your login credentials confidential.</p>
        </Section>

        <Section title="6. Cookies">
          <p>
            We use essential cookies to maintain your session and keep you logged in. We do not use advertising or tracking cookies. You can disable cookies in your browser, but this may affect functionality.
          </p>
        </Section>

        <Section title="7. Your Rights">
          <p>You have the right to:</p>
          <ul>
            <li>Access the personal data we hold about you.</li>
            <li>Correct inaccurate or incomplete information.</li>
            <li>Request deletion of your account and associated data.</li>
            <li>Export your data in a portable format.</li>
            <li>Withdraw consent for communications at any time.</li>
          </ul>
          <p>To exercise any of these rights, contact us at <a href="mailto:hello@nnamdiobi.com" className="text-[#DC5B17] hover:underline">hello@nnamdiobi.com</a>.</p>
        </Section>

        <Section title="8. Children's Privacy">
          <p>Our platform is not directed at children under 13. We do not knowingly collect personal information from children. If you believe a child has provided us with their information, please contact us and we will delete it promptly.</p>
        </Section>

        <Section title="9. Changes to This Policy">
          <p>We may update this policy from time to time. We will notify you of significant changes by email or by a prominent notice on the platform. Your continued use after changes take effect constitutes acceptance of the updated policy.</p>
        </Section>

        <Section title="10. Contact Us">
          <p>
            If you have any questions about this Privacy Policy, please contact us at:<br />
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
