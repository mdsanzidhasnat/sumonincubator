/*
 * Sumon Incubator — shared admin sidebar builder.
 * Injects the sidebar into #si-sidebar-root on standalone pages
 * (dashboard.html, add-product.html) and marks the active entry.
 */
(function () {
  var root = document.getElementById('si-sidebar-root');
  if (!root) return;

  function detectActive() {
    var path = window.location.pathname;
    var hash = window.location.hash || '';
    if (/add-product\.html$/.test(path)) return 'add';
    if (/dashboard\.html$/.test(path)) return 'dashboard';
    if (hash.indexOf('/model/Category') !== -1) return 'category';
    if (hash.indexOf('/model/Product') !== -1) return 'product';
    return null;
  }

  var sections = [
    {
      label: 'All Models',
      links: [
        { id: 'dashboard', href: 'dashboard.html', label: 'Dashboard' },
        { id: 'category', href: 'index.html#/model/Category', label: 'Category' },
        { id: 'product', href: 'index.html#/model/Product', label: 'Product' },
      ],
    },
    {
      label: 'Tools',
      links: [{ id: 'add', href: 'add-product.html', label: 'Add Product' }],
    },
  ];

  var active = detectActive();

  function renderLinks(links) {
    return links
      .map(function (item) {
        var cls = 'si-link' + (item.id === active ? ' active' : '');
        return '<a class="' + cls + '" href="' + item.href + '">' + item.label + '</a>';
      })
      .join('');
  }

  var navs = sections
    .map(function (section) {
      return (
        '<div class="si-section">' +
        section.label +
        '</div><nav class="si-nav">' +
        renderLinks(section.links) +
        '</nav>'
      );
    })
    .join('');

  root.innerHTML =
    '<aside class="si-sidebar">' +
    '<div class="si-brand">' +
    '<img src="images/logo.svg" alt="Sumon Incubator" />' +
    '<div><div class="si-brand-name">Sumon Incubator</div><div class="si-brand-sub">Admin Panel</div></div>' +
    '<button type="button" class="si-close" title="Close menu">&times;</button>' +
    '</div>' +
    '<div class="si-scroll">' +
    navs +
    '</div>' +
    '</aside>' +
    '<button type="button" class="si-hamburger" aria-label="Open menu">&#9776;</button>';

  var aside = root.querySelector('.si-sidebar');
  var hamburger = root.querySelector('.si-hamburger');
  var close = root.querySelector('.si-close');

  function open(flag) {
    aside.classList.toggle('si-open', flag);
    document.body.classList.toggle('si-open', flag);
  }

  hamburger.addEventListener('click', function () {
    open(true);
  });
  close.addEventListener('click', function () {
    open(false);
  });
})();
