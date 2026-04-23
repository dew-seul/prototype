/**
 * Command Palette — 가이드 데이터 정의
 */
var GUIDE_DATA = (function () {
    'use strict';

    var BASE_URL = 'https://gongbizguide.oopy.io';

    /* ── 카테고리 ── */
    var categories = [
        { id: 'update',   label: '업데이트 소식',  description: '공비서의 새로운 기능과 개선 사항' },
        { id: 'pc-guide', label: 'PC 사용법',     description: 'PC에서 공비서 원장님을 사용하는 방법' },
        { id: 'faq',      label: '자주 묻는 질문', description: '자주 묻는 질문과 답변 모음' }
    ];

    /* ── 가이드 항목 ── */
    var items = [
        /* 업데이트 소식 */
        { id: 'update-naver-deposit-improvement', category: 'update', label: '네이버 예약금 기능 개선',                           path: '/33b48de8-e0ea-8049-940c-c137731d3874', tags: ['네이버', '네이버예약', '예약금', '매출등록', '매출'] },
        { id: 'update-naver-coupon-stats',      category: 'update',   label: '네이버 예약 쿠폰 및 통계 기능 업데이트',            path: '/33448de8-e0ea-8065-b770-f4139bfb0e33', tags: ['쿠폰', '네이버쿠폰', '네이버예약', '네이버', '통계', '직원', '직원통계'] },
        { id: 'update-naver-deposit-request',   category: 'update',   label: '네이버 예약금 확인, 고객 요청사항 업데이트',         path: '/31748de8-e0ea-8095-ad37-edb0ff8a9838', tags: ['네이버', '네이버예약', '예약금', '요청사항'] },
        { id: 'update-calendar-usability',      category: 'update',   label: '캘린더 사용성 개선 업데이트',                        path: '/31048de8-e0ea-8034-a3ac-f560bcf1cef4', tags: ['캘린더', '샵운영설정', '설정', '휴게시간', '메모'] },
        { id: 'update-npay-store',              category: 'update',   label: '네이버페이(NPay) 매장 결제 기능 출시',              path: '/2ef48de8-e0ea-80b8-85a8-ea14c0f63b63', tags: ['네이버페이', 'NPay', '결제', '매장결제', '네이버'] },
        { id: 'update-naver-calendar-confirm',  category: 'update',   label: '네이버 예약 캘린더 확정 기능 업데이트',              path: '/2d248de8-e0ea-803f-b756-d00b3ab1e20c', tags: ['네이버예약', '캘린더', '예약확정', '네이버'] },
        { id: 'update-customer-chart-ticket-share', category: 'update', label: '고객 상세 차트 및 정액권 공유 기능 업데이트',      path: '/2bc48de8-e0ea-8057-a6d8-e6281bc998aa', tags: ['고객차트', '정액권', '공유', '회원권'] },
        { id: 'update-deposit-settlement',      category: 'update',   label: '예약금 정산 시스템 개편 안내',                       path: '/2b548de8-e0ea-801d-b669-e31a4ad8c396', tags: ['예약금', '정산', '결제'] },
        { id: 'update-treatment-stats',         category: 'update',   label: '시술 통계 기능 업데이트',                            path: '/29a48de8-e0ea-80b7-afe6-d52ea678bc95', tags: ['시술', '통계', '매출', '분석'] },
        { id: 'update-recent-visit',            category: 'update',   label: '최근 방문일 기능 업데이트',                          path: '/29248de8-e0ea-80a0-8531-fc4ca82e0bd6', tags: ['방문일', '고객', '고객관리'] },
        { id: 'update-gongbiz-notice',          category: 'update',   label: '공비서 원장님 업데이트 안내',                        path: '/23e48de8-e0ea-8073-9450-f1b0e1a61ca8', tags: ['업데이트', '공비서'] },
        { id: 'update-payment-stats',           category: 'update',   label: '결제 수단 및 통계 기능 업데이트',                    path: '/23748de8-e0ea-8086-b07b-c7d1e95af7f8', tags: ['결제', '통계', '매출', '카드', '현금'] },
        { id: 'update-naver-multi-link',        category: 'update',   label: '네이버 예약 다중 연동 기능 도입',                    path: '/1e348de8-e0ea-8051-b77d-d7fa1c7427cf', tags: ['네이버예약', '연동', '다중연동', '네이버'] },
        { id: 'update-gongbiz-app-launch',      category: 'update',   label: "뷰티샵 고객 예약 전용 앱 '공비서' 런칭!",           path: '/1c848de8-e0ea-8011-a77f-d1c62cf1b070', tags: ['공비서앱', '예약앱', '고객예약', '런칭'] },

        /* PC 사용법 */
        { id: 'pc-shortcut',           category: 'pc-guide', label: '바탕화면에 공비서 원장님 바로가기 만들기',     path: '/14d48de8-e0ea-8030-8947-c732513b1056', tags: ['바로가기', '바탕화면', '시작하기', 'PC'] },
        { id: 'pc-data-migration',     category: 'pc-guide', label: '고객, 매출 데이터 이전하기',                  path: '/14d48de8-e0ea-80f5-9554-c78ed36a1c3c', tags: ['데이터', '이관', '이전', '엑셀', '업로드'] },
        { id: 'pc-cosmetic-setup',     category: 'pc-guide', label: '시술 메뉴 설정하기',                          path: '/14d48de8-e0ea-805a-a8c2-efe3c4cf0090', tags: ['시술', '메뉴', '설정', '등록'] },
        { id: 'pc-booking-edit',       category: 'pc-guide', label: '예약 간편하게 변경하기',                      path: '/14d48de8-e0ea-80bb-ab64-cd0d56a4c89b', tags: ['예약', '변경', '수정', '캘린더'] },
        { id: 'pc-alarm-setup',        category: 'pc-guide', label: '알림톡/자동 문자 설정하기',                   path: '/14d48de8-e0ea-804c-bea1-ec93e4d7d1ca', tags: ['알림톡', '자동문자', '문자', '카카오', '설정'] },
        { id: 'pc-naver-link',         category: 'pc-guide', label: '네이버 예약 연동하기',                        path: '/fde50d77-a2fb-4ebd-a61d-de4aedee8e33', tags: ['네이버예약', '연동', '네이버', '동기화'] },
        { id: 'pc-booking-cancel',     category: 'pc-guide', label: '예약 취소와 예약 삭제',                       path: '/15048de8-e0ea-8087-92d5-f0d36b736a4a', tags: ['예약취소', '예약삭제', '캘린더'] },
        { id: 'pc-customer-download',  category: 'pc-guide', label: '고객 정보 다운로드',                          path: '/28c48de8-e0ea-80da-b218-dd7744138727', tags: ['고객정보', '다운로드', '엑셀', '내보내기'] },
        { id: 'pc-alarm-charge',       category: 'pc-guide', label: '알림톡/자동문자 충전 방법',                   path: '/15048de8-e0ea-80f5-8bba-e9246f09d81c', tags: ['알림톡', '충전', '문자', '포인트'] },
        { id: 'pc-product-register',   category: 'pc-guide', label: '제품 등록 방법',                              path: '/15048de8-e0ea-8014-9c7e-fb98f233210b', tags: ['제품', '상품', '등록', '판매'] },
        { id: 'pc-employee-manage',    category: 'pc-guide', label: '직원 등록 및 순서/퇴사 설정',                 path: '/15048de8-e0ea-80a9-9765-ee97d7e70c05', tags: ['직원', '등록', '순서', '퇴사', '직원관리'] },
        { id: 'pc-walkin-sale',        category: 'pc-guide', label: '예약 등록 없이 매출 등록',                    path: '/15048de8-e0ea-806f-b02a-fc256a001294', tags: ['매출', '등록', '워크인', '현장결제'] },
        { id: 'pc-sale-edit',          category: 'pc-guide', label: '매출 내역 수정/삭제',                         path: '/15048de8-e0ea-80b4-93f5-e47ec2ed1c85', tags: ['매출수정', '매출삭제', '내역관리'] },
        { id: 'pc-unpaid-manage',      category: 'pc-guide', label: '미수금(외상) 관리 기능',                      path: '/15048de8-e0ea-805b-a465-cfe619925e85', tags: ['미수금', '외상', '결제', '매출관리'] },
        { id: 'pc-ticket-setup',       category: 'pc-guide', label: '정액권, 티켓 기본 설정하기',                  path: '/15048de8-e0ea-801f-82bf-e4784e86ff55', tags: ['정액권', '티켓', '회원권', '상품설정'] },
        { id: 'pc-ticket-charge',      category: 'pc-guide', label: '정액권, 티켓 충전/수정 방법',                 path: '/15048de8-e0ea-80df-850f-fa09c134ac57', tags: ['정액권충전', '티켓충전', '수정', '회원권'] },
        { id: 'pc-deposit-setup',      category: 'pc-guide', label: '예약금 기능 설정하고 예약금 받기',            path: '/15048de8-e0ea-8034-8a02-f085078cb95d', tags: ['예약금', '설정', '결제'] },
        { id: 'pc-deposit-refund',     category: 'pc-guide', label: '예약금 결제, 예약금 환불하기',                path: '/15048de8-e0ea-803b-9525-f1aff9f263ec', tags: ['예약금결제', '예약금환불', '환불'] },
        { id: 'pc-deposit-settlement', category: 'pc-guide', label: '예약금 정산 신청하기',                        path: '/15048de8-e0ea-80c2-aa8a-db53bf4b7964', tags: ['예약금정산', '정산', '출금'] },
        { id: 'pc-naver-guide',        category: 'pc-guide', label: '네이버 예약 연동 후 이용가이드',              path: '/4daa5657-18ec-4ef0-8522-b5037508c1b8', tags: ['네이버예약', '연동후', '이용가이드'] },
        { id: 'pc-naver-confirm-mode', category: 'pc-guide', label: '네이버예약 확정 방식 설정',                   path: '/2a348de8-e0ea-800a-871a-fa6a842d5ab1', tags: ['네이버예약', '확정방식', '자동확정', '수동확정'] },

        /* 자주 묻는 질문 */
        { id: 'faq-free-trial',        category: 'faq',      label: '무료 체험 궁금증 해결',                       path: '/01cd50ad-333c-4697-aef4-55f25e11636c', tags: ['무료체험', '체험', '가입', '시작'] },
        { id: 'faq-data-migration',    category: 'faq',      label: '타 프로그램 데이터 이관',                     path: '/1ed48de8-e0ea-80b3-b6c4-c611303ddb4c', tags: ['데이터이관', '마이그레이션', '이전'] },
        { id: 'faq-employee-manage',   category: 'faq',      label: '직원 등록 및 순서/퇴사 설정',                path: '/169a24a5-701e-46f6-81e0-1c81fb24a5be', tags: ['직원등록', '직원순서', '퇴사'] },
        { id: 'faq-license',           category: 'faq',      label: '이용권(카드정기결제, 선납권) 신청 방법',      path: '/14d48de8-e0ea-802b-940e-ef73ae776294', tags: ['이용권', '정기결제', '선납권', '구독'] }
    ];

    /* ── 가이드 항목을 커맨드 형식으로 변환 ── */
    function toCommands(categoryId) {
        return items
            .filter(function (item) { return item.category === categoryId; })
            .map(function (item) {
                return {
                    id: item.id,
                    label: item.label,
                    description: '',
                    keywords: item.tags,
                    category: 'guide',
                    badge: null,
                    hasSubMenu: false,
                    action: function () {
                        window.open(BASE_URL + item.path, '_blank');
                    }
                };
            });
    }

    function getGuideGroups() {
        return categories.map(function (cat) {
            return {
                heading: cat.label,
                searchOnly: false,
                commands: toCommands(cat.id)
            };
        }).filter(function (g) { return g.commands.length > 0; });
    }

    /** 1depth 검색용: 모든 가이드를 하나의 searchOnly 그룹으로 */
    function getSearchOnlyGuideGroup() {
        var allGuideCommands = [];
        for (var i = 0; i < items.length; i++) {
            var item = items[i];
            allGuideCommands.push({
                id: item.id,
                label: item.label,
                description: '',
                keywords: item.tags,
                category: 'guide',
                badge: null,
                hasSubMenu: false,
                action: (function (it) {
                    return function () {
                        window.open(BASE_URL + it.path, '_blank');
                    };
                })(item)
            });
        }
        return {
            heading: '가이드',
            searchOnly: true,
            commands: allGuideCommands
        };
    }

    return {
        categories: categories,
        items: items,
        getGuideGroups: getGuideGroups,
        getSearchOnlyGuideGroup: getSearchOnlyGuideGroup
    };
})();
