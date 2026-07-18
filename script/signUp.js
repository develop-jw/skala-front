var form = document.getElementById('signUpForm');
        var fields = {
            name: document.getElementById('name'),
            email: document.getElementById('email'),
            password: document.getElementById('password'),
            passwordConfirm: document.getElementById('passwordConfirm')
        };
        var errors = {
            name: document.getElementById('nameError'),
            email: document.getElementById('emailError'),
            password: document.getElementById('passwordError'),
            passwordConfirm: document.getElementById('passwordConfirmError')
        };

        function setError(key, message) {
            errors[key].textContent = message;
            fields[key].classList.toggle('invalid', !!message);
        }

        form.addEventListener('submit', function (e) {
            e.preventDefault();
            var isValid = true;

            var name = fields.name.value.trim();
            if (!name) {
            setError('name', '이름을 입력해주세요.');
            isValid = false;
            } else {
            setError('name', '');
            }

            var email = fields.email.value.trim();
            var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!email) {
            setError('email', '이메일을 입력해주세요.');
            isValid = false;
            } else if (!emailPattern.test(email)) {
            setError('email', '올바른 이메일 형식이 아닙니다.');
            isValid = false;
            } else {
            setError('email', '');
            }

            var password = fields.password.value;
            if (!password) {
            setError('password', '비밀번호를 입력해주세요.');
            isValid = false;
            } else if (password.length < 8) {
            setError('password', '비밀번호는 8자 이상이어야 합니다.');
            isValid = false;
            } else {
            setError('password', '');
            }

            var passwordConfirm = fields.passwordConfirm.value;
            if (!passwordConfirm) {
            setError('passwordConfirm', '비밀번호 확인을 입력해주세요.');
            isValid = false;
            } else if (passwordConfirm !== password) {
            setError('passwordConfirm', '비밀번호가 일치하지 않습니다.');
            isValid = false;
            } else {
            setError('passwordConfirm', '');
            }

            if (!isValid) {
            return;
            }

            /* ----- Sign Up ----- */
            var USERS_KEY = 'jwhub_users';
            var SESSION_KEY = 'jwhub_session';

            var users = [];
            try {
                users = JSON.parse(localStorage.getItem(USERS_KEY)) || [];
            } catch (err) {
                users = [];
            }

            var alreadyExists = users.some(function (u) { return u.email === email; });
            if (alreadyExists) {
                setError('email', '이미 가입된 이메일입니다.');
                return;
            }

            users.push({ name: name, email: email, password: password });
            localStorage.setItem(USERS_KEY, JSON.stringify(users));
            localStorage.setItem(SESSION_KEY, JSON.stringify({ name: name, email: email }));
            window.location.href = 'signUpResult.html?name=' + encodeURIComponent(name);
        });
