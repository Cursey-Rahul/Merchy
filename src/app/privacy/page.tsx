import React from "react";

export const metadata = {
  title: "Privacy Policy - Merchy",
  description: "Read the Privacy Policy for Merchy food delivery app",
};

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-20">
      <div className="w-full mx-auto bg-white shadow-md rounded-lg p-10 lg:p-16">
        <h1 className="text-4xl font-bold mb-8 text-gray-900">Privacy Policy</h1>

        <p className="mb-6 text-gray-700">
          <strong>Effective Date:</strong> Sunday, August 17, 2025<br />
          <strong>Last Updated:</strong> Sunday, August 17, 2025
        </p>

        <p className="mb-6 text-gray-700">
          Merchy (“we,” “our,” or “us”) values your privacy and is committed to protecting your personal information. This Privacy Policy explains how we collect, use, and safeguard the information you provide when using the Merchy mobile application, website, and related services (“Service”).
        </p>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-3 text-gray-800">1. Information We Collect</h2>
          <p className="mb-2 text-gray-700">
            We may collect the following information from you:
          </p>
          <ul className="list-disc list-inside text-gray-700 mb-2">
            <li>Personal identification details such as name, email address, phone number, and delivery address.</li>
            <li>Payment information, including credit/debit card details or other payment methods.</li>
            <li>Order history, preferences, and feedback provided through the Service.</li>
            <li>Device information and usage data, including IP address, browser type, and operating system.</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-3 text-gray-800">2. How We Use Your Information</h2>
          <p className="mb-2 text-gray-700">
            We use the information collected for the following purposes:
          </p>
          <ul className="list-disc list-inside text-gray-700 mb-2">
            <li>To provide and improve our services, including order processing and delivery.</li>
            <li>To communicate with you regarding your orders, promotions, and updates.</li>
            <li>To analyze trends, usage, and preferences to enhance the user experience.</li>
            <li>To ensure the security and integrity of the Service and prevent fraudulent activity.</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-3 text-gray-800">3. Sharing Your Information</h2>
          <p className="mb-2 text-gray-700">
            We do not sell or rent your personal information to third parties. We may share information under the following circumstances:
          </p>
          <ul className="list-disc list-inside text-gray-700 mb-2">
            <li>With restaurants and delivery partners for order fulfillment.</li>
            <li>With payment processors to complete transactions.</li>
            <li>When required by law or to respond to legal requests.</li>
            <li>To protect the safety, rights, or property of users and the public.</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-3 text-gray-800">4. Data Security</h2>
          <p className="text-gray-700">
            We implement reasonable technical and organizational measures to protect your personal information from unauthorized access, disclosure, alteration, or destruction. However, no method of transmission or storage is 100% secure, and we cannot guarantee absolute security.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-3 text-gray-800">5. Your Rights</h2>
          <p className="mb-2 text-gray-700">
            You have the right to:
          </p>
          <ul className="list-disc list-inside text-gray-700 mb-2">
            <li>Access, update, or correct your personal information.</li>
            <li>Request deletion of your personal data, subject to legal and contractual obligations.</li>
            <li>Opt-out of receiving promotional communications from us.</li>
          </ul>
          <p className="text-gray-700">
            To exercise these rights, please contact us at <strong>support@merchy.com</strong>.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-3 text-gray-800">6. Cookies and Tracking</h2>
          <p className="text-gray-700">
            We use cookies, analytics, and similar tracking technologies to enhance your experience, remember your preferences, and analyze trends. You can manage your cookie preferences through your browser settings.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-3 text-gray-800">7. Third-Party Links</h2>
          <p className="text-gray-700">
            Our Service may contain links to third-party websites. We are not responsible for the privacy practices of these third parties, and we encourage you to review their privacy policies.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-3 text-gray-800">8. Children`s Privacy</h2>
          <p className="text-gray-700">
            Our Service is not directed to individuals under the age of 18. We do not knowingly collect personal information from children. If we become aware that we have collected data from a child, we will take steps to delete it promptly.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-3 text-gray-800">9. Changes to This Privacy Policy</h2>
          <p className="text-gray-700">
            We may update this Privacy Policy from time to time. Updated versions will be posted on the app and website with the revised effective date. Continued use of the Service constitutes acceptance of the updated Privacy Policy.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3 text-gray-800">10. Contact Us</h2>
          <p className="text-gray-700 mb-2">
            For questions or concerns regarding this Privacy Policy, please contact us at:
          </p>
          <ul className="list-disc list-inside text-gray-700">
            <li>Email: <strong>cursey.pvt.ltd@gmail.com</strong></li>
            <li>Phone: <strong>+91-XXXXXXXXXX</strong></li>
          </ul>
        </section>
      </div>
    </main>
  );
}
