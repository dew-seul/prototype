const MenuHandler = {
    init: function () {
        const _this = this;
        const sessionKind = $("#sessionKind").val();
        const sessionShopNo = $("#sessionShopNo").val();
        _this.intervalPollingRemainingAlarm();
        _this.renderAlimTalkInfoWithB2cSettingStatus(sessionShopNo);
        _this.buildShopList(sessionKind, sessionShopNo);
    },
    intervalPollingRemainingAlarm: function () {
        const _this = this;
        // 30 초 주기로 조회한다
        const interval = 1000 * 30;
        const $remainingAlarmCount = $('#remaining-alarm-count');

        _this.pollingRemainingAlarm()
            .then(data => $remainingAlarmCount.html(numberWithCommas(data.remainingAlarm)))
            .catch(err => console.error(err))
            .finally(() => setTimeout(() => MenuHandler.intervalPollingRemainingAlarm(), interval));
    },
    pollingRemainingAlarm: function () {
        // 3초 주기로 재시도한다
        const interval = 1000 * 3;
        // 최대 3번 재시도한다
        const maxAttempts = 3;
        const validate = response => !!response && Object.hasOwn(response, "remainingAlarm");

        return poller({
            handler: MenuHandler.fetchRemainingAlarm,
            interval: interval,
            maxAttempts: maxAttempts,
            validate: validate
        });
    },
    /**
     * @param {string} shopNo - 샵번호
     * */
    renderAlimTalkInfoWithB2cSettingStatus: async function(shopNo){
        const _this = this;
        const $alimTalkInfo = $('#alimtalk-info-with-b2c-setting');

        try {
            const b2cSettingStatus = await _this.fetchB2cSettingStatus(shopNo);
            const b2cAlimtalkSaving = await _this.fetchB2cSettingAlimtalkSaving(shopNo)
            const alimTalkInfoHtml = _this.getAlimTalkInfoWithB2cSettingStatusTemplate(b2cSettingStatus, b2cAlimtalkSaving);
            $alimTalkInfo.html(alimTalkInfoHtml);
        } catch(error){
            console.error(error);
        }
    },
    /**
     * @param {{approvalStatus:'NONE' | 'APPROVED' | 'REJECTED' | 'PENDING', isActive:boolean}} b2cSettingStatus - B2C 샵 연동 상태
     * @param {{alimtalkSendAmount:number, alimtalkUnitPrice:number, totalSavingAmount:number}} b2cAlimtalkSaving - 알림톡 상태
     * */
    getAlimTalkInfoWithB2cSettingStatusTemplate: function(b2cSettingStatus, b2cAlimtalkSaving){
        const _this = this;
        return _this.makeKakaoNotificationButton(b2cSettingStatus, b2cAlimtalkSaving)

    },
    fetchRemainingAlarm: async () => {
        const errorMessage = "샵 잔여알림 API 응답 실패";
        const $remainingAlarmCount = $('#remaining-alarm-count');

        return fetch("/web/v2/shops/me/remaining-alarm")
            .then(async response => {
                const body = await response.json()
                if (!response.ok) {
                    throw new Error(`${errorMessage}\n${JSON.stringify(body)}`);
                }
                return body.data;
            })
            .catch(err => {
                console.warn(err);
                $remainingAlarmCount.html('-');
                return err;
            })
    },
    fetchEmployeeToken: function(){
        return fetch('/api/v2/employees/token', {
            method:"POST",
        }).then((res)=>res.json()).then((res)=>res.data.token);
    },
    fetchB2cSettingStatus: async function(shopNo) {
        const _this = this;
        const token = await _this.fetchEmployeeToken();
        return fetch(`/api/v2/zero-shops/${shopNo}/status`, {
            headers: {
                "GD-Auth-Token": token
            }
        }).then((res)=>res.json()).then((res)=>res.data);
    },

    fetchB2cSettingAlimtalkSaving: async function(shopNo) {
        const _this = this;
        const token = await _this.fetchEmployeeToken();
        return fetch(`/api/v2/zero-shops/marketing/${shopNo}/alimtalk-saving`, {
            headers: {
                "GD-Auth-Token": token
            }
        }).then((res)=>res.json()).then((res)=>res.data);
    },
    buildShopList: function (sessionKind, sessionShopNo) {
        const _this = this;
        const shopOwnerType = "점주";
        if (shopOwnerType === sessionKind) {
            //샵 메뉴 리스트를 조회한다
            $.getJSON("/web/v2/shops")
                .done(function (result) {
                    const shopList = $("#shop-list");
                    result.data.map(shop => {
                        shopList.append(_this.makeShopItem(sessionShopNo, shop));
                    });

                    shopList.append(_this.makeShopAddItem());
                })
        }
    },
    makeShopItem: (sessionShopNo, shop) => {
        const {name, shopNo} = shop;
        return `
            <div class="dropdown-setting-menu-item" onclick="location.href='/shop/change/${shopNo}'">
                <span class="shop-change-btn ${sessionShopNo === shopNo ? 'active' : ''}">${name}</span>
                <i class="chevron-icon"></i>
                <i class="edit-icon" onclick="event.stopPropagation(); location.href='/shop/basic-info/${shopNo}'"></i>
            </div>
        `;
    },
    makeShopAddItem: () => `
            <div class="dropdown-setting-menu-item shop-add-item">
                <i class="on-off-icon"></i>
                <span onclick="location.href='/signup/shop'">샵 추가하기</span>
            </div>`,

    formatAmount:(amount) => {
        let numericAmount;

        if (typeof amount === 'string') {
            const cleanedAmount = amount.replace(/[^\d.-]/g, '')
            numericAmount = parseFloat(cleanedAmount)
        } else {
            numericAmount = amount
        }

        if (isNaN(numericAmount) || numericAmount < 0) {
            return ''
        }

        const MAX_DISPLAY_AMOUNT = 999_999_999_999
        const formatter = new Intl.NumberFormat('ko-KR')

        if (numericAmount > MAX_DISPLAY_AMOUNT) {
            return `${formatter.format(MAX_DISPLAY_AMOUNT)}원+`
        }

        return `${formatter.format(numericAmount)}원`
        return amount.toLocaleString();
    },

    goToB2cSettingPage: function(){
        location.href = '/b2c/setting';
    },

    openAlimtalkInfo: function(){
        const sessionKind = $("#sessionKind").val();
        const shopOwnerType = "점주";
        if (shopOwnerType === sessionKind) {
            window.open('/popup-window/alarmtalk-info', 'popup-window', 'width=356,height=356')
        }else{
            alert('접근 권한이 없습니다.')
        }
    },

    makeKakaoNotificationButton: function(b2cSettingStatus, b2cSettingAlarmSavingInfo) {
        const _this = this;
        const { approvalStatus, isActive } = b2cSettingStatus || {};
        const alimtalkSendAmount = b2cSettingAlarmSavingInfo?.alimtalkSendAmount ?? 0;
        const totalSavingAmount = b2cSettingAlarmSavingInfo?.totalSavingAmount ?? 0;
        const formattedSavingAmount = _this.formatAmount(totalSavingAmount);


        if (approvalStatus === 'REJECTED') {
            return '<div style="width: 100%; height: 4px"></div>';
        }

        const isApproved = approvalStatus === 'APPROVED';
        const marginTop = isApproved ? '16px' : '18px';
        const arrowClass = isApproved ? 'show-tooltip-arrow' : '';

        if (approvalStatus === 'APPROVED') {
            if (isActive) {
                if (alimtalkSendAmount === 0) {
                    return `
                        <div class="KakaoNotificationButtonWrapper ${arrowClass}" style="margin-top:${marginTop};">
                          <div class="kakao-notification-button" onclick="return false;">
                            <div class="subtitle-s color-gray-0 opacity-60">공비서로 예약받고 있어요.</div>
                            <div class="title-s color-gray-0">모든 알림톡 전송 시 100% 무료!</div>
                          </div>
                        </div>
                    `;
                } else {
                    return `
                        <div class="KakaoNotificationButtonWrapper ${arrowClass}" style="margin-top:${marginTop};">
                          <div class="kakao-notification-button" data-track-id="menu_callout" onclick="MenuHandler.openAlimtalkInfo()" >
                            <div class="subtitle-s color-gray-0 opacity-60">카카오 알림톡 무료 혜택으로</div>
                            <div class="title-s color-gray-0">총 ${formattedSavingAmount} 아꼈어요!</div>
                          </div>
                       </div>
                    `;
                }
            } else {
                return `
                    <div class="KakaoNotificationButtonWrapper ${arrowClass}" style="margin-top:${marginTop};">
                        <div class="kakao-notification-button" data-track-id="menu_callout"  onclick="MenuHandler.goToB2cSettingPage()">
                          <div class="subtitle-s color-gray-0 opacity-60">공비서로 예약받기를 꺼두셨네요?</div>
                          <div class="title-s color-gray-0">지금 예약받기 시작하면 알림톡 무료!</div>
                        </div>
                     </div>
                  `;
            }
        }

        if (approvalStatus === 'NONE') {
            return `
                <div data-track-id="menu_callout" class="KakaoNotificationButtonWrapper ${arrowClass}" style="margin-top:${marginTop};"  onclick="MenuHandler.goToB2cSettingPage()">
                  <div class="kakao-notification-button-none" >
                    <i class="icon icon-kakao-white icon--size-20 color-gray-0"></i>
                    <span class="title-s color-gray-0">카카오 알림톡 무료로 보내기</span>
                    <i class="icon icon-right-white icon--size-20 color-gray-0"></i>
                  </div>
               </div>
            `;
        }

        return '';
    }

}

$(function () {
    MenuHandler.init();
});
