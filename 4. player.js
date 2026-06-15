// 플레이어 정보 구조체
const player = {
    x: 1280,
    y: 900,
    w: 30,
    h: 40,
    speed: 5,
    step: 0,
    color: '#2563eb',
    hair: '#111827',
    name: '나'
};

// 상자 기반 충돌 검사 알고리즘
function collides(nx, ny) {
    const r = { x: nx, y: ny, w: player.w, h: player.h };
    
    // 빌딩들과 충돌 판단
    for (const b of buildings) {
        if (r.x < b.x + b.w && r.x + r.w > b.x && r.y < b.y + b.h && r.y + r.h > b.y) return true;
    }
    // 상점들과 충돌 판단
    for (const s of shops) {
        if (r.x < s.x + s.w && r.x + r.w > s.x && r.y < s.y + s.w && r.y + r.h > s.y) return true;
    }
    // 월드 밖 이탈 판단
    return nx < 0 || ny < 0 || nx + player.w > WORLD_W || ny + player.h > WORLD_H;
}

// 플레이어 캐릭터 렌더링 함수
function drawPlayer(ctx) {
    const x = player.x;
    const y = player.y;
    const bob = Math.sin(player.step / 6) * 2;
    
    // 그림자
    ctx.fillStyle = 'rgba(0,0,0,.25)';
    ctx.beginPath();
    ctx.ellipse(x + 15, y + 38, 22, 8, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // 다리 움직임 애니메이션 효과
    ctx.strokeStyle = '#172033';
    ctx.lineWidth = 5;
    ctx.lineCap = 'round';
    const swing = Math.sin(player.step / 5) * 4;
    ctx.beginPath(); ctx.moveTo(x + 11, y + 25); ctx.lineTo(x + 8 + swing, y + 39); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(x + 20, y + 25); ctx.lineTo(x + 23 - swing, y + 39); ctx.stroke();
    
    // 몸통 및 머리
    roundRect(ctx, x + 5, y + 12 + bob, 20, 24, 8, player.color, '#172033');
    ctx.fillStyle = '#ffd7b5';
    ctx.beginPath();
    ctx.arc(x + 15, y + 7 + bob, 12, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#172033';
    ctx.lineWidth = 3;
    ctx.stroke();
    
    // 머리카락
    ctx.fillStyle = player.hair;
    ctx.beginPath();
    ctx.arc(x + 15, y + 2 + bob, 10, Math.PI, Math.PI * 2);
    ctx.fill();
    
    // 이름표
    ctx.fillStyle = '#111827';
    ctx.font = 'bold 11px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(player.name, x + 15, y + 58);
}

// NPC AI 및 렌더링 로직
function updateAndDrawNpcs(ctx, frame) {
    npcs.forEach(n => {
        // 랜덤 목적지 갱신 로직
        if (Math.hypot(n.x - n.tx, n.y - n.ty) < 3) {
            n.tx = 480 + Math.random() * 1600;
            n.ty = 390 + Math.random() * 850;
        }
        // 목적지를 행해 선형 보간 이동
        n.x += (n.tx - n.x) * 0.005;
        n.y += (n.ty - n.y) * 0.005;

        const bob = Math.sin((frame + n.x) / 18) * 2;
        ctx.fillStyle = 'rgba(0,0,0,.22)';
        ctx.beginPath();
        ctx.ellipse(n.x, n.y + 22, 18, 7, 0, 0, Math.PI * 2);
        ctx.fill();
        
        roundRect(ctx, n.x - 10, n.y - 2 + bob, 20, 24, 8, n.color, '#172033');
        ctx.fillStyle = '#ffd7b5';
        ctx.beginPath();
        ctx.arc(n.x, n.y - 11 + bob, 11, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#172033';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        ctx.fillStyle = '#111827';
        ctx.font = 'bold 11px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(n.name, n.x, n.y + 40);
        
        // NPC 말풍선 로직
        if ((frame + Math.floor(n.x)) % 360 < 80) {
            const tw = Math.min(210, Math.max(115, n.line.length * 9));
            roundRect(ctx, n.x - tw / 2, n.y - 62, tw, 28, 14, 'rgba(255,255,255,.94)');
            ctx.fillStyle = '#111827';
            ctx.font = '11px sans-serif';
            ctx.fillText(n.line, n.x, n.y - 44);
        }
    });
}

// Helper 함수: 둥근 사각형 그리기
function roundRect(ctx, x, y, w, h, r, fill, stroke) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    if (fill) {
        ctx.fillStyle = fill;
        ctx.fill();
    }
    if (stroke) {
        ctx.strokeStyle = stroke;
        ctx.lineWidth = 3;
        ctx.stroke();
    }
}