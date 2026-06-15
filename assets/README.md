# CubeTown — Pixel Asset Drop Folder

이 폴더에 PNG 도트 에셋을 드롭하면 `js/asset-loader.js` 가 자동으로 우선 사용합니다. 누락된 파일은 코드 내장 도트로 fallback 됩니다.

## 빠른 확인

1. `assets-demo.html` 을 브라우저에서 더블클릭 (file:// 동작)
2. 카드별 배지를 확인 — 🟢 `EXTERNAL` 이면 PNG 적용, 🟡 `FALLBACK` 이면 내장 도트 사용 중
3. PNG 드롭 후 페이지 새로고침 또는 우측 상단 **↻ Reload** 버튼

## 폴더 구조 + 파일명 (정확히 일치해야 함)

```
assets/
├── landmarks/
│   ├── kr.png          ← 한옥 / Korea (32×32 권장)
│   ├── jp.png          ← 토리이 / Japan
│   ├── cn.png          ← 중식 처마+홍등 / China
│   ├── tw.png          ← 야시장 / Taiwan
│   ├── us.png          ← 50s 다이너 / USA
│   ├── uk.png          ← 빅벤+전화부스 / UK
│   └── fr.png          ← 에펠+파티세리 / France
├── avatars/
│   ├── 1.png ~ 8.png   ← 12×20 권장, 8종 색상 변주 캐릭터
├── tiles/
│   ├── grass.png       ← 잔디 (16×16, 사방 이어붙이기 가능)
│   ├── road.png        ← 모래길
│   ├── cobble.png      ← 자갈도로
│   └── plaza.png       ← 광장 돌바닥
└── game/
    ├── obstacle-cactus.png  ← 미니게임 장애물 1 (16×16)
    ├── obstacle-rock.png    ← 미니게임 장애물 2 (16×16)
    └── coin.png             ← 미니게임 코인 (8×8 권장)
```

## 권장 사양

| 항목 | 사이즈 | 포맷 | 비고 |
|------|--------|------|------|
| Landmarks | **32×32 px** (또는 48×48 / 64×64 정사각형) | PNG, 투명 배경 | 자동 스케일됨. 비율은 정사각형 유지 |
| Avatars | **12×20 px** ~ 16×24 px | PNG, 투명 배경 | 정면 1프레임 OK. 4방향 시트는 추후 옵션 |
| Tiles | **16×16 px** | PNG | seamless (가장자리 자연스럽게 이어지기) 권장 |
| Game obstacles | **16×16 px** | PNG, 투명 배경 | 충돌 박스 = 그림 영역 거의 채우기 |
| Game coin | **8×8 px** (또는 16×16) | PNG, 투명 배경 | 회전 애니메이션은 코드에서 처리 |

## 사이즈가 권장값과 다를 때

- 동작은 합니다 (큐브타운/게임 캔버스가 자동 스케일)
- 단 demo 페이지에서 ⚠ `size mismatch` 경고 표시됨
- 다른 비율(예: 직사각 캐릭터) 도 받지만 일관성 유지를 위해 가능한 권장값에 맞춰주세요

## 라이선스 & 출처

- CC0 / Public Domain / CC-BY 인 에셋을 사용하세요
- 사용한 에셋의 출처(작가, 라이선스 링크)는 별도 메모해 두면 추후 `README.md` Credits 섹션에 자동 추가됩니다
- 추천 소스:
  - https://itch.io  ("pixel art topdown free" 검색)
  - https://opengameart.org
  - https://kenney.nl/assets  (대부분 CC0)
  - https://craftpix.net  (유료)

## 일부만 드롭해도 OK

22개 슬롯 모두 채울 필요 없습니다. 예시:
- 랜드마크 7개만 외부 → 아바타·타일·게임은 내장 도트 사용
- KR/JP/CN/TW 4개만 외부 → 나머지 3개국은 내장 도트 사용
- 작업 진행 중간에 부분 드롭 → 즉시 확인 가능

코드는 누락된 항목을 자동 fallback 처리하므로 어떤 조합이든 깨지지 않습니다.
