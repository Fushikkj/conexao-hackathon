/* =========================================================
   CONECTA — script
========================================================= */
document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Navegação SPA ---------- */
  function navigate(targetId) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    const target = document.getElementById(targetId);
    if (target) target.classList.add('active');
    // fecha menu mobile aberto
    document.querySelectorAll('.top-nav.open').forEach(n => n.classList.remove('open'));
    document.querySelectorAll('.nav-toggle.open').forEach(b => {
      b.classList.remove('open');
      b.setAttribute('aria-expanded', 'false');
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  document.addEventListener('click', (e) => {
    const link = e.target.closest('[data-page]');
    if (link) {
      e.preventDefault();
      navigate(link.dataset.page);
    }
  });

  /* ---------- Menu hambúrguer ---------- */
  document.querySelectorAll('.nav-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      const header = btn.closest('.top-header');
      const nav = header ? header.querySelector('.top-nav') : null;
      if (!nav) return;
      const open = nav.classList.toggle('open');
      btn.classList.toggle('open', open);
      btn.setAttribute('aria-expanded', String(open));
    });
  });

  /* ---------- Ver mais ---------- */
  const btnVerMais = document.getElementById('btnVerMais');
  const textoExtra = document.getElementById('textoExtra');
  if (btnVerMais && textoExtra) {
    btnVerMais.addEventListener('click', () => {
      const show = textoExtra.classList.toggle('show');
      btnVerMais.textContent = show ? 'Ver menos' : 'Ver mais';
    });
  }

  /* ---------- Tabs de Login / Cadastro ---------- */
  document.querySelectorAll('.auth-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.tab;
      document.querySelectorAll('.auth-tab').forEach(t => t.classList.toggle('active', t === tab));
      document.querySelectorAll('.auth-form').forEach(f => {
        f.classList.toggle('active', f.id === 'form-' + target);
      });
    });
  });
  document.querySelectorAll('[data-switch]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const target = link.dataset.switch;
      const tab = document.querySelector(`.auth-tab[data-tab="${target}"]`);
      if (tab) tab.click();
    });
  });

  /* ---------- Carrinho + Checkout ---------- */
  const cart = [];
  const overlay = document.getElementById('cartOverlay');
  const drawer = document.getElementById('cartDrawer');
  const body = document.getElementById('cartBody');
  const totalEl = document.getElementById('cartTotal');
  const badge = document.getElementById('cartBadge');
  const checkoutBtn = document.getElementById('cartCheckout');
  const modal = document.getElementById('checkoutModal');
  const form = document.getElementById('checkoutForm');
  const success = document.getElementById('checkoutSuccess');
  const payTotal = document.getElementById('payTotal');
  const fab = document.getElementById('cartFab');
  const closeBtn = document.getElementById('cartClose');
  const checkoutCloseBtn = document.getElementById('checkoutClose');

  const fmt = (n) => 'R$ ' + n.toFixed(2).replace('.', ',');

  function openCart()  { drawer && drawer.classList.add('active');    overlay && overlay.classList.add('active'); }
  function closeCart() { drawer && drawer.classList.remove('active'); overlay && overlay.classList.remove('active'); }

  function render() {
    if (!body) return;
    if (cart.length === 0) {
      body.innerHTML = '<p class="cart-empty">Seu carrinho está vazio.</p>';
      if (checkoutBtn) checkoutBtn.disabled = true;
    } else {
      body.innerHTML = cart.map((item, i) => `
        <div class="cart-item">
          <div class="cart-item-info">
            <strong>Plano ${item.plano}</strong>
            <small>Assinatura mensal</small>
          </div>
          <div style="display:flex; align-items:center;">
            <span class="cart-item-price">${fmt(item.preco)}</span>
            <button class="cart-item-remove" data-i="${i}" aria-label="Remover">×</button>
          </div>
        </div>`).join('');
      if (checkoutBtn) checkoutBtn.disabled = false;
    }
    const total = cart.reduce((s, x) => s + x.preco, 0);
    if (totalEl) totalEl.textContent = fmt(total);
    if (badge) badge.textContent = String(cart.length);
    if (payTotal) payTotal.textContent = cart.length ? ' — ' + fmt(total) : '';
  }

  document.querySelectorAll('.plano-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const plano = btn.dataset.plano;
      const preco = parseFloat(btn.dataset.preco || '0');
      if (!plano) return;
      if (preco === 0) {
        alert('Plano gratuito ativado! 🎉');
        return;
      }
      if (cart.find(i => i.plano === plano)) { openCart(); return; }
      cart.push({ plano, preco });
      render();
      openCart();
    });
  });

  if (body) {
    body.addEventListener('click', (e) => {
      if (e.target.classList.contains('cart-item-remove')) {
        cart.splice(parseInt(e.target.dataset.i, 10), 1);
        render();
      }
    });
  }

  if (closeBtn)         closeBtn.addEventListener('click', closeCart);
  if (overlay)          overlay.addEventListener('click', closeCart);
  if (fab)              fab.addEventListener('click', openCart);

  if (checkoutBtn && modal && form && success) {
    checkoutBtn.addEventListener('click', () => {
      if (cart.length === 0) return;
      closeCart();
      modal.classList.add('active');
      form.hidden = false;
      success.hidden = true;
    });
  }
  if (checkoutCloseBtn && modal) {
    checkoutCloseBtn.addEventListener('click', () => modal.classList.remove('active'));
  }

  if (form) {
    if (form.cartao) {
      form.cartao.addEventListener('input', (e) => {
        e.target.value = e.target.value.replace(/\D/g, '').replace(/(\d{4})(?=\d)/g, '$1 ').trim();
      });
    }
    if (form.validade) {
      form.validade.addEventListener('input', (e) => {
        let v = e.target.value.replace(/\D/g, '');
        if (v.length >= 3) v = v.slice(0, 2) + '/' + v.slice(2, 4);
        e.target.value = v;
      });
    }
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      form.hidden = true;
      success.hidden = false;
      cart.length = 0;
      render();
      setTimeout(() => modal.classList.remove('active'), 2200);
    });
  }

  render();
});
