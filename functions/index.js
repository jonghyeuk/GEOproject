/**
 * EduAtlas - Cloud Functions SSR
 *
 * /documents/:slug 요청 시 Firestore에서 JSON 데이터를 읽어
 * 완전한 HTML을 조립하여 반환합니다.
 *
 * 봇(Google, AI)이 JavaScript 없이도 모든 콘텐츠를 볼 수 있도록 합니다.
 */

const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();
const db = admin.firestore();

const BASE_URL = "https://geoproject-8fc76.web.app";

// ============================================================
// 카테고리 데이터 (정적)
// ============================================================

const CATEGORIES = [
  { id: "theory", name: "이론·원리", nameKo: "이론·원리", icon: "📐", description: "과학 법칙, 공식, 핵심 개념을 구조화하여 정리한 지식 문서" },
  { id: "experiment", name: "실험방법", nameKo: "실험방법", icon: "🧪", description: "실험 설계, 변인 통제, 측정 방법, 데이터 수집 절차 가이드" },
  { id: "equipment", name: "실험장치", nameKo: "실험장치", icon: "🔧", description: "간이 실험장치 제작법, 센서 활용, 아두이노 연동 가이드" },
  { id: "simulation", name: "시뮬레이션", nameKo: "시뮬레이션", icon: "🎮", description: "과학 원리를 직접 체험하는 인터랙티브 시뮬레이션" },
];

function getCategoryById(id) {
  return CATEGORIES.find((c) => c.id === id);
}

// ============================================================
// contentBlocks → HTML 렌더링
// ============================================================

function renderContentBlocks(blocks) {
  if (!blocks || !blocks.length) return "";
  return blocks
    .map((block) => {
      switch (block.type) {
        case "heading": {
          const tag = "h" + (block.level || 2);
          return `<${tag}>${escapeHtml(block.text)}</${tag}>`;
        }
        case "paragraph":
          return `<p>${escapeHtml(block.text)}</p>`;
        case "list": {
          const listTag = block.ordered ? "ol" : "ul";
          const items = block.items
            .map((item) => `<li>${escapeHtml(item)}</li>`)
            .join("");
          return `<${listTag}>${items}</${listTag}>`;
        }
        case "table": {
          const ths = block.headers
            .map((h) => `<th>${escapeHtml(h)}</th>`)
            .join("");
          const trs = block.rows
            .map(
              (row) =>
                "<tr>" +
                row.map((cell) => `<td>${escapeHtml(cell)}</td>`).join("") +
                "</tr>"
            )
            .join("");
          return `<table><thead><tr>${ths}</tr></thead><tbody>${trs}</tbody></table>`;
        }
        case "quote":
          return `<blockquote>${escapeHtml(block.text)}</blockquote>`;
        case "note":
          return `<div class="content-note"><strong>${escapeHtml(block.label || "참고")}</strong> ${escapeHtml(block.text)}</div>`;
        default:
          return "";
      }
    })
    .join("\n");
}

// Markdown → HTML 변환 (body 폴백용)
function renderMarkdown(md) {
  if (!md) return "";
  return md
    .replace(/^### (.*$)/gm, "<h3>$1</h3>")
    .replace(/^## (.*$)/gm, "<h2>$1</h2>")
    .replace(/^# (.*$)/gm, "<h1>$1</h1>")
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/^- (.*$)/gm, "<li>$1</li>")
    .replace(/(<li>.*<\/li>)/s, "<ul>$1</ul>")
    .replace(/\n\n/g, "</p><p>")
    .replace(/\n/g, "<br>");
}

function escapeHtml(text) {
  if (!text) return "";
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function formatDate(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

// ============================================================
// HTML 템플릿 생성
// ============================================================

function buildDocumentHTML(doc) {
  const cat = getCategoryById(doc.categoryId);
  const title = doc.seoTitle || doc.title;
  const description = doc.seoDescription || doc.summary;
  const canonicalUrl = `${BASE_URL}/documents/${doc.slug}`;

  // --- 본문 HTML ---
  let bodyHTML = "";
  if (doc.contentBlocks && doc.contentBlocks.length > 0) {
    bodyHTML = renderContentBlocks(doc.contentBlocks);
  } else if (doc.body) {
    bodyHTML = renderMarkdown(doc.body);
  }

  // --- directAnswer ---
  let directAnswerHTML = "";
  if (doc.directAnswer && doc.directAnswer.length > 0) {
    directAnswerHTML = `
      <div class="direct-answer-box">
        <h3>핵심 답변</h3>
        ${doc.directAnswer.map((a) => `<p>${escapeHtml(a)}</p>`).join("")}
      </div>`;
  }

  // --- keyInfo ---
  let keyInfoHTML = "";
  if (doc.keyInfo) {
    const items = Object.entries(doc.keyInfo)
      .map(
        ([k, v]) => `
        <div class="key-info-item">
          <span class="label">${escapeHtml(k)}</span>
          <span class="value">${escapeHtml(v)}</span>
        </div>`
      )
      .join("");
    keyInfoHTML = `<div class="key-info-box"><h3>핵심 정보</h3>${items}</div>`;
  }

  // --- FAQ ---
  let faqHTML = "";
  if (doc.faqItems && doc.faqItems.length > 0) {
    faqHTML = `
      <section class="faq-section">
        <h2>자주 묻는 질문</h2>
        <div class="faq-list">
          ${doc.faqItems
            .map(
              (faq) => `
            <details class="faq-item">
              <summary class="faq-question">${escapeHtml(faq.question)}</summary>
              <div class="faq-answer">${escapeHtml(faq.answer)}</div>
            </details>`
            )
            .join("")}
        </div>
      </section>`;
  }

  // --- Author ---
  let authorHTML = "";
  if (doc.authorInfo) {
    authorHTML = `
      <div class="author-section">
        <div class="author-info">
          <span class="author-name">${escapeHtml(doc.authorInfo.name)}</span>
          <span class="author-role">${escapeHtml(doc.authorInfo.role)}${doc.authorInfo.expertise ? " · " + escapeHtml(doc.authorInfo.expertise) : ""}</span>
        </div>
      </div>`;
  }

  // --- Tags ---
  const allTags = [...(doc.tags || [])];
  if (doc.entities) {
    doc.entities.forEach((e) => {
      if (!allTags.includes(e)) allTags.push(e);
    });
  }
  const tagsHTML = allTags.length
    ? `<div class="tag-list" style="margin-top:40px;">
        ${allTags.map((t) => `<a href="/tags/${encodeURIComponent(t)}" class="tag">${escapeHtml(t)}</a>`).join("")}
      </div>`
    : "";

  // --- JSON-LD: Article ---
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: doc.title,
    description: description,
    datePublished: doc.createdAt,
    dateModified: doc.updatedAt,
    author: doc.authorInfo
      ? {
          "@type": "Person",
          name: doc.authorInfo.name,
          jobTitle: doc.authorInfo.role,
        }
      : { "@type": "Organization", name: "EduAtlas" },
    publisher: {
      "@type": "Organization",
      name: "EduAtlas",
      url: BASE_URL,
    },
    mainEntityOfPage: canonicalUrl,
    articleSection: cat ? cat.nameKo : "",
    keywords: (doc.tags || []).join(", "),
  };

  // --- JSON-LD: FAQPage ---
  let faqSchemaTag = "";
  if (doc.faqItems && doc.faqItems.length > 0) {
    const faqSchema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: doc.faqItems.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: { "@type": "Answer", text: faq.answer },
      })),
    };
    faqSchemaTag = `<script type="application/ld+json">${JSON.stringify(faqSchema)}</script>`;
  }

  // --- JSON-LD: EducationalOrganization ---
  let eduOrgSchemaTag = "";
  if (doc.docType === "academy" || doc.docType === "company") {
    const eduOrgSchema = {
      "@context": "https://schema.org",
      "@type": "EducationalOrganization",
      name: doc.title,
      description: description,
      url: canonicalUrl,
    };
    if (doc.keyInfo) {
      if (doc.keyInfo.location)
        eduOrgSchema.address = {
          "@type": "PostalAddress",
          addressLocality: doc.keyInfo.location,
        };
      if (doc.keyInfo.subjects) eduOrgSchema.knowsAbout = doc.keyInfo.subjects;
    }
    eduOrgSchemaTag = `<script type="application/ld+json">${JSON.stringify(eduOrgSchema)}</script>`;
  }

  // --- JSON-LD: BreadcrumbList ---
  const breadcrumbItems = [
    {
      "@type": "ListItem",
      position: 1,
      name: "EduAtlas",
      item: BASE_URL + "/",
    },
  ];
  if (cat) {
    breadcrumbItems.push({
      "@type": "ListItem",
      position: 2,
      name: cat.nameKo,
      item: `${BASE_URL}/categories/${cat.id}`,
    });
    breadcrumbItems.push({
      "@type": "ListItem",
      position: 3,
      name: doc.title,
    });
  } else {
    breadcrumbItems.push({
      "@type": "ListItem",
      position: 2,
      name: doc.title,
    });
  }
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbItems,
  };

  // --- Breadcrumb visible ---
  const breadcrumbHTML = `
    <div class="breadcrumb">
      <a href="/">Explore</a><span class="sep">&rsaquo;</span>
      ${cat ? `<a href="/categories/${cat.id}">${escapeHtml(cat.nameKo)}</a><span class="sep">&rsaquo;</span>` : ""}
      <span>${escapeHtml(doc.title)}</span>
    </div>`;

  // --- Header ---
  const headerHTML = `
    <div class="doc-header">
      ${cat ? `<a href="/categories/${cat.id}" class="doc-category">${cat.icon} ${escapeHtml(cat.nameKo)}</a>` : ""}
      <h1>${escapeHtml(doc.title)}</h1>
      <p class="doc-summary">${escapeHtml(doc.summary)}</p>
      <div class="doc-meta">
        <span>${formatDate(doc.updatedAt)}</span>
        <span>${escapeHtml(doc.docType)}</span>
        ${doc.targetAudience ? `<span>${doc.targetAudience.map(escapeHtml).join(", ")}</span>` : ""}
      </div>
    </div>`;

  return `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(title)} - EduAtlas</title>
  <meta name="description" content="${escapeHtml(description)}">
  <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large">
  <link rel="canonical" href="${canonicalUrl}">

  <!-- Open Graph -->
  <meta property="og:type" content="article">
  <meta property="og:title" content="${escapeHtml(title)}">
  <meta property="og:description" content="${escapeHtml(description)}">
  <meta property="og:url" content="${canonicalUrl}">
  <meta property="og:site_name" content="EduAtlas">
  <meta property="og:locale" content="ko_KR">
  <meta property="article:published_time" content="${doc.createdAt || ""}">
  <meta property="article:modified_time" content="${doc.updatedAt || ""}">

  <!-- Twitter -->
  <meta name="twitter:card" content="summary">
  <meta name="twitter:title" content="${escapeHtml(title)}">
  <meta name="twitter:description" content="${escapeHtml(description)}">

  <!-- JSON-LD -->
  <script type="application/ld+json">${JSON.stringify(articleSchema)}</script>
  ${faqSchemaTag}
  ${eduOrgSchemaTag}
  <script type="application/ld+json">${JSON.stringify(breadcrumbSchema)}</script>

  <link rel="stylesheet" href="/css/style.css">
</head>
<body>
  <!-- Static Header for bots -->
  <div id="site-header">
    <header class="site-header">
      <div class="header-inner">
        <a href="/" class="logo"><span aria-hidden="true">🔬</span> EduAtlas</a>
        <button class="mobile-toggle" aria-label="메뉴">☰</button>
        <nav>
          <ul class="nav-links">
            <li><a href="/">홈</a></li>
            <li><a href="/categories/theory">이론·원리</a></li>
            <li><a href="/categories/experiment">실험방법</a></li>
            <li><a href="/categories/equipment">실험장치</a></li>
            <li><a href="/categories/simulation">시뮬레이션</a></li>
            <li><a href="/search.html">검색</a></li>
          </ul>
        </nav>
      </div>
    </header>
  </div>

  <main class="container page-content">
    ${breadcrumbHTML}

    <div class="doc-layout">
      <article>
        ${headerHTML}
        ${directAnswerHTML}
        ${keyInfoHTML}
        <div class="doc-body">${bodyHTML}</div>
        ${faqHTML}
        ${authorHTML}
        <div class="error-report" style="margin-top:24px; padding:12px 16px; background:#f8f9fa; border-radius:8px; font-size:0.9rem; color:#666;">
          정보에 오류가 있나요? <a href="/contact.html" style="color:var(--primary-color); text-decoration:underline;">오류 제보하기</a>
        </div>
        ${tagsHTML}
      </article>

      <aside></aside>
    </div>
  </main>

  <footer class="site-footer">
    <div class="footer-inner">
      <div class="footer-grid">
        <div>
          <div class="footer-brand">🔬 EduAtlas</div>
          <p class="footer-desc">AI가 인용하는 과학 교육 지식 데이터베이스</p>
        </div>
        <div class="footer-section">
          <h4>지식 DB</h4>
          <a href="/categories/theory">이론·원리</a>
          <a href="/categories/experiment">실험방법</a>
          <a href="/categories/equipment">실험장치</a>
          <a href="/categories/simulation">시뮬레이션</a>
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
      <div class="footer-bottom">&copy; 2026 EduAtlas. All rights reserved.</div>
    </div>
  </footer>

  <!-- Client-side JS (사용자 인터랙션용, 봇은 위 HTML만으로 충분) -->
  <script src="https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js"></script>
  <script src="https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore-compat.js"></script>
  <script src="/js/firebase-config.js"></script>
  <script src="/data/documents.js"></script>
  <script src="/js/app.js"></script>
  <script>
  // SSR 페이지에서는 클라이언트 JS가 사이드바 등 인터랙티브 요소만 보강
  function pageInit() {
    var slug = "${doc.slug}";
    var doc = getDocumentBySlug(slug);
    if (!doc) return;

    // 사이드바만 클라이언트에서 렌더 (관련문서 추천 등)
    var sidebarHTML = '';
    if (doc.cluster && doc.cluster.pillarTopic) {
      var clusterDocs = doc.cluster.relatedClusterSlugs
        ? doc.cluster.relatedClusterSlugs.map(function(s){ return getDocumentBySlug(s); }).filter(Boolean)
        : [];
      sidebarHTML += '<div class="sidebar-section"><h3>주제 클러스터</h3>' +
        '<div class="cluster-topic">' + doc.cluster.pillarTopic + '</div>' +
        '<div class="cluster-sub">' + doc.cluster.subTopic + ' · ' + doc.cluster.intentType + '</div>' +
        (clusterDocs.length ? clusterDocs.map(function(d){
          return '<a href="/documents/' + d.slug + '" class="related-link">' + d.title + '</a>';
        }).join('') : '') + '</div>';
    }
    var manualRelated = getRelatedDocuments(doc);
    var autoRelated = getRecommendedDocs(doc, 5);
    var seen = {};
    manualRelated.forEach(function(d){ seen[d.id] = true; });
    var allRelated = manualRelated.slice();
    autoRelated.forEach(function(d){ if (!seen[d.id]) { allRelated.push(d); seen[d.id] = true; }});
    var finalRelated = allRelated.slice(0, 6);
    if (finalRelated.length) {
      sidebarHTML += '<div class="sidebar-section"><h3>관련 문서</h3>' +
        finalRelated.map(function(r){ return '<a href="/documents/' + r.slug + '" class="related-link">' + r.title + '</a>'; }).join('') +
      '</div>';
    }
    var aside = document.querySelector('aside');
    if (aside) aside.innerHTML = sidebarHTML;
  }
  </script>
</body>
</html>`;
}

// ============================================================
// 404 페이지
// ============================================================

function build404HTML() {
  return `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>문서를 찾을 수 없습니다 - EduAtlas</title>
  <meta name="robots" content="noindex">
  <link rel="stylesheet" href="/css/style.css">
</head>
<body>
  <div id="site-header">
    <header class="site-header">
      <div class="header-inner">
        <a href="/" class="logo"><span>🌐</span> EduAtlas</a>
        <nav><ul class="nav-links">
          <li><a href="/">Explore</a></li>
          <li><a href="/search.html">Search</a></li>
        </ul></nav>
      </div>
    </header>
  </div>
  <main class="container page-content">
    <div class="empty-state" style="padding:80px 0; text-align:center;">
      <div class="empty-icon">📄</div>
      <h1>문서를 찾을 수 없습니다</h1>
      <p style="margin-top:16px;"><a href="/">홈으로 돌아가기</a> · <a href="/knowledge.html">문서 목록</a></p>
    </div>
  </main>
</body>
</html>`;
}

// ============================================================
// SAMPLE_DOCUMENTS 폴백 (Firestore 비어있을 때 사용)
// ============================================================

const SAMPLE_DOCUMENTS = require("./sample-documents.json");

/**
 * Firestore에서 문서를 검색하고, 없으면 SAMPLE_DOCUMENTS에서 폴백
 */
async function findDocBySlug(slug) {
  try {
    const snapshot = await db
      .collection("documents")
      .where("slug", "==", slug)
      .where("status", "==", "published")
      .limit(1)
      .get();

    if (!snapshot.empty) {
      return snapshot.docs[0].data();
    }
  } catch (err) {
    console.warn("Firestore query failed, using fallback:", err.message);
  }

  // Firestore에 없으면 SAMPLE_DOCUMENTS에서 찾기
  return SAMPLE_DOCUMENTS.find(
    (d) => d.slug === slug && d.status === "published"
  );
}

async function findDocsByCategory(categoryId) {
  try {
    const snapshot = await db
      .collection("documents")
      .where("categoryId", "==", categoryId)
      .where("status", "==", "published")
      .get();

    if (!snapshot.empty) {
      const docs = [];
      snapshot.forEach((d) => docs.push(d.data()));
      return docs;
    }
  } catch (err) {
    console.warn("Firestore query failed, using fallback:", err.message);
  }

  // Firestore에 없으면 SAMPLE_DOCUMENTS에서 필터
  return SAMPLE_DOCUMENTS.filter(
    (d) => d.categoryId === categoryId && d.status === "published"
  );
}

async function findAllPublishedDocs() {
  try {
    const snapshot = await db
      .collection("documents")
      .where("status", "==", "published")
      .get();

    if (!snapshot.empty) {
      const docs = [];
      snapshot.forEach((d) => docs.push(d.data()));
      return docs;
    }
  } catch (err) {
    console.warn("Firestore query failed, using fallback:", err.message);
  }

  return SAMPLE_DOCUMENTS.filter((d) => d.status === "published");
}

// ============================================================
// Cloud Function: Firestore에 SAMPLE_DOCUMENTS 시드 (1회성)
// ============================================================

exports.seedFirestore = functions.https.onRequest(async (req, res) => {
  try {
    const batch = db.batch();
    for (const doc of SAMPLE_DOCUMENTS) {
      batch.set(db.collection("documents").doc(doc.id), doc);
    }
    await batch.commit();
    res.status(200).json({
      success: true,
      count: SAMPLE_DOCUMENTS.length,
      message: `${SAMPLE_DOCUMENTS.length}개 문서를 Firestore에 시드했습니다.`,
    });
  } catch (err) {
    console.error("Seed Error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// ============================================================
// Cloud Function: SSR 문서 페이지
// ============================================================

exports.ssrDocument = functions.https.onRequest(async (req, res) => {
  // URL에서 slug 추출: /documents/some-slug → some-slug
  const pathParts = req.path.split("/").filter(Boolean);
  const slug = pathParts[pathParts.length - 1] || pathParts[pathParts.length - 2];

  if (!slug) {
    res.status(404).send(build404HTML());
    return;
  }

  try {
    const doc = await findDocBySlug(slug);

    if (!doc) {
      res.status(404).send(build404HTML());
      return;
    }

    const html = buildDocumentHTML(doc);

    // 1시간 캐싱 (CDN + 브라우저)
    res.set("Cache-Control", "public, max-age=3600, s-maxage=86400");
    res.status(200).send(html);
  } catch (err) {
    console.error("SSR Error:", err);
    res.status(500).send("<h1>서버 오류가 발생했습니다</h1>");
  }
});

// ============================================================
// Cloud Function: SSR 카테고리 페이지
// ============================================================

exports.ssrCategory = functions.https.onRequest(async (req, res) => {
  const pathParts = req.path.split("/").filter(Boolean);
  const catId = pathParts[pathParts.length - 1] || pathParts[pathParts.length - 2];

  const cat = getCategoryById(catId);

  // 카테고리 목록 (catId가 없거나 잘못된 경우)
  if (!catId || !cat) {
    const categoriesListHTML = CATEGORIES.map(
      (c) => `
      <a href="/categories/${c.id}" style="display:block; padding:24px; margin-bottom:16px; border:1px solid #e5e7eb; border-radius:12px; text-decoration:none; color:inherit;">
        <span style="font-size:36px;">${c.icon}</span>
        <h2 style="margin:8px 0 4px; font-size:20px;">${escapeHtml(c.name)}</h2>
        <p style="color:#6b7280; font-size:14px;">${escapeHtml(c.nameKo)}</p>
      </a>`
    ).join("");

    const html = `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>지식 카테고리 - EduAtlas</title>
  <meta name="description" content="과학 교육 지식 DB: 이론·원리, 실험방법, 실험장치, 시뮬레이션">
  <meta name="robots" content="index, follow">
  <link rel="canonical" href="${BASE_URL}/categories">
  <meta property="og:title" content="지식 카테고리 - EduAtlas">
  <meta property="og:description" content="과학 교육 지식 DB: 이론·원리, 실험방법, 실험장치, 시뮬레이션">
  <meta property="og:url" content="${BASE_URL}/categories">
  <link rel="stylesheet" href="/css/style.css">
</head>
<body>
  <div id="site-header"></div>
  <main class="container page-content">
    <div class="breadcrumb"><a href="/">홈</a><span class="sep">&rsaquo;</span><span>카테고리</span></div>
    <h1 class="section-title">지식 카테고리</h1>
    <p class="section-subtitle">과학 교육 콘텐츠를 탐색하세요</p>
    ${categoriesListHTML}
  </main>
  <div id="site-footer"></div>
  <script src="https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js"></script>
  <script src="https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore-compat.js"></script>
  <script src="/js/firebase-config.js"></script>
  <script src="/data/documents.js"></script>
  <script src="/js/app.js"></script>
  <script>function pageInit() {}</script>
</body>
</html>`;

    res.set("Cache-Control", "public, max-age=3600, s-maxage=86400");
    res.status(200).send(html);
    return;
  }

  // 카테고리 상세 — Firestore + SAMPLE_DOCUMENTS 폴백
  try {
    const docs = await findDocsByCategory(catId);
    docs.sort((a, b) => (b.updatedAt || "").localeCompare(a.updatedAt || ""));

    const docListHTML = docs.length
      ? docs
          .map(
            (d) => `
        <a href="/documents/${d.slug}" class="card" style="display:block; text-decoration:none; color:inherit;">
          <div class="card-title">${escapeHtml(d.title)}</div>
          <div class="card-desc">${escapeHtml(d.summary)}</div>
          <div class="card-meta"><span>${escapeHtml(d.docType)}</span><span>${formatDate(d.updatedAt)}</span></div>
        </a>`
          )
          .join("")
      : '<p>아직 문서가 없습니다.</p>';

    // CollectionPage Schema
    const collectionSchema = {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: `${cat.name} - ${cat.nameKo}`,
      description: `${cat.nameKo} 분야의 교육 문서 모음`,
      url: `${BASE_URL}/categories/${cat.id}`,
      isPartOf: {
        "@type": "WebSite",
        name: "EduAtlas",
        url: BASE_URL,
      },
    };

    const html = `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(cat.name)} - ${escapeHtml(cat.nameKo)} - EduAtlas</title>
  <meta name="description" content="${escapeHtml(cat.nameKo)} 분야의 교육 문서 모음 - EduAtlas">
  <meta name="robots" content="index, follow">
  <link rel="canonical" href="${BASE_URL}/categories/${cat.id}">
  <meta property="og:title" content="${escapeHtml(cat.name)} - ${escapeHtml(cat.nameKo)}">
  <meta property="og:description" content="${escapeHtml(cat.nameKo)} 분야의 교육 문서 모음">
  <meta property="og:url" content="${BASE_URL}/categories/${cat.id}">
  <meta property="og:type" content="website">
  <script type="application/ld+json">${JSON.stringify(collectionSchema)}</script>
  <link rel="stylesheet" href="/css/style.css">
</head>
<body>
  <div id="site-header"></div>
  <main class="container page-content">
    <div class="breadcrumb">
      <a href="/">Explore</a><span class="sep">&rsaquo;</span>
      <a href="/categories">Categories</a><span class="sep">&rsaquo;</span>
      <span>${escapeHtml(cat.nameKo)}</span>
    </div>
    <h1>${cat.icon} ${escapeHtml(cat.name)} <small style="color:#6b7280;">${escapeHtml(cat.nameKo)}</small></h1>
    <p style="color:#6b7280; margin-bottom:32px;">${docs.length}개 문서</p>
    <h2 class="section-title">문서 목록</h2>
    <div class="card-grid">${docListHTML}</div>
  </main>
  <div id="site-footer"></div>
  <script src="https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js"></script>
  <script src="https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore-compat.js"></script>
  <script src="/js/firebase-config.js"></script>
  <script src="/data/documents.js"></script>
  <script src="/js/app.js"></script>
  <script>function pageInit() {}</script>
</body>
</html>`;

    res.set("Cache-Control", "public, max-age=3600, s-maxage=86400");
    res.status(200).send(html);
  } catch (err) {
    console.error("SSR Category Error:", err);
    res.status(500).send("<h1>서버 오류가 발생했습니다</h1>");
  }
});

// ============================================================
// Cloud Function: 동적 sitemap.xml 생성
// ============================================================

exports.dynamicSitemap = functions.https.onRequest(async (req, res) => {
  try {
    const docs = await findAllPublishedDocs();

    const today = new Date().toISOString().slice(0, 10);

    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${BASE_URL}/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${BASE_URL}/knowledge.html</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>${BASE_URL}/categories</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${BASE_URL}/search.html</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>${BASE_URL}/geo-builder.html</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${BASE_URL}/tag.html</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>${BASE_URL}/about.html</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>
  <url>
    <loc>${BASE_URL}/contact.html</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>
  <url>
    <loc>${BASE_URL}/privacy.html</loc>
    <lastmod>${today}</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.4</priority>
  </url>
  <url>
    <loc>${BASE_URL}/terms.html</loc>
    <lastmod>${today}</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.4</priority>
  </url>
  <url>
    <loc>${BASE_URL}/content-policy.html</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>`;

    // 카테고리 페이지
    CATEGORIES.forEach((cat) => {
      xml += `
  <url>
    <loc>${BASE_URL}/categories/${cat.id}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;
    });

    // 문서 페이지
    docs.forEach((doc) => {
      xml += `
  <url>
    <loc>${BASE_URL}/documents/${doc.slug}</loc>
    <lastmod>${doc.updatedAt || today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`;
    });

    xml += "\n</urlset>";

    res.set("Content-Type", "application/xml");
    res.set("Cache-Control", "public, max-age=3600, s-maxage=86400");
    res.status(200).send(xml);
  } catch (err) {
    console.error("Sitemap Error:", err);
    res.status(500).send("<error>Sitemap generation failed</error>");
  }
});
