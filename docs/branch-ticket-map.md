# 브랜치-티켓 매핑

기준 날짜: `2026-03-08`

관련 문서:
- `docs/ticket-breakdown.md`
- `docs/core-feature-spec.md`
- `docs/screen-wireflow.md`

기준 커밋:
- `bc8624a` `docs: define preset-driven quick draft baseline`

## 1. 문서 목적
이 문서는 현재 생성된 디자인 실험 브랜치를 티켓 분해 문서와 연결하기 위한 매핑표다.

목표는 아래와 같다.
- 어떤 브랜치가 어떤 티켓을 실험하는지 바로 이해한다.
- 디자인 실험 브랜치와 기능 구현 브랜치를 혼동하지 않는다.
- 같은 티켓 안에서도 어떤 가설이 다른지 분리해서 본다.

## 2. 운영 원칙
### 2.1 브랜치 해석 규칙
- 브랜치 1개는 `하나의 디자인 가설`에 대응한다.
- 브랜치명 앞의 영역이 `주 실험 화면`이다.
- 브랜치명 뒤의 키워드가 `디자인 방향`이다.

### 2.2 티켓 연결 규칙
- `Primary Ticket`: 이 브랜치가 직접 실험하는 핵심 티켓
- `Secondary Ticket`: 함께 영향을 받는 인접 티켓
- `Blocked By`: 선행 구현이 없으면 실험이 어려운 티켓

### 2.3 병합 원칙
- 이 브랜치들은 기본적으로 `실험 브랜치`다.
- 바로 `main`으로 병합하지 않는다.
- 마음에 드는 결과가 나오면 해당 티켓용 `feat/...` 브랜치 또는 작업 브랜치로 필요한 부분만 가져간다.

## 3. 매핑 요약
### 3.1 랜딩 브랜치
#### `design-landing-clean-editorial`
- Primary Ticket: `T-003`
- Secondary Ticket: `T-001`
- Blocked By: `T-001`
- 실험 포인트: 클린 에디토리얼 톤의 랜딩 히어로, CTA, sample preset 소개 방식

#### `design-landing-photo-bold`
- Primary Ticket: `T-003`
- Secondary Ticket: `T-001`
- Blocked By: `T-001`
- 실험 포인트: 사진 임팩트를 크게 쓰는 랜딩 첫 화면

#### `design-landing-quiet-luxury`
- Primary Ticket: `T-003`
- Secondary Ticket: `T-001`
- Blocked By: `T-001`
- 실험 포인트: 절제된 럭셔리 톤, 여백 중심 랜딩

#### `design-landing-magazine-minimal`
- Primary Ticket: `T-003`
- Secondary Ticket: `T-001`
- Blocked By: `T-001`
- 실험 포인트: 매거진형 그리드와 편집 디자인 톤의 랜딩

### 3.2 Quick Draft 입력 브랜치
#### `design-quickdraft-minimal-input`
- Primary Ticket: `T-004`
- Secondary Ticket: `T-002`, `T-005`
- Blocked By: `T-001`, `T-002`, `T-003`
- 실험 포인트: 필드 수를 최소화한 초간단 입력 경험

#### `design-quickdraft-guided-flow`
- Primary Ticket: `T-004`
- Secondary Ticket: `T-002`, `T-005`
- Blocked By: `T-001`, `T-002`, `T-003`
- 실험 포인트: 단계 안내와 보조 문구가 있는 가이드형 입력 경험

#### `design-quickdraft-preset-first-preview`
- Primary Ticket: `T-004`
- Secondary Ticket: `T-005`, `T-006`
- Blocked By: `T-001`, `T-002`, `T-003`
- 실험 포인트: `샘플은 초안에서 바로 바꿀 수 있음`을 강하게 전달하는 입력 흐름

### 3.3 Preview / preset 전환 브랜치
#### `design-preview-preset-chips`
- Primary Ticket: `T-006`
- Secondary Ticket: `T-005`, `T-009`
- Blocked By: `T-005`
- 실험 포인트: chip 형태의 빠른 preset 전환 UI

#### `design-preview-preset-carousel`
- Primary Ticket: `T-006`
- Secondary Ticket: `T-005`, `T-009`
- Blocked By: `T-005`
- 실험 포인트: 카드형 carousel로 preset을 비교하는 UI

#### `design-preview-preset-fullscreen-picker`
- Primary Ticket: `T-006`
- Secondary Ticket: `T-005`, `T-009`
- Blocked By: `T-005`
- 실험 포인트: 전체화면 picker로 preset을 비교하는 UI

### 3.4 카드 hero 브랜치
#### `design-card-hero-clean`
- Primary Ticket: `T-008`
- Secondary Ticket: `T-006`, `T-011`
- Blocked By: `T-005`, `T-007`
- 실험 포인트: 정갈하고 절제된 `main-parallax-screen`

#### `design-card-hero-cinematic`
- Primary Ticket: `T-008`
- Secondary Ticket: `T-006`, `T-011`
- Blocked By: `T-005`, `T-007`
- 실험 포인트: 사진 몰입감이 강한 영화적 hero

#### `design-card-hero-classic`
- Primary Ticket: `T-008`
- Secondary Ticket: `T-006`, `T-011`
- Blocked By: `T-005`, `T-007`
- 실험 포인트: 클래식 웨딩 무드의 hero

### 3.5 갤러리 브랜치
#### `design-gallery-masonry`
- Primary Ticket: `T-007`
- Secondary Ticket: `T-008`
- Blocked By: `T-006`
- 실험 포인트: masonry 스타일 갤러리와 확대 모달 동선

#### `design-gallery-filmstrip`
- Primary Ticket: `T-007`
- Secondary Ticket: `T-008`
- Blocked By: `T-006`
- 실험 포인트: 필름스트립 느낌의 갤러리와 확대 모달 동선

### 3.6 에디터 브랜치
#### `design-editor-minimal`
- Primary Ticket: `T-009`
- Secondary Ticket: `T-010`
- Blocked By: `T-005`, `T-006`
- 실험 포인트: 가장 단순한 섹션 리스트 + preview 이동

#### `design-editor-bottom-sheet`
- Primary Ticket: `T-009`
- Secondary Ticket: `T-010`
- Blocked By: `T-005`, `T-006`
- 실험 포인트: 모바일 bottom sheet 중심 편집 UX

#### `design-editor-card-stack`
- Primary Ticket: `T-009`
- Secondary Ticket: `T-010`
- Blocked By: `T-005`, `T-006`
- 실험 포인트: 카드 스택 방식 섹션 편집 UX

### 3.7 preset 테마 브랜치
#### `design-preset-clean-editorial`
- Primary Ticket: `T-005`
- Secondary Ticket: `T-006`, `T-008`, `T-011`
- Blocked By: `T-001`
- 실험 포인트: clean editorial preset의 레이아웃, 카피, 타이포, 애니메이션

#### `design-preset-modern-minimal`
- Primary Ticket: `T-005`
- Secondary Ticket: `T-006`, `T-008`, `T-011`
- Blocked By: `T-001`
- 실험 포인트: modern minimal preset 패키지

#### `design-preset-romantic-story`
- Primary Ticket: `T-005`
- Secondary Ticket: `T-006`, `T-008`, `T-011`
- Blocked By: `T-001`
- 실험 포인트: romantic story preset 패키지

#### `design-preset-photo-bold`
- Primary Ticket: `T-005`
- Secondary Ticket: `T-006`, `T-008`, `T-011`
- Blocked By: `T-001`
- 실험 포인트: 사진 강조형 preset 패키지

## 4. 티켓별 연결 브랜치
### `T-003` 랜딩 최소 버전 구현
- `design-landing-clean-editorial`
- `design-landing-photo-bold`
- `design-landing-quiet-luxury`
- `design-landing-magazine-minimal`

### `T-004` Quick Draft 입력 화면 구현
- `design-quickdraft-minimal-input`
- `design-quickdraft-guided-flow`
- `design-quickdraft-preset-first-preview`

### `T-005` Quick Draft 생성 API 및 추천 preset 적용
- `design-preset-clean-editorial`
- `design-preset-modern-minimal`
- `design-preset-romantic-story`
- `design-preset-photo-bold`

### `T-006` draft 미리보기 및 sample preset 전환 구현
- `design-preview-preset-chips`
- `design-preview-preset-carousel`
- `design-preview-preset-fullscreen-picker`

### `T-007` 갤러리 섹션 및 확대 모달 구현
- `design-gallery-masonry`
- `design-gallery-filmstrip`

### `T-008` 공개 카드 뷰어 기본 완성
- `design-card-hero-clean`
- `design-card-hero-cinematic`
- `design-card-hero-classic`

### `T-009` 에디터 홈 및 카드 기본 수정 구현
- `design-editor-minimal`
- `design-editor-bottom-sheet`
- `design-editor-card-stack`

## 5. 추천 사용 방식
### 5.1 가장 안전한 방식
1. `main`에서 기능 뼈대를 만든다.
2. 실험하고 싶은 티켓에 맞는 `design-*` 브랜치로 체크아웃한다.
3. 디자인 시안을 만든다.
4. 비교 후 가장 좋은 안만 기능 브랜치로 가져간다.

### 5.2 비교하기 좋은 묶음
- 랜딩 비교:
`design-landing-clean-editorial`
`design-landing-photo-bold`
`design-landing-quiet-luxury`
`design-landing-magazine-minimal`

- Quick Draft 입력 비교:
`design-quickdraft-minimal-input`
`design-quickdraft-guided-flow`
`design-quickdraft-preset-first-preview`

- preset 전환 비교:
`design-preview-preset-chips`
`design-preview-preset-carousel`
`design-preview-preset-fullscreen-picker`

- hero 비교:
`design-card-hero-clean`
`design-card-hero-cinematic`
`design-card-hero-classic`

### 5.3 merge 단위 추천
- 랜딩 브랜치끼리는 서로 섞지 말고 하나만 채택
- Quick Draft 입력 브랜치도 하나만 채택
- preview preset 전환 브랜치도 하나만 채택
- preset 테마 브랜치는 여러 개를 병행 채택 가능

## 6. 아직 브랜치가 없는 티켓
아래 티켓은 현재 별도 디자인 실험 브랜치를 만들지 않았다.

- `T-001`: 구조 / 타입 / 상태 계약 중심이라 디자인 브랜치보다 기능 브랜치가 적합
- `T-002`: 업로드 API 중심이라 디자인 브랜치보다 기능 브랜치가 적합
- `T-010`: 섹션 편집 규칙은 `T-009` 에디터 브랜치에 흡수 가능
- `T-011`: 발행/공유는 기능 완성 후 필요한 디자인 조정이 적음
- `T-012`: RSVP는 기능 우선
- `T-013`: 방명록 / 계좌 복사는 기능 우선
- `T-014`: 이벤트 / 통계는 기능 우선
- `T-015`: QA 단계라 실험 브랜치 대상이 아님

이 티켓들은 지금 단계에서 굳이 디자인 실험 브랜치로 세분화하지 않아도 된다.
