/**
 * Command Palette — 커맨드 데이터 정의
 */
var COMMAND_META = (function () {
    'use strict';

    /* ── 빠른 작업 (Quick Actions) ── */
    var quickActions = {
        heading: '빠른 작업',
        searchOnly: false,
        commands: [
            {
                id: 'action-create-booking',
                label: '예약 등록',
                description: '신규 예약 등록',
                keywords: ['예약', '예약등록', '등록', '새 예약', '신규'],
                category: 'action',
                badge: null,
                hasSubMenu: false,
                action: function () {
                    var isCalendarPage = location.pathname.indexOf('/book/calendar') > -1;
                    if (isCalendarPage) {
                        localStorage.setItem('cmdKCreateBookingModal', 'true');
                        window.dispatchEvent(new Event('cmdKOpenCreateBooking'));
                    } else {
                        localStorage.setItem('cmdKCreateBookingModal', 'true');
                        navigateWithCanAccess('/book/calendar');
                    }
                }
            },
            {
                id: 'action-create-customer',
                label: '고객 등록',
                description: '신규 고객 등록',
                keywords: ['고객', '고객등록', '신규', '첫방문', '등록'],
                category: 'action',
                badge: null,
                hasSubMenu: false,
                action: function () {
                    var isCustomerPage = location.pathname.indexOf('/customer') > -1;
                    localStorage.setItem('cmdKCreateCustomerModal', 'true');
                    if (isCustomerPage) {
                        window.dispatchEvent(new Event('cmdKOpenCreateCustomer'));
                    } else {
                        navigateWithCanAccess('/customer');
                    }
                }
            },
            {
                id: 'action-create-sale',
                label: '매출 등록',
                description: '신규 매출 등록',
                keywords: ['매출', '매출등록', '신규', '등록'],
                category: 'action',
                badge: null,
                hasSubMenu: false,
                action: function () {
                    const returnUrl = location.pathname + location.search;
                    goUrlWithDate('/sale/register?returnUrl=' + encodeURIComponent(returnUrl));
                }
            }
        ]
    };

    /* ── 빠른 이동 (Quick Navigation) ── */
    var quickNavigation = {
        heading: '빠른 이동',
        searchOnly: false,
        commands: [
            { id: 'goto-booking',                  label: '예약 캘린더',          description: '예약현황, 매장 휴무, 직원별일정(일/주/월/리스트)',       keywords: ['예약', '캘린더'],                                          url: '/book/calendar' },
            { id: 'goto-customer',                 label: '고객 차트',           description: '고객 목록, 고객 상세',                              keywords: ['고객', '회원', '고객차트'],                                  url: '/customer' },
            { id: 'goto-sale',                     label: '매출 목록',           description: '결제, 판매 내역',                                  keywords: ['매출', '결제', '판매'],                                     url: '/sale' },
            { id: 'goto-shop-status',              label: '샵 현황',            description: '샵 운영 현황',                                     keywords: ['매장', '통계', '운영 현황', '당일매출'],                      url: '/shop/statistics' },
            { id: 'goto-statistics',               label: '통계 대시보드',       description: '통계 그래프, 객단가, 기간별 비교 분석 등',              keywords: ['대시보드', '매출 현황', '통계', '매출'],                      url: '/statistics/dashboard' },
            { id: 'goto-statistics-sale-item',      label: '상품별 통계',         description: '시술, 제품, 회원권 등 샵에서 판매한 상품에 대한 통계 데이터', keywords: ['시술 매출', '메뉴별', '매출 분석', '매출', '당일매출', '합계', '통계'], url: '/statistics/sale-item' },
            { id: 'goto-statistics-payment-method', label: '결제 수단별 통계',    description: '매출 등록시 입력한 결제 수단에 대한 통계 데이터',         keywords: ['결제수단', '카드', '현금', '수단별', '매출', '통계'],          url: '/statistics/payment-method' },
            { id: 'goto-shop-cosmetic',            label: '시술메뉴',            description: '시술 메뉴 관리, 가격 설정',                          keywords: ['시술', '메뉴', '서비스'],                                    url: '/shop/cosmetic' },
            { id: 'goto-shop-employee',            label: '직원 관리',           description: '담당자·권한 설정',                                  keywords: ['직원', '스태프', '담당자'],                                  url: '/shop/employee' },
            { id: 'goto-deposit-settlement',       label: '예약금 내역/정산',     description: '예약금, 정산 내역',                                 keywords: ['예약금', '정산'],                                           url: '/deposit/settlement' },
            { id: 'goto-alarm-charge',             label: '알림 충전',           description: '알림톡, 문자충전',                                  keywords: ['충전', '포인트', '알림톡', '문자'],                           url: '/payment/alarm-charge' },
            { id: 'goto-license',                  label: '이용권정보',          description: '정기결제, 요금제, 부가서비스',                        keywords: ['결제', '라이선스'],                                         url: '/payment/license' },
            { id: 'goto-membership',               label: '회원권/포인트관리',    description: '정액권, 티켓, 포인트 관리(조회/충전/설정)',              keywords: ['회원권', '정액권', '티켓', '포인트'],                         url: '/cust/membership' },
            { id: 'goto-sms-send',                 label: '문자/단체문자 전송',   description: '고객에게 단체 문자발송, 본인인증',                     keywords: ['문자', 'SMS', '단체문자', '알림'],                           url: '/sms/send' },
            { id: 'goto-sms-auto-procedure',       label: '시술 후 알림',        description: '시술 후 일정 기간 간격으로 발송하는 메시지',             keywords: ['문자', 'SMS', '단체문자', '시술', '알림'],                    url: '/sms/auto/procedure' },
            { id: 'goto-alimtalk-histories',       label: '전송내역',            description: '알림톡, 자동문자, 단체문자 전송내역',                  keywords: ['전송', '전송내역', '발송', '발송내역'],                       url: '/alimtalk/histories' },
            { id: 'goto-statistics-employee',      label: '직원 통계',           description: '직원별 매출 통계 데이터를 확인, 고객 유형별/상품별 통계', keywords: ['직원', '직원 매출', '매출', '통계'],                          url: '/statistics/employee' },
            { id: 'goto-shop-point',               label: '포인트/행사상품',      description: '포인트 적립률 설정',                                  keywords: ['포인트', '적립', '매출'],                                    url: '/shop/point/set' },
            { id: 'goto-product',                  label: '제품관리',            description: '제품 등록, 관리',                                    keywords: ['제품', '제품 등록'],                                        url: '/product' }
        ].map(function (cmd) {
            cmd.category = 'navigation';
            cmd.badge = null;
            cmd.hasSubMenu = false;
            cmd.action = function () { navigateWithCanAccess(cmd.url); };
            return cmd;
        })
    };

    /* ── 샵 설정 (Shop Settings) ── */
    var shopSettings = {
        heading: '샵 설정',
        searchOnly: false,
        commands: [
            { id: 'goto-business-time',     label: '샵 영업 설정',       description: '오픈·마감·휴무일',                          keywords: ['영업시간', '시간', '오픈'],                       url: '/shop/business-setting/business-time' },
            { id: 'goto-calendar-setting',   label: '캘린더 표시',        description: '캘린더 보기 옵션, 직원색상',                  keywords: ['캘린더', '예약 설정'],                            url: '/shop/calendar-setting/calendar' },
            { id: 'goto-naver-setting',      label: '네이버 예약 연동',    description: '플레이스 연동',                             keywords: ['네이버', '플레이스', '매장결제', '쿠폰'],           url: '/naver/setting' },
            { id: 'goto-auto-alarm',         label: '알림톡/자동문자',    description: '알림톡, 자동문자',                           keywords: ['알림', '알림톡', 'sms', '문자'],                  url: '/auto-alarm' },
            { id: 'goto-send-number',        label: '발신 번호 설정',     description: '발신번호 등록',                              keywords: ['발신번호', '전화번호'],                            url: '/sms/send' },
            { id: 'goto-deposit-policy',     label: '예약금 설정',        description: '예약금, 노쇼 방지',                          keywords: ['예약금', '노쇼'],                                 url: '/deposit/policy' },
            { id: 'goto-b2c-setting',        label: '공비서로 예약받기',   description: '공비서 앱 입점, 알림톡 무료',                  keywords: ['공비서', '입점', '온라인예약'],                     url: '/b2c/setting' },
            { id: 'goto-payment-method',     label: '결제 수단 관리',     description: '결제 카드 등록',                              keywords: ['결제 수단', '카드', '결제 정보'],                  url: '/payment/payment-method' },
            { id: 'goto-customer-filter',    label: '고객 필터 설정',     description: '신규 고객, 재방문 고객, 회원권 보유 고객',      keywords: ['고객', '필터', '분류', '조건'],                    url: '/customer/filter-setting' },
            { id: 'goto-customer-group',     label: '고객 그룹 설정',     description: '고객 그룹 관리',                              keywords: ['고객', '그룹', '등급', '세그먼트'],                url: '/customer/group-setting' },
            { id: 'goto-shop-incentives',    label: '인센티브 설정',      description: '직원 목표, 인센티브',                          keywords: ['인센티브', '성과급', '수당'],                      url: '/shop/employee/incentives' }
        ].map(function (cmd) {
            cmd.category = 'setting';
            cmd.badge = null;
            cmd.hasSubMenu = false;
            cmd.action = function () { navigateWithCanAccess(cmd.url); };
            return cmd;
        })
    };

    /* ── 가이드 및 고객센터 ── */
    var helpSupport = {
        heading: '가이드 및 고객센터',
        searchOnly: false,
        commands: [
            {
                id: 'help-guide',
                label: '사용 가이드',
                description: '공비서 원장님을 더욱 잘 활용할 수 있는 사용 가이드',
                keywords: ['도움말', '가이드'],
                category: 'guide',
                badge: null,
                hasSubMenu: true,
                action: function () { /* 2depth 진입은 command-palette.js에서 처리 */ }
            },
            {
                id: 'help-happy-talk',
                label: '1:1 문의',
                description: '문의 사항이 있다면 1:1 문의로 전달해 주세요',
                keywords: ['카카오', '채팅', '문의', '톡', '1:1', '문의하기', '고객센터', '전화', '상담'],
                category: 'support',
                badge: null,
                hasSubMenu: false,
                isHidden: function () {
                    var iframe = document.getElementById('HappytalkIframe');
                    return !iframe || iframe.style.visibility === 'hidden';
                },
                action: function () {
                    if (typeof ht !== 'undefined' && ht && typeof ht.open === 'function') {
                        ht.open();
                    }
                }
            }
        ]
    };

    /* ── 프로모션 정의 ── */
    var PROMOTIONS = [
        {
            commandId: 'goto-statistics',
            badge: null,
            expiresAt: null
        }
    ];

    /* ── canAccess 쿼리 보존 ── */
    function navigateWithCanAccess(url) {
        var currentParams = new URLSearchParams(window.location.search);
        if (currentParams.get('canAccess') === 'true') {
            var separator = url.indexOf('?') > -1 ? '&' : '?';
            url = url + separator + 'canAccess=true';
        }
        goUrlWithDate(url);
    }

    /* ── 헬퍼 함수 ── */
    function getAllGroups() {
        return [quickActions, quickNavigation, shopSettings, helpSupport];
    }

    function getAllFlatCommands() {
        var result = [];
        var groups = getAllGroups();
        for (var i = 0; i < groups.length; i++) {
            for (var j = 0; j < groups[i].commands.length; j++) {
                result.push(groups[i].commands[j]);
            }
        }
        return result;
    }

    function findCommandById(id) {
        var all = getAllFlatCommands();
        for (var i = 0; i < all.length; i++) {
            if (all[i].id === id) return all[i];
        }
        return null;
    }

    function getActivePromotions() {
        var now = new Date();
        return PROMOTIONS.filter(function (p) {
            if (p.expiresAt && new Date(p.expiresAt) < now) return false;
            return !!findCommandById(p.commandId);
        });
    }

    function buildPromotionGroup() {
        var promos = getActivePromotions();
        if (promos.length === 0) return null;

        var commands = [];
        for (var i = 0; i < promos.length; i++) {
            var original = findCommandById(promos[i].commandId);
            if (original) {
                var clone = {};
                for (var key in original) {
                    if (original.hasOwnProperty(key)) clone[key] = original[key];
                }
                clone.badge = promos[i].badge;
                commands.push(clone);
            }
        }

        if (commands.length === 0) return null;
        return { heading: '추천', searchOnly: false, commands: commands };
    }

    return {
        getAllGroups: getAllGroups,
        getAllFlatCommands: getAllFlatCommands,
        findCommandById: findCommandById,
        buildPromotionGroup: buildPromotionGroup,
        quickActions: quickActions,
        quickNavigation: quickNavigation,
        shopSettings: shopSettings,
        helpSupport: helpSupport
    };
})();
