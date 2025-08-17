import React from "react";

export const metadata = {
  title: "Terms & Conditions - Merchy",
  description: "Read the Terms & Conditions for Merchy food delivery app",
};

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-20">
      <div className="w-full mx-auto bg-white shadow-md rounded-lg p-10 lg:p-16">
        <h1 className="text-4xl font-bold mb-8 text-gray-900">Terms & Conditions</h1>

        <p className="mb-6 text-gray-700">
          <strong>Effective Date:</strong> Sunday, August 17, 2025<br />
          <strong>Last Updated:</strong> Sunday, August 17, 2025
        </p>

        <p className="mb-6 text-gray-700">
          Welcome to <strong>Merchy</strong> (“we,” “our,” or “us”). These Terms and Conditions (“Terms”) govern your access and use of the Merchy mobile application, website, and related services (“Service”). By accessing or using our Service, you agree to be bound by these Terms. If you do not agree to any part of these Terms, you are not authorized to use the Service.
        </p>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-3 text-gray-800">1. Eligibility</h2>
          <p className="mb-2 text-gray-700">
            To use the Service, you must be at least eighteen (18) years old. By accessing or using the Service, you represent and warrant that you have the legal authority to enter into a binding agreement in accordance with these Terms.
          </p>
          <p className="text-gray-700">
            If you are under 18, you are not permitted to use this Service under any circumstances.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-3 text-gray-800">2. User Account</h2>
          <p className="mb-2 text-gray-700">
            In order to place orders and access certain features of the Service, you may be required to create a user account. You agree to provide accurate, current, and complete information during the registration process and to update such information to keep it accurate. 
          </p>
          <p className="mb-2 text-gray-700">
            You are responsible for maintaining the confidentiality of your account credentials, including your password, and for all activity that occurs under your account. If you suspect unauthorized use, you must immediately notify us.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-3 text-gray-800">3. Service Scope</h2>
          <p className="mb-2 text-gray-700">
            Merchy acts solely as a platform that connects customers with restaurants and delivery partners. We do not prepare, manufacture, or sell food ourselves. The restaurant from which the food originates is solely responsible for the quality, safety, and compliance of the food.
          </p>
          <p className="text-gray-700">
            Estimated delivery times provided on the platform are for convenience only and may vary due to factors such as traffic, weather, and operational delays. We do not guarantee delivery times.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-3 text-gray-800">4. Orders & Payments</h2>
          <p className="mb-2 text-gray-700">
            All prices listed on the Service are in <strong>Indian Rupees (INR)</strong>. Payments for orders must be made using the approved payment methods available within the Service. Orders are confirmed only after successful payment authorization.
          </p>
          <p className="text-gray-700">
            Once an order is placed and confirmed, it may not be cancelled except as permitted under our cancellation policy. You are responsible for verifying order details before placing an order.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-3 text-gray-800">5. Refund & Cancellation Policy</h2>
          <p className="mb-2 text-gray-700">
            Refunds may be issued under the following circumstances:
          </p>
          <ul className="list-disc list-inside mb-2 text-gray-700">
            <li>The order was not delivered.</li>
            <li>The order delivered was incorrect or incomplete.</li>
            <li>The food delivered was unsafe or unfit for consumption.</li>
          </ul>
          <p className="text-gray-700">
            Refund timelines may vary depending on your payment method and financial institution. In certain cases, partial refunds may be issued at our discretion.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-3 text-gray-800">6. Delivery</h2>
          <p className="mb-2 text-gray-700">
            You agree to provide complete and accurate delivery information, including address and contact details. In the event that you are unavailable at the time of delivery, your order may be canceled without a refund. 
          </p>
          <p className="text-gray-700">
            Ownership and risk of the food items pass to you upon delivery. We are not responsible for any loss, damage, or quality issues after delivery.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-3 text-gray-800">7. Prohibited Activities</h2>
          <p className="mb-2 text-gray-700">
            You agree not to use the Service for any fraudulent, illegal, or unauthorized purposes, including but not limited to:
          </p>
          <ul className="list-disc list-inside mb-2 text-gray-700">
            <li>Placing fraudulent or unauthorized orders.</li>
            <li>Reselling or redistributing food obtained through the Service.</li>
            <li>Interfering with or attempting to disrupt the Service using unauthorized means, including hacking or automated tools.</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-3 text-gray-800">8. Intellectual Property</h2>
          <p className="text-gray-700">
            All content, trademarks, logos, and other intellectual property displayed on the Service are owned by <strong>Merchy</strong>. You may not copy, reproduce, distribute, or use our intellectual property without our prior written consent.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-3 text-gray-800">9. Limitation of Liability</h2>
          <p className="text-gray-700">
            Merchy is not responsible for the quality, safety, or taste of the food provided by restaurants. We are not liable for delays due to circumstances beyond our control, including traffic, weather, or strikes. Our maximum liability, if any, is limited to the total amount paid for the affected order.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-3 text-gray-800">10. Termination</h2>
          <p className="text-gray-700">
            We reserve the right to suspend or terminate your account in case of violation of these Terms. You may also terminate your use of the Service at any time by discontinuing access.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-3 text-gray-800">11. Governing Law</h2>
          <p className="text-gray-700">
            These Terms are governed by the laws of <strong>India</strong>, and any disputes will be subject to the jurisdiction of courts located in <strong>Delhi, India</strong>.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-3 text-gray-800">12. Changes to Terms</h2>
          <p className="text-gray-700">
            We may update these Terms periodically. Updated versions will be posted on the app and website with the revised effective date. Continued use of the Service constitutes acceptance of the updated Terms.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3 text-gray-800">13. Contact Us</h2>
          <p className="text-gray-700">
            For questions about these Terms, please contact us at:
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
