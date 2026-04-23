# 다양한 문자 샘플 모달 — JSP 통합 가이드

바닐라 HTML/CSS/JS로 작성된 **의존성 0** 모달 스니펫. 기존 JSP 시술 후 알림 페이지에 그대로 붙여 넣으면 됨.

## 파일 구성

- `modal.html` — 모달 마크업 (body 하단 삽입용)
- `modal.css` — 전용 스타일 (prefix `gbz-m-*`로 격리)
- `modal.js` — 인터랙션 (열기·닫기·검색·복사·토스트)

## 통합 단계

### 1. 파일 배치

JSP 프로젝트 구조에 맞게 배치:

```
/webapp
  /resources
    /css
      modal.css          ← 여기
    /js
      modal.js           ← 여기
  /WEB-INF
    /views
      /sms
        auto-procedure.jsp  ← 기존 시술 후 알림 JSP
```

### 2. JSP에서 리소스 로드

`auto-procedure.jsp`의 `<head>` 또는 페이지 레이아웃에 추가:

```jsp
<link rel="stylesheet" href="${pageContext.request.contextPath}/resources/css/modal.css">
```

`</body>` 직전에 추가:

```jsp
<jsp:include page="/WEB-INF/views/common/modal.html" />  <!-- 또는 modal.html 내용 직접 포함 -->
<script src="${pageContext.request.contextPath}/resources/js/modal.js"></script>
```

> `modal.html`은 순수 HTML이라 JSP include 대신 파일 내용을 JSP 안에 **직접 붙여 넣어도 됨**.

### 3. 기존 "다양한 문자 샘플 보기" 버튼 연결

기존 JSP에서 Notion 외부 링크로 가는 `<a>` 태그를 찾아서:

```html
<!-- Before (외부 링크) -->
<a href="https://0909.notion.site/..." target="_blank">
  <div style="display:flex; gap:4px;">
    <img src="..."><span>다양한 문자 샘플 보기</span>
  </div>
</a>
```

아래처럼 변경:

```html
<!-- After (내부 모달) -->
<a href="#" onclick="event.preventDefault(); window.openSampleModal();">
  <div style="display:flex; gap:4px;">
    <img src="..."><span>다양한 문자 샘플 보기</span>
  </div>
</a>
```

핵심: `window.openSampleModal()` 호출. 나머지 인터랙션(닫기·ESC·dim 클릭)은 `modal.js`가 자동 바인딩.

## 템플릿 데이터 추가/수정

템플릿은 `modal.html`의 `.gbz-m-tpl` 요소에 하드코딩돼 있음. 각 카드 구조:

```html
<div class="gbz-m-tpl" data-cat="nail" data-msg='[헤렌네일]
[고객이름]님, ...'>
  <div class="gbz-m-tpl-head">
    <div class="gbz-m-tpl-meta">
      <div class="gbz-m-tpl-badges">
        <span class="gbz-m-badge gbz-m-badge--info">네일</span>
        <span class="gbz-m-badge gbz-m-badge--neutral">예약 등록 시</span>
      </div>
      <h3 class="gbz-m-tpl-title">네일샵 예약 확정 + 안내</h3>
    </div>
    <button class="gbz-m-tpl-copy" type="button">복사</button>
  </div>
  <div class="gbz-m-tpl-msg"></div>
  <div class="gbz-m-tpl-byte"></div>
</div>
```

- `data-cat`: 필터 카테고리 (all/nail/hair/skin/fit/pilates/ticket/etc 중 하나)
- `data-msg`: 템플릿 본문 (변수 `[고객이름]` `[시술이름]` `[예약일시]`는 자동 하이라이트)
- `.gbz-m-tpl-msg` / `.gbz-m-tpl-byte`는 빈 채로 두면 JS가 채워줌

## 기능 체크리스트

- [x] 카테고리 필터 (가로 스크롤 + 좌우 fade·버튼)
- [x] 변수 자동 하이라이트 (`[고객이름]` `[시술이름]` `[예약일시]`)
- [x] 90byte 카운터 + LMS 안내
- [x] 원클릭 복사 (navigator.clipboard + fallback)
- [x] 토스트 피드백 (모달 내부, 2초 자동 소멸)
- [x] 접근성 (`aria-modal`, `aria-pressed`, `role=dialog/status`)
- [x] 모달 열릴 때 body 스크롤 잠금
- [x] ESC / dim 클릭 닫기

## 공비서 DS 토큰 매핑

CSS 내 prefix(`--gbzm-*`)로 스코프된 토큰이라 페이지 전체 토큰과 충돌 없음. 만약 전역 `tokens.css`와 통일하고 싶으면 `modal.css` 상단 `:root .gbz-m-root { ... }` 블록의 값만 공용 토큰으로 치환하면 됨.

## 브라우저 지원

- Chrome/Edge: ✅
- Safari: ✅
- Firefox: ✅
- IE11: ❌ (CSS custom properties, `scroll-snap-type`, clipboard API 미지원 — 공비서 원장님 서비스가 IE 지원 중단했다면 무관)
