const canvas = document.getElementById('game'), ctx = canvas.getContext('2d');
const mini = document.getElementById('mini'), mctx = mini.getContext('2d');
const VIEW_W = canvas.width, VIEW_H = canvas.height;

// 입력 이벤트 제어 상태 스토리지
const keys = {};
let currentUser = 'testuser', isAdmin = false, cubes = 12800, authStatus = '미인증', frame = 0;
let cam = { x: 0, y: 0 };

// 1. 시스템 계정 및 인증 UI 핸들링 함수
function fillLogin(id) {
    document.getElementById('loginId').value = id;
    document.getElementById('loginPw').value = 'demo1234';
}

function login() {
    const id = document.getElementById('loginId').value.trim();
    const pw = document.getElementById('loginPw').value.trim();
    if (!['testuser', 'admin'].includes(id) || pw !== 'demo1234') {
        toast('아이디 또는 비밀번호가 맞지 않습니다.');
        return;
    }
    currentUser = id;
    isAdmin = id === 'admin';
    authStatus = isAdmin ? '운영자' : '미인증';
    document.getElementById('hudUser').textContent = id;
    document.getElementById('hudAuth').textContent = authStatus;
    document.getElementById('login').style.display = 'none';
}

function updateHud() {
    document.getElementById('hudCube').textContent = Number(cubes).toLocaleString('ko-KR') + ' Cube';
    document.getElementById('hudAuth').textContent = authStatus;
}

function toast(msg) {
    const t = document.getElementById('toast');
    t.textContent = msg;
    t.style.display = 'block';
    setTimeout(() => t.style.display = 'none', 2600);
}

// 2. 근접 사물 인식 스크립트
function getNearObject() {
    const cx = player.x + player.w / 2, cy = player.y + player.h / 2;
    for (const o of [...buildings, ...shops, ...stalls]) {
        const ox = o.x + (o.w || 90) / 2, oy = o.y + (o.h || 48) / 2;
        if (Math.hypot(cx - ox, cy - oy) < 96) return o;
    }
    return null;
}

// 3. 실시간 프레임 동적 갱신
function update() {
    let dx = 0, dy = 0;
    if (keys.ArrowUp || keys.w) dy -= player.speed;
    if (keys.ArrowDown || keys.s) dy += player.speed;
    if (keys.ArrowLeft || keys.a) dx -= player.speed;
    if (keys.ArrowRight || keys.d) dx += player.speed;
    
    if (dx || dy) {
        if (!collides(player.x + dx, player.y)) player.x += dx;
        if (!collides(player.x, player.y + dy)) player.y += dy;
        player.step++;
    }
    
    // 카메라 위치 바운딩 세팅
    cam.x = Math.max(0, Math.min(WORLD_W - VIEW_W, player.x + player.w / 2 - VIEW_W / 2));
    cam.y = Math.max(0, Math.min(WORLD_H - VIEW_H, player.y + player.h / 2 - VIEW_H / 2));
    
    const near = getNearObject();
    const hint = document.getElementById('hint');
    if (near) {
        hint.textContent = near.name + ' : Enter 또는 클릭';
        hint.style.display = 'block';
    } else hint.style.display = 'none';
}

// 4. 월드 드로잉 로직 함수군
function drawWorld() {
    ctx.fillStyle = '#87cf77';
    ctx.fillRect(0, 0, VIEW_W, VIEW_H);
    ctx.save();
    ctx.translate(-cam.x, -cam.y);
    
    // 기본 격자 타일 그리기
    for (let x = 0; x < WORLD_W; x += 60) {
        for (let y = 0; y < WORLD_H; y += 60) {
            if ((x + y) % 120 === 0) {
                ctx.fillStyle = 'rgba(255,255,255,.09)';
                ctx.fillRect(x + 20, y + 20, 9, 9);
            }
        }
    }
    // 도선 도로 영역 렌더링
    roundRect(ctx, 1200, 0, 120, WORLD_H, 25, '#d8c39a');
    roundRect(ctx, 0, 880, WORLD_W, 110, 25, '#d8c39a');
    roundRect(ctx, 600, 500, 1380, 120, 25, '#d8c39a');
    roundRect(ctx, 340, 380, 120, 960, 25, '#d8c39a');
    
    // 각 구역 구획선 그리기
    zones.forEach(z => {
        roundRect(ctx, z.x, z.y, z.w, z.h, 26, z.color, 'rgba(255,255,255,.2)');
        ctx.fillStyle = 'rgba(15,23,42,.65)';
        ctx.font = 'bold 20px sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText(z.name, z.x + 22, z.y + 34);
    });
    
    drawBillboard();
    buildings.forEach(drawBuilding);
    shops.forEach(drawShop);
    stalls.forEach(drawStall);
    updateAndDrawNpcs(ctx, frame);
    drawPlayer(ctx);
    ctx.restore();
}

function drawBillboard() {
    roundRect(ctx, 1040, 420, 450, 62, 14, 'rgba(17,24,39,.88)', '#334155');
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 17px sans-serif';
    ctx.textAlign = 'center';
    const msg = frame % 360 < 120 ? '인기 공간 TOP 1  서울 산책' : frame % 360 < 240 ? '한국여행센터 공식 링크 업데이트' : '신규 이용자 인증 기능 오픈';
    ctx.fillText(msg, 1265, 458);
}

function drawBuilding(b) {
    roundRect(ctx, b.x + 8, b.y + 10, b.w, b.h, 18, 'rgba(0,0,0,.17)');
    roundRect(ctx, b.x, b.y, b.w, b.h, 18, b.color, 'rgba(30,41,59,.45)');
    roundRect(ctx, b.x + 14, b.y + 12, b.w - 28, 30, 10, 'rgba(255,255,255,.22)');
    roundRect(ctx, b.x + b.w / 2 - 26, b.y + b.h - 48, 52, 48, 10, '#374151');
    roundRect(ctx, b.x + 24, b.y + 58, 42, 32, 8, 'rgba(255,255,255,.7)');
    roundRect(ctx, b.x + b.w - 66, b.y + 58, 42, 32, 8, 'rgba(255,255,255,.7)');
    ctx.fillStyle = '#fff'; ctx.font = 'bold 18px sans-serif'; ctx.textAlign = 'center';
    ctx.fillText(b.icon, b.x + b.w / 2, b.y + 38);
    ctx.fillText(b.name, b.x + b.w / 2, b.y + b.h + 28);
    ctx.font = '12px sans-serif'; ctx.fillStyle = 'rgba(255,255,255,.93)';
    ctx.fillText(b.desc, b.x + b.w / 2, b.y + b.h + 47);
}

function drawShop(s) {
    roundRect(ctx, s.x + 5, s.y + 7, s.w, s.w, 14, 'rgba(0,0,0,.16)');
    roundRect(ctx, s.x, s.y, s.w, s.w, 14, s.color, 'rgba(30,41,59,.45)');
    roundRect(ctx, s.x + 14, s.y + 16, s.w - 28, 22, 8, 'rgba(255,255,255,.8)');
    ctx.fillStyle = '#fff'; ctx.font = 'bold 12px sans-serif'; ctx.textAlign = 'center';
    ctx.fillText(s.name, s.x + s.w / 2, s.y + s.w + 20);
}

function drawStall(s) {
    roundRect(ctx, s.x, s.y, 90, 48, 8, '#7c2d12', '#431407');
    roundRect(ctx, s.x + 7, s.y - 20, 76, 24, 7, '#fef3c7', '#92400e');
    ctx.fillStyle = '#7c2d12'; ctx.font = 'bold 10px sans-serif'; ctx.textAlign = 'center';
    ctx.fillText(s.name, s.x + 45, s.y - 4);
    ctx.fillStyle = '#fff'; ctx.font = '10px sans-serif';
    ctx.fillText(s.text, s.x + 45, s.y + 70);
}

// 5. 미니맵 시스템
function drawMiniMap() {
    mctx.clearRect(0, 0, 170, 96);
    mctx.fillStyle = 'rgba(135,207,119,.45)';
    mctx.fillRect(0, 0, 170, 96);
    const mx = x => x / WORLD_W * 170, my = y => y / WORLD_H * 96;
    mctx.fillStyle = 'rgba(255,255,255,.2)';
    zones.forEach(z => mctx.fillRect(mx(z.x), my(z.y), z.w / WORLD_W * 170, z.h / WORLD_H * 96));
    mctx.fillStyle = '#0ea5e9';
    buildings.forEach(b => mctx.fillRect(mx(b.x), my(b.y), 4, 4));
    mctx.fillStyle = '#fff'; mctx.beginPath(); mctx.arc(mx(player.x), my(player.y), 4, 0, Math.PI * 2); mctx.fill();
    mctx.strokeStyle = 'rgba(255,255,255,.7)'; mctx.strokeRect(mx(cam.x), my(cam.y), VIEW_W / WORLD_W * 170, VIEW_H / WORLD_H * 96);
}

// 6. 메인 핵심 무한루프 및 채팅 사이클 생성
function loop() {
    frame++;
    update();
    drawWorld();
    drawMiniMap();
    if (frame % 90 === 0) renderChat();
    requestAnimationFrame(loop);
}

function renderChat() {
    document.getElementById('chatLines').innerHTML = [...npcs].sort(() => Math.random() - .5).slice(0, 5).map(n => `<p><b>${n.name}</b> : ${n.line}</p>`).join('');
}

// 7. 인터랙션에 따른 동적 모달 마크업 매핑 및 팝업 이벤트
function openObj(id) {
    const o = [...buildings, ...shops, ...stalls].find(x => x.id === id);
    if (!o) return;
    document.getElementById('modalTitle').textContent = o.name;
    document.getElementById('modalBody').innerHTML = contentFor(o);
    document.getElementById('modalBg').style.display = 'flex';
}

function closeModal() { document.getElementById('modalBg').style.display = 'none'; }
function bgClose(e) { if (e.target.id === 'modalBg') closeModal(); }
function badge(t, cls = '') { return `<span class="badge ${cls}">${t}</span>`; }

function readyPopup(type = '인증') {
    const map = {
        인증: '인증받지 않은 이용자입니다. 해당 기능은 인증 완료 후 이용 가능합니다.',
        공간: '개인 공간 개설은 인증 이용자만 가능합니다. 인증 완료 후 이용해 주세요.',
        아이템: '아이템 구매는 인증 이용자만 가능합니다.',
        친구: '친구 기능은 인증 이용자만 사용할 수 있습니다.',
        노점: '노점 개설은 인증 이용자만 가능합니다.',
        큐브: 'Cube 기능은 정식 서비스 오픈 후 제공됩니다.',
        이벤트: '현재 참가 신청 기간이 아닙니다. 다음 이벤트 일정을 확인해 주세요.',
        운영: '운영자 전용 메뉴입니다.'
    };
    toast(map[type] || map.인증);
}

function contentFor(o) {
    if (o.id === 'travel') return `<div class="grid cols2"><div class="card soft"><h3>한국여행센터</h3><p class="muted">CubeTown에서 실제로 이용 가능한 콘텐츠 공간입니다. 쿠폰을 직접 배포하지 않고 공식 사이트로 연결합니다.</p><div class="num">공식 링크 제공</div></div><div class="card"><h3>여행 스타터팩</h3><p class="muted">한국 쇼핑, 교통, 결제, 여행 준비 정보를 한곳에서 확인할 수 있도록 구성합니다.</p></div></div><div style="height:14px"></div><div class="grid cols3"><div class="card soft"><h3>올리브영 글로벌</h3><p class="muted">한국 쇼핑 및 K-뷰티 정보 확인</p><a class="btn green" target="_blank" rel="noopener noreferrer" href="https://global.oliveyoung.com/">공식 사이트 열기</a></div><div class="card soft"><h3>WOWPASS</h3><p class="muted">한국 여행자용 결제·교통·환전 서비스</p><a class="btn" target="_blank" rel="noopener noreferrer" href="https://www.wowpass.io/ja">공식 사이트 열기</a></div><div class="card soft"><h3>한국여행 가이드</h3><p class="muted">eSIM, 교통, 쇼핑, 맛집 정보</p><button class="btn secondary" onclick="readyPopup('인증')">인증 후 이용</button></div></div><div style="height:14px"></div><table><thead><tr><th>카테고리</th><th>내용</th><th>상태</th></tr></thead><tbody><tr><td>쇼핑</td><td>올리브영 공식 사이트 연결</td><td>${badge('이용가능', 'ok')}</td></tr><tr><td>여행편의</td><td>WOWPASS 공식 사이트 연결</td><td>${badge('이용가능', 'ok')}</td></tr><tr><td>여행가이드</td><td>한국여행 체크리스트</td><td>${badge('인증 필요', 'lock')}</td></tr></tbody></table>`;
    if (o.type === 'shop') return `<div class="grid cols2"><div class="card soft"><h3>${o.name}</h3><p class="muted">이용자 개인 공간입니다. 소개글, 콘텐츠, 이미지, 링크를 전시할 수 있는 공간으로 확장됩니다.</p><div class="num">${o.shout}</div></div><div class="card"><h3>공간 정보</h3><p class="muted">방문자 128명 / 좋아요 34개 / 즐겨찾기 18명</p><button class="btn secondary" onclick="readyPopup('공간')">공간 관리</button> <button class="btn" onclick="showProfile('${o.name}')">프로필 보기</button></div></div>`;
    if (o.type === 'stall') return `<div class="card soft"><h3>${o.name}</h3><p class="muted">노점 형태로 이용자가 마을에 캐릭터를 세워두고 자신의 공간을 홍보하는 기능입니다.</p><div class="num">${o.text}</div></div><div class="card" style="margin-top:14px"><button class="btn secondary" onclick="readyPopup('노점')">노점 상세 관리</button> <button class="btn" onclick="readyPopup('친구')">문의하기</button></div>`;
    if (o.id === 'itemshop') return `<div class="grid cols3">${[['캐릭터 의상', '500 Cube', '상의, 하의, 신발, 액세서리'], ['개인 공간 스킨', '3,000 Cube', '나만의 공간 꾸미기'], ['노점 개설권', '1,000 Cube', '마을에 캐릭터를 세워 홍보'], ['간판 스킨', '800 Cube', '공간 간판 꾸미기'], ['프리미엄 공간 외형', '5,000 Cube', '고급 공간 디자인'], ['특수 이펙트', '700 Cube', '캐릭터 주변 효과']].map(i => `<div class="card soft"><h3>${i[0]}</h3><p class="muted">${i[2]}</p><div class="num">${i[1]}</div><button class="btn secondary" onclick="readyPopup('아이템')">구매하기</button></div>`).join('')}</div>`;
    if (o.id === 'board') return `<div class="card soft"><h3>CubeTown 게시판</h3><p class="muted">공지사항, 이벤트, 추천 공간, 한국여행센터 업데이트를 확인할 수 있습니다.</p></div><div style="height:14px"></div><table><thead><tr><th>구분</th><th>제목</th><th>상태</th></tr></thead><tbody>${logs.map(l => `<tr><td>${l.type}</td><td>${l.title}</td><td>${badge(l.status, l.status === '이용가능' || l.status === '진행중' ? 'ok' : 'warn')}</td></tr>`).join('')}</tbody></table>`;
    if (o.id === 'auth') return `<div class="grid cols2"><div class="card soft"><p class="muted">현재 인증 상태</p><div class="num">${authStatus}</div></div><div class="card soft"><p class="muted">기본 이용 가능 기능</p><div class="num" style="font-size:18px">마을 이동 / 한국여행센터 / 게시판 열람</div></div></div><div class="card" style="margin-top:14px"><h3>인증 안내</h3><p class="muted">개인 공간 운영, 노점 설치, 친구 기능, 아이템 구매 등은 인증 이용자만 사용할 수 있습니다.</p><button class="btn" onclick="readyPopup('인증')">인증 신청</button></div>`;
    if (o.id === 'admin') return isAdmin ? `<div class="grid cols4"><div class="card soft"><p class="muted">등록 유저</p><div class="num">1,284명</div></div><div class="card soft"><p class="muted">개인 공간</p><div class="num">214개</div></div><div class="card soft"><p class="muted">노점</p><div class="num">88개</div></div><div class="card soft"><p class="muted">신고 대기</p><div class="num">3건</div></div></div><div class="card" style="margin-top:14px"><h3>운영 기능</h3><p class="muted">유저 상태, 공간 신청, 노점 신청, 게시판, 신고 내역, 한국여행센터 링크 등을 관리합니다.</p><button class="btn secondary" onclick="toast('회원 관리 화면으로 이동합니다.')">회원 관리</button> <button class="btn secondary" onclick="toast('콘텐츠 관리 화면으로 이동합니다.')">콘텐츠 관리</button></div>` : `<div class="card soft"><h3>운영자 전용 구역</h3><p class="muted">권한이 있는 계정으로 로그인해주세요.</p><button class="btn danger" onclick="readyPopup('운영')">접근 제한</button></div>`;
    if (o.id === 'mypage') return `<div class="grid cols3"><div class="card soft"><p class="muted">아이디</p><div class="num" style="font-size:20px">${currentUser}</div></div><div class="card soft"><p class="muted">보유 큐브</p><div class="num">${Number(cubes).toLocaleString('ko-KR')} Cube</div></div><div class="card soft"><p class="muted">인증상태</p><div class="num" style="font-size:20px">${authStatus}</div></div></div><div class="card" style="margin-top:14px"><h3>캐릭터 꾸미기</h3><p class="muted">얼굴, 헤어, 의상, 액세서리, 이펙트를 변경하는 기능입니다.</p><button class="btn purple" onclick="changeAvatar()">베타 꾸미기 적용</button> <button class="btn secondary" onclick="readyPopup('아이템')">상세 편집</button></div><div class="card" style="margin-top:14px"><h3>내 공간 / 내 노점</h3><p class="muted">내가 만든 공간과 노점을 관리하는 영역입니다.</p><button class="btn secondary" onclick="readyPopup('공간')">공간 만들기</button> <button class="btn secondary" onclick="readyPopup('노점')">노점 설치</button></div>`;
    if (o.id === 'event') return `<div class="grid cols2"><div class="card soft"><h3>이벤트 광장</h3><p class="muted">시즌 이벤트, 아바타 콘테스트, 공간 랭킹, 출석 이벤트 등을 운영할 수 있는 공간입니다.</p><button class="btn" onclick="readyPopup('이벤트')">참가 신청</button></div><div class="card soft"><h3>인기 공간 랭킹</h3><table><tbody><tr><td>1</td><td>서울 산책</td></tr><tr><td>2</td><td>K-뷰티 노트</td></tr><tr><td>3</td><td>Cube Studio</td></tr></tbody></table></div></div>`;
    return '';
}

function showProfile(name) {
    document.getElementById('modalTitle').textContent = name + ' 프로필';
    document.getElementById('modalBody').innerHTML = `<div class="grid cols2"><div class="card soft"><h3>${name}</h3><p class="muted">한국 여행과 디지털 콘텐츠에 관심이 있는 이용자입니다.</p><div class="num">친구 54명</div></div><div class="card"><h3>최근 활동</h3><p class="muted">공간 방문 / 게시판 열람 / 한국여행센터 확인</p><button class="btn secondary" onclick="readyPopup('친구')">친구 신청</button></div></div>`;
}

function changeAvatar() {
    const colors = ['#2563eb', '#7c3aed', '#16a34a', '#ec4899', '#f97316'];
    const hairs = ['#111827', '#7c2d12', '#f59e0b', '#374151'];
    player.color = colors[Math.floor(Math.random() * colors.length)];
    player.hair = hairs[Math.floor(Math.random() * hairs.length)];
    cubes = Math.max(0, cubes - 50);
    updateHud();
    toast('캐릭터 외형이 변경되었습니다. Cube 기능은 정식 서비스 오픈 후 제공됩니다.');
}

// 8. 전역 스코프 및 윈도우 스크립트 연결
window.closeModal = closeModal;
window.bgClose = bgClose;
window.readyPopup = readyPopup;
window.changeAvatar = changeAvatar;
window.showProfile = showProfile;
window.fillLogin = fillLogin;
window.login = login;

// 키보드 방향키 이동 이벤트 리스너 등록
window.addEventListener('keydown', e => {
    keys[e.key] = true;
    if (e.key === 'Enter') {
        const o = getNearObject();
        if (o) openObj(o.id);
    }
});
window.addEventListener('keyup', e => keys[e.key] = false);

// 캔버스 마우스 클릭 상호작용 리스너 등록
canvas.addEventListener('click', e => {
    const r = canvas.getBoundingClientRect();
    const x = (e.clientX - r.left) * (canvas.width / r.width) + cam.x;
    const y = (e.clientY - r.top) * (canvas.height / r.height) + cam.y;
    
    for (const o of [...buildings, ...shops, ...stalls]) {
        const ow = o.w || 90, oh = o.h || 48;
        if (x >= o.x && x <= o.x + ow && y >= o.y - 25 && y <= o.y + oh + 80) {
            openObj(o.id);
            return;
        }
    }
    const near = getNearObject();
    if (near) openObj(near.id);
});

// 초기화 호출 및 무한루프 엔진 작동
updateHud();
renderChat();
loop();