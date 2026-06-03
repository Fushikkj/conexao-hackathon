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


document.addEventListener("DOMContentLoaded", () => {

    // ==========================
    // NAVEGAÇÃO ENTRE PÁGINAS
    // ==========================
function showPage(pageId) {
    document.querySelectorAll(".page").forEach(p => {
        p.classList.remove("active");
    });

    const page = document.getElementById(pageId);
    if (page) page.classList.add("active");
}

document.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-page]");
    if (!btn) return;

    e.preventDefault();
    showPage(btn.dataset.page);
});


    // ==========================
    // VER MAIS (HOME)
    // ==========================

    window.toggleTexto = function () {

        const texto = document.getElementById("textoExtra");
        const botao = document.getElementById("btnVerMais");

        if (!texto || !botao) return;

        if (texto.style.display === "inline") {
            texto.style.display = "none";
            botao.textContent = "Ver mais";
        } else {
            texto.style.display = "inline";
            botao.textContent = "Ver menos";
        }
    };


    // ==========================
    // CADASTRO
    // ==========================

    const cadastroForm = document.getElementById("form-cadastro");

    cadastroForm?.addEventListener("submit", (e) => {

        e.preventDefault();

        const nome = cadastroForm.nome.value.trim();
        const email = cadastroForm.email.value.trim();
        const senha = cadastroForm.senha.value.trim();
        const senha2 = cadastroForm.senha2.value.trim();

        if (!nome || !email || !senha || !senha2) {
            alert("Preencha todos os campos do cadastro.");
            return;
        }

        if (senha.length < 6) {
            alert("A senha deve ter no mínimo 6 caracteres.");
            return;
        }

        if (senha !== senha2) {
            alert("As senhas não coincidem.");
            return;
        }

        const usuario = {
            nome,
            email,
            senha,
            bio: "",
            foto: "Imagens/PERFIL.png",
            eventos: []
        };

        localStorage.setItem("usuario", JSON.stringify(usuario));

        alert("Cadastro realizado com sucesso!");

        document.querySelector('[data-tab="login"]')?.click();
    });


    // ==========================
    // LOGIN
    // ==========================

    const loginForm = document.getElementById("form-login");

    loginForm?.addEventListener("submit", (e) => {

        e.preventDefault();

        const email = loginForm.email.value.trim();
        const senha = loginForm.senha.value.trim();

        if (!email || !senha) {
            alert("Preencha e-mail e senha.");
            return;
        }

        const usuario = JSON.parse(localStorage.getItem("usuario"));

        if (!usuario) {
            alert("Nenhum usuário cadastrado.");
            return;
        }

        if (usuario.email === email && usuario.senha === senha) {

            localStorage.setItem(
                "usuarioLogado",
                JSON.stringify(usuario)
            );

            preencherPerfil();

            alert("Login realizado com sucesso!");

            navigate("page-perfil");

        } else {
            alert("E-mail ou senha incorretos.");
        }
    });


    // ==========================
    // PERFIL (CARREGAR)
    // ==========================

    function preencherPerfil() {

        const usuario = JSON.parse(localStorage.getItem("usuarioLogado"));

        if (!usuario) return;

        // inputs
        const nome = document.getElementById("perfil-nome-input");
        const email = document.getElementById("perfil-email-input");
        const bio = document.getElementById("perfil-bio");
        const foto = document.getElementById("foto-perfil");

        if (nome) nome.value = usuario.nome || "";
        if (email) email.value = usuario.email || "";
        if (bio) bio.value = usuario.bio || "";
        if (foto) foto.src = usuario.foto || "Imagens/PERFIL.png";

        // texto simples (se existir no HTML antigo)
        const nomeSpan = document.getElementById("perfil-nome");
        const emailSpan = document.getElementById("perfil-email");

        if (nomeSpan) nomeSpan.textContent = usuario.nome;
        if (emailSpan) emailSpan.textContent = usuario.email;

    }

    preencherPerfil();


    // ==========================
    // SALVAR PERFIL
    // ==========================

    document.getElementById("salvarPerfil")?.addEventListener("click", () => {

        const usuario = JSON.parse(localStorage.getItem("usuarioLogado"));

        if (!usuario) return;

        usuario.nome = document.getElementById("perfil-nome-input").value;
        usuario.email = document.getElementById("perfil-email-input").value;
        usuario.bio = document.getElementById("perfil-bio").value;

        localStorage.setItem("usuario", JSON.stringify(usuario));
        localStorage.setItem("usuarioLogado", JSON.stringify(usuario));

        alert("Perfil atualizado com sucesso!");
        preencherPerfil();
    });


    // ==========================
    // FOTO DE PERFIL
    // ==========================

    document.getElementById("input-foto")?.addEventListener("change", (e) => {

        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();

        reader.onload = function (ev) {

            const usuario = JSON.parse(localStorage.getItem("usuarioLogado"));

            usuario.foto = ev.target.result;

            localStorage.setItem("usuario", JSON.stringify(usuario));
            localStorage.setItem("usuarioLogado", JSON.stringify(usuario));

            document.getElementById("foto-perfil").src = ev.target.result;
        };

        reader.readAsDataURL(file);
    });


    // ==========================
    // PLANOS (COM LOGIN OBRIGATÓRIO)
    // ==========================

    document.querySelectorAll(".plano-btn").forEach(btn => {

        btn.addEventListener("click", (e) => {

            e.preventDefault();

            const usuario = JSON.parse(localStorage.getItem("usuarioLogado"));

            if (!usuario) {
                alert("Você precisa estar logado para escolher um plano.");
                navigate("page-login");
                return;
            }

            const plano = btn.dataset.plano;

            if (plano === "Participante") {
                alert("Plano gratuito ativado! Você pode participar de eventos selecionados.");
            }

            if (plano === "Apoiador") {
                alert("Obrigado por apoiar! Agora você tem acesso ilimitado aos eventos.");
            }

            if (plano === "Comunidade") {
                alert("Plano Comunidade ativado! Sua organização terá destaque.");
            }

        });

    });

});