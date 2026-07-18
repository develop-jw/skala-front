/* ----- Scroll Reveal ----- */
        var revealEls = document.querySelectorAll('.reveal');
        if ('IntersectionObserver' in window) {
            var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
                }
            });
            }, { threshold: 0.12 });
            revealEls.forEach(function (el) { observer.observe(el); });
        } else {
            revealEls.forEach(function (el) { el.classList.add('is-visible'); });
        }

        /* ----- Filter ----- */
        var filterBtns = document.querySelectorAll('.filter-btn');
        var tripCards = document.querySelectorAll('.trip-card');
        filterBtns.forEach(function (btn) {
            btn.addEventListener('click', function () {
            filterBtns.forEach(function (b) { b.classList.remove('active'); });
            btn.classList.add('active');
            var filter = btn.dataset.filter;
            tripCards.forEach(function (card) {
                var match = filter === 'all' || card.dataset.category === filter;
                card.style.display = match ? '' : 'none';
            });
            });
        });

        /* ----- Header Scroll ----- */
        var header = document.getElementById('siteHeader');
        var toTopBtn = document.getElementById('toTopBtn');
        window.addEventListener('scroll', function () {
            header.classList.toggle('scrolled', window.scrollY > 10);
            toTopBtn.classList.toggle('visible', window.scrollY > 400);
        });
        toTopBtn.addEventListener('click', function () {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });

        /* ----- Auth ----- */
        var SESSION_KEY = 'jwhub_session';

        function getSession() {
            try { return JSON.parse(localStorage.getItem(SESSION_KEY)); } catch (err) { return null; }
        }

        function renderHeaderAuth() {
            var session = getSession();
            var headerAuth = document.getElementById('headerAuth');
            headerAuth.innerHTML = '';

            if (session) {
                var headerChip = document.createElement('span');
                headerChip.className = 'header-user-chip';
                headerChip.textContent = session.name + '님';

                var headerLogoutBtn = document.createElement('button');
                headerLogoutBtn.type = 'button';
                headerLogoutBtn.className = 'header-logout-btn';
                headerLogoutBtn.textContent = '로그아웃';
                headerLogoutBtn.addEventListener('click', function () {
                    localStorage.removeItem(SESSION_KEY);
                    renderHeaderAuth();
                });

                headerAuth.appendChild(headerChip);
                headerAuth.appendChild(headerLogoutBtn);
            } else {
                var headerLoginLink = document.createElement('a');
                headerLoginLink.href = '../index.html';
                headerLoginLink.className = 'header-login-btn';
                headerLoginLink.textContent = '로그인';
                headerAuth.appendChild(headerLoginLink);
            }
        }

        renderHeaderAuth();
