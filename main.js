// Maestro 포트폴리오 — 인터랙션
// 1) 헤더 스크롤 상태 토글  2) 햄버거 메뉴 토글  3) 네비 active 하이라이트

(function () {
  'use strict';

  const header = document.getElementById('site-header');
  const hamburger = document.getElementById('hamburger-btn');
  const navLinks = document.getElementById('nav-links');
  const links = document.querySelectorAll('.nav-link');

  /* 1. 헤더 — 스크롤 시 테두리 표시 */
  function updateHeaderOnScroll() {
    if (!header) return;
    if (window.scrollY > 8) header.classList.add('is-scrolled');
    else header.classList.remove('is-scrolled');
  }

  /* 2. 햄버거 메뉴 토글 */
  function toggleMenu(force) {
    if (!hamburger || !navLinks) return;
    const willOpen = typeof force === 'boolean'
      ? force
      : hamburger.getAttribute('aria-expanded') !== 'true';
    hamburger.setAttribute('aria-expanded', String(willOpen));
    hamburger.setAttribute('aria-label', willOpen ? '메뉴 닫기' : '메뉴 열기');
    navLinks.classList.toggle('is-open', willOpen);
  }

  if (hamburger) {
    hamburger.addEventListener('click', function () { toggleMenu(); });
  }

  // 메뉴 링크 클릭 시 모바일에서는 자동으로 닫기
  links.forEach(function (link) {
    link.addEventListener('click', function () {
      if (window.matchMedia('(max-width: 767px)').matches) {
        toggleMenu(false);
      }
    });
  });

  // ESC 로 메뉴 닫기
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && navLinks && navLinks.classList.contains('is-open')) {
      toggleMenu(false);
      if (hamburger) hamburger.focus();
    }
  });

  /* 3. 섹션 스크롤 — 현재 섹션 active 표시 */
  const sections = Array.from(document.querySelectorAll('main section[id]'));

  function updateActiveLink() {
    if (sections.length === 0) return;
    const headerH = header ? header.offsetHeight : 64;
    const scrollPos = window.scrollY + headerH + 24;

    let currentId = sections[0].id;
    for (let i = 0; i < sections.length; i++) {
      if (sections[i].offsetTop <= scrollPos) {
        currentId = sections[i].id;
      }
    }

    links.forEach(function (link) {
      const href = link.getAttribute('href');
      if (href === '#' + currentId) link.classList.add('active');
      else link.classList.remove('active');
    });
  }

  /* 스크롤 핸들러 — rAF 쓰로틀 */
  let ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(function () {
      updateHeaderOnScroll();
      updateActiveLink();
      ticking = false;
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);

  // 초기 상태 반영
  updateHeaderOnScroll();
  updateActiveLink();
})();
