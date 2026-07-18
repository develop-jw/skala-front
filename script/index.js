/* ----- Tools ----- */
        var TOOLS = {
            updown: {
                render: function (body) {
                    var answer = Math.floor(Math.random() * 100) + 1;
                    var tries = 0;

                    body.innerHTML =
                        '<h3>Up-Down 숫자 맞추기</h3>' +
                        '<p class="modal-desc">1부터 100 사이의 숫자를 맞혀보세요.</p>' +
                        '<div class="modal-field">' +
                            '<label for="updownInput">숫자 입력</label>' +
                            '<input type="number" id="updownInput" min="1" max="100" />' +
                        '</div>' +
                        '<div class="modal-actions">' +
                            '<button type="button" class="btn btn-primary btn-block" id="updownGuessBtn">확인</button>' +
                        '</div>' +
                        '<div class="modal-result" id="updownResult">몇 번 만에 맞히는지 도전해보세요!</div>' +
                        '<div class="updown-top10">' +
                            '<h4>Top 10 기록</h4>' +
                            '<ol class="updown-top10-list" id="updownTop10List"></ol>' +
                        '</div>';

                    var input = body.querySelector('#updownInput');
                    var resultEl = body.querySelector('#updownResult');
                    var guessBtn = body.querySelector('#updownGuessBtn');
                    var top10List = body.querySelector('#updownTop10List');

                    renderUpdownTop10(top10List);

                    function submitGuess() {
                        var guess = parseInt(input.value, 10);
                        if (isNaN(guess) || guess < 1 || guess > 100) {
                            resultEl.textContent = '1부터 100 사이의 숫자를 입력해주세요.';
                            return;
                        }
                        tries++;
                        if (guess === answer) {
                            resultEl.textContent = tries + '번 만에 정답을 맞히셨습니다! 정답은 ' + answer + '입니다.';
                            input.disabled = true;
                            guessBtn.disabled = true;

                            if (isLoggedIn()) {
                                saveUpdownScore(tries);
                                renderUpdownTop10(top10List);
                            } else {
                                resultEl.textContent += ' (로그인하면 이 기록이 Top 10에 저장돼요)';
                            }
                        } else {
                            resultEl.textContent = (guess < answer ? '더 큰 숫자입니다.' : '더 작은 숫자입니다.') + ' (' + tries + '번째 시도)';
                            input.value = '';
                            input.focus();
                        }
                    }

                    guessBtn.addEventListener('click', submitGuess);
                    input.addEventListener('keydown', function (e) {
                        if (e.key === 'Enter') submitGuess();
                    });
                    input.focus();
                }
            },

            grade: {
                render: function (body) {
                    var subjects = ['통계수학', '수리통계학', '머신러닝'];

                    var fieldsHtml = subjects.map(function (s, i) {
                        return (
                            '<div class="modal-field">' +
                                '<label for="score' + i + '">' + s + ' 점수 (0~100)</label>' +
                                '<input type="number" id="score' + i + '" min="0" max="100" />' +
                            '</div>'
                        );
                    }).join('');

                    body.innerHTML =
                        '<h3>성적 계산기</h3>' +
                        '<p class="modal-desc">과목별 점수를 입력하면 총점·평균·등급을 계산합니다.</p>' +
                        fieldsHtml +
                        '<div class="modal-actions">' +
                            '<button type="button" class="btn btn-primary btn-block" id="calcGradeBtn">계산하기</button>' +
                        '</div>' +
                        '<div class="modal-result" id="gradeResult" style="display:none;"></div>';

                    body.querySelector('#calcGradeBtn').addEventListener('click', function () {
                        var total = 0;
                        for (var i = 0; i < subjects.length; i++) {
                            var v = parseInt(body.querySelector('#score' + i).value, 10);
                            total += isNaN(v) ? 0 : v;
                        }
                        var average = total / subjects.length;
                        var grade = average >= 90 ? 'A' : average >= 80 ? 'B' : average >= 70 ? 'C' : average >= 60 ? 'D' : 'F';

                        var resultEl = body.querySelector('#gradeResult');
                        resultEl.style.display = 'block';
                        resultEl.innerHTML =
                            '총점: <strong>' + total + '점</strong><br>' +
                            '평균: <strong>' + average.toFixed(1) + '점</strong><br>' +
                            '등급: <strong>' + grade + '</strong>';
                    });
                }
            },

            bag: {
                render: function (body) {
                    var bag = [
                        { name: '노트북', count: 1 },
                        { name: '노트', count: 2 },
                        { name: '펜', count: 3 },
                        { name: '이어폰', count: 1 }
                    ];

                    var itemsHtml = bag.map(function (item) {
                        return '<li><span>' + item.name + '</span><span>' + item.count + '개</span></li>';
                    }).join('');

                    body.innerHTML =
                        '<h3>내 가방 속 물건</h3>' +
                        '<p class="modal-desc">가방에 들어있는 물건과 수량입니다.</p>' +
                        '<ul class="modal-bag-list">' + itemsHtml + '</ul>';
                }
            },

            login: {
                render: function (body) {
                    body.innerHTML =
                        '<h3>로그인</h3>' +
                        '<p class="modal-desc">가입하실 때 등록한 이메일과 비밀번호를 입력해주세요.</p>' +
                        '<div class="modal-field">' +
                            '<label for="loginEmailInput">이메일</label>' +
                            '<input type="text" id="loginEmailInput" placeholder="example@email.com" />' +
                        '</div>' +
                        '<div class="modal-field">' +
                            '<label for="loginPasswordInput">비밀번호</label>' +
                            '<input type="password" id="loginPasswordInput" placeholder="비밀번호를 입력하세요" />' +
                        '</div>' +
                        '<div class="modal-actions">' +
                            '<button type="button" class="btn btn-primary btn-block" id="loginSubmitBtn">로그인</button>' +
                        '</div>' +
                        '<div class="modal-result" id="loginResult" style="display:none;"></div>';

                    var emailInput = body.querySelector('#loginEmailInput');
                    var passwordInput = body.querySelector('#loginPasswordInput');
                    var resultEl = body.querySelector('#loginResult');

                    function submitLogin() {
                        var email = emailInput.value.trim();
                        var password = passwordInput.value;

                        if (!email || !password) {
                            resultEl.style.display = 'block';
                            resultEl.textContent = '이메일과 비밀번호를 모두 입력해주세요.';
                            return;
                        }

                        var users = [];
                        try {
                            users = JSON.parse(localStorage.getItem(USERS_KEY)) || [];
                        } catch (err) {
                            users = [];
                        }

                        var matched = users.find(function (u) {
                            return u.email === email && u.password === password;
                        });

                        if (!matched) {
                            resultEl.style.display = 'block';
                            resultEl.textContent = '이메일 또는 비밀번호가 일치하지 않습니다. 가입 이력이 없다면 먼저 회원가입해주세요.';
                            return;
                        }

                        localStorage.setItem(SESSION_KEY, JSON.stringify({ name: matched.name, email: matched.email }));
                        renderAuthState();
                        closeModal();
                    }

                    body.querySelector('#loginSubmitBtn').addEventListener('click', submitLogin);
                    passwordInput.addEventListener('keydown', function (e) {
                        if (e.key === 'Enter') submitLogin();
                    });
                    emailInput.focus();
                }
            }
        };

        /* ----- Updown Top 10 ----- */
        var UPDOWN_SCORES_KEY = 'jwhub_updown_scores';

        function getUpdownScores() {
            try { return JSON.parse(localStorage.getItem(UPDOWN_SCORES_KEY)) || []; } catch (err) { return []; }
        }

        function saveUpdownScore(tries) {
            var session = getSession();
            if (!session) return;

            var scores = getUpdownScores();
            scores.push({ name: session.name, tries: tries, createdAt: Date.now() });
            scores.sort(function (a, b) {
                return a.tries - b.tries || a.createdAt - b.createdAt;
            });
            scores = scores.slice(0, 10);
            localStorage.setItem(UPDOWN_SCORES_KEY, JSON.stringify(scores));
        }

        function renderUpdownTop10(listEl) {
            var scores = getUpdownScores();

            if (scores.length === 0) {
                listEl.innerHTML = '<li class="updown-top10-empty">아직 기록이 없어요. 로그인하고 첫 기록을 남겨보세요!</li>';
                return;
            }

            listEl.innerHTML = scores.map(function (score, i) {
                return (
                    '<li>' +
                        '<span class="updown-top10-rank">' + (i + 1) + '</span>' +
                        '<span class="updown-top10-name">' + escapeGuestbookHtml(score.name) + '</span>' +
                        '<span class="updown-top10-tries">' + score.tries + '번</span>' +
                    '</li>'
                );
            }).join('');
        }

        var modalOverlay = document.getElementById('modalOverlay');
        var modalBody = document.getElementById('modalBody');

        function openModal(toolId) {
            var tool = TOOLS[toolId];
            if (!tool) return;
            tool.render(modalBody);
            modalOverlay.classList.add('open');
        }

        function closeModal() {
            modalOverlay.classList.remove('open');
            modalBody.innerHTML = '';
        }

        document.getElementById('startUpDown').addEventListener('click', function () { openModal('updown'); });
        document.getElementById('startGrade').addEventListener('click', function () { openModal('grade'); });
        document.getElementById('startBag').addEventListener('click', function () { openModal('bag'); });
        document.getElementById('modalClose').addEventListener('click', closeModal);
        modalOverlay.addEventListener('click', function (e) {
            if (e.target === modalOverlay) closeModal();
        });
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') closeModal();
        });

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
            }, { threshold: 0.15 });
            revealEls.forEach(function (el) { observer.observe(el); });
        } else {
            revealEls.forEach(function (el) { el.classList.add('is-visible'); });
        }

        document.getElementById('scrollCue').addEventListener('click', function () {
            document.getElementById('miniTools').scrollIntoView({ behavior: 'smooth' });
        });

        /* ----- Auth ----- */
        var USERS_KEY = 'jwhub_users';
        var SESSION_KEY = 'jwhub_session';

        function getSession() {
            try {
                return JSON.parse(localStorage.getItem(SESSION_KEY));
            } catch (err) {
                return null;
            }
        }

        function isLoggedIn() {
            return !!getSession();
        }

        function renderAuthState() {
            var session = getSession();

            /* ----- Header ----- */
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
                    renderAuthState();
                });

                headerAuth.appendChild(headerChip);
                headerAuth.appendChild(headerLogoutBtn);
            } else {
                var headerLoginBtn = document.createElement('button');
                headerLoginBtn.type = 'button';
                headerLoginBtn.className = 'header-login-btn';
                headerLoginBtn.textContent = '로그인';
                headerLoginBtn.addEventListener('click', function () { openModal('login'); });
                headerAuth.appendChild(headerLoginBtn);
            }

            /* ----- Hero CTA ----- */
            var cta = document.getElementById('heroCta');
            cta.innerHTML = '';

            if (session) {
                var chip = document.createElement('span');
                chip.className = 'welcome-chip';
                chip.textContent = session.name + '님, 환영합니다 👋';

                var logoutBtn = document.createElement('button');
                logoutBtn.type = 'button';
                logoutBtn.className = 'btn btn-secondary';
                logoutBtn.textContent = '로그아웃';
                logoutBtn.addEventListener('click', function () {
                    localStorage.removeItem(SESSION_KEY);
                    renderAuthState();
                });

                cta.appendChild(chip);
                cta.appendChild(logoutBtn);
            } else {
                var link = document.createElement('a');
                link.href = 'html/signUp.html';
                link.className = 'btn btn-primary';
                link.textContent = '회원가입하고 소통하기';
                cta.appendChild(link);
            }

            renderGuestbookWriteArea();
        }

        renderAuthState();

        /* ----- Guestbook ----- */
        var GUESTBOOK_KEY = 'jwhub_guestbook';

        function getGuestbookEntries() {
            try { return JSON.parse(localStorage.getItem(GUESTBOOK_KEY)) || []; } catch (err) { return []; }
        }

        function saveGuestbookEntries(entries) {
            localStorage.setItem(GUESTBOOK_KEY, JSON.stringify(entries));
        }

        function formatGuestbookTime(timestamp) {
            var d = new Date(timestamp);
            return d.getFullYear() + '.' + String(d.getMonth() + 1).padStart(2, '0') + '.' + String(d.getDate()).padStart(2, '0') +
                ' ' + String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0');
        }

        function renderGuestbookList() {
            var listEl = document.getElementById('guestbookList');
            var entries = getGuestbookEntries().slice().sort(function (a, b) { return b.createdAt - a.createdAt; });

            if (entries.length === 0) {
                listEl.innerHTML = '<div class="guestbook-empty">아직 남겨진 메시지가 없어요. 첫 번째 메시지를 남겨보세요!</div>';
                return;
            }

            listEl.innerHTML = entries.map(function (entry) {
                return (
                    '<div class="guestbook-entry">' +
                        '<div class="guestbook-entry-head">' +
                            '<span class="guestbook-entry-name">' + escapeGuestbookHtml(entry.name) + '</span>' +
                            '<span class="guestbook-entry-time">' + formatGuestbookTime(entry.createdAt) + '</span>' +
                        '</div>' +
                        '<p class="guestbook-entry-message">' + escapeGuestbookHtml(entry.message) + '</p>' +
                    '</div>'
                );
            }).join('');
        }

        function escapeGuestbookHtml(str) {
            return String(str)
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;');
        }

        function renderGuestbookWriteArea() {
            var session = getSession();
            var writeArea = document.getElementById('guestbookWriteArea');

            if (!session) {
                writeArea.innerHTML =
                    '<p class="guestbook-form-desc">로그인하면 방명록에 메시지를 남길 수 있어요.</p>' +
                    '<button type="button" class="btn btn-secondary btn-block" id="guestbookLoginBtn">로그인하러 가기</button>';
                document.getElementById('guestbookLoginBtn').addEventListener('click', function () {
                    openModal('login');
                });
                return;
            }

            writeArea.innerHTML =
                '<p class="guestbook-author">' + escapeGuestbookHtml(session.name) + '님으로 작성</p>' +
                '<textarea class="guestbook-textarea" id="guestbookMessageInput" placeholder="남기고 싶은 메시지를 적어주세요."></textarea>' +
                '<p class="guestbook-error" id="guestbookError"></p>' +
                '<button type="button" class="btn btn-primary btn-block" id="guestbookSubmitBtn">남기기</button>';

            var messageInput = document.getElementById('guestbookMessageInput');
            var errorEl = document.getElementById('guestbookError');

            document.getElementById('guestbookSubmitBtn').addEventListener('click', function () {
                var message = messageInput.value.trim();
                if (!message) {
                    errorEl.textContent = '메시지를 입력해주세요.';
                    return;
                }
                errorEl.textContent = '';

                var entries = getGuestbookEntries();
                entries.push({
                    id: Date.now(),
                    name: session.name,
                    message: message,
                    createdAt: Date.now()
                });
                saveGuestbookEntries(entries);

                messageInput.value = '';
                renderGuestbookList();
            });
        }

        renderGuestbookList();
        renderGuestbookWriteArea();
