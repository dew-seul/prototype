 $(function() {
    $.ajax({
        type: 'GET',
        url: '/api/v2/popups/gongbiz-store',
        success: function(data) {
            const {id, backgroundImageUrl, imageLinkUrlParameterKeys, imageLinkUrlParameterValues} = data.data;
            const popupId = 'gongbiz_store_popup_' + id;
            const isShown = data.data.id && document.cookie.indexOf(popupId) < 0 && getParameter('welcome') !== '1';

            if (!isShown) {
                return false;
            }

            const innerHtml =
                `<div class="eventpopup_Dimmer" id="${popupId}">
                    <div class="popup_Area">
                        <div class="popup_Box">
                            <img src="${backgroundImageUrl}" usemap="#Map" />
                            <map name="Map">
                                <area shape="rect" coords="0,256,200,384" style="cursor: pointer;"
                                    onclick="goGongbizStore(
                                        '${imageLinkUrlParameterKeys[0]}', '${imageLinkUrlParameterValues[0]}')"
                                        target="_blank">
                                <area shape="rect" coords="200,256,400,384" style="cursor: pointer;"
                                    onclick="goGongbizStore(
                                        '${imageLinkUrlParameterKeys[1]}', '${imageLinkUrlParameterValues[1]}')" 
                                        target="_blank">
                                <area shape="rect" coords="0,384,200,512" style="cursor: pointer;"
                                    onclick="goGongbizStore(
                                        '${imageLinkUrlParameterKeys[2]}', '${imageLinkUrlParameterValues[2]}')" 
                                        target="_blank">
                                <area shape="rect" coords="200,384,400,512" style="cursor: pointer;"
                                    onclick="goGongbizStore(
                                        '${imageLinkUrlParameterKeys[3]}', '${imageLinkUrlParameterValues[3]}')" 
                                        target="_blank">
                            </map>
                        </div>
                        <div class="popup_Btn-wrapper">
                            <div class="popup_Btn close" onclick="$('#${popupId}').css('display', 'none');">
                                닫기
                            </div>
                            <div class="popup_Btn temporary-off" onclick="hideGongbizStorePopup('${popupId}')">
                                3일간 보지 않기
                            </div>
                        </div>
                    </div>
                <div`;

            $('#gongbiz_store_popup_content').append(innerHtml);
        },
        error: function(xhr) {
            console.error(xhr);
        }
    });
});

function goGongbizStore(parameterKey, parameterValue) {
	$.ajax({
		 type: 'POST',
		 url: '/api/shoppingmall',
		 success: function(data) {
			if (data.result === 'NOT LOGIN') {
				alert('로그인 되어 있지 않습니다.');
                return false;
			}

            if (data.result !== 'SUCCESS') {
				alert('실패 하였습니다. 다시 시도 해보십시오.');
                return false;
			}

            switch (parameterKey) {
                case 'productcode':
                    window.open(data.url + '&productcode=' + parameterValue, '_blank');
                    break;
                case 'it_id':
                    window.open(data.url + '&it_id=' + parameterValue, '_blank');
                    break;
                case 'ca_id':
                    window.open(data.url + '&ca_id=' + parameterValue, '_blank');
                    break;
                case 'ev_id':
                    window.open(data.url + '&ev_id=' + parameterValue, '_blank');
                    break;
                default:
                    alert('연결할 수 없는 링크입니다.');
            }
		 }
	});
}

function hideGongbizStorePopup(popupId) {
    const hidePeriod = 3;
	let date = new Date()

	date.setDate(date.getDate() + hidePeriod)
    document.cookie = popupId + '=hidden; domain=.gongbiz.kr; path=/; expires=' + date.toGMTString() + ';'

	$('#' + popupId).css('display', 'none');
}
