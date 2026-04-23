/**
 * Command Palette — 메인 로직
 *
 * 의존성: Fuse.js, command-data.js, guide-data.js, recent-commands.js, search-log.js
 */
var cmdPalette = (function () {
    'use strict';

    /* ── SVG 아이콘 ── */
    var ICON_SEARCH = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>';
    var ICON_BACK = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>';

    /* ── 상태 ── */
    var isOpen = false;
    var search = '';
    var selectedIndex = 0;
    var depth = 1;
    var sessionId = '';
    var didSelect = false;
    var fuse1depth = null;
    var fuse2depth = null;
    var listEventsBound = false;
    var isKeyboardNav = false;

    /* ── Fuse.js 설정 ── */
    var fuseOptions = {
        keys: [
            { name: 'label',       weight: 2 },
            { name: 'keywords',    weight: 1 },
            { name: 'description', weight: 0.5 }
        ],
        threshold: 0.4,
        distance: 100,
        ignoreLocation: true,
        includeScore: true
    };

    /* ── 초기화 ── */
    function init() {
        try {
            var allCommands = COMMAND_META.getAllFlatCommands();
            var guideSearchGroup = GUIDE_DATA.getSearchOnlyGuideGroup();
            var allSearchable = allCommands.concat(guideSearchGroup.commands);
            fuse1depth = new Fuse(allSearchable, fuseOptions);

            var guideGroups = GUIDE_DATA.getGuideGroups();
            var allGuideItems = [];
            for (var i = 0; i < guideGroups.length; i++) {
                allGuideItems = allGuideItems.concat(guideGroups[i].commands);
            }
            fuse2depth = new Fuse(allGuideItems, fuseOptions);
        } catch (e) {
            console.error('[CommandPalette] init error:', e);
        }

        bindGlobalShortcuts();
        initSearchTriggerBadge();
    }

    /* ── 글로벌 단축키 ── */
    function bindGlobalShortcuts() {
        document.addEventListener('keydown', function (e) {
            var tag = e.target.tagName;
            var isEditable = (tag === 'INPUT' || tag === 'TEXTAREA' || e.target.isContentEditable);

            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                toggle();
                return;
            }

            if (isOpen) {
                handlePaletteKeyDown(e);
                return;
            }

            if (isEditable) return;

            if ((e.metaKey || e.ctrlKey) && e.key === 'b') {
                e.preventDefault();
                location.href = '/book/calendar';
            }
            if ((e.metaKey || e.ctrlKey) && e.key === 'u') {
                e.preventDefault();
                location.href = '/customer';
            }
            if ((e.metaKey || e.ctrlKey) && e.key === 'n') {
                e.preventDefault();
                localStorage.setItem('cmdKCreateBookingModal', 'true');
                var isCalendarPage = location.pathname.indexOf('/book/calendar') > -1;
                if (isCalendarPage) {
                    window.dispatchEvent(new Event('cmdKOpenCreateBooking'));
                } else {
                    goUrlWithDate('/book/calendar');
                }
            }
        });
    }

    /* ── 사이드바 검색 뱃지 ── */
    function initSearchTriggerBadge() {
        var badge = document.getElementById('searchTriggerBadge');
        if (badge) {
            var isMac = /Mac/.test(navigator.userAgent);
            badge.textContent = isMac ? '\u2318K' : 'Ctrl+K';
        }
    }

    /* ── 모달 열기/닫기 ── */
    function open() {
        isOpen = true;
        search = '';
        selectedIndex = 0;
        depth = 1;
        didSelect = false;
        sessionId = Date.now() + '-' + Math.random().toString(36).slice(2, 9);

        document.getElementById('cmdPalette').style.display = 'grid';

        if (!listEventsBound) {
            bindListEvents(document.getElementById('cmdList'));
            listEventsBound = true;
        }

        var inputEl = document.getElementById('cmdSearchInput');
        inputEl.value = '';
        inputEl.placeholder = '\uC5B4\uB5A4 \uAE30\uB2A5\uC744 \uCC3E\uC73C\uC2DC\uB098\uC694? \uC608) \uC624\uD6C4 5\uC2DC \uC608\uC57D';
        document.getElementById('cmdSearchIcon').className = 'cmd-search-icon';
        document.body.style.overflow = 'hidden';

        render();
        setTimeout(function () { inputEl.focus(); }, 30);
    }

    function close() {
        if (!isOpen) return;

        if (!didSelect && search.trim().length >= 2) {
            var flat = getCurrentFlatCommands();
            CMD_LOG.send({
                query: search,
                sessionId: sessionId,
                resultCount: flat.length,
                noResults: flat.length === 0,
                abandoned: true
            });
        }

        isOpen = false;
        document.getElementById('cmdPalette').style.display = 'none';
        document.body.style.overflow = '';
    }

    function toggle() {
        isOpen ? close() : open();
    }

    /* ── 검색 입력 ── */
    var searchTimer = null;

    function onSearchChange(e) {
        search = e.target.value;
        selectedIndex = 0;
        render();

        clearTimeout(searchTimer);
        if (search.trim().length >= 2) {
            searchTimer = setTimeout(function () {
                var flat = getCurrentFlatCommands();
                CMD_LOG.send({
                    query: search,
                    sessionId: sessionId,
                    resultCount: flat.length,
                    noResults: flat.length === 0
                });
            }, 700);
        }
    }

    /* ── 그룹 생성 ── */
    function getActiveGroups() {
        var groups = (depth === 2) ? get2depthGroups() : get1depthGroups();
        /* isHidden()이 true인 커맨드 제외 */
        var filtered = [];
        for (var i = 0; i < groups.length; i++) {
            var cmds = groups[i].commands.filter(function (cmd) {
                return !(typeof cmd.isHidden === 'function' && cmd.isHidden());
            });
            if (cmds.length > 0) {
                filtered.push({ heading: groups[i].heading, searchOnly: groups[i].searchOnly, commands: cmds });
            }
        }
        return filtered;
    }

    function get1depthGroups() {
        var query = search.trim();

        if (!query) {
            /* 기본: 추천 → 최근 → 빠른작업 → 빠른이동 → 샵설정 → 가이드및고객센터 */
            var groups = [];
            var promoGroup = COMMAND_META.buildPromotionGroup();
            if (promoGroup) groups.push(promoGroup);

            var recentGroup = CMD_RECENT.buildRecentGroup(function (id) {
                var cmd = COMMAND_META.findCommandById(id);
                if (cmd) return cmd;
                /* 가이드 커맨드에서도 검색 (guide-item- 접두사 호환) */
                var guideId = id.replace(/^guide-item-/, '');
                var guideGroup = GUIDE_DATA.getSearchOnlyGuideGroup();
                for (var g = 0; g < guideGroup.commands.length; g++) {
                    if (guideGroup.commands[g].id === guideId || guideGroup.commands[g].id === id) return guideGroup.commands[g];
                }
                return null;
            });
            if (recentGroup) groups.push(recentGroup);

            var allGroups = COMMAND_META.getAllGroups();
            for (var i = 0; i < allGroups.length; i++) {
                if (!allGroups[i].searchOnly) groups.push(allGroups[i]);
            }
            return groups;
        }

        /* 검색 모드 */
        var matchedIds = {};
        var fuseResults = fuse1depth.search(query);
        for (var r = 0; r < fuseResults.length; r++) {
            matchedIds[fuseResults[r].item.id] = true;
        }

        /* 스마트 액션 */
        var smartGroup = buildSmartActionGroup(query);

        /* 기존 그룹에서 매칭 ID만 필터링 (searchOnly 포함) */
        var allGroups = COMMAND_META.getAllGroups();
        var guideSearchGroup = GUIDE_DATA.getSearchOnlyGuideGroup();
        var sourceGroups = allGroups.concat([guideSearchGroup]);

        var result = [];
        if (smartGroup) result.push(smartGroup);

        for (var g = 0; g < sourceGroups.length; g++) {
            var filtered = sourceGroups[g].commands.filter(function (cmd) {
                return matchedIds[cmd.id];
            });
            if (filtered.length > 0) {
                result.push({
                    heading: sourceGroups[g].heading,
                    commands: filtered
                });
            }
        }
        return result;
    }

    function get2depthGroups() {
        var query = search.trim();
        var guideGroups = GUIDE_DATA.getGuideGroups();

        if (!query) return guideGroups;

        var matchedIds = {};
        var fuseResults = fuse2depth.search(query);
        for (var r = 0; r < fuseResults.length; r++) {
            matchedIds[fuseResults[r].item.id] = true;
        }

        var result = [];
        for (var g = 0; g < guideGroups.length; g++) {
            var filtered = guideGroups[g].commands.filter(function (cmd) {
                return matchedIds[cmd.id];
            });
            if (filtered.length > 0) {
                result.push({
                    heading: guideGroups[g].heading,
                    commands: filtered
                });
            }
        }
        return result;
    }

    function getCurrentFlatCommands() {
        return getFlatCommands(getActiveGroups());
    }

    function getFlatCommands(groups) {
        var result = [];
        for (var i = 0; i < groups.length; i++) {
            for (var j = 0; j < groups[i].commands.length; j++) {
                result.push(groups[i].commands[j]);
            }
        }
        return result;
    }

    /* ── 스마트 액션 (시간 파싱) ── */
    function parseTimeFromQuery(query) {
        var trimmed = query.trim();
        if (!trimmed) return null;

        var hours = null;
        var minutes = 0;
        var isPM = null;

        if (/오전/.test(trimmed)) isPM = false;
        if (/오후/.test(trimmed)) isPM = true;

        var colonMatch = trimmed.match(/(\d{1,2}):(\d{2})/);
        if (colonMatch) {
            hours = parseInt(colonMatch[1], 10);
            minutes = parseInt(colonMatch[2], 10);
        }

        if (hours === null) {
            var koreanMatch = trimmed.match(/(\d{1,2})\s*시\s*(?:(\d{1,2})\s*분|반)?/);
            if (koreanMatch) {
                hours = parseInt(koreanMatch[1], 10);
                if (koreanMatch[2]) {
                    minutes = parseInt(koreanMatch[2], 10);
                } else if (/반/.test(trimmed)) {
                    minutes = 30;
                }
            }
        }

        if (hours === null || isNaN(hours) || hours < 0 || hours > 23) return null;
        if (isNaN(minutes) || minutes < 0 || minutes > 59) return null;

        if (isPM === true && hours < 12) hours += 12;
        if (isPM === false && hours === 12) hours = 0;

        return { hours: hours, minutes: minutes, isExplicitPeriod: isPM !== null };
    }

    function buildSmartActionGroup(query) {
        var parsed = parseTimeFromQuery(query);
        if (!parsed) return null;

        var now = new Date();
        var todayAtTime = new Date(now);
        todayAtTime.setHours(parsed.hours, parsed.minutes, 0, 0);

        if (!parsed.isExplicitPeriod && parsed.hours < 12 && now > todayAtTime) {
            var pmCandidate = new Date(todayAtTime);
            pmCandidate.setHours(pmCandidate.getHours() + 12);
            if (now <= pmCandidate) {
                todayAtTime = pmCandidate;
            }
        }

        var bookingDate = (now > todayAtTime)
            ? new Date(todayAtTime.getTime() + 24 * 60 * 60 * 1000)
            : todayAtTime;

        var desc = formatSmartBookingDesc(bookingDate);

        return {
            heading: '빠른 작업',
            commands: [{
                id: 'smart-booking-' + bookingDate.getTime(),
                label: '예약 등록',
                description: desc,
                keywords: [],
                category: 'action',
                badge: null,
                hasSubMenu: false,
                action: function () {
                    var iso = bookingDate.toISOString();
                    var isCalendarPage = location.pathname.indexOf('/book/calendar') > -1;
                    localStorage.setItem('cmdKCreateBookingModal', JSON.stringify({ date: iso }));
                    if (isCalendarPage) {
                        window.dispatchEvent(new Event('cmdKOpenCreateBooking'));
                    } else {
                        var url = '/book/calendar';
                        var params = new URLSearchParams(window.location.search);
                        if (params.get('canAccess') === 'true') {
                            url += '?canAccess=true';
                        }
                        goUrlWithDate(url);
                    }
                }
            }]
        };
    }

    function formatSmartBookingDesc(date) {
        var month = date.getMonth() + 1;
        var day = date.getDate();
        var dayNames = ['일', '월', '화', '수', '목', '금', '토'];
        var dayName = dayNames[date.getDay()];
        var h = date.getHours();
        var m = date.getMinutes();
        var period = h < 12 ? '오전' : '오후';
        var displayH = h <= 12 ? h : h - 12;
        if (displayH === 0) displayH = 12;
        var timeStr = period + ' ' + displayH + ':' + (m < 10 ? '0' + m : m);

        return month + '월 ' + day + '일 (' + dayName + ') ' + timeStr + ' 신규 예약 등록';
    }

    /* ── 렌더링 ── */
    function render() {
        var groups = getActiveGroups();
        var listEl = document.getElementById('cmdList');
        var emptyEl = document.getElementById('cmdEmpty');
        var flat = getFlatCommands(groups);

        if (flat.length === 0 && search.trim()) {
            listEl.style.display = 'none';
            emptyEl.style.display = '';
            return;
        }
        listEl.style.display = '';
        emptyEl.style.display = 'none';

        var html = '';
        var flatIdx = 0;
        for (var g = 0; g < groups.length; g++) {
            if (g > 0) html += '<div class="cmd-group-divider"></div>';
            html += '<div class="cmd-group">';
            html += '<div class="cmd-group-heading">' + escapeHtml(groups[g].heading) + '</div>';
            for (var c = 0; c < groups[g].commands.length; c++) {
                var cmd = groups[g].commands[c];
                var isSel = (flatIdx === selectedIndex);
                html += renderCommandItem(cmd, flatIdx, isSel);
                flatIdx++;
            }
            html += '</div>';
        }
        listEl.innerHTML = html;

        var sel = listEl.querySelector('[data-selected="true"]');
        if (sel) sel.scrollIntoView({ block: 'nearest' });
    }

    function bindListEvents(listEl) {
        listEl.addEventListener('click', function (e) {
            var item = e.target.closest('.cmd-item');
            if (!item) return;
            var idx = parseInt(item.getAttribute('data-flat-index'), 10);
            if (!isNaN(idx)) cmdPalette.selectByIndex(idx);
        });
        listEl.addEventListener('mousemove', function () {
            isKeyboardNav = false;
        });
        listEl.addEventListener('mouseenter', function (e) {
            if (isKeyboardNav) return;
            var item = e.target.closest('.cmd-item');
            if (!item) return;
            var idx = parseInt(item.getAttribute('data-flat-index'), 10);
            if (!isNaN(idx)) cmdPalette.hoverIndex(idx);
        }, true);
    }

    function renderCommandItem(cmd, flatIdx, isSelected) {
        return '<div class="cmd-item' + (isSelected ? ' selected' : '') + '"'
            + ' data-flat-index="' + flatIdx + '"'
            + ' data-command-id="' + cmd.id + '"'
            + ' data-selected="' + isSelected + '"'
            + ' role="option" aria-selected="' + isSelected + '">'
            + '<div class="cmd-item-label-wrapper">'
            + '<div class="cmd-item-text-group">'
            + '<div class="cmd-item-title">' + escapeHtml(cmd.label)
            + '</div>'
            + (cmd.description ? '<div class="cmd-item-description">' + escapeHtml(cmd.description) + '</div>' : '')
            + '</div></div>'
            + (cmd.hasSubMenu ? '<span class="cmd-item-submenu-arrow" aria-hidden="true"><svg width="20" height="20" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M19.2929 13.2929C19.6834 12.9024 20.3166 12.9024 20.7071 13.2929L30.7071 23.2929C31.0976 23.6834 31.0976 24.3166 30.7071 24.7071L20.7071 34.7071C20.3166 35.0976 19.6834 35.0976 19.2929 34.7071C18.9024 34.3166 18.9024 33.6834 19.2929 33.2929L28.5858 24L19.2929 14.7071C18.9024 14.3166 18.9024 13.6834 19.2929 13.2929Z" fill="#20232B"/></svg></span>' : '')
            + '</div>';
    }

    /* ── 키보드 핸들링 (팔레트 내부) ── */
    function handlePaletteKeyDown(e) {
        if (e.key === 'Escape') {
            e.preventDefault();
            if (depth === 2) { goBack(); }
            else { close(); }
            return;
        }

        var flat = getCurrentFlatCommands();

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                isKeyboardNav = true;
                selectedIndex = (selectedIndex < flat.length - 1) ? selectedIndex + 1 : 0;
                render();
                break;
            case 'ArrowUp':
                e.preventDefault();
                isKeyboardNav = true;
                selectedIndex = (selectedIndex > 0) ? selectedIndex - 1 : flat.length - 1;
                render();
                break;
            case 'Enter':
                e.preventDefault();
                if (flat[selectedIndex]) selectCommand(flat[selectedIndex]);
                break;
        }
    }

    /* ── 커맨드 실행 ── */
    function selectCommand(cmd) {
        if (cmd.id === 'help-guide') {
            depth = 2;
            search = '';
            selectedIndex = 0;
            var inputEl = document.getElementById('cmdSearchInput');
            inputEl.value = '';
            inputEl.placeholder = '\uCC3E\uC73C\uC2DC\uB294 \uAE30\uB2A5\uC744 \uC785\uB825\uD574 \uBCF4\uC138\uC694.';
            document.getElementById('cmdSearchIcon').className = 'cmd-search-icon cmd-search-icon--back clickable';
            document.getElementById('cmdSearchIcon').onclick = goBack;
            render();
            return;
        }

        /* 권한 체크 */
        if (typeof COMMAND_PERMISSION !== 'undefined' && !COMMAND_PERMISSION.canAccess(cmd.id)) {
            alert('접근 권한이 없습니다.');
            return;
        }

        didSelect = true;

        if (search.trim().length >= 2) {
            var flat = getCurrentFlatCommands();
            CMD_LOG.send({
                query: search,
                sessionId: sessionId,
                resultCount: flat.length,
                selectedCommandId: cmd.id,
                commandLabel: cmd.label
            });
        }

        /* 가이드 항목은 guide-item- 접두사로 저장 (React와 호환) */
        var recentId = cmd.category === 'guide' ? 'guide-item-' + cmd.id : cmd.id;
        CMD_RECENT.addRecentCommand(recentId, cmd.label);
        CMD_RECENT.trackCommand(recentId);

        /* 가이드(새 탭) 커맨드는 모달 유지, 나머지는 닫기 */
        if (cmd.category !== 'guide') {
            close();
        }

        try {
            cmd.action();
        } catch (e) {
            console.error('[CommandPalette] action error:', e);
        }
    }

    /* ── 2depth 뒤로가기 ── */
    function goBack() {
        depth = 1;
        search = '';
        selectedIndex = 0;
        var inputEl = document.getElementById('cmdSearchInput');
        inputEl.value = '';
        inputEl.placeholder = '\uC5B4\uB5A4 \uAE30\uB2A5\uC744 \uCC3E\uC73C\uC2DC\uB098\uC694? \uC608) \uC624\uD6C4 5\uC2DC \uC608\uC57D';
        document.getElementById('cmdSearchIcon').className = 'cmd-search-icon';
        document.getElementById('cmdSearchIcon').onclick = null;
        render();
    }

    /* ── 유틸 ── */
    function escapeHtml(str) {
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
    }

    /* ── Public API ── */
    return {
        init: init,
        open: open,
        close: close,
        toggle: toggle,
        selectByIndex: function (idx) {
            var flat = getCurrentFlatCommands();
            if (flat[idx]) selectCommand(flat[idx]);
        },
        hoverIndex: function (idx) {
            selectedIndex = idx;
            var listEl = document.getElementById('cmdList');
            var items = listEl.querySelectorAll('.cmd-item');
            for (var i = 0; i < items.length; i++) {
                var fi = parseInt(items[i].getAttribute('data-flat-index'), 10);
                if (fi === idx) {
                    items[i].classList.add('selected');
                    items[i].setAttribute('data-selected', 'true');
                    items[i].setAttribute('aria-selected', 'true');
                } else {
                    items[i].classList.remove('selected');
                    items[i].setAttribute('data-selected', 'false');
                    items[i].setAttribute('aria-selected', 'false');
                }
            }
        },
        handleOverlayClick: function (e) {
            if (e.target === e.currentTarget) close();
        },
        onSearchChange: onSearchChange
    };
})();

document.addEventListener('DOMContentLoaded', function () {
    cmdPalette.init();

    document.getElementById('cmdSearchInput')
        .addEventListener('input', cmdPalette.onSearchChange);
});
