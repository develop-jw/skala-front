var params = new URLSearchParams(window.location.search);
        var name = params.get('name');
        if (name) {
            document.getElementById('resultTitle').textContent = name + '님, 환영합니다!';
            document.getElementById('resultDesc').textContent = '회원가입이 완료되었습니다. 이제 조종원과 직접 소통하실 수 있어요.';
        }
