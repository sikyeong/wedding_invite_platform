# API 명세서

기준 날짜: `2026-03-08`

관련 문서:
- `docs/core-feature-spec.md`

## 1. 문서 목적
이 문서는 모바일 청첩장 서비스 P0 구현을 위한 서버 API 계약 초안이다.

목표는 아래와 같다.
- Quick Draft를 가장 짧은 입력 흐름으로 생성한다.
- Quick Draft 생성 시 추천 preset을 자동 적용한다.
- 첫 미리보기 이후 sample preset 전환을 지원한다.
- draft / published 상태를 명확히 분리한다.
- 공개 카드와 편집용 API를 분리한다.
- RSVP, 방명록, 계좌 복사, 공유, 통계까지 P0 범위를 서버에서 일관되게 지원한다.

## 2. 기본 원칙
### 2.1 API 분리 원칙
- 공개 카드 조회 API와 편집 API를 분리한다.
- 공개 카드 조회는 소유자 token 없이 접근 가능해야 한다.
- draft 카드 조회 및 편집은 소유자 token이 있어야 한다.

### 2.2 인증 원칙
- 카드 소유자 인증은 `x-card-token` 헤더를 사용한다.
- draft 미리보기, 카드 수정, 발행, 통계 조회는 `x-card-token`이 필요하다.
- 공개 카드 조회, RSVP 작성, 방명록 작성은 토큰 없이 가능하다.

### 2.3 응답 원칙
- 모든 JSON 응답은 일관된 envelope를 사용한다.
- 성공 응답은 `data`를 포함한다.
- 실패 응답은 `error.code`, `error.message`를 포함한다.

성공 예시:
```json
{
  "data": {
    "card": {
      "id": "card_123"
    }
  }
}
```

실패 예시:
```json
{
  "error": {
    "code": "GALLERY_LIMIT_EXCEEDED",
    "message": "갤러리 사진은 최대 40장까지 업로드할 수 있어요."
  }
}
```

## 3. 공통 데이터 모델
### 3.1 Card
```json
{
  "id": "card_123",
  "status": "draft",
  "slug": null,
  "ownerToken": "owner_xxx",
  "presetId": "preset_clean_editorial",
  "presetVersion": "2026-03-08",
  "presetSource": "recommended",
  "presetOverrides": {
    "styleTokens": {},
    "animation": {},
    "music": {},
    "sections": {}
  },
  "groomName": "민준",
  "brideName": "서연",
  "mainImage": {
    "id": "img_main_1",
    "url": "https://cdn.example.com/cards/card_123/main.jpg",
    "width": 1200,
    "height": 1800
  },
  "middleImage": {
    "id": "img_mid_1",
    "url": "https://cdn.example.com/cards/card_123/middle.jpg",
    "width": 1200,
    "height": 1800,
    "source": "auto"
  },
  "galleryImages": [
    {
      "id": "img_gallery_1",
      "url": "https://cdn.example.com/cards/card_123/gallery-1.jpg",
      "width": 1200,
      "height": 1800
    }
  ],
  "sections": [],
  "share": {
    "ogTitle": "민준 · 서연의 결혼식에 초대합니다",
    "ogDescription": "웨딩화보와 함께 보는 모바일 청첩장",
    "ogImageUrl": "https://cdn.example.com/cards/card_123/og.jpg"
  },
  "publishedAt": null,
  "createdAt": "2026-03-08T10:00:00Z",
  "updatedAt": "2026-03-08T10:00:00Z"
}
```

### 3.2 Section
```json
{
  "id": "sec_gallery",
  "type": "gallery",
  "order": 2,
  "state": "default",
  "isVisible": true,
  "payload": {}
}
```

`type` 허용값:
- `main-parallax-screen`
- `gallery`
- `wedding-date`
- `venue`
- `d-day`
- `rsvp`
- `guestbook`
- `parents`
- `account`
- `story`

`state` 허용값:
- `default`: preset 기본값을 따르는 상태
- `edited`: 사용자 payload override가 있는 상태
- `hidden`: 사용자가 숨김 override를 준 상태

추가 규칙:
- `isVisible` 는 preset 기본값과 사용자 override를 합성한 최종 렌더 노출 여부다.
- `sections[]` 는 응답 시점의 resolved render 모델이며, 저장 시에는 `presetOverrides` 와 분리해 관리한다.

### 3.3 Sample Preset
```json
{
  "id": "preset_clean_editorial",
  "name": "Clean Editorial",
  "category": "clean",
  "thumbnailUrl": "https://cdn.example.com/presets/clean-editorial.jpg",
  "styleTokens": {
    "fontHeading": "Cormorant Garamond",
    "fontBody": "Pretendard",
    "accentColor": "#d8c3b7"
  },
  "defaultCopy": {
    "intro": "두 사람의 결혼식에 초대합니다"
  },
  "defaultSectionRules": {
    "story": {
      "isVisible": true,
      "order": 8
    },
    "account": {
      "isVisible": false,
      "order": 7
    }
  },
  "animation": {
    "hero": "soft-fade"
  },
  "music": {
    "enabled": true,
    "trackId": "track_serene_01"
  }
}
```

### 3.4 RSVP Entry
```json
{
  "id": "rsvp_123",
  "cardId": "card_123",
  "guestName": "홍길동",
  "attending": true,
  "partySize": 2,
  "message": "축하드립니다",
  "createdAt": "2026-03-08T11:00:00Z"
}
```

### 3.5 Guestbook Entry
```json
{
  "id": "guestbook_123",
  "cardId": "card_123",
  "authorName": "김하객",
  "message": "결혼 축하해요",
  "createdAt": "2026-03-08T11:00:00Z"
}
```

## 4. 공통 검증 규칙
### 4.1 Quick Draft 검증
- `groomName` 필수
- `brideName` 필수
- `mainImage` 필수
- `galleryImages` 최소 4장
- `galleryImages` 최대 40장
- `middleImage` 미입력 시 서버가 자동 할당
- `presetId`는 선택 입력이며, 미입력 시 서버가 추천 preset을 자동 선택

### 4.2 sample preset 규칙
- Quick Draft 생성 전에 preset 선택은 필수 입력이 아니다.
- 추천 preset은 자동 적용되지만 사용자는 첫 미리보기 직후 `3~5개`의 curated preset 안에서 즉시 다른 preset으로 바꿀 수 있어야 한다.
- preset 전환 시 `groomName`, `brideName`, `mainImage`, `middleImage`, `galleryImages`, RSVP, 방명록 데이터는 유지되어야 한다.
- `state`가 `default`인 section은 새 preset의 `defaultCopy`, `defaultSectionRules`, style 규칙으로 재계산될 수 있다.
- `state`가 `edited`이거나 `hidden`인 section은 사용자 override로 유지되어야 한다.
- `main-parallax-screen` 과 `gallery` 는 system-required section이라 preset 전환 후에도 항상 `isVisible=true` 여야 한다.

### 4.3 갤러리 제한 정책
- 41번째 갤러리 이미지 추가 요청은 실패해야 한다.
- 실패 문구는 반드시 아래 문구를 사용한다.
`갤러리 사진은 최대 40장까지 업로드할 수 있어요.`

### 4.4 상태 규칙
- `draft` 상태는 소유자 token 없이는 조회할 수 없다.
- `published` 상태는 공개 URL로 조회 가능해야 한다.
- 발행 이후에도 소유자는 편집 API로 수정 가능하되, 수정 후 재발행 정책은 별도 운영 규칙으로 다룬다.

## 5. 인증 및 헤더
### 5.1 요청 헤더
공통:
```http
Content-Type: application/json
```

소유자 인증이 필요한 API:
```http
Content-Type: application/json
x-card-token: owner_xxx
```

### 5.2 인증 실패
- `401 UNAUTHORIZED`: 토큰 없음 또는 형식 오류
- `403 FORBIDDEN`: 카드 소유자 token 불일치

## 6. API 목록
### 6.1 업로드 API
#### POST `/api/uploads/images`
이미지 업로드용 메타데이터를 생성한다.

사용 시점:
- Quick Draft 사진 업로드 전
- 에디터에서 이미지 교체 시

요청:
```json
{
  "files": [
    {
      "filename": "main.jpg",
      "contentType": "image/jpeg",
      "size": 2488123
    }
  ]
}
```

응답:
```json
{
  "data": {
    "uploads": [
      {
        "uploadId": "upl_123",
        "fileId": "img_123",
        "uploadUrl": "https://upload.example.com/...",
        "publicUrl": "https://cdn.example.com/..."
      }
    ]
  }
}
```

검증:
- 이미지 MIME 타입만 허용
- 서버 정책을 넘는 대용량 파일은 거절

### 6.2 카드 생성 API
#### POST `/api/cards`
Quick Draft를 생성한다.

요청:
```json
{
  "quickDraft": {
    "groomName": "민준",
    "brideName": "서연",
    "mainImageId": "img_main_1",
    "middleImageId": null,
    "presetId": null,
    "galleryImageIds": [
      "img_gallery_1",
      "img_gallery_2",
      "img_gallery_3",
      "img_gallery_4"
    ]
  }
}
```

서버 동작:
- draft 상태 카드 생성
- `ownerToken` 생성
- `presetId`가 없으면 추천 preset 자동 선택
- 선택된 preset의 기본 레이아웃, 카피, 섹션 기본값 적용
- `main-parallax-screen` 생성
- `gallery` 섹션 생성
- `middleImage` 자동 할당
- RSVP를 포함한 기본 섹션 생성
- 비공개 미리보기 URL 생성
- 첫 미리보기에서 전환 가능한 `3~5개` preset 후보 결정
- 이벤트 `upload_photo_pack`, `apply_recommended_preset`, `auto_assign_photo_slots` 기록

응답:
```json
{
  "data": {
    "card": {
      "id": "card_123",
      "status": "draft",
      "ownerToken": "owner_xxx",
      "presetId": "preset_clean_editorial",
      "presetSource": "recommended",
      "previewUrl": "/preview/card_123",
      "editorUrl": "/editor/card_123"
    },
    "appliedPreset": {
      "id": "preset_clean_editorial",
      "name": "Clean Editorial"
    },
    "availablePresets": [
      {
        "id": "preset_clean_editorial",
        "name": "Clean Editorial"
      },
      {
        "id": "preset_modern_story",
        "name": "Modern Story"
      },
      {
        "id": "preset_photo_bold",
        "name": "Photo Bold"
      }
    ]
  }
}
```

실패 코드:
- `VALIDATION_ERROR`
- `GALLERY_MIN_REQUIRED`
- `GALLERY_LIMIT_EXCEEDED`
- `IMAGE_NOT_FOUND`
- `PRESET_NOT_FOUND`

### 6.3 draft 미리보기 조회 API
#### GET `/api/cards/:cardId/preview`
draft 카드를 소유자 전용으로 조회한다.

인증:
- `x-card-token` 필요

응답:
```json
{
  "data": {
    "card": {
      "id": "card_123",
      "status": "draft",
      "presetId": "preset_clean_editorial",
      "presetSource": "recommended",
      "groomName": "민준",
      "brideName": "서연",
      "mainImage": {},
      "middleImage": {},
      "galleryImages": [],
      "sections": []
    },
    "appliedPreset": {
      "id": "preset_clean_editorial",
      "name": "Clean Editorial"
    },
    "availablePresets": [
      {
        "id": "preset_clean_editorial",
        "name": "Clean Editorial"
      },
      {
        "id": "preset_modern_story",
        "name": "Modern Story"
      },
      {
        "id": "preset_photo_bold",
        "name": "Photo Bold"
      }
    ]
  }
}
```

실패 코드:
- `UNAUTHORIZED`
- `FORBIDDEN`
- `CARD_NOT_FOUND`

### 6.4 공개 카드 조회 API
#### GET `/api/public/cards/:slug`
발행된 카드를 공개 조회한다.

응답:
```json
{
  "data": {
    "card": {
      "id": "card_123",
      "status": "published",
      "slug": "minjun-seoyeon",
      "presetId": "preset_clean_editorial",
      "groomName": "민준",
      "brideName": "서연",
      "mainImage": {},
      "middleImage": {},
      "galleryImages": [],
      "sections": [],
      "share": {}
    }
  }
}
```

서버 동작:
- 이벤트 `view_main_parallax_screen` 기록

실패 코드:
- `CARD_NOT_FOUND`
- `CARD_NOT_PUBLISHED`

### 6.5 카드 편집 조회 API
#### GET `/api/cards/:cardId/edit`
에디터 초기 로딩용 카드 데이터를 조회한다.

인증:
- `x-card-token` 필요

응답:
```json
{
  "data": {
    "card": {
      "id": "card_123",
      "status": "draft",
      "presetId": "preset_clean_editorial",
      "groomName": "민준",
      "brideName": "서연",
      "mainImage": {},
      "middleImage": {},
      "galleryImages": [],
      "sections": []
    },
    "appliedPreset": {
      "id": "preset_clean_editorial",
      "name": "Clean Editorial"
    },
    "availablePresets": [
      {
        "id": "preset_clean_editorial",
        "name": "Clean Editorial"
      },
      {
        "id": "preset_modern_story",
        "name": "Modern Story"
      },
      {
        "id": "preset_photo_bold",
        "name": "Photo Bold"
      }
    ]
  }
}
```

서버 동작:
- 에디터 최초 진입 시 이벤트 `open_editor` 를 기록해야 한다.

### 6.6 sample preset 목록 조회 API
#### GET `/api/presets`
랜딩과 draft 미리보기, 에디터에서 사용할 sample preset 목록을 조회한다.

쿼리:
- `context=landing`: 랜딩 티저용 preset 목록을 조회한다. 최대 3개까지 반환할 수 있다.
- `context=draft` 또는 `context=editor`: 현재 카드에 전환 가능한 preset 목록을 조회한다. 현재 적용 preset을 포함한 `3~5개`를 반환해야 한다.
- `cardId`: `context=draft|editor` 에서 추천 범위를 카드 기준으로 좁힐 때 사용한다.

응답:
```json
{
  "data": {
    "items": [
      {
        "id": "preset_clean_editorial",
        "name": "Clean Editorial",
        "category": "clean",
        "thumbnailUrl": "https://cdn.example.com/presets/clean-editorial.jpg"
      },
      {
        "id": "preset_modern_story",
        "name": "Modern Story",
        "category": "modern",
        "thumbnailUrl": "https://cdn.example.com/presets/modern-story.jpg"
      },
      {
        "id": "preset_photo_bold",
        "name": "Photo Bold",
        "category": "photo-first",
        "thumbnailUrl": "https://cdn.example.com/presets/photo-bold.jpg"
      }
    ]
  }
}
```

### 6.7 sample preset 전환 API
#### PATCH `/api/cards/:cardId/preset`
draft 카드에 적용된 sample preset을 변경한다.

인증:
- `x-card-token` 필요

요청:
```json
{
  "presetId": "preset_modern_story"
}
```

서버 동작:
- 적용 가능한 preset인지 검증
- `presetId`, `presetVersion`, `presetSource` 갱신
- `state`가 `default`인 section은 새 preset의 기본 payload, `isVisible`, order 규칙으로 재계산
- `state`가 `edited`인 section payload override는 유지
- `state`가 `hidden`인 section visibility override는 유지
- `main-parallax-screen` 과 `gallery` 는 항상 `isVisible=true` 로 강제
- 이벤트 `change_sample_preset` 기록

응답:
```json
{
  "data": {
    "card": {
      "id": "card_123",
      "presetId": "preset_modern_story",
      "presetSource": "manual"
    },
    "appliedPreset": {
      "id": "preset_modern_story",
      "name": "Modern Story"
    }
  }
}
```

### 6.8 카드 기본 정보 수정 API
#### PATCH `/api/cards/:cardId`
카드의 기본 메타데이터를 수정한다.

인증:
- `x-card-token` 필요

요청:
```json
{
  "groomName": "민준",
  "brideName": "서연",
  "mainImageId": "img_main_2",
  "middleImageId": "img_mid_2"
}
```

규칙:
- `mainImageId` 변경 시 첫 화면 렌더 안정성을 유지해야 한다.
- `middleImageId`가 `null`로 들어오면 자동 배정 정책을 다시 적용할 수 있다.

### 6.9 갤러리 수정 API
#### PATCH `/api/cards/:cardId/gallery`
갤러리 이미지를 교체, 추가, 삭제, 순서 변경한다.

인증:
- `x-card-token` 필요

요청:
```json
{
  "galleryImageIds": [
    "img_gallery_1",
    "img_gallery_3",
    "img_gallery_5",
    "img_gallery_6"
  ]
}
```

규칙:
- 최소 4장 유지
- 최대 40장 유지
- 업로드 순서가 뷰어 순서가 된다

실패 코드:
- `GALLERY_MIN_REQUIRED`
- `GALLERY_LIMIT_EXCEEDED`

### 6.10 섹션 수정 API
#### PATCH `/api/cards/:cardId/sections`
섹션 payload, 상태, 순서를 일괄 수정한다.

인증:
- `x-card-token` 필요

요청:
```json
{
  "sections": [
    {
      "id": "sec_date",
      "type": "wedding-date",
      "order": 3,
      "state": "edited",
      "isVisible": true,
      "payload": {
        "date": "2026-10-03",
        "time": "13:00",
        "timezone": "Asia/Seoul"
      }
    },
    {
      "id": "sec_account",
      "type": "account",
      "order": 7,
      "state": "hidden",
      "isVisible": false,
      "payload": {
        "accounts": []
      }
    }
  ]
}
```

규칙:
- 미리보기와 발행 렌더는 동일한 `sections` 구조를 사용한다.
- `state=default` 는 해당 section의 사용자 override를 제거하고 preset 기본값으로 되돌리는 의미다.
- `state=edited` 는 payload override를 `presetOverrides.sections` 에 저장하는 의미다.
- `state=hidden` 는 숨김 override를 `presetOverrides.sections` 에 저장하는 의미다.
- `main-parallax-screen`과 `gallery`는 P0에서 삭제 불가이며 숨김도 불가하다.

### 6.11 카드 발행 API
#### POST `/api/cards/:cardId/publish`
draft 카드를 published 상태로 전환한다.

인증:
- `x-card-token` 필요

요청:
```json
{
  "slug": "minjun-seoyeon"
}
```

서버 동작:
- 공개 slug 중복 검사
- 상태를 `published`로 변경
- `publishedAt` 기록
- 공유용 OG 메타데이터 생성 또는 갱신
- 이벤트 `publish_card` 기록

응답:
```json
{
  "data": {
    "card": {
      "id": "card_123",
      "status": "published",
      "slug": "minjun-seoyeon",
      "publicUrl": "/cards/minjun-seoyeon"
    }
  }
}
```

실패 코드:
- `SLUG_ALREADY_TAKEN`
- `PUBLISH_VALIDATION_ERROR`

### 6.12 RSVP 작성 API
#### POST `/api/public/cards/:slug/rsvp`
공개 카드에서 참석 여부를 제출한다.

요청:
```json
{
  "guestName": "홍길동",
  "attending": true,
  "partySize": 2,
  "message": "축하드립니다"
}
```

서버 동작:
- RSVP 저장
- 이벤트 `submit_rsvp` 기록

응답:
```json
{
  "data": {
    "rsvp": {
      "id": "rsvp_123"
    }
  }
}
```

실패 코드:
- `CARD_NOT_FOUND`
- `RSVP_VALIDATION_ERROR`

### 6.13 RSVP 목록 조회 API
#### GET `/api/cards/:cardId/rsvps`
카드 소유자가 RSVP 목록을 조회한다.

인증:
- `x-card-token` 필요

응답:
```json
{
  "data": {
    "items": [
      {
        "id": "rsvp_123",
        "guestName": "홍길동",
        "attending": true,
        "partySize": 2,
        "message": "축하드립니다",
        "createdAt": "2026-03-08T11:00:00Z"
      }
    ]
  }
}
```

### 6.14 방명록 작성 API
#### POST `/api/public/cards/:slug/guestbook`
공개 카드에서 방명록을 작성한다.

요청:
```json
{
  "authorName": "김하객",
  "message": "결혼 축하해요"
}
```

서버 동작:
- 방명록 저장
- 이벤트 `write_guestbook` 기록

응답:
```json
{
  "data": {
    "entry": {
      "id": "guestbook_123"
    }
  }
}
```

### 6.15 방명록 조회 API
#### GET `/api/public/cards/:slug/guestbook`
공개 카드의 방명록 목록을 조회한다.

응답:
```json
{
  "data": {
    "items": [
      {
        "id": "guestbook_123",
        "authorName": "김하객",
        "message": "결혼 축하해요",
        "createdAt": "2026-03-08T11:00:00Z"
      }
    ]
  }
}
```

### 6.16 통계 조회 API
#### GET `/api/cards/:cardId/stats`
카드 소유자가 기본 통계를 조회한다.

인증:
- `x-card-token` 필요

응답:
```json
{
  "data": {
    "stats": {
      "viewMainParallaxScreen": 120,
      "applyRecommendedPreset": 1,
      "changeSamplePreset": 6,
      "keptRecommendedPreset": false,
      "submitRsvp": 18,
      "writeGuestbook": 9,
      "copyAccount": 14
    }
  }
}
```

### 6.17 이벤트 수집 API
#### POST `/api/events`
클라이언트 행동 이벤트를 수집한다.

요청:
```json
{
  "eventName": "copy_account",
  "cardId": "card_123",
  "slug": "minjun-seoyeon",
  "metadata": {
    "sectionId": "sec_account"
  },
  "occurredAt": "2026-03-08T11:10:00Z"
}
```

허용 이벤트:
- `view_landing`
- `click_start_create`
- `upload_photo_pack`
- `apply_recommended_preset`
- `auto_assign_photo_slots`
- `change_sample_preset`
- `open_editor`
- `view_main_parallax_screen`
- `publish_card`
- `submit_rsvp`
- `write_guestbook`
- `copy_account`

## 7. 에러 코드 정의
- `VALIDATION_ERROR`: 일반 입력 오류
- `UNAUTHORIZED`: 인증 누락 또는 형식 오류
- `FORBIDDEN`: 소유자 권한 없음
- `CARD_NOT_FOUND`: 카드 없음
- `CARD_NOT_PUBLISHED`: 공개 카드 아님
- `IMAGE_NOT_FOUND`: 이미지 리소스 없음
- `PRESET_NOT_FOUND`: preset 없음
- `GALLERY_MIN_REQUIRED`: 갤러리 최소 수량 미달
- `GALLERY_LIMIT_EXCEEDED`: 갤러리 최대 수량 초과
- `SLUG_ALREADY_TAKEN`: 발행 slug 중복
- `PUBLISH_VALIDATION_ERROR`: 발행 조건 미충족
- `RSVP_VALIDATION_ERROR`: RSVP 입력 오류

## 8. 수용 기준
### 8.1 Quick Draft
- 필수 입력만으로 카드가 생성되어야 한다.
- `POST /api/cards` 한 번으로 draft 카드와 추천 preset, 기본 섹션이 준비되어야 한다.
- 중간 사진 미입력 시 서버가 자동 배정해야 한다.
- 추천 preset이 적용되어도 사용자는 입력값 재작성 없이 preset을 바꿀 수 있어야 한다.
- Quick Draft 직후 RSVP 섹션이 기본 생성되고 기본 노출되어야 한다.
- draft 미리보기 응답에는 현재 preset을 포함한 `3~5개`의 전환 가능 preset이 포함되어야 한다.

### 8.2 공개 카드
- 공개 카드 조회는 slug 기준으로 가능해야 한다.
- 메인 화면 진입 시 통계 이벤트가 누락되지 않아야 한다.
- RSVP, 방명록, 계좌 복사 이벤트가 카드 기준으로 집계 가능해야 한다.
- 발행된 카드는 적용된 preset 기반 표현을 유지해야 한다.

### 8.3 편집 및 발행
- 편집 API는 `x-card-token` 없이 동작하면 안 된다.
- 발행 후 즉시 공개 URL 조회가 가능해야 한다.
- 갤러리 40장 제한은 생성과 수정 모두에서 동일하게 강제되어야 한다.
- preset 전환 시 사용자 데이터가 손실되면 안 된다.
- `main-parallax-screen` 과 `gallery` 는 편집 API로 숨길 수 없어야 한다.
- `edited` 와 `hidden` 상태는 `presetOverrides` 로 유지되고, `default` 상태만 새 preset 기본값을 따라야 한다.

## 9. 권장 구현 순서
1. 이미지 업로드 API
2. Quick Draft 생성 API + 추천 preset 적용
3. draft 미리보기 조회 API
4. sample preset 목록 조회 / 전환 API
5. 공개 카드 조회 API
6. 카드 편집 API
7. 발행 API
8. RSVP / 방명록 / 통계 API
