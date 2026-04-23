/**
 * Command Palette — GA4 검색 로그
 */
var CMD_LOG = (function () {
    'use strict';

    var EVENT_NAME = 'cmd_k_search';

    function getShopNo() {
        var el = document.getElementById('sessionShopNo');
        return el ? el.value : null;
    }

    /**
     * GA4 이벤트 전송
     * @param {Object} params
     * @param {string}  params.query
     * @param {string}  params.sessionId
     * @param {number}  [params.resultCount]
     * @param {boolean} [params.noResults]
     * @param {boolean} [params.abandoned]
     * @param {string}  [params.selectedCommandId]
     * @param {string}  [params.commandLabel]
     */
    function send(params) {
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({
            event: EVENT_NAME,
            search_query: params.query || '',
            result_count: params.resultCount || 0,
            no_results: !!params.noResults,
            abandoned: !!params.abandoned,
            selected_command_id: params.selectedCommandId || null,
            session_id: params.sessionId || '',
            shop_no: getShopNo()
        });
    }

    return {
        send: send
    };
})();
