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
