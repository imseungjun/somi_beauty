/**
 * @somi_beauty_korea 피드 표시 설정
 *
 * ① 자동 썸네일(권장): 아래 INSTAGRAM_POST_URLS에 게시물·릴 주소를 넣으세요.
 *    인스타 앱/웹에서 게시물 → ⋮ → 링크 복사 (최대 6개, 위에서부터 최신 순)
 *
 * ② 위젯만 쓰기: SnapWidget(https://snapwidget.com) 등에서 @somi_beauty_korea 연동 후
 *    받은 embed URL을 INSTAGRAM_WIDGET_IFRAME_SRC에 넣으면 그리드 대신 위젯이 보입니다.
 */

/** 예: "https://snapwidget.com/embed/123456" — 비우면 위젯 미사용 */
export const INSTAGRAM_WIDGET_IFRAME_SRC = "";

/**
 * instagram.com/p/... 또는 /reel/... 퍼머링크 (최대 6개)
 * 비어 있으면 로컬 /images/social-1.jpg … 폴백
 */
export const INSTAGRAM_POST_URLS = [
  // 예: "https://www.instagram.com/p/xxxxxxxxxxx/",
];
