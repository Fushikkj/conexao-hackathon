document.addEventListener('DOMContentLoaded', function () {
    function navigate(targetId) {
        document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
        const target = document.getElementById(targetId);
        if (target) target.classList.add('active');
        window.scrollTo(0, 0);
    }

    document.addEventListener('click', function (e) {
        const link = e.target.closest('[data-page]');
        if (link) {
            e.preventDefault();
            navigate(link.dataset.page);
        }
    });
});

(function () {
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
  
    const fmt = (n) => 'R$ ' + n.toFixed(2).replace('.', ',');
  
    function openCart() {
      drawer.classList.add('active');
      overlay.classList.add('active');
    }
    function closeCart() {
      drawer.classList.remove('active');
      overlay.classList.remove('active');
    }
  
    function render() {
      if (cart.length === 0) {
        body.innerHTML = '<p class="cart-empty">Seu carrinho está vazio.</p>';
        checkoutBtn.disabled = true;
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
          </div>
        `).join('');
        checkoutBtn.disabled = false;
      }
      const total = cart.reduce((s, x) => s + x.preco, 0);
      totalEl.textContent = fmt(total);
      badge.textContent = cart.length;
      payTotal.textContent = cart.length ? ' — ' + fmt(total) : '';
    }
  
    // Clique nos botões de plano
    document.querySelectorAll('.plano-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const plano = btn.dataset.plano;
        const preco = parseFloat(btn.dataset.preco || '0');
        if (preco === 0) {
          alert('Plano gratuito ativado!');
          return;
        }
        // Evita duplicar mesmo plano
        if (cart.find(i => i.plano === plano)) {
          openCart();
          return;
        }
        cart.push({ plano, preco });
        render();
        openCart();
      });
    });
  
    // Remover item
    body.addEventListener('click', (e) => {
      if (e.target.classList.contains('cart-item-remove')) {
        cart.splice(parseInt(e.target.dataset.i), 1);
        render();
      }
    });
  
    // Fechar
    document.getElementById('cartClose').addEventListener('click', closeCart);
    overlay.addEventListener('click', closeCart);
    document.getElementById('cartFab').addEventListener('click', openCart);
  
    // Checkout
    checkoutBtn.addEventListener('click', () => {
      closeCart();
      modal.classList.add('active');
      form.hidden = false;
      success.hidden = true;
    });
    document.getElementById('checkoutClose').addEventListener('click', () => {
      modal.classList.remove('active');
    });
  
    // Máscara simples cartão / validade
    form.cartao.addEventListener('input', e => {
      e.target.value = e.target.value.replace(/\D/g, '').replace(/(\d{4})(?=\d)/g, '$1 ').trim();
    });
    form.validade.addEventListener('input', e => {
      let v = e.target.value.replace(/\D/g, '');
      if (v.length >= 3) v = v.slice(0,2) + '/' + v.slice(2,4);
      e.target.value = v;
    });
  
    // Submit fake (simulação)
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      form.hidden = true;
      success.hidden = false;
      cart.length = 0;
      render();
      setTimeout(() => modal.classList.remove('active'), 2200);
    });
  
    render();
  })();

  // Alterna entre Login e Cadastro
const tabs = document.querySelectorAll('.auth-tab');
const forms = {
  login: document.getElementById('form-login'),
  cadastro: document.getElementById('form-cadastro'),
};

function switchTab(name){
  tabs.forEach(t => t.classList.toggle('active', t.dataset.tab === name));
  Object.entries(forms).forEach(([k, f]) => f.classList.toggle('active', k === name));
}
tabs.forEach(t => t.addEventListener('click', () => switchTab(t.dataset.tab)));
document.querySelectorAll('[data-switch]').forEach(a => {
  a.addEventListener('click', e => { e.preventDefault(); switchTab(a.dataset.switch); });
});

// Validação simples + feedback
function validar(form){
  let ok = true;
  form.querySelectorAll('input[required]').forEach(input => {
    const valido = input.checkValidity();
    input.classList.toggle('invalid', !valido);
    if (!valido) ok = false;
  });
  return ok;
}

// Cadastro
document.getElementById("form-cadastro").addEventListener("submit", function(e) {
    e.preventDefault();

    const nome = this.nome.value;
    const email = this.email.value;
    const senha = this.senha.value;
    const senha2 = this.senha2.value;

    if (senha !== senha2) {
        alert("As senhas não coincidem!");
        return;
    }

    const usuario = {
        nome,
        email,
        senha
    };

    localStorage.setItem("usuarioConecta", JSON.stringify(usuario));

    alert("Cadastro realizado com sucesso!");

    document.querySelector('[data-tab="login"]').click();
});

// Login
document.getElementById("form-login").addEventListener("submit", function(e) {
    e.preventDefault();

    const email = this.email.value;
    const senha = this.senha.value;

    const usuario = JSON.parse(
        localStorage.getItem("usuarioConecta")
    );

    if (!usuario) {
        alert("Nenhum usuário cadastrado.");
        return;
    }

    if (
        usuario.email === email &&
        usuario.senha === senha
    ) {
        localStorage.setItem("logado", "true");

        alert(`Bem-vindo, ${usuario.nome}!`);

        showPage("eventos");
    } else {
        alert("E-mail ou senha incorretos.");
    }
});