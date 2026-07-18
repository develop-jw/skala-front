        // 로그인 여부 확인 — 일정 추가/수정/삭제 권한을 가르는 데 쓰인다.
        // render() 계열 함수보다 먼저 정의해야 최초 렌더링부터 정상 동작한다.
        // ================================================================
        var SESSION_KEY = 'jwhub_session';

        function getSession() {
            try { return JSON.parse(localStorage.getItem(SESSION_KEY)); } catch (err) { return null; }
        }

        function isLoggedIn() {
            return !!getSession();
        }

        var DAYS = ['월', '화', '수', '목', '금', '토', '일'];
        var TIME_SLOTS = [
            '09:00-10:00', '10:00-11:00', '11:00-12:00', '12:00-13:00',
            '13:00-14:00', '14:00-15:00', '15:00-16:00', '16:00-17:00',
            '17:00-18:00', '18:00-19:00', '19:00-20:00', '20:00-21:00'
        ];

        var schedule = [
            { id: 1, day: '월', slot: '09:00-10:00', title: 'SKALA - AI 서비스 기초', memo: '이론 강의' },
            { id: 2, day: '수', slot: '13:00-14:00', title: 'SKALA - 팀 프로젝트 실습', memo: '생성형 AI 서비스 개발' },
            { id: 3, day: '금', slot: '19:00-20:00', title: '개인 포트폴리오 정리', memo: '' }
        ];
        var nextId = 4;
        var editingId = null;

        var daySelect = document.getElementById('classDay');
        var slotSelect = document.getElementById('classSlot');
        var form = document.getElementById('classForm');
        var titleInput = document.getElementById('classTitle');
        var memoInput = document.getElementById('classMemo');
        var titleError = document.getElementById('classTitleError');
        var theadRow = document.getElementById('tableHeadRow');
        var tbody = document.getElementById('tableBody');

        function escapeHtml(str) {
            return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
        }

        function fillOptions(select, values) {
            select.innerHTML = values.map(function (v) {
            return '<option value="' + v + '">' + v + (values === DAYS ? '요일' : '') + '</option>';
            }).join('');
        }

        fillOptions(daySelect, DAYS);
        fillOptions(slotSelect, TIME_SLOTS);

        function buildHead() {
            var html = '<th>시간</th>';
            DAYS.forEach(function (d) {
            html += '<th>' + d + '</th>';
            });
            theadRow.innerHTML = html;
        }

        function itemEditMarkup(item) {
            return (
            '<div class="slot-edit">' +
                '<select class="edit-day">' +
                DAYS.map(function (d) {
                    return '<option value="' + d + '"' + (d === item.day ? ' selected' : '') + '>' + d + '요일</option>';
                }).join('') +
                '</select>' +
                '<select class="edit-slot">' +
                TIME_SLOTS.map(function (s) {
                    return '<option value="' + s + '"' + (s === item.slot ? ' selected' : '') + '>' + s + '</option>';
                }).join('') +
                '</select>' +
                '<input type="text" class="edit-title" value="' + escapeHtml(item.title) + '" placeholder="일정명" />' +
                '<input type="text" class="edit-memo" value="' + escapeHtml(item.memo) + '" placeholder="메모" />' +
                '<div class="slot-edit-actions">' +
                '<button type="button" class="cancel-btn"><svg><use href="#icon-x"></use></svg>취소</button>' +
                '<button type="button" class="save-btn"><svg><use href="#icon-check"></use></svg>저장</button>' +
                '</div>' +
            '</div>'
            );
        }

        function itemViewMarkup(item) {
            var actionsHtml = isLoggedIn()
                ? (
                    '<div class="slot-actions">' +
                    '<button type="button" class="edit-btn"><svg><use href="#icon-edit"></use></svg></button>' +
                    '<button type="button" class="delete-btn"><svg><use href="#icon-trash"></use></svg></button>' +
                    '</div>'
                )
                : '';
            return (
            '<div class="slot-item" data-id="' + item.id + '">' +
                '<h4>' + escapeHtml(item.title) + '</h4>' +
                (item.memo ? '<p>' + escapeHtml(item.memo) + '</p>' : '') +
                actionsHtml +
            '</div>'
            );
        }

        function render() {
            tbody.innerHTML = '';

            TIME_SLOTS.forEach(function (slot) {
            var tr = document.createElement('tr');
            var rowHtml = '<th scope="row">' + slot + '</th>';

            DAYS.forEach(function (day) {
                var items = schedule.filter(function (s) { return s.day === day && s.slot === slot; });
                var cellHtml = '';
                if (items.length === 0) {
                cellHtml = '<div class="slot-empty"></div>';
                } else {
                items.forEach(function (item) {
                    cellHtml += (isLoggedIn() && editingId === item.id) ? itemEditMarkup(item) : itemViewMarkup(item);
                });
                }
                rowHtml += '<td>' + cellHtml + '</td>';
            });

            tr.innerHTML = rowHtml;
            tbody.appendChild(tr);
            });
        }

        form.addEventListener('submit', function (e) {
            e.preventDefault();
            if (!isLoggedIn()) return;

            var title = titleInput.value.trim();

            if (!title) {
            titleError.textContent = '일정명을 입력해주세요.';
            return;
            }
            titleError.textContent = '';

            schedule.push({
            id: nextId++,
            day: daySelect.value,
            slot: slotSelect.value,
            title: title,
            memo: memoInput.value.trim()
            });

            titleInput.value = '';
            memoInput.value = '';
            render();
        });

        tbody.addEventListener('click', function (e) {
            if (!isLoggedIn()) return;

            var itemEl = e.target.closest('.slot-item');
            var editEl = e.target.closest('.slot-edit');

            if (itemEl) {
            var id = Number(itemEl.dataset.id);
            if (e.target.closest('.delete-btn')) {
                schedule = schedule.filter(function (s) { return s.id !== id; });
                if (editingId === id) editingId = null;
                render();
            } else if (e.target.closest('.edit-btn')) {
                editingId = id;
                render();
            }
            return;
            }

            if (editEl) {
            if (e.target.closest('.cancel-btn')) {
                editingId = null;
                render();
                return;
            }
            if (e.target.closest('.save-btn')) {
                var item = schedule.find(function (s) { return s.id === editingId; });
                var newTitle = editEl.querySelector('.edit-title').value.trim();
                if (!newTitle) return;
                item.day = editEl.querySelector('.edit-day').value;
                item.slot = editEl.querySelector('.edit-slot').value;
                item.title = newTitle;
                item.memo = editEl.querySelector('.edit-memo').value.trim();
                editingId = null;
                render();
            }
            }
        });

        buildHead();
        render();

        var header = document.getElementById('siteHeader');
        window.addEventListener('scroll', function () {
            header.classList.toggle('scrolled', window.scrollY > 10);
        });

        // 섹션 헤더 페이드인
        var revealEls = document.querySelectorAll('.reveal');
        if ('IntersectionObserver' in window) {
            var revealObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                revealObserver.unobserve(entry.target);
                }
            });
            }, { threshold: 0.15 });
            revealEls.forEach(function (el) { revealObserver.observe(el); });
        } else {
            revealEls.forEach(function (el) { el.classList.add('is-visible'); });
        }

        // ===== 장기 일정(월간·연간) 관리 =====
        var MONTHS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

        var longTermSchedule = [
            { id: 1, year: 2026, month: 7, title: 'SKALA 개강', memo: '오리엔테이션' },
            { id: 2, year: 2026, month: 11, title: 'SKALA 팀 프로젝트 마감', memo: '발표 준비' },
            { id: 3, year: 2026, month: 12, title: 'SKALA 수료', memo: '' },
            { id: 4, year: 2027, month: 2, title: '취업 준비 시작', memo: '포트폴리오 정리' }
        ];
        var ltNextId = 5;
        var ltEditingId = null;

        var ltYearInput = document.getElementById('ltYear');
        var ltMonthSelect = document.getElementById('ltMonth');
        var ltForm = document.getElementById('longTermForm');
        var ltTitleInput = document.getElementById('ltTitle');
        var ltMemoInput = document.getElementById('ltMemo');
        var ltTitleError = document.getElementById('ltTitleError');
        var ltHeadRow = document.getElementById('ltHeadRow');
        var ltTableBody = document.getElementById('ltTableBody');
        var longTermCountEl = document.getElementById('longTermCount');

        ltMonthSelect.innerHTML = MONTHS.map(function (m) {
            return '<option value="' + m + '">' + m + '월</option>';
        }).join('');

        function ltBuildHead() {
            var html = '<th>연도</th>';
            MONTHS.forEach(function (m) {
            html += '<th>' + m + '월</th>';
            });
            ltHeadRow.innerHTML = html;
        }

        function ltItemEditMarkup(item) {
            return (
            '<div class="slot-edit">' +
                '<input type="number" class="edit-year" value="' + item.year + '" min="2000" max="2100" />' +
                '<select class="edit-month">' +
                MONTHS.map(function (m) {
                    return '<option value="' + m + '"' + (m === item.month ? ' selected' : '') + '>' + m + '월</option>';
                }).join('') +
                '</select>' +
                '<input type="text" class="edit-title" value="' + escapeHtml(item.title) + '" placeholder="일정명" />' +
                '<input type="text" class="edit-memo" value="' + escapeHtml(item.memo) + '" placeholder="메모" />' +
                '<div class="slot-edit-actions">' +
                '<button type="button" class="lt-cancel-btn"><svg><use href="#icon-x"></use></svg>취소</button>' +
                '<button type="button" class="lt-save-btn"><svg><use href="#icon-check"></use></svg>저장</button>' +
                '</div>' +
            '</div>'
            );
        }

        function ltItemViewMarkup(item) {
            var actionsHtml = isLoggedIn()
                ? (
                    '<div class="slot-actions">' +
                    '<button type="button" class="lt-edit-btn"><svg><use href="#icon-edit"></use></svg></button>' +
                    '<button type="button" class="lt-delete-btn"><svg><use href="#icon-trash"></use></svg></button>' +
                    '</div>'
                )
                : '';
            return (
            '<div class="slot-item" data-id="' + item.id + '">' +
                '<h4>' + escapeHtml(item.title) + '</h4>' +
                (item.memo ? '<p>' + escapeHtml(item.memo) + '</p>' : '') +
                actionsHtml +
            '</div>'
            );
        }

        function ltRender() {
            var years = [];
            longTermSchedule.forEach(function (item) {
            if (years.indexOf(item.year) === -1) years.push(item.year);
            });
            years.sort(function (a, b) { return a - b; });

            ltTableBody.innerHTML = '';

            if (years.length === 0) {
            ltTableBody.innerHTML = '<tr><td colspan="13" style="text-align:center; color:var(--color-text-muted); padding:24px;">등록된 장기 일정이 없습니다.</td></tr>';
            } else {
            years.forEach(function (year) {
                var tr = document.createElement('tr');
                var rowHtml = '<th scope="row">' + year + '</th>';

                MONTHS.forEach(function (month) {
                var items = longTermSchedule.filter(function (s) { return s.year === year && s.month === month; });
                var cellHtml = '';
                if (items.length === 0) {
                    cellHtml = '<div class="slot-empty"></div>';
                } else {
                    items.forEach(function (item) {
                    cellHtml += (isLoggedIn() && ltEditingId === item.id) ? ltItemEditMarkup(item) : ltItemViewMarkup(item);
                    });
                }
                rowHtml += '<td>' + cellHtml + '</td>';
                });

                tr.innerHTML = rowHtml;
                ltTableBody.appendChild(tr);
            });
            }

            animateCount(longTermCountEl, longTermSchedule.length);
        }

        ltForm.addEventListener('submit', function (e) {
            e.preventDefault();
            if (!isLoggedIn()) return;

            var title = ltTitleInput.value.trim();
            var year = parseInt(ltYearInput.value, 10);

            if (!title) {
            ltTitleError.textContent = '일정명을 입력해주세요.';
            return;
            }
            if (!year) {
            ltTitleError.textContent = '연도를 입력해주세요.';
            return;
            }
            ltTitleError.textContent = '';

            longTermSchedule.push({
            id: ltNextId++,
            year: year,
            month: parseInt(ltMonthSelect.value, 10),
            title: title,
            memo: ltMemoInput.value.trim()
            });

            ltTitleInput.value = '';
            ltMemoInput.value = '';
            ltRender();
        });

        ltTableBody.addEventListener('click', function (e) {
            if (!isLoggedIn()) return;

            var itemEl = e.target.closest('.slot-item');
            var editEl = e.target.closest('.slot-edit');

            if (itemEl) {
            var id = Number(itemEl.dataset.id);
            if (e.target.closest('.lt-delete-btn')) {
                longTermSchedule = longTermSchedule.filter(function (s) { return s.id !== id; });
                if (ltEditingId === id) ltEditingId = null;
                ltRender();
            } else if (e.target.closest('.lt-edit-btn')) {
                ltEditingId = id;
                ltRender();
            }
            return;
            }

            if (editEl) {
            if (e.target.closest('.lt-cancel-btn')) {
                ltEditingId = null;
                ltRender();
                return;
            }
            if (e.target.closest('.lt-save-btn')) {
                var item = longTermSchedule.find(function (s) { return s.id === ltEditingId; });
                var newTitle = editEl.querySelector('.edit-title').value.trim();
                var newYear = parseInt(editEl.querySelector('.edit-year').value, 10);
                if (!newTitle || !newYear) return;
                item.year = newYear;
                item.month = parseInt(editEl.querySelector('.edit-month').value, 10);
                item.title = newTitle;
                item.memo = editEl.querySelector('.edit-memo').value.trim();
                ltEditingId = null;
                ltRender();
            }
            }
        });

        // 숫자가 스르륵 올라가는 카운트업 애니메이션
        function animateCount(el, target) {
            var start = parseInt(el.textContent, 10) || 0;
            if (start === target) return;
            var startTime = null;
            var duration = 500;

            function step(timestamp) {
            if (!startTime) startTime = timestamp;
            var progress = Math.min(1, (timestamp - startTime) / duration);
            el.textContent = Math.round(start + (target - start) * progress);
            if (progress < 1) requestAnimationFrame(step);
            }
            requestAnimationFrame(step);
        }

        ltBuildHead();
        ltRender();

        // 스크롤로 이 섹션에 처음 들어왔을 때: 표가 페이드인 + 카운트가 0에서부터 다시 올라감
        var longTermSection = document.getElementById('longTermSection');
        var longTermTableWrapper = document.getElementById('longTermTableWrapper');
        if ('IntersectionObserver' in window && longTermSection) {
            var ltObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                longTermTableWrapper.classList.add('is-visible');
                longTermCountEl.textContent = '0';
                animateCount(longTermCountEl, longTermSchedule.length);
                ltObserver.unobserve(entry.target);
                }
            });
            }, { threshold: 0.2 });
            ltObserver.observe(longTermSection);
        } else if (longTermTableWrapper) {
            longTermTableWrapper.classList.add('is-visible');
        }

        // ================================================================
        // 로그인 상태 표시 (헤더 오른쪽) — SESSION_KEY/getSession은 파일 상단에서
        // 이미 정의했으므로 여기서는 재사용만 한다.
        // ================================================================
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
                    updateScheduleAuthUI();
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

        // ================================================================
        // 로그인 여부에 따라 "일정 추가하기" 폼을 보여줄지, 로그인 안내를
        // 보여줄지 전환한다. 편집/삭제 버튼 자체는 itemViewMarkup /
        // ltItemViewMarkup 안에서 isLoggedIn()으로 이미 걸러지므로,
        // 여기서는 render()/ltRender()를 다시 호출해 그 버튼들도 갱신한다.
        // ================================================================
        function updateScheduleAuthUI() {
            var loggedIn = isLoggedIn();

            document.getElementById('classForm').style.display = loggedIn ? '' : 'none';
            document.getElementById('classTableNote').style.display = loggedIn ? '' : 'none';
            document.getElementById('classLoginNotice').style.display = loggedIn ? 'none' : '';

            document.getElementById('longTermForm').style.display = loggedIn ? '' : 'none';
            document.getElementById('ltTableNote').style.display = loggedIn ? '' : 'none';
            document.getElementById('ltLoginNotice').style.display = loggedIn ? 'none' : '';

            render();
            ltRender();
        }

        updateScheduleAuthUI();
