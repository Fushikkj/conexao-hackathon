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

/// Alterna entre Login e Cadastro
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

forms.login.addEventListener('submit', e => {
  e.preventDefault();
  if (!validar(forms.login)) return;
  const btn = forms.login.querySelector('.auth-btn');
  btn.textContent = 'Entrando...';
  setTimeout(() => {
    btn.classList.add('success');
    btn.textContent = '✓ Bem-vindo!';
    // localStorage.setItem('conecta_user', JSON.stringify({...}))
    // setTimeout(()=> showPage('home'), 800);
  }, 600);
});

forms.cadastro.addEventListener('submit', e => {
  e.preventDefault();
  const f = forms.cadastro;
  if (!validar(f)) return;
  if (f.senha.value !== f.senha2.value){
    f.senha2.classList.add('invalid');
    alert('As senhas não coincidem');
    return;
  }
  const btn = f.querySelector('.auth-btn');
  btn.textContent = 'Criando conta...';
  setTimeout(() => {
    btn.classList.add('success');
    btn.textContent = '✓ Conta criada!';
    setTimeout(() => switchTab('login'), 900);
  }, 600);
});