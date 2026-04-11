// ==============================================
// risePaisa — Legal Pages (Privacy, Terms, Disclaimer)
// ==============================================
import { setPageMeta } from '../components.js';
import { getSettings } from '../admin/store.js';

const LEGAL_CONTENT = {
  privacy: {
    title: 'Privacy Policy',
    description: 'How RisePaisa collects, uses, and protects your personal information across courses, templates, and consulting services.',
    lastUpdated: 'April 2026',
    content: `
  <h2>Introduction</h2>
  <p>RisePaisa ("we", "our", or "us") is committed to protecting your personal data while delivering financial education services, including online courses (e.g., NEPSE, personal finance), digital products (templates), and paid consulting sessions. By accessing or using our platform, you agree to this Privacy Policy.</p>

  <h2>Scope of Services</h2>
  <ul>
    <li>Online courses and educational content</li>
    <li>Digital products such as templates and guides</li>
    <li>Paid consulting and advisory sessions</li>
    <li>Website and related digital platforms</li>
  </ul>

  <h2>Information We Collect</h2>

  <h3>Information You Provide</h3>
  <ul>
    <li><strong>Personal Information:</strong> Name, email, phone number, billing details</li>
    <li><strong>Communication Data:</strong> Messages via contact forms, WhatsApp, or email</li>
    <li><strong>Consultation Data:</strong> Information voluntarily shared during consulting sessions</li>
  </ul>

  <h3>Account & Service Data</h3>
  <ul>
    <li>Course access records and progress</li>
    <li>Purchase history and service usage</li>
  </ul>

  <h3>Payment Data</h3>
  <ul>
    <li>Transaction ID and payment status</li>
    <li>Processed via third-party gateways (e.g., Khalti, eSewa, Stripe)</li>
    <li><strong>We do not store card or wallet credentials</strong></li>
  </ul>

  <h3>Automatically Collected Information</h3>
  <ul>
    <li>IP address, browser type, device information</li>
    <li>Pages visited, session duration, click behavior</li>
    <li>Cookies and analytics data</li>
  </ul>

  <h2>How We Use Your Information</h2>
  <ul>
    <li>To deliver purchased courses, templates, and consulting services</li>
    <li>To process payments and grant access to content</li>
    <li>To provide customer support and respond to inquiries</li>
    <li>To improve platform performance and user experience</li>
    <li>To detect fraud, abuse, or unauthorized usage</li>
    <li>To send updates and marketing content (with opt-out option)</li>
    <li>To comply with legal obligations</li>
  </ul>

  <h2>Legal Basis for Processing</h2>
  <ul>
    <li><strong>Contractual Necessity:</strong> To deliver purchased services</li>
    <li><strong>Consent:</strong> For marketing and optional data submission</li>
    <li><strong>Legitimate Interest:</strong> Analytics, improvement, fraud prevention</li>
    <li><strong>Legal Obligation:</strong> Compliance with applicable laws</li>
  </ul>

  <h2>Data Sharing</h2>
  <p>We do not sell, rent, or trade your personal information.</p>
  <ul>
    <li><strong>Service Providers:</strong> Payment gateways, hosting, analytics tools</li>
    <li><strong>Internal Access:</strong> Limited to authorized personnel only</li>
    <li><strong>Legal Authorities:</strong> When required by law or to protect our rights</li>
  </ul>

  <h2>Cookies & Tracking</h2>
  <p>We use cookies and tracking technologies to enhance user experience and analyze platform usage.</p>
  <ul>
    <li><strong>Essential Cookies:</strong> Required for functionality</li>
    <li><strong>Analytics Cookies:</strong> For traffic and behavior analysis (e.g., Google Analytics)</li>
  </ul>
  <p>You may disable cookies via browser settings, but some features may not function properly.</p>

  <h2>Data Security</h2>
  <p>We implement industry-standard safeguards including SSL encryption and secure infrastructure. However, no system is completely secure, and you acknowledge inherent risks in online data transmission.</p>

  <h2>Data Retention</h2>
  <p>We retain data as necessary to:</p>
  <ul>
    <li>Provide continued access to purchased services</li>
    <li>Comply with legal and financial obligations in Nepal</li>
    <li>Handle disputes, refunds, or chargebacks</li>
    <li>Improve content and services</li>
  </ul>

  <h2>Your Rights</h2>
  <ul>
    <li>Access and update your personal data</li>
    <li>Request deletion of your account</li>
    <li>Withdraw consent for marketing communications</li>
    <li>Request a copy of your data</li>
  </ul>
  <p>We may retain certain data where required for legal, operational, or contractual purposes.</p>

  <h2>Financial & Consulting Disclaimer</h2>
  <p>All content, courses, templates, and consulting services provided by RisePaisa are for educational and informational purposes only. We do not provide financial, investment, or legal advice.</p>
  <p>You are solely responsible for any financial decisions, including investments in NEPSE or other markets. RisePaisa shall not be liable for any losses, damages, or outcomes resulting from the use of our services.</p>

  <h2>Children’s Privacy</h2>
  <p>Our services are not intended for individuals under 16. If such data is identified, it will be deleted.</p>

  <h2>Policy Updates</h2>
  <p>We reserve the right to update this Privacy Policy at any time without prior notice. Continued use of our services constitutes acceptance of the updated policy.</p>

  <h2>Governing Law</h2>
  <p>This Privacy Policy is governed by the laws of Nepal. Any disputes shall be subject to the jurisdiction of the courts of Kathmandu.</p>

  <h2>Contact Us</h2>
  <p>If you have any questions or requests, contact us at:</p>
  <p>Email: <a href="mailto:itsaakashdas@gmail.com">itsaakashdas@gmail.com</a></p>
  <p>Phone: +977 9761145115</p>
  <p>Website: <a href="https://www.risepaisa.com">www.risepaisa.com</a></p>
`
  },

  terms: {
    title: 'Terms & Conditions',
    description: 'Terms governing the use of RisePaisa services, including courses, templates, and consulting.',
    lastUpdated: 'April 2026',
    content: `
  <h2>Introduction</h2>
  <p>These Terms & Conditions ("Terms") govern your access to and use of RisePaisa ("we", "our", or "us"), including all services such as online courses, digital products (templates), and consulting sessions. By accessing or purchasing from RisePaisa, you agree to these Terms.</p>

  <h2>Scope of Services</h2>
  <ul>
    <li>Online financial education courses (e.g., NEPSE, personal finance)</li>
    <li>Digital products including templates, guides, and tools</li>
    <li>Paid consulting sessions (e.g., video calls, advisory)</li>
    <li>Website and related digital platforms</li>
  </ul>

  <h2>User Eligibility</h2>
  <p>By using our services, you confirm that:</p>
  <ul>
    <li>You are at least 16 years of age</li>
    <li>You have the legal capacity to enter into a binding agreement</li>
    <li>All information provided is accurate and complete</li>
  </ul>

  <h2>Account Responsibility</h2>
  <ul>
    <li>You are responsible for maintaining the confidentiality of your account</li>
    <li>You agree not to share login access with others</li>
    <li>We reserve the right to suspend or terminate accounts involved in misuse</li>
  </ul>

  <h2>Payments & Pricing</h2>
  <ul>
    <li>All prices are listed in applicable currency and may change without prior notice</li>
    <li>Payments are processed via third-party providers (e.g., Khalti, eSewa, Stripe)</li>
    <li>Access to services is granted only after successful payment confirmation</li>
    <li>You are responsible for any applicable taxes or transaction charges</li>
  </ul>

  <h2>Refund Policy</h2>
  <p>Due to the digital nature of our products and services:</p>
  <ul>
    <li>All sales are final unless explicitly stated otherwise</li>
    <li>No refunds for accessed courses, downloaded templates, or completed consulting sessions</li>
    <li>Refund requests (if applicable) are evaluated on a case-by-case basis</li>
  </ul>

  <h2>Consulting Services</h2>
  <ul>
    <li>Consulting sessions are scheduled based on availability</li>
    <li>Rescheduling must be requested in advance</li>
    <li>Missed sessions without prior notice may not be rescheduled or refunded</li>
  </ul>

  <h2>Intellectual Property</h2>
  <ul>
    <li>All content (videos, materials, templates) is owned by RisePaisa</li>
    <li>You are granted a limited, non-transferable, non-commercial license</li>
    <li>You may not copy, distribute, resell, or reproduce content without permission</li>
  </ul>

  <h2>Prohibited Use</h2>
  <ul>
    <li>Sharing or reselling course access or materials</li>
    <li>Attempting to hack, disrupt, or misuse the platform</li>
    <li>Using content for illegal or unauthorized purposes</li>
  </ul>

  <h2>Financial Disclaimer</h2>
  <p>All content provided by RisePaisa is for educational purposes only and does not constitute financial, investment, or legal advice.</p>
  <p>You are solely responsible for your financial decisions, including investments in NEPSE or other markets.</p>

  <h2>Limitation of Liability</h2>
  <p>RisePaisa shall not be liable for:</p>
  <ul>
    <li>Any financial loss or investment outcomes</li>
    <li>Indirect, incidental, or consequential damages</li>
    <li>Loss arising from reliance on educational content</li>
  </ul>

  <h2>Service Availability</h2>
  <p>We do not guarantee uninterrupted or error-free access. Services may be modified, suspended, or discontinued at any time.</p>

  <h2>Termination</h2>
  <p>We reserve the right to suspend or terminate access if:</p>
  <ul>
    <li>These Terms are violated</li>
    <li>Fraudulent or abusive behavior is detected</li>
  </ul>

  <h2>Changes to Terms</h2>
  <p>We may update these Terms at any time without prior notice. Continued use of our services constitutes acceptance of the updated Terms.</p>

  <h2>Governing Law</h2>
  <p>These Terms shall be governed by the laws of Nepal. Any disputes shall be subject to the jurisdiction of the courts of Kathmandu.</p>

  <h2>Contact Information</h2>
  <p>For any questions regarding these Terms:</p>
  <p>Email: <a href="mailto:itsaakashdas@gmail.com">itsaakashdas@gmail.com</a></p>
  <p>Phone: +977 9761145115</p>
  <p>Website: <a href="https://www.risepaisa.com">www.risepaisa.com</a></p>
`
  },

  disclaimer: {
    title: 'Disclaimer',
    description: 'Important disclaimers about risePaisa\'s financial education content.',
    lastUpdated: 'March 2026',
    content: `
      <h2>Educational Purpose Only</h2>
      <p><strong>risePaisa provides financial education content for informational and educational purposes only.</strong> Nothing on this website, in our courses, or articles should be construed as professional financial advice, investment advice, tax advice, or legal advice.</p>

      <h2>Not Financial Advice</h2>
      <p>The information provided by risePaisa:</p>
      <ul>
        <li>Is for educational and informational use only</li>
        <li>Should not be the sole basis for any financial decision</li>
        <li>Does not constitute a recommendation to buy, sell, or hold any investment</li>
        <li>May not reflect the most current legal or regulatory developments</li>
      </ul>

      <h2>Consult a Professional</h2>
      <p>Before making any financial decisions, including but not limited to investments, tax filing, or financial planning, we strongly recommend consulting with a qualified financial advisor, chartered accountant, or tax professional who can consider your individual circumstances.</p>

      <h2>No Guarantee of Results</h2>
      <p>We do not guarantee any specific financial outcomes from following our educational content. Past performance of any investment mentioned in our content does not guarantee future results. All investments carry risk, including the potential loss of principal.</p>

      <h2>Accuracy of Information</h2>
      <p>While we strive to provide accurate and up-to-date information, we make no warranties about the completeness, reliability, or accuracy of the content. Tax laws, regulations, and financial products in Nepal may change, and our content may not always reflect the most recent updates.</p>

      <h2>Third-Party Links</h2>
      <p>Our website may contain links to third-party websites. We are not responsible for the content, accuracy, or practices of these external sites.</p>

      <h2>Risk Disclosure</h2>
      <p>Investing in the stock market (including NEPSE), mutual funds, and other financial instruments involves risk. You may lose some or all of your investment. Only invest money you can afford to lose.</p>

      <h2>Contact</h2>
      <p>If you have questions about this Disclaimer, please contact us at <a href="mailto:itsaakashdas@gmail.com">itsaakashdas@gmail.com</a>.</p>
    `
  }
};

export function renderLegalPage(type) {
  const defaults = LEGAL_CONTENT[type];
  if (!defaults) {
    setPageMeta('Page Not Found', '');
    return `<div class="section"><div class="container" style="text-align:center"><h1>Page Not Found</h1><a href="#/" class="btn btn-primary" style="margin-top:var(--space-6)">Go Home</a></div></div>`;
  }

  // CMS: check admin-stored content, fall back to hardcoded defaults
  const stored = getSettings().pages?.[type];
  const title = (stored?.title && stored.title.trim()) ? stored.title : defaults.title;
  const lastUpdated = (stored?.lastUpdated && stored.lastUpdated.trim()) ? stored.lastUpdated : defaults.lastUpdated;
  const content = (stored?.content && stored.content.trim()) ? stored.content : defaults.content;

  setPageMeta(title, defaults.description);

  return `
    <div class="legal-page" id="legal-page">
      <div class="breadcrumb">
        <a href="#/">Home</a><span class="separator">/</span>
        <span>${title}</span>
      </div>
      <h1>${title}</h1>
      <p class="last-updated">Last updated: ${lastUpdated}</p>
      ${content}
    </div>
  `;
}

export function initLegalPage() { }
