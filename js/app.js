/**
 * EduAtlas Knowledge Platform - 공통 JS
 */

// ---- Navigation ----
function initNav() {
  const toggle = document.querySelector('.mobile-toggle');
  const nav = document.querySelector('.nav-links');
  if (toggle && nav) {
    toggle.addEventListener('click', () => nav.classList.toggle('open'));
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.site-header')) nav.classList.remove('open');
    });
  }
  // active link
  const path = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === path || (path === 'index.html' && href === 'index.html')) {
      a.classList.add('active');
    }
  });
}

// ---- Header HTML ----
function getHeaderHTML() {
  return `
  <header class="site-header">
    <div class="header-inner">
      <a href="/" class="logo">
        <span>🌐</span> EduAtlas
      </a>
      <button class="mobile-toggle" aria-label="메뉴">☰</button>
      <nav>
        <ul class="nav-links">
          <li><a href="/">Explore</a></li>
          <li><a href="/categories/academies">Academies</a></li>
          <li><a href="/categories/research">Research</a></li>
          <li><a href="/categories/topics">Topics</a></li>
          <li><a href="/categories/experiments">Experiments</a></li>
          <li><a href="/categories/study">Study</a></li>
          <li><a href="/interactive.html">Interactive</a></li>
          <li><a href="/search.html">Search</a></li>
        </ul>
      </nav>
    </div>
  </header>`;
}

// ---- Footer HTML ----
function getFooterHTML() {
  return `
  <footer class="site-footer">
    <div class="footer-inner">
      <div class="footer-grid">
        <div>
          <div class="footer-brand">🌐 EduAtlas</div>
          <p class="footer-desc">Explore Education Atlas — 교육 데이터를 지도처럼 탐색하는 플랫폼</p>
        </div>
        <div class="footer-section">
          <h4>Atlas</h4>
          <a href="/categories/academies">Academies</a>
          <a href="/categories/research">Research</a>
          <a href="/categories/topics">Topics</a>
          <a href="/categories/experiments">Experiments</a>
          <a href="/categories/study">Study</a>
          <a href="/interactive.html">Interactive</a>
        </div>
        <div class="footer-section">
          <h4>Tools</h4>
          <a href="geo-builder.html">GEO Builder</a>
          <a href="search.html">Search</a>
          <a href="admin.html">Admin</a>
        </div>
        <div class="footer-section">
          <h4>Trust</h4>
          <a href="about.html">About</a>
          <a href="contact.html">Contact</a>
          <a href="privacy.html">개인정보처리방침</a>
          <a href="terms.html">이용약관</a>
          <a href="content-policy.html">콘텐츠 운영 원칙</a>
        </div>
      </div>
      <div class="footer-bottom">
        &copy; 2026 EduAtlas. All rights reserved.
      </div>
    </div>
  </footer>`;
}

// ---- Render Helpers ----
function renderDocCard(doc) {
  const cat = getCategoryById(doc.categoryId);
  const desc = (doc.directAnswer && doc.directAnswer.length > 0)
    ? doc.directAnswer[0]
    : doc.summary;
  return `
  <a href="/documents/${doc.slug}" class="card">
    <div class="card-title">${doc.title}</div>
    <div class="card-desc">${desc}</div>
    <div class="card-meta">
      <span>${cat ? cat.icon + ' ' + cat.nameKo : ''}</span>
      <span>${doc.docType}</span>
      <span>${formatDate(doc.updatedAt)}</span>
    </div>
    <div class="tag-list" style="margin-top:10px">
      ${doc.tags.slice(0, 4).map(t => `<span class="tag">${t}</span>`).join('')}
    </div>
  </a>`;
}

function renderCatCard(cat) {
  const count = getDocumentsByCategory(cat.id).length;
  return `
  <a href="/categories/${cat.id}" class="cat-card">
    <div class="cat-icon">${cat.icon}</div>
    <div class="cat-name">${cat.name}</div>
    <div class="cat-name-ko">${cat.nameKo}</div>
    <div class="cat-count">${count}개 문서</div>
  </a>`;
}

// ---- URL Params ----
function getParam(name) {
  return new URLSearchParams(location.search).get(name);
}

// ---- Init ----
document.addEventListener('DOMContentLoaded', () => {
  // inject header & footer
  const headerEl = document.getElementById('site-header');
  const footerEl = document.getElementById('site-footer');
  if (headerEl) headerEl.innerHTML = getHeaderHTML();
  if (footerEl) footerEl.innerHTML = getFooterHTML();
  initNav();

  // page-specific init — Firestore 데이터 로드 완료 후 실행
  if (typeof pageInit === 'function') {
    if (typeof onDataReady === 'function') {
      onDataReady(pageInit);
    } else {
      pageInit();
    }
  }
});
