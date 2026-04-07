// ==============================================
// risePaisa — Personal Consultancy Page
// ==============================================
import { ICONS, setPageMeta, getWhatsApp } from '../components.js';
import { getSettings } from '../admin/store.js';

export function renderConsultancyPage() {
  const settings = getSettings();
  const pg = settings.pages?.consultancy || {};

  const title = (pg.title && pg.title.trim()) ? pg.title : 'Personal Consultancy';
  const description = (pg.description && pg.description.trim())
    ? pg.description
    : 'We provide one-to-one personal consultancy sessions focused on finance, investing, and practical money management based on your real situation.\n\nThis is a direct video call consultancy where you can discuss your financial goals, problems, and strategy in detail.';
  const pricingText = (pg.pricingText && pg.pricingText.trim())
    ? pg.pricingText
    : 'Consultancy is conducted via video call.\nIf you need personalized guidance and clear direction, you can book a session and get direct support.';
  const priceValue = (pg.priceValue && pg.priceValue.trim()) ? pg.priceValue : '2500';
  const duration = (pg.duration && pg.duration.trim()) ? pg.duration : '2 hours';
  const buttonText = (pg.buttonText && pg.buttonText.trim()) ? pg.buttonText : 'Contact for Consultancy';

  const waNumber = getWhatsApp();
  const waLink = `https://wa.me/${waNumber}`;

  setPageMeta(title, 'Get personal financial consultancy from risePaisa. Book a video session today.');

  // Split description by newlines for paragraph rendering
  const descParagraphs = description.split('\n').filter(p => p.trim());
  
  // Split pricing text similarly
  const pricingParagraphs = pricingText.split('\n').filter(p => p.trim());

  return `
    <div class="page-header" id="consultancy-header">
      <div class="container">
        <h1>${title}</h1>
      </div>
    </div>
    <section class="section">
      <div class="container" style="max-width:700px;text-align:center">

        <div style="margin-bottom:var(--space-8)">
          ${descParagraphs.map(p => `<p style="font-size:var(--text-lg);color:var(--color-text-secondary);line-height:var(--leading-relaxed);margin-bottom:var(--space-4)">${p.trim()}</p>`).join('')}
        </div>

        <div style="background:var(--color-card);border:1px solid var(--color-border);border-radius:var(--radius-lg);padding:var(--space-6);margin-bottom:var(--space-8)">
          ${pricingParagraphs.map(p => `<p style="font-size:var(--text-md);color:var(--color-text-secondary);margin-bottom:var(--space-4)">${p.trim()}</p>`).join('')}
          <div style="font-size:var(--text-2xl);font-weight:var(--weight-bold);color:var(--color-accent);margin-bottom:0">
            NPR ${priceValue} <span style="font-size:var(--text-sm);color:var(--color-text-muted);font-weight:normal">/ session (approx. ${duration})</span>
          </div>
        </div>

        <a href="${waLink}" target="_blank" rel="noopener" class="btn btn-whatsapp btn-lg" style="font-size:var(--text-lg);padding:var(--space-4) var(--space-8)">
          ${ICONS.whatsapp} ${buttonText}
        </a>

      </div>
    </section>
  `;
}

export function initConsultancyPage() {
  // No interactive elements needed
}
