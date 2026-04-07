// ==============================================
// risePaisa — Blog Post Page
// ==============================================
import { getArticles } from '../admin/store.js';
import { renderShareButtons, renderArticleCard, formatDate, setPageMeta } from '../components.js';

export function renderBlogPostPage(slug) {
  const ARTICLES = getArticles();
  const article = ARTICLES.find(a => a.slug === slug);
  if (!article) {
    setPageMeta('Article Not Found', '');
    return `<div class="section"><div class="container" style="text-align:center"><h1>Article Not Found</h1><p>Sorry, we couldn't find that article.</p><a href="#/blog" class="btn btn-primary" style="margin-top:var(--space-6)">Browse Articles</a></div></div>`;
  }

  setPageMeta(article.title, article.excerpt);

  const catClass = {
    'Personal Finance': 'cat-personal-finance',
    'NEPSE & Investing': 'cat-nepse',
    'Taxation': 'cat-taxation',
    'Fintech': 'cat-fintech',
  };

  // Get related articles (same category, not this one)
  const related = ARTICLES.filter(a => a.category === article.category && a.id !== article.id).slice(0, 3);

  return `
    <div class="blog-post-hero" id="post-hero">
      <div class="container">
        <div class="breadcrumb">
          <a href="#/">Home</a><span class="separator">/</span>
          <a href="#/blog">Blog</a><span class="separator">/</span>
          <span>${article.title}</span>
        </div>
        <span class="card-category ${catClass[article.category] || 'cat-nepse'}" style="margin-bottom:var(--space-4);display:inline-block">${article.category}</span>
        <h1>${article.title}</h1>
        <div class="blog-post-meta">
          <span>By <strong>${article.author}</strong></span>
          <span>·</span>
          <span>${formatDate(article.date)}</span>
          <span>·</span>
          <span>${article.readTime}</span>
        </div>
      </div>
    </div>

    ${article.thumbnail
      ? `<div class="blog-post-featured" id="post-featured">
          <div class="container container-narrow" style="max-width:720px;margin:0 auto;padding:0 var(--space-5)">
            <img src="${article.thumbnail}" alt="${article.title}" class="blog-post-featured-img" loading="lazy">
          </div>
        </div>`
      : ''
    }

    <article class="blog-post-body" id="post-body">
      ${article.content}
    </article>

    <div class="blog-post-footer" id="post-footer">
      ${renderShareButtons(article.title, `#/blog/${article.slug}`)}
      <a href="#/blog" class="btn btn-ghost">← Back to Articles</a>
    </div>

    ${related.length > 0 ? `
      <section class="related-articles" id="related-articles">
        <div class="container">
          <div class="section-header">
            <h2>Related Articles</h2>
          </div>
          <div class="grid-3">
            ${related.map(a => renderArticleCard(a)).join('')}
          </div>
        </div>
      </section>
    ` : ''}
  `;
}

export function initBlogPostPage() {
  // No special initialization needed
}
