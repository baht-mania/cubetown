// 월드 세팅 상숫값
const WORLD_W = 2600;
const WORLD_H = 1800;

// 구역 데이터
const zones = [
    { name: '한국여행존', x: 130, y: 130, w: 520, h: 360, color: 'rgba(14,165,233,.12)' },
    { name: '중앙광장', x: 780, y: 190, w: 1020, h: 390, color: 'rgba(231,212,170,.55)' },
    { name: '개인공간거리', x: 610, y: 590, w: 1330, h: 260, color: 'rgba(255,255,255,.10)' },
    { name: '노점거리', x: 610, y: 980, w: 1330, h: 210, color: 'rgba(124,45,18,.10)' },
    { name: '이벤트구역', x: 980, y: 1240, w: 520, h: 310, color: 'rgba(236,72,153,.12)' },
    { name: '운영구역', x: 2030, y: 1140, w: 460, h: 350, color: 'rgba(239,68,68,.12)' }
];

// 랜드마크 빌딩 데이터
const buildings = [
    { id: 'travel', type: 'building', name: '한국여행센터', x: 260, y: 220, w: 260, h: 160, color: '#0ea5e9', icon: 'KOREA', desc: '쿠폰·여행정보·공식링크', zone: '한국여행존' },
    { id: 'itemshop', type: 'building', name: '아이템샵', x: 1100, y: 240, w: 220, h: 145, color: '#f59e0b', icon: 'SHOP', desc: '아바타·공간 꾸미기', zone: '중앙광장' },
    { id: 'board', type: 'building', name: '게시판', x: 1450, y: 245, w: 210, h: 140, color: '#8b5cf6', icon: 'BOARD', desc: '공지·이벤트', zone: '중앙광장' },
    { id: 'auth', type: 'building', name: '인증센터', x: 1910, y: 260, w: 220, h: 145, color: '#10b981', icon: 'AUTH', desc: '이용자 인증', zone: '인증구역' },
    { id: 'admin', type: 'building', name: '운영센터', x: 2140, y: 1230, w: 240, h: 160, color: '#ef4444', icon: 'ADMIN', desc: '운영자 전용', zone: '운영구역' },
    { id: 'mypage', type: 'building', name: '마이페이지', x: 300, y: 1280, w: 220, h: 150, color: '#38bdf8', icon: 'MY', desc: '캐릭터·큐브·내 공간', zone: '개인구역' },
    { id: 'event', type: 'building', name: '이벤트 광장', x: 1110, y: 1320, w: 250, h: 160, color: '#ec4899', icon: 'EVENT', desc: '이벤트·랭킹', zone: '이벤트구역' }
];

// 개인 상점 데이터
const shops = [
    { id: 'shop1', type: 'shop', name: '루나의 공간', x: 690, y: 650, w: 100, h: 100, color: '#f97316', shout: '신규 공간 오픈!' },
    { id: 'shop2', type: 'shop', name: '픽셀 스튜디오', x: 840, y: 650, w: 100, h: 100, color: '#22c55e', shout: '콘텐츠 전시중!' },
    { id: 'shop3', type: 'shop', name: 'K-뷰티 노트', x: 990, y: 650, w: 100, h: 100, color: '#a855f7', shout: '한국 쇼핑 정보!' },
    { id: 'shop4', type: 'shop', name: '서울 산책', x: 1140, y: 650, w: 100, h: 100, color: '#06b6d4', shout: '성수동 코스 공개!' },
    { id: 'shop5', type: 'shop', name: 'Cube Studio', x: 1290, y: 650, w: 100, h: 100, color: '#f43f5e', shout: '오늘의 추천 공간!' },
    { id: 'shop6', type: 'shop', name: 'K-POP 라운지', x: 1440, y: 650, w: 100, h: 100, color: '#6366f1', shout: '공연 정보 모음!' },
    { id: 'shop7', type: 'shop', name: '명동 쇼핑노트', x: 1590, y: 650, w: 100, h: 100, color: '#14b8a6', shout: '쇼핑코스 공개!' },
    { id: 'shop8', type: 'shop', name: '홍대 플레이스', x: 1740, y: 650, w: 100, h: 100, color: '#e11d48', shout: '카페 정보 모음!' }
];

// 노점 데이터
const stalls = [
    { id: 'stall1', type: 'stall', name: '민수의 노점', x: 670, y: 1040, text: '추천 콘텐츠 확인!' },
    { id: 'stall2', type: 'stall', name: '하나의 노점', x: 830, y: 1040, text: '한국 여행 쿠폰 모음!' },
    { id: 'stall3', type: 'stall', name: '타로의 노점', x: 990, y: 1040, text: '오늘의 여행 팁!' },
    { id: 'stall4', type: 'stall', name: '유나의 노점', x: 1150, y: 1040, text: 'K-뷰티 정보!' },
    { id: 'stall5', type: 'stall', name: 'Cube 안내소', x: 1310, y: 1040, text: '한국여행센터 오픈!' },
    { id: 'stall6', type: 'stall', name: '서울 가이드', x: 1470, y: 1040, text: '명동 쇼핑 코스!' },
    { id: 'stall7', type: 'stall', name: '성수 노트', x: 1630, y: 1040, text: '성수동 추천!' },
    { id: 'stall8', type: 'stall', name: 'WOW 안내', x: 1790, y: 1040, text: '여행카드 확인!' }
];

// 게시판 데이터 로그
let logs = [
    { type: '공지', title: 'CubeTown 서비스 업데이트 안내', status: '진행중' },
    { type: '한국여행센터', title: '올리브영 글로벌 공식 링크 연결', status: '이용가능' },
    { type: '한국여행센터', title: 'WOWPASS 공식 링크 연결', status: '이용가능' },
    { type: '이벤트', title: '아바타 콘테스트 참가 신청 예정', status: '일정공개예정' }
];

// NPC 풀 생성 데이터 및 풀 빌딩
const names = ['루나', '민수', '하나', '타로', '지우', '사토', '유나', '카즈', '미나', '렌', '나오', '하루', '소라', '유키', '리쿠', '아오이', '진', '케이', '마리', '노아', '리나', '현우', '서아', '도윤', '가이드', '미오', '아키', '하린', '소윤', '준'];
const lines = ['한국여행센터가 오픈했어요!', '올리브영 공식 링크를 확인하세요!', 'WOWPASS 정보도 있어요!', '개인 공간 기능은 인증 후 이용 가능합니다.', 'CubeTown에 오신 것을 환영합니다!', '오늘의 추천 공간을 확인해보세요!', '이벤트 광장도 둘러보세요!', 'K-뷰티 노트를 방문해보세요!', '성수동 코스가 인기예요!', '노점거리에서 만나요!'];

let npcs = [];
for (let i = 0; i < 46; i++) {
    npcs.push({
        name: names[i % names.length],
        x: 520 + Math.random() * 1550,
        y: 420 + Math.random() * 850,
        tx: 520 + Math.random() * 1550,
        ty: 420 + Math.random() * 850,
        color: ['#f97316', '#22c55e', '#ec4899', '#8b5cf6', '#06b6d4', '#ef4444', '#2563eb'][i % 7],
        line: lines[i % lines.length]
    });
}