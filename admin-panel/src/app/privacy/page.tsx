import React from 'react';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto max-w-4xl overflow-hidden rounded-lg bg-white shadow-lg">
        <div className="px-6 py-8 md:px-8">
          <h1 className="mb-4 text-3xl font-bold text-gray-900">
            Privacy Policy
          </h1>
          <p className="mb-8 text-sm italic text-gray-600">
            Last updated: February 3, 2025
          </p>

          <section className="mb-8">
            <p className="mb-4 text-gray-600">
              The purpose of this Privacy Policy (&quot;Policy&quot;) is to
              inform customers, suppliers, and other users (&quot;Users&quot;)
              about the personal information and data collected by Ranjit
              (&quot;Ranjit,&quot; &quot;we,&quot; &quot;us,&quot; or
              &quot;our&quot;) through our website (www.ranjit.in) and mobile
              application (collectively, the &quot;Platform&quot;). This Policy
              demonstrates our commitment to complying with the Information
              Technology Act, 2000, and the Information Technology (Reasonable
              Security Practices and Procedures and Sensitive Personal Data or
              Information) Rules, 2011 (&quot;Rules&quot;).
            </p>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-semibold text-gray-800">
              PART I – Information Ranjit Collects and Controls
            </h2>

            <h3 className="mb-3 text-xl font-medium text-gray-800">
              1. What Information Ranjit Collects
            </h3>
            <p className="mb-4 text-gray-600">
              We collect information only for legitimate purposes. Information
              may be:
            </p>
            <ul className="mb-6 list-disc pl-6 text-gray-600">
              <li className="mb-1">Provided by you</li>
              <li className="mb-1">Automatically collected</li>
              <li className="mb-1">Obtained from third parties</li>
            </ul>

            <h4 className="mb-2 text-lg font-medium text-gray-800">
              a. Information You Provide
            </h4>
            <ul className="mb-6 list-disc pl-6 text-gray-600">
              <li className="mb-2">
                Account Signup: Name, company name, PAN, GST details, contact
                number, email address, country, username, and password. Optional
                details (e.g., photo, time zone, language) may also be provided.
              </li>
              <li className="mb-2">
                Payment Processing: Name, contact details, and payment
                information (credit card number is not stored; only last four
                digits, expiry date, and cardholder name/address are retained).
              </li>
              <li className="mb-2">
                Interactions with Ranjit: Communications (emails, calls, chats)
                may be recorded for quality improvement.
              </li>
              <li className="mb-2">
                Testimonials: Name and personal details in testimonials (with
                your consent and review prior to posting).
              </li>
            </ul>

            <h4 className="mb-2 text-lg font-medium text-gray-800">
              b. Automatically Collected Information
            </h4>
            <ul className="mb-6 list-disc pl-6 text-gray-600">
              <li className="mb-2">
                Browser/Device Data: IP address, browser type, language
                preference, time zone, operating system, device details, and
                access timestamps.
              </li>
              <li className="mb-2">
                Cookies and Tracking Technologies: First-party cookies, HTML5
                storage, and scripts to enhance user experience, track
                navigation, and analyze demographics.
              </li>
              <li className="mb-2">
                Application Logs and Analytics: Usage data (clicks, features
                accessed, errors, performance metrics, device locations).
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-semibold text-gray-800">
              PART II – Information Ranjit Processes on Your Behalf
            </h2>
            <h3 className="mb-3 text-xl font-medium text-gray-800">
              1. Service Data
            </h3>
            <ul className="mb-6 list-disc pl-6 text-gray-600">
              <li className="mb-2">
                Data Provided by You: Includes customer/employee data shared via
                our services or technical support requests.
              </li>
              <li className="mb-2">
                Mobile Device Data: Camera, contacts, location, or photo library
                access (if permitted) to enable app functionality.
              </li>
            </ul>

            <h3 className="mb-3 text-xl font-medium text-gray-800">
              2. Ownership and Control
            </h3>
            <p className="mb-4 text-gray-600">
              You retain ownership of your service data. You may:
            </p>
            <ul className="mb-6 list-disc pl-6 text-gray-600">
              <li className="mb-2">Access, share, or delete your data.</li>
              <li className="mb-2">
                Manage integrations with third-party services.
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-semibold text-gray-800">
              PART III – General
            </h2>
            <h3 className="mb-3 text-xl font-medium text-gray-800">
              Contact Information
            </h3>
            <div className="rounded-lg bg-gray-50 p-6">
              <p className="mb-4 text-gray-600">
                For concerns about adherence to this Policy, contact us:
              </p>
              <ul className="text-gray-600">
                <li className="mb-2">Company: Ranjit</li>
                <li className="mb-2">Email: support@ranjit.in</li>
                <li className="mb-2">Website: www.ranjit.in</li>
              </ul>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;