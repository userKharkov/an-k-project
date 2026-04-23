const Cart = (() => {
  let items = JSON.parse(localStorage.getItem('velour_cart') || '[]');

  function save() {
    localStorage.setItem('velour_cart', JSON.stringify(items));
  }

  function add(product, size) {
    const key = `${product.id}-${size}`;
    const existing = items.find(i => i.key === key);
    if (existing) {
      existing.qty++;
    } else {
      items.push({ key, product, size, qty: 1 });
    }
    save();
    render();
    updateCount();
  }

  function remove(key) {
    items = items.filter(i => i.key !== key);
    save();
    render();
    updateCount();
  }

  function changeQty(key, delta) {
    const item = items.find(i => i.key === key);
    if (!item) return;
    item.qty += delta;
    if (item.qty <= 0) {
      remove(key);
      return;
    }
    save();
    render();
    updateCount();
  }

  function getCount() {
    return items.reduce((s, i) => s + i.qty, 0);
  }

  function getTotal() {
    return items.reduce((s, i) => s + i.product.price * i.qty, 0);
  }

  function updateCount() {
    const el = document.getElementById('cartCount');
    if (!el) return;
    const count = getCount();
    el.textContent = count;
    el.classList.toggle('visible', count > 0);
  }

  function render() {
    const body = document.getElementById('cartBody');
    const footer = document.getElementById('cartFooter');
    const totalEl = document.getElementById('cartTotal');
    if (!body) return;

    if (items.length === 0) {
      body.innerHTML = `
        <div class="cart-empty">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
            <line x1="3" y1="6" x2="21" y2="6"/>
            <path d="M16 10a4 4 0 0 1-8 0"/>
          </svg>
          <p>Корзина пуста</p>
        </div>`;
      if (footer) footer.style.display = 'none';
      return;
    }

    body.innerHTML = items.map(item => `
      <div class="cart-item" data-key="${item.key}">
        <div class="cart-item__img" style="background:${generateGradient(item.product.colors)}"></div>
        <div class="cart-item__info">
          <div class="cart-item__name">${item.product.name}</div>
          <div class="cart-item__size">Размер: ${item.size}</div>
          <div class="cart-item__bottom">
            <div class="qty-control">
              <button onclick="Cart.changeQty('${item.key}', -1)">−</button>
              <span>${item.qty}</span>
              <button onclick="Cart.changeQty('${item.key}', 1)">+</button>
            </div>
            <div class="cart-item__price">${formatPrice(item.product.price * item.qty)}</div>
          </div>
          <button class="cart-item__remove" onclick="Cart.remove('${item.key}')">Удалить</button>
        </div>
      </div>
    `).join('');

    if (footer) footer.style.display = 'block';
    if (totalEl) totalEl.textContent = formatPrice(getTotal());
  }

  function open() {
    document.getElementById('cartDrawer')?.classList.add('open');
    document.getElementById('cartOverlay')?.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function close() {
    document.getElementById('cartDrawer')?.classList.remove('open');
    document.getElementById('cartOverlay')?.classList.remove('open');
    document.body.style.overflow = '';
  }

  function init() {
    updateCount();
    render();

    document.getElementById('cartToggle')?.addEventListener('click', open);
    document.getElementById('cartClose')?.addEventListener('click', close);
    document.getElementById('cartOverlay')?.addEventListener('click', close);
  }

  return { add, remove, changeQty, init, open, close };
})();

function showToast(msg) {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2500);
}