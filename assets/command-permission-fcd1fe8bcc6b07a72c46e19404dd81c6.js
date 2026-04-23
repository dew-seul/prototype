/**
 * Command Palette — 커맨드별 권한 맵 정의
 *
 * type:
 *   'owner'      — OWNER(점주)만 접근 가능
 *   'staff-menu' — STAFF(직원)인 경우 해당 메뉴 코드의 authyn === 'Y' 필요
 *
 * 점주는 모든 커맨드에 접근 가능하므로 별도 체크하지 않는다.
 * 직원만 이 맵을 기준으로 권한을 확인한다.
 */
var COMMAND_PERMISSION = (function () {
    'use strict';

    /* ── owner 타입: OWNER만 접근 가능 (9개) ── */
    var OWNER_ONLY_COMMANDS = [
        'goto-deposit-settlement',  // 예약금 내역
        'goto-alarm-charge',        // 알림 충전
        'goto-license',             // 이용권 관리
        'goto-naver-setting',       // 네이버 예약 설정
        'goto-deposit-policy',      // 예약금 설정
        'goto-payment-method',      // 결제 수단 관리
        'goto-b2c-setting',         // 공비서로 예약받기
        'goto-calendar-setting',    // 캘린더 설정
        'goto-business-time'        // 영업 시간 설정
    ];

    /* ── staff-menu 타입: STAFF인 경우 해당 메뉴 코드 권한 필요 (19개) ── */
    var STAFF_MENU_COMMANDS = {
        'goto-shop-status':              'SHOP_STATISTIC', // 홈 > 샵 현황
        'goto-statistics':               'STATISTIC',      // 통계
        'goto-statistics-sale-item':     'STATISTIC',      // 통계 > 시술별 매출
        'goto-statistics-payment-method':'STATISTIC',      // 통계 > 결제 수단별 매출
        'goto-statistics-employee':      'STATISTIC',      // 통계 > 직원 통계
        'goto-membership':               'C002',           // 고객 > 회원권/포인트관리
        'goto-shop-cosmetic':            'F001',           // 우리샵 관리 > 시술메뉴
        'goto-shop-employee':            'F003',           // 우리샵 관리 > 직원관리
        'goto-shop-incentives':          'F003',           // 우리샵 관리 > 직원관리 > 인센티브
        'goto-auto-alarm':               'G005',           // 마케팅 > 알림톡/자동 문자
        'goto-customer':                 'C001',           // 고객 > 고객차트
        'action-create-customer':        'C001',           // 고객 등록 (고객차트 권한)
        'goto-customer-filter':          'C001',           // 고객 > 고객 필터 설정
        'goto-customer-group':           'C001',           // 고객 > 고객 그룹 설정
        'goto-send-number':              'G001',           // 마케팅 > 발신 번호 설정
        'goto-sms-send':                 'G001',           // 마케팅 > 문자 발송
        'goto-sms-auto-procedure':       'G004',           // 마케팅 > 시술 후 알림
        'goto-alimtalk-histories':       'G002',           // 마케팅 > 발송 내역
        'goto-shop-point':               'F002'            // 우리샵 관리 > 포인트/행사
    };

    /**
     * 커맨드 ID에 대한 권한 정보를 반환한다.
     * @param {string} commandId
     * @returns {{ type: string, menuCode?: string } | null}
     *   null이면 권한 체크 불필요 (누구나 접근 가능)
     */
    function getPermission(commandId) {
        if (OWNER_ONLY_COMMANDS.indexOf(commandId) > -1) {
            return { type: 'owner' };
        }
        if (STAFF_MENU_COMMANDS.hasOwnProperty(commandId)) {
            return { type: 'staff-menu', menuCode: STAFF_MENU_COMMANDS[commandId] };
        }
        return null;
    }

    /**
     * 현재 사용자가 해당 커맨드에 접근 가능한지 확인한다.
     * @param {string} commandId
     * @returns {boolean}
     */
    function canAccess(commandId) {
        var perm = getPermission(commandId);
        if (!perm) return true; // 권한 체크 불필요

        var kind = _getSessionKind();
        if (kind === '점주') return true; // 점주는 모든 권한 보유

        // 직원인 경우
        if (perm.type === 'owner') return false;

        if (perm.type === 'staff-menu') {
            return _hasMenuAuth(perm.menuCode);
        }

        return true;
    }

    /** sessionKind 값 조회 (hidden input에서) */
    function _getSessionKind() {
        var el = document.getElementById('sessionKind');
        return el ? el.value : '';
    }

    /** sessionMenu 권한 맵에서 해당 메뉴 코드의 authyn 확인 */
    function _hasMenuAuth(menuCode) {
        if (typeof window.__cmdPaletteMenuAuth === 'object' && window.__cmdPaletteMenuAuth !== null) {
            return window.__cmdPaletteMenuAuth[menuCode] === 'Y';
        }
        return false;
    }

    return {
        getPermission: getPermission,
        canAccess: canAccess
    };
})();
