function escapeHtml(str) {
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

var params = new URLSearchParams(window.location.search);
var name = params.get('name');
var interest = params.get('interest');
var message = params.get('message');

if (name) {
    document.getElementById('resultTitle').textContent = name + '님, 환영합니다!';
    document.getElementById('resultDesc').textContent = '회원가입이 완료되었습니다. 이제 조종원과 직접 소통하실 수 있어요.';
}

/* ----- Result Extra ----- */
var INTEREST_GUIDE = {
    guestbook: '방명록에 첫 메시지를 남겨보세요!',
    class: '나만의 일정을 등록하고 관리해보세요.',
    trip: '여행 기록 갤러리를 둘러보세요.',
    game: '업다운 게임으로 Top 10 기록에 도전해보세요!'
};

var extraEl = document.getElementById('resultExtra');
var extraParts = [];

extraParts.push('<h4 class="result-extra-title">안내사항</h4>');

if (message) {
    extraParts.push('<p><strong>남겨주신 인사말</strong> — ' + escapeHtml(message) + '</p>');
}

extraParts.push('<ul class="result-extra-list">');
Object.keys(INTEREST_GUIDE).forEach(function (key) {
    extraParts.push('<li>' + INTEREST_GUIDE[key] + '</li>');
});
extraParts.push('</ul>');

extraParts.push('<p class="result-extra-note">로그아웃하지 않는 한 로그인 상태가 계속 유지되니<br>다른 페이지도 자유롭게 둘러보세요.</p>');

extraEl.innerHTML = extraParts.join('');