/* =========================================================================
   KaiRA site script
   -------------------------------------------------------------------------
   全ページ共通の「ヘッダー・フッター・ナビゲーション・アクセス解析・
   お知らせバー・NF年度ナビ」をこのファイルだけで管理します。
   メニュー項目やSNSリンクを変えたいときは、下の SITE を編集してください。

   ページ側の約束事:
     <body data-page="about">          … 現在地（nav の id）
     <header id="site-header" class="site-header"></header>
     <main id="main"> … </main>
     <footer id="site-footer" class="site-footer"></footer>
     <nav data-year-pager></nav>        … NF特設ページのみ（任意）
   ========================================================================= */
(function () {
  "use strict";

  var SITE = {
    name: "京都大学人工知能研究会 KaiRA",
    tagline: "AIを学びたい京都大学の学生による自主ゼミサークル",
    email: "kyoto.kaira@gmail.com",
    analyticsId: "G-DX5GXFJ6EH",
    since: 2018,

    /* グローバルナビ。id は <body data-page="…"> と対応します。 */
    nav: [
      { id: "home", label: "ホーム", href: "index.html" },
      { id: "about", label: "KaiRAについて", href: "about.html" },
      { id: "news", label: "News", href: "news.html" },
      { id: "works", label: "作品", href: "works.html" },
      { id: "contact", label: "入会案内", href: "contact.html" }
    ],

    social: [
      { label: "X (旧Twitter)", href: "https://twitter.com/kyoto_kaira" },
      { label: "GitHub", href: "https://github.com/kyoto-kaira" },
      { label: "Docswell", href: "https://www.docswell.com/user/kyoto-kaira" },
      { label: "Qiita", href: "https://qiita.com/organizations/kyoto-kaira" },
      { label: "connpass", href: "https://kaira-thesis-reading.connpass.com/" }
    ],

    /* NF特設ページ（新しい年度を先頭に追加） */
    nfYears: [
      { year: 2025, href: "works/nf2025.html" },
      { year: 2024, href: "works/nf2024.html" },
      { year: 2023, href: "works/nf2023.html" },
      { year: 2022, href: "works/nf2022.html" },
      { year: 2021, href: "works/nf2021.html" },
      { year: 2020, href: "works/nf2020.html" }
    ],

    /* お知らせバー（全ページ上部）。不要なときは null にします。
       例: { text: "11月祭に出展します！", linkLabel: "特設ページ", href: "works/nf2025.html" } */
    announcement: null
  };

  /* ---- サイトのルートURL（このスクリプトの1階層上）を求める ------------- */
  var script = document.currentScript;
  var ROOT = new URL("../", script ? script.src : location.href).href;

  function url(path) {
    return /^https?:/.test(path) ? path : new URL(path, ROOT).href;
  }

  function icon(name, extraClass) {
    return (
      '<svg class="icon' + (extraClass ? " " + extraClass : "") + '" aria-hidden="true" focusable="false">' +
      '<use href="' + url("assets/icons/sprite.svg") + "#" + name + '"></use></svg>'
    );
  }

  function escapeHtml(text) {
    return String(text).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  var currentPage = document.body.getAttribute("data-page");

  /* ---- Google Analytics ---------------------------------------------- */
  function setupAnalytics() {
    if (!SITE.analyticsId || /^(localhost|127\.)/.test(location.hostname)) return;
    var tag = document.createElement("script");
    tag.async = true;
    tag.src = "https://www.googletagmanager.com/gtag/js?id=" + SITE.analyticsId;
    document.head.appendChild(tag);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag("js", new Date());
    window.gtag("config", SITE.analyticsId);
  }

  /* ---- Header -------------------------------------------------------- */
  function renderHeader() {
    var header = document.getElementById("site-header");
    if (!header) return;

    var links = SITE.nav.map(function (item) {
      var current = item.id === currentPage ? ' aria-current="page"' : "";
      return (
        '<li><a class="site-nav__link" href="' + url(item.href) + '"' + current + ">" +
        escapeHtml(item.label) + "</a></li>"
      );
    }).join("");

    header.innerHTML =
      '<div class="container site-header__bar">' +
        '<a class="site-header__brand" href="' + url("index.html") + '">' +
          '<img class="site-header__logo" src="' + url("assets/images/logo/KaiRA.png") +
          '" width="87" height="36" alt="' + escapeHtml(SITE.name) + '">' +
        "</a>" +
        '<button class="site-nav__toggle" type="button" aria-expanded="false" aria-controls="site-nav" aria-label="メニューを開く">' +
          icon("menu").replace("<svg", '<svg data-icon="menu"') +
          icon("close").replace("<svg", '<svg data-icon="close"') +
        "</button>" +
        '<nav class="site-nav" id="site-nav" aria-label="メインメニュー">' +
          '<ul class="site-nav__list">' + links + "</ul>" +
        "</nav>" +
      "</div>";

    var skip = document.createElement("a");
    skip.className = "skip-link";
    skip.href = "#main";
    skip.textContent = "本文へスキップ";
    document.body.insertBefore(skip, document.body.firstChild);

    if (SITE.announcement) {
      var a = SITE.announcement;
      var bar = document.createElement("div");
      bar.className = "announcement";
      bar.innerHTML =
        '<div class="container announcement__inner">' +
          '<span class="announcement__text">' + escapeHtml(a.text) + "</span>" +
          (a.href
            ? '<a class="announcement__link" href="' + url(a.href) + '">' +
              escapeHtml(a.linkLabel || "詳しく見る") + icon("arrow-right", "icon--sm") + "</a>"
            : "") +
        "</div>";
      header.parentNode.insertBefore(bar, header);
    }

    setupMenu(header);
  }

  function setupMenu(header) {
    var toggle = header.querySelector(".site-nav__toggle");
    var nav = header.querySelector(".site-nav");
    if (!toggle || !nav) return;

    function setOpen(open) {
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "メニューを閉じる" : "メニューを開く");
      nav.setAttribute("data-open", String(open));
    }

    toggle.addEventListener("click", function () {
      setOpen(toggle.getAttribute("aria-expanded") !== "true");
    });
    nav.addEventListener("click", function (event) {
      if (event.target.closest("a")) setOpen(false);
    });
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") {
        setOpen(false);
        toggle.focus();
      }
    });
    document.addEventListener("click", function (event) {
      if (!header.contains(event.target)) setOpen(false);
    });
  }

  /* ---- Footer -------------------------------------------------------- */
  function renderFooter() {
    var footer = document.getElementById("site-footer");
    if (!footer) return;

    var siteLinks = SITE.nav.map(function (item) {
      return '<li><a class="site-footer__link" href="' + url(item.href) + '">' + escapeHtml(item.label) + "</a></li>";
    }).join("");

    var socialLinks = SITE.social.map(function (item) {
      return (
        '<li><a class="site-footer__link" href="' + item.href + '" target="_blank" rel="noopener">' +
        escapeHtml(item.label) + icon("external", "icon--sm") + "</a></li>"
      );
    }).join("");

    footer.innerHTML =
      '<div class="container">' +
        '<div class="site-footer__grid">' +
          "<div>" +
            '<img class="site-footer__logo" src="' + url("assets/images/logo/KaiRA.png") +
            '" width="106" height="44" alt="' + escapeHtml(SITE.name) + '">' +
            '<p class="site-footer__tagline">' + escapeHtml(SITE.tagline) + "</p>" +
            '<p class="site-footer__mail"><a class="site-footer__link" href="mailto:' + SITE.email + '">' +
              icon("mail", "icon--sm") + SITE.email + "</a></p>" +
          "</div>" +
          '<nav aria-label="サイト内リンク"><p class="site-footer__heading">Site</p><ul class="site-footer__list">' + siteLinks + "</ul></nav>" +
          '<nav aria-label="SNS・外部リンク"><p class="site-footer__heading">Follow</p><ul class="site-footer__list">' + socialLinks + "</ul></nav>" +
        "</div>" +
        '<div class="site-footer__bottom">' +
          "<span>&copy; " + SITE.since + "–" + new Date().getFullYear() + " " + escapeHtml(SITE.name) + "</span>" +
          "<span>This site is hosted on GitHub Pages.</span>" +
        "</div>" +
      "</div>";
  }

  /* ---- NF特設ページの年度ナビ ------------------------------------------- */
  function renderYearPager() {
    var pager = document.querySelector("[data-year-pager]");
    if (!pager) return;
    var currentYear = Number(pager.getAttribute("data-year-pager"));

    var chips = SITE.nfYears.map(function (item) {
      var current = item.year === currentYear ? ' aria-current="page"' : "";
      return '<li><a class="subnav__link" href="' + url(item.href) + '"' + current + ">NF" + item.year + "</a></li>";
    }).join("");

    pager.classList.add("year-pager");
    pager.setAttribute("aria-label", "他の年度のNF特設サイト");
    pager.innerHTML =
      '<h2 class="year-pager__title">他の年度のNF特設サイト</h2>' +
      '<ul class="subnav__list subnav__list--wrap">' + chips + "</ul>" +
      '<a class="link-arrow" href="' + url("works/collection_of_journals.html") + '">過去の会誌一覧' + icon("arrow-right") + "</a>";
  }

  /* ---- ページ内目次の現在地ハイライト ----------------------------------- */
  /* 横スクロールするチップ列の中で、現在地のチップが見える位置までずらす */
  function keepChipVisible(link) {
    var list = link.closest(".subnav__list");
    if (!list) return;
    var listRect = list.getBoundingClientRect();
    var linkRect = link.getBoundingClientRect();
    if (linkRect.left < listRect.left || linkRect.right > listRect.right) {
      list.scrollBy({ left: linkRect.left - listRect.left - listRect.width / 2 + linkRect.width / 2, behavior: "smooth" });
    }
  }

  function setupScrollSpy() {
    var links = Array.prototype.slice.call(document.querySelectorAll("[data-scrollspy] a[href^='#']"));
    if (!links.length || !("IntersectionObserver" in window)) return;

    var map = {};
    links.forEach(function (link) {
      var target = document.getElementById(link.getAttribute("href").slice(1));
      if (target) map[target.id] = link;
    });

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        links.forEach(function (l) { l.removeAttribute("aria-current"); });
        var link = map[entry.target.id];
        if (link) {
          link.setAttribute("aria-current", "true");
          keepChipVisible(link);
        }
      });
    }, { rootMargin: "-30% 0px -65% 0px" });

    Object.keys(map).forEach(function (id) { observer.observe(document.getElementById(id)); });
  }

  setupAnalytics();
  renderHeader();
  renderFooter();
  renderYearPager();
  setupScrollSpy();
})();
