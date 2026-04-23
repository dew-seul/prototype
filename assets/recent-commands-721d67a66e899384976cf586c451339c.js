/**
 * Command Palette — 최근 사용 & 빈도 추적
 */
var CMD_RECENT = (function () {
    'use strict';

    var LS_KEY_RECENT = 'gongbiz-recent-commands';
    var LS_KEY_FREQ   = 'gongbiz-command-frequency';
    var MAX_RECENT = 3;
    var MAX_FREQ   = 50;

    /* ── 최근 사용 커맨드 ── */
    function getRecentList() {
        try {
            return JSON.parse(localStorage.getItem(LS_KEY_RECENT) || '[]');
        } catch (e) {
            return [];
        }
    }

    function addRecentCommand(id, label) {
        var list = getRecentList();
        list = list.filter(function (item) { return item.id !== id; });
        list.unshift({ id: id, label: label, usedAt: Date.now() });
        if (list.length > MAX_RECENT) list = list.slice(0, MAX_RECENT);
        localStorage.setItem(LS_KEY_RECENT, JSON.stringify(list));
    }

    /** 최근 사용 그룹을 커맨드 그룹 형태로 반환 */
    function buildRecentGroup(findCommandById) {
        var list = getRecentList();
        if (list.length === 0) return null;

        var commands = [];
        for (var i = 0; i < list.length; i++) {
            var cmd = findCommandById(list[i].id);
            if (cmd) {
                var clone = {};
                for (var key in cmd) {
                    if (cmd.hasOwnProperty(key)) clone[key] = cmd[key];
                }
                commands.push(clone);
            }
        }
        if (commands.length === 0) return null;

        return {
            heading: '최근 사용',
            searchOnly: false,
            commands: commands
        };
    }

    /* ── 검색 빈도 추적 ── */
    function getFrequencyMap() {
        try {
            return JSON.parse(localStorage.getItem(LS_KEY_FREQ) || '{}');
        } catch (e) {
            return {};
        }
    }

    function trackCommand(commandId) {
        var map = getFrequencyMap();
        map[commandId] = (map[commandId] || 0) + 1;

        var keys = Object.keys(map);
        if (keys.length > MAX_FREQ) {
            var minKey = keys[0];
            for (var i = 1; i < keys.length; i++) {
                if (map[keys[i]] < map[minKey]) minKey = keys[i];
            }
            delete map[minKey];
        }

        localStorage.setItem(LS_KEY_FREQ, JSON.stringify(map));
    }

    return {
        addRecentCommand: addRecentCommand,
        buildRecentGroup: buildRecentGroup,
        trackCommand: trackCommand
    };
})();
