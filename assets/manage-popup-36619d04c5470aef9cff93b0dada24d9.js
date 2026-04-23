// need jquery
$(function () {
	let queue = []; // 모달을 순차적으로 관리할 큐

	function renderPopupComponent({ id, link, url, content }) {
		const html = url ? `<img src="${url}"></img>` : content;
		const popupHTML = `
			<div class="modal-wrapper" id="event-popup${id}" style="display: none;">
				<div class="modal-dimmer isActiveDimmed"></div>
				<div class="modal-content">
					<div class="notice-popup-wrapper">
						<div class="notice-popup-close-button-wrapper" data-id="${id}">
							<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
								<path fill-rule="evenodd" clip-rule="evenodd" d="M5.6129 4.2097C5.22061 3.90468 4.65338 3.93241 4.29289 4.29289C3.90237 4.68342 3.90237 5.31658 4.29289 5.70711L10.5858 12L4.29289 18.2929C3.90237 18.6834 3.90237 19.3166 4.29289 19.7071C4.65338 20.0676 5.22061 20.0953 5.6129 19.7903L5.70711 19.7071L12 13.4142L18.2929 19.7071L18.3871 19.7903C18.7794 20.0953 19.3466 20.0676 19.7071 19.7071C20.0976 19.3166 20.0976 18.6834 19.7071 18.2929L13.4142 12L19.7071 5.70711C20.0976 5.31658 20.0976 4.68342 19.7071 4.29289C19.3466 3.93241 18.7794 3.90468 18.3871 4.2097L18.2929 4.29289L12 10.5858L5.70711 4.29289L5.6129 4.2097Z" fill="#20232B"/>
							</svg>
						</div>
						<div onclick="${link ? `window.open('${link}', '_blank')` : ''}">
							${html}
						</div>
						<div class="notice-popup-footer-wrapper">
							<h4 class="hide-notice-popup-today" data-id="${id}">하루 동안 보지 않기</h4>
						</div>
					</div>
				</div>				
			</div>
		`;

		$('body .content .page').after(popupHTML);
		queue.push(`event-popup${id}`); // 큐에 모달 ID 추가
	}

	function showNextPopup() {
		if (queue.length === 0) return; // 더 이상 모달이 없으면 종료
		const nextPopupId = queue[0]; // 큐의 첫 번째 모달 가져오기
		$('#' + nextPopupId).show(); // 모달 표시
	}

	// 모달 닫기
	function hideModalWithId(id) {
		$('#' + id).hide();
		queue.shift(); // 현재 모달 제거
		showNextPopup(); // 다음 모달 표시
	}

	// 하루 동안 보지 않기 버튼 클릭
	function hideNoticePopupToday(id) {
		const todayDate = new Date();
		todayDate.setHours(23, 59, 59, 999);
		document.cookie = `${id}=hidden; path=/; expires=${todayDate.toUTCString()};`;

		hideModalWithId(id);
	}

	// 이벤트 핸들러 추가
	$(document).on('click', '.modal-dimmer', function () {
		const popupId = queue[0];
		hideModalWithId(popupId);
	});

	$(document).on('click', '.notice-popup-close-button-wrapper', function () {
		const popupId = queue[0];
		hideModalWithId(popupId);
	});

	$(document).on('click', '.hide-notice-popup-today', function () {
		const popupId = queue[0];
		hideNoticePopupToday(popupId);
	});

	// AJAX 요청 후 모달 표시
	$.ajax({
		type: 'GET',
		url: '/popup',
		data: 'd=' + getDummy(),
		success: function (data) {
			if (data.result == 'SUCCESS') {
				data.popList.forEach(popItem => {
					if (!document.cookie.includes(`event-popup${popItem.id}=hidden`)) {
						renderPopupComponent({
							id: popItem.id,
							link: popItem.link,
							url: popItem.url,
							content: popItem.content
						});
					}
				});
				showNextPopup(); // 첫 번째 모달 표시
			}
		},
	});
});
$(document).mouseup(function (e) {
	if ($('.ui .modal .eval-popup').hasClass('visible')) {
		if (
			!$('.visible').is(e.target) &&
			$('.visible').has(e.target).length <= 0
		) {
			$('.visible').removeClass('visible')
		}
	}
})

function hideElement(id){
	$('#' + id).removeClass('visible');
}

function hideModalWithId(id){
	hideElement(id);
}

function hideNoticePopupWithPeriod(id, period) {
	//console.log('hidepopup'+id+'/'+period);
	var todayDate = new Date()
	todayDate.setDate(todayDate.getDate() + period)
	document.cookie =
		id + '=hidden; path=/; domain=.gongbiz.kr; expires=' + todayDate.toGMTString() + ';'

	$('#' + id).removeClass('visible')
	$('#' + id).css('display', 'none')
}

$(function () {
	if (
		$('.modal.tutorial-wrap').length == 0 ||
		$('.modal.tutorial-wrap').hasClass('hidden')
	) {
		if (
			document.cookie.indexOf('event-popup-store-20220314=hidden') < 0 &&
			isNotWelcome()
		) {
			$.ajax({
				type: 'GET',
				url: '/api/store/event',
				data: 'd=' + getDummy(),
				success: function (data) {
					if (data.result == 'SUCCESS') {
						if (data.popYn === 'Y') {
							var eventPop_arr = []
							eventPop_arr.push(
								'<div class="eventpopup_Dimmer" id="event-popup-store-20220314">'
							)
							eventPop_arr.push('    <div class="popup_Area">')
							eventPop_arr.push(
								'    	   <a class="close" style="display: none" onclick="$(\'#event-popup-store-20220314\').css(\'display\',\'none\');"><img src="https://gongnail-art.s3.ap-northeast-2.amazonaws.com/static/storevent/close.svg"/></a>'
							)
							eventPop_arr.push('        <div class="popup_Box">')
							eventPop_arr.push(
								'            <img src="https://crm-image.gongbiz.kr/static/storevent/20220314/popup_img.png" usemap="#Map" />'
							) /* usemap="#Map" 추가*/
							eventPop_arr.push('            <map name="Map">')
							eventPop_arr.push(
								'              <area shape="rect" coords="8,188,203,290" style="cursor: pointer;" onclick="onClickGongNailShop(\'1643850178\');" target="_blank">'
							)
							eventPop_arr.push(
								'              <area shape="rect" coords="203,187,393,292" style="cursor: pointer;" onclick="onClickGongNailShop(\'1646275717\');" target="_blank">'
							)
							eventPop_arr.push(
								'              <area shape="rect" coords="8,289,201,392" style="cursor: pointer;" onclick="onClickGongNailShop(\'1645407541\');" target="_blank">'
							)
							eventPop_arr.push(
								'              <area shape="rect" coords="201,290,393,393" style="cursor: pointer;" onclick="onClickGongNailShop(\'1645687591\');" target="_blank">'
							)
							eventPop_arr.push('            </map>')
							eventPop_arr.push('        </div>')
							eventPop_arr.push('        <div class="popup_Btn">')
							eventPop_arr.push(
								"            <a onclick=\"hideNoticePopupWithPeriod('event-popup-store-20220314', " +
								data.popNotSeeDay +
								');">' +
								data.popNotSeeMsg +
								'</a>'
							)
							eventPop_arr.push('        </div>')
							eventPop_arr.push('    </div>')
							eventPop_arr.push('</div>')
							$('body .content .page').after(
								eventPop_arr.join('')
							)
						} else {
							hideNoticePopupWithPeriod(
								'event-popup-store-20220314',
								1
							)
						}
					}
				},
			})
		}
	}
})

function isNotWelcome() {
	return getParameter('welcome') !== '1'
}
