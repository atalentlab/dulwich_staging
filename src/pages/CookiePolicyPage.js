import React, { useState, useEffect } from 'react';
import PageHeader from '../components/layout/PageHeader';
import PageFooter from '../components/layout/PageFooter';
import useCookieConsent from '../hooks/useCookieConsent';

const Section = ({ title, children }) => (
  <div className="mb-10">
    <h2 className="text-xl font-bold text-[#3C3737] mb-3 pb-2 border-b border-[#F2EDE9]">
      {title}
    </h2>
    <div className="text-sm text-[#3C3C3B] leading-relaxed space-y-3">{children}</div>
  </div>
);

const CookieRow = ({ name, provider, purpose, expiry, type }) => (
  <tr className="border-b border-gray-100 text-xs">
    <td className="py-2.5 pr-3 font-mono font-medium text-[#3C3737]">{name}</td>
    <td className="py-2.5 pr-3 text-gray-600">{provider}</td>
    <td className="py-2.5 pr-3 text-gray-600">{purpose}</td>
    <td className="py-2.5 pr-3 text-gray-600 whitespace-nowrap">{expiry}</td>
    <td className="py-2.5">
      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#FAF7F5] text-[#3C3737] border border-[#F2EDE9]">
        {type}
      </span>
    </td>
  </tr>
);

const CookiePolicyPage = () => {
  const [selectedSchool, setSelectedSchool] = useState('Dulwich International College');
  const [selectedSchoolSlug, setSelectedSchoolSlug] = useState('international');
  const [availableSchools, setAvailableSchools] = useState([]);
  const [chatOpen, setChatOpen] = useState(false);

  const { preferences, acceptAll, rejectAll, resetConsent } = useCookieConsent();

  useEffect(() => {
    const fetchSchools = async () => {
      try {
        const baseUrl = process.env.REACT_APP_API_URL || 'https://cms.dulwich.org';
        const res = await fetch(`${baseUrl}/api/schools`);
        if (!res.ok) return;
        const data = await res.json();
        const list = data.data || data.schools || data;
        if (Array.isArray(list)) {
          const processed = [];
          if (!list.some(s => s.slug === 'international')) {
            processed.push({ id: -1, title: 'International', slug: 'international', url: window.location.origin });
          }
          list.forEach(s => {
            processed.push(s.slug === 'international' ? { ...s, title: 'International' } : s);
          });
          setAvailableSchools(processed);
        }
      } catch { /* silent */ }
    };
    fetchSchools();
  }, []);

  return (
    <div className="page-wrapper">
      <PageHeader
        selectedSchool={selectedSchool}
        availableSchools={availableSchools}
        setSelectedSchool={setSelectedSchool}
        setSelectedSchoolSlug={setSelectedSchoolSlug}
        setChatOpen={setChatOpen}
        chatOpen={chatOpen}
      />

      {/* Hero */}
      <div className="bg-[#9E1422] pt-32 pb-12 px-4">
        <div className="max-w-[1120px] mx-auto">
          <p className="text-xs font-semibold tracking-widest uppercase text-red-300 mb-2">Legal</p>
          <h1 className="text-4xl lg:text-5xl font-black text-white">Cookie Policy</h1>
          <p className="text-red-200 mt-3 text-sm">Last updated: February 2026</p>
        </div>
      </div>

      <main className="max-w-[1120px] mx-auto px-4 py-14">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-12">

          {/* ── Main Content ───────────────────────────────────────────── */}
          <div>
            <Section title="What are cookies?">
              <p>
                Cookies are small text files placed on your device when you visit a website.
                They allow the website to remember your actions and preferences over time, so
                you don't have to re-enter them every time you visit.
              </p>
              <p>
                This policy explains what cookies Dulwich International Schools uses, why we
                use them, and how you can manage your preferences.
              </p>
            </Section>

            <Section title="How we use cookies">
              <p>We use cookies for the following purposes:</p>
              <ul className="list-disc list-inside space-y-1.5 pl-2">
                <li>To keep our website functioning correctly (strictly necessary)</li>
                <li>To understand how you interact with our site (analytics)</li>
                <li>To personalise content and serve relevant advertisements (marketing)</li>
                <li>To remember your preferences and settings</li>
              </ul>
            </Section>

            {/* Cookie Table */}
            <Section title="Cookies we use">
              {/* Necessary */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-2.5 h-2.5 rounded-full bg-green-500 flex-shrink-0" />
                  <h3 className="font-bold text-[#3C3737]">Strictly Necessary</h3>
                  <span className="text-xs text-gray-400">(Always active)</span>
                </div>
                <div className="overflow-x-auto rounded-lg border border-[#F2EDE9]">
                  <table className="w-full text-left">
                    <thead className="bg-[#FAF7F5]">
                      <tr className="text-[10px] font-semibold uppercase tracking-wide text-gray-500">
                        <th className="px-3 py-2">Name</th>
                        <th className="px-3 py-2">Provider</th>
                        <th className="px-3 py-2">Purpose</th>
                        <th className="px-3 py-2">Expiry</th>
                        <th className="px-3 py-2">Type</th>
                      </tr>
                    </thead>
                    <tbody className="px-3">
                      <CookieRow name="dulwich_cookie_consent" provider="dulwich.org" purpose="Stores your cookie preferences" expiry="1 year" type="HTTP" />
                      <CookieRow name="PHPSESSID" provider="dulwich.org" purpose="Preserves user session state" expiry="Session" type="HTTP" />
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Analytics */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-400 flex-shrink-0" />
                  <h3 className="font-bold text-[#3C3737]">Analytics</h3>
                </div>
                <div className="overflow-x-auto rounded-lg border border-[#F2EDE9]">
                  <table className="w-full text-left">
                    <thead className="bg-[#FAF7F5]">
                      <tr className="text-[10px] font-semibold uppercase tracking-wide text-gray-500">
                        <th className="px-3 py-2">Name</th>
                        <th className="px-3 py-2">Provider</th>
                        <th className="px-3 py-2">Purpose</th>
                        <th className="px-3 py-2">Expiry</th>
                        <th className="px-3 py-2">Type</th>
                      </tr>
                    </thead>
                    <tbody className="px-3">
                      <CookieRow name="_ga" provider="Google" purpose="Registers a unique ID for Google Analytics statistics" expiry="2 years" type="HTTP" />
                      <CookieRow name="_ga_*" provider="Google" purpose="Collects data on visitor behaviour" expiry="2 years" type="HTTP" />
                      <CookieRow name="_gid" provider="Google" purpose="Registers a unique ID for a single day session" expiry="1 day" type="HTTP" />
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Marketing */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#D30013] flex-shrink-0" />
                  <h3 className="font-bold text-[#3C3737]">Marketing</h3>
                </div>
                <div className="overflow-x-auto rounded-lg border border-[#F2EDE9]">
                  <table className="w-full text-left">
                    <thead className="bg-[#FAF7F5]">
                      <tr className="text-[10px] font-semibold uppercase tracking-wide text-gray-500">
                        <th className="px-3 py-2">Name</th>
                        <th className="px-3 py-2">Provider</th>
                        <th className="px-3 py-2">Purpose</th>
                        <th className="px-3 py-2">Expiry</th>
                        <th className="px-3 py-2">Type</th>
                      </tr>
                    </thead>
                    <tbody className="px-3">
                      <CookieRow name="_fbp" provider="Meta" purpose="Used by Facebook to deliver advertisement products" expiry="3 months" type="HTTP" />
                      <CookieRow name="fr" provider="Meta" purpose="Used for targeted advertising" expiry="3 months" type="HTTP" />
                      <CookieRow name="ads/ga-audiences" provider="Google" purpose="Used by Google AdWords to re-engage visitors" expiry="Session" type="Pixel" />
                    </tbody>
                  </table>
                </div>
              </div>
            </Section>

            <Section title="Third-party cookies">
              <p>
                Some cookies are placed by third-party services that appear on our pages,
                including Google Analytics, Meta Pixel, and Baidu Analytics. These third
                parties have their own privacy policies. We recommend reviewing them.
              </p>
            </Section>

            <Section title="Your rights">
              <p>
                Under GDPR and applicable data protection law, you have the right to:
              </p>
              <ul className="list-disc list-inside space-y-1.5 pl-2">
                <li>Access the personal data we hold about you</li>
                <li>Request deletion of your data</li>
                <li>Withdraw cookie consent at any time</li>
                <li>Lodge a complaint with a supervisory authority</li>
              </ul>
            </Section>

            <Section title="Contact us">
              <p>
                If you have any questions about our use of cookies, please contact us at{' '}
                <a href="mailto:dci@dulwich.org" className="text-[#D30013] underline hover:text-[#B8000F]">
                  dci@dulwich.org
                </a>
                .
              </p>
            </Section>
          </div>

          {/* ── Sidebar ───────────────────────────────────────────────── */}
          <div className="space-y-4">
            {/* Current preferences card */}
            <div className="sticky top-24 bg-[#FAF7F5] rounded-xl border border-[#F2EDE9] p-5">
              <h3 className="text-sm font-bold text-[#3C3737] mb-4">Your Cookie Preferences</h3>

              <div className="space-y-3 mb-5">
                {[
                  { key: 'necessary', label: 'Strictly Necessary', always: true },
                  { key: 'analytics', label: 'Analytics' },
                  { key: 'marketing', label: 'Marketing' },
                ].map(({ key, label, always }) => (
                  <div key={key} className="flex items-center justify-between">
                    <span className="text-xs text-[#3C3C3B]">{label}</span>
                    <span
                      className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                        preferences[key]
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-500'
                      }`}
                    >
                      {preferences[key] ? 'Active' : 'Off'}
                    </span>
                  </div>
                ))}
              </div>

              <div className="space-y-2">
                <button
                  onClick={acceptAll}
                  className="w-full py-2 bg-[#D30013] text-white text-xs font-semibold rounded-lg hover:bg-[#B8000F] transition-colors"
                >
                  Accept All
                </button>
                <button
                  onClick={rejectAll}
                  className="w-full py-2 border border-gray-300 text-[#3C3737] text-xs font-medium rounded-lg hover:bg-white transition-colors"
                >
                  Reject All
                </button>
                <button
                  onClick={resetConsent}
                  className="w-full py-2 text-[#D30013] text-xs font-medium underline hover:text-[#B8000F] transition-colors"
                >
                  Reset & Show Banner Again
                </button>
              </div>
            </div>
          </div>

        </div>
      </main>

      <PageFooter
        selectedSchool={selectedSchool}
        availableSchools={availableSchools}
        setSelectedSchool={setSelectedSchool}
        setSelectedSchoolSlug={setSelectedSchoolSlug}
      />
    </div>
  );
};

export default CookiePolicyPage;
