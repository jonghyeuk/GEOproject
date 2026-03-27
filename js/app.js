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
        <span>🏫</span> EduAtlas
      </a>
      <button class="mobile-toggle" aria-label="메뉴">☰</button>
      <nav>
        <ul class="nav-links">
          <li><a href="/">홈</a></li>
          <li><a href="/categories/academy">학원찾기</a></li>
          <li><a href="/categories/edu-guide">교육가이드</a></li>
          <li><a href="/search.html">검색</a></li>
          <li><a href="/register.html" class="nav-cta">학원등록</a></li>
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
          <div class="footer-brand">🏫 EduAtlas</div>
          <p class="footer-desc">AI가 인용하는 교육 정보 데이터베이스</p>
        </div>
        <div class="footer-section">
          <h4>학원 정보</h4>
          <a href="/categories/academy">학원찾기</a>
          <a href="/categories/edu-guide">교육가이드</a>
          <a href="/register.html">학원등록</a>
        </div>
        <div class="footer-section">
          <h4>도구</h4>
          <a href="/search.html">검색</a>
          <a href="/admin.html">관리</a>
        </div>
        <div class="footer-section">
          <h4>정보</h4>
          <a href="/about.html">소개</a>
          <a href="/contact.html">문의</a>
          <a href="/privacy.html">개인정보처리방침</a>
          <a href="/terms.html">이용약관</a>
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

// ---- Academy Card Render ----
function renderAcademyCard(doc) {
  const info = doc.academyInfo || {};
  const subjectNames = (info.subjects || []).map(sid => {
    const s = SUBJECTS.find(x => x.id === sid);
    return s ? s.icon + ' ' + s.name : sid;
  });
  return `
  <a href="/documents/${doc.slug}" class="card academy-card">
    <div class="card-title">${doc.academyInfo ? doc.keyInfo.name : doc.title}</div>
    <div class="card-desc">${subjectNames.join(' | ')}${info.ageGroups ? ' &middot; ' + info.ageGroups.join(', ') : ''}</div>
    <div class="card-meta">
      <span>📍 ${doc.keyInfo ? doc.keyInfo.location : ''} ${info.district || ''}</span>
      ${info.classSize ? '<span>👥 ' + info.classSize + '</span>' : ''}
      ${info.monthlyFee ? '<span>💰 ' + info.monthlyFee + '</span>' : ''}
    </div>
    <div class="tag-list" style="margin-top:10px">
      ${(info.features || []).slice(0, 3).map(f => '<span class="tag">' + f + '</span>').join('')}
    </div>
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
