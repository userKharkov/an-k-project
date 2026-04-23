document.addEventListener('DOMContentLoaded', () => {
  Cart.init();
  initHeader();
  initHero();
  renderProducts();
  initNewsletter();
});

/* Header */
function initHeader() {
  const header = document.getElementById('header');
  const burger = document.getElementById('burger');
  const nav = document.getElementById('nav');
  const searchToggle = document.getElementById('searchToggle');
  const searchBar = document.getElementById('searchBar');
  const searchClose = document.getElementById('searchClose');

  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 40);
  });

  burger?.addEventListener('click', () => {
    burger.classList.toggle('open');
    nav.classList.toggle('open');
  });

  searchToggle?.addEventListener('click', () => {
    searchBar.classList.add('open');
    document.getElementById('searchInput')?.focus();
  });

  searchClose?.addEventListener('click', () => {
    searchBar.classList.remove('open');
  });
}

/* Hero slider */
function initHero() {
  const slides = document.querySelectorAll('.hero__slide');
  const dots = document.querySelectorAll('.hero__dot');
  let current = 0;
  let timer;

  function goTo(idx) {
    slides[current].classList.remove('active');
    dots[current].classList.remove('active');
    current = (idx + slides.length) % slides.length;
    slides[current].classList.add('active');
    dots[current].classList.add('active');
  }

  function startAuto() {
    timer = setInterval(() => goTo(current + 1), 5000);
  }

  function resetAuto() {
    clearInterval(timer);
    startAuto();
  }

  document.getElementById('heroNext')?.addEventListener('click', () => { goTo(current + 1); resetAuto(); });
  document.getElementById('heroPrev')?.addEventListener('click', () => { goTo(current - 1); resetAuto(); });

  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      goTo(parseInt(dot.dataset.slide));
      resetAuto();
    });
  });

  startAuto();
}

/* Product cards */
function createProductCard(product) {
  const priceHTML = product.oldPrice
    ? `<span class="product-card__price product-card__price--sale">${formatPrice(product.price)}</span>
       <span class="product-card__price product-card__price--old">${formatPrice(product.oldPrice)}</span>`
    : `<span class="product-card__price">${formatPrice(product.price)}</span>`;

  const badgeHTML = product.badge
    ? `<span class="product-card__badge product-card__badge--${product.badge}">
         ${product.badge === 'new' ? 'Новинка' : `-${Math.round((1 - product.price / product.oldPrice) * 100)}%`}
       </span>`
    : '';

  const card = document.createElement('div');
  card.className = 'product-card';
  card.innerHTML = `
    <div class="product-card__img-wrap">
      <div class="product-card__img" style="background:${generateGradient(product.colors)};width:100%;height:100%;"></div>
      ${badgeHTML}
      <div class="product-card__actions">
        <button class="product-card__btn product-card__btn--primary" data-id="${product.id}">В корзину</button>
        <button class="product-card__like" data-id="${product.id}" aria-label="В избранное">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
        </button>
      </div>
    </div>
    <div class="product-card__category">${product.category}</div>
    <div class="product-card__name">${product.name}</div>
    <div class="product-card__prices">${priceHTML}</div>
  `;

  card.querySelector('.product-card__btn')?.addEventListener('click', (e) => {
    e.stopPropagation();
    const size = product.sizes[0];
    Cart.add(product, size);
    showToast(`«${product.name}» добавлен в корзину`);
  });

  card.querySelector('.product-card__like')?.addEventListener('click', (e) => {
    e.stopPropagation();
    const btn = e.currentTarget;
    btn.classList.toggle('liked');
    showToast(btn.classList.contains('liked') ? 'Добавлено в избранное' : 'Удалено из избранного');
  });

  return card;
}

function renderProducts() {
  const newContainer = document.getElementById('newProducts');
  const saleContainer = document.getElementById('saleProducts');

  const newProducts = PRODUCTS.filter(p => p.isNew).slice(0, 4);
  const saleProducts = PRODUCTS.filter(p => p.isSale).slice(0, 4);

  newProducts.forEach(p => newContainer?.appendChild(createProductCard(p)));
  saleProducts.forEach(p => saleContainer?.appendChild(createProductCard(p)));
}

/* Newsletter */
function initNewsletter() {
  const form = document.getElementById('newsletterForm');
  const success = document.getElementById('newsletterSuccess');

  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    form.style.display = 'none';
    success?.classList.add('show');
  });
}