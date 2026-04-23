function addEventListenerToAll(comps, eventType, func) {
  var length = comps.length;
  for (var i = 0; i < length; i ++) {
    var comp = comps[i];
    comp.addEventListener(eventType, func);
  }
}

function toggleClass(classList, cls) {
  if (classList.contains(cls)) {
    classList.remove(cls);
  } else {
    classList.add(cls);
  }
}


//
// Quantity Picker
//
function initQuantityPickers() {
  var components = document.querySelectorAll(".quantity-picker");
  forEach(components, initQuantityPicker);
}

function initQuantityPicker(component) {
  var number = component.querySelector(".number");
  var decr = component.querySelector(".decr");
  var incr = component.querySelector(".incr");
  decr.addEventListener("click", function (e) {
    if (decr.classList.contains("inactive")) {
      return;
    }

    var curr = Number(number.innerText);
    if (curr == 2) {
      decr.classList.add("inactive");
    }

    number.innerText = Number(number.innerText) - 1;
  });
  incr.addEventListener("click", function (e) {
    decr.classList.remove("inactive");
    number.innerText = Number(number.innerText) + 1;
  });
}


//
// dropdown
//
function onClickDropdown(e) {
  // assume event is fired to text or icon
  var dropdown = e.target.parentElement;
  toggleClass(dropdown.classList, "opened");
}

function onClickDropdownItem(e) {
  // assume item element's grand parent is dropdown component
  var dropdown = e.target.parentElement.parentElement;
  toggleClass(dropdown.classList, "opened");
  
  var active = dropdown.querySelectorAll(".item.active");
  for (var i = 0; i < active.length; i ++) {
	  toggleClass(active[i].classList, "active"); 
  }
  toggleClass(e.target.classList, "active");

  var currentText = dropdown.querySelector(".text");
  currentText.innerText = e.target.getAttribute("data-text");
  currentText.setAttribute("data-value", e.target.getAttribute("data-value"));
}

function initDropdown(dropdown) {
  var items = dropdown.querySelectorAll(".item");
  var length = items.length;
  for (var i = 0; i < length; i ++) {
    items[i].addEventListener("click", onClickDropdownItem);
  }
}

function initDropdowns() {
  var dropdowns = document.querySelectorAll(".ui.dropdown");
  var length = dropdowns.length;
  for (var i = 0; i < length; i ++) {
    var dropdown = dropdowns[i];
    dropdown.addEventListener("click", onClickDropdown);
    initDropdown(dropdown);
  }
}


//
// choose-date
//
function onClickChooseDate(e) {
  if (e.target.classList.contains("text") || e.target.classList.contains("fa-caret-down")) {
  } else {
    return;
  }

  // assume clicked element's parent is dropdown component
  var elem = e.target.parentElement;
  toggleClass(elem.classList, "opened");
}

function initChooseDate(chooseDate) {
  var year = chooseDate.getAttribute("data-year");
  var month = chooseDate.getAttribute("data-month");
  var text = year + "년 " + month + "월 ";

  chooseDate.addEventListener("click", onClickChooseDate, false);
  var dates = chooseDate.querySelectorAll(".calendar-body .date");
  forEach(dates, function (item, index, array) {
    item.addEventListener("click", function (e) {
      var textElement = chooseDate.querySelector(".text");
      textElement.innerText = text + e.target.innerText + "일";
      toggleClass(chooseDate.classList, "opened");
    });
  });
}

function initChooseDates() {
  var chooseDates = document.querySelectorAll(".ui.choose-date");
  var length = chooseDates.length;
  for (var i = 0; i < length; i ++) {
    var comp = chooseDates[i];
    initChooseDate(comp)
  }
}


//
// modal
//
function onClickModalTab(clicked, nextTabClassName) {
  var modal = traceParentByClassName(clicked, "modal");
  var tabs = modal.querySelector(".tabs");

  var prevActiveItem = tabs.querySelector(".item.active");
  toggleClass(prevActiveItem.classList, "active");
  toggleClass(clicked.parentElement.classList, "active");

  var prevActiveContent = modal.querySelector(".tab-content:not(.hidden)");
  var nextActiveContent = modal.querySelector(".tab-content." + nextTabClassName);
  toggleClass(prevActiveContent.classList, "hidden");
  toggleClass(nextActiveContent.classList, "hidden");

  if($('#memfrm-dueyn-no').is(':checked')) {
    $('.periodSetting.membership').css('display','none');
  } else {
    $('.periodSetting.membership').css('display','block');
  }

  if($('#ticfrm-dueyn-no').is(':checked')) {
    $('.periodSetting.ticket').css('display','none');
  } else {
    $('.periodSetting.ticket').css('display','block');
  }
}

function setBodyDimmed(dimming) {
  var body = document.querySelector("body");
  if (dimming) {
    body.classList.add("dimmed");
  } else {
    body.classList.remove("dimmed");
  }
}

function getDimmer(comp) {
  return comp.parentElement.classList.contains("dimmer") ? comp.parentElement : undefined;
}

function showModal(args) {
  var modal = document.querySelector(args.selector);
  var dimmer = getDimmer(modal);
  if (dimmer && !dimmer.classList.contains("visible")) {
    dimmer.classList.add("visible");
    setBodyDimmed(true);
  }

  var payload = {
    comp: modal,
    args: args,
    events: []
  };

  if (args.approve) {
    var func = function (e) {
      if (args.approve.callback) {
        args.approve.callback(e);
      }
      if (args.approve.canHide == null || args.approve.canHide) {
        hideModal(e);
      }
    };
    forEach(modal.querySelectorAll(args.approve.selector), function (item, index, array) {
      payload.events.push({
        element: item,
        type: "click",
        callback: func
      });
      item.addEventListener("click", func);
    });
  }
  if (args.negative) {
    var func = function (e) {
      if (args.negative.callback && args.negative.callback(e)) {
        hideModal(e);
      } else {
        hideModal(e);
      }
    };
    forEach(modal.querySelectorAll(args.negative.selector), function (item, index, array) {
      payload.events.push({
        element: item,
        type: "click",
        callback: func
      });
      item.addEventListener("click", func);
    });
  }

  toggleClass(modal.classList, "visible");

  modalStack.push(payload);
}

function hideModal(e) {
  var popped = modalStack.pop();
  var comp = popped.comp;
  var args = popped.args;

  forEach(popped.events, function (item, index, array) {
    item.element.removeEventListener(item.type, item.callback);
  });

  var dimmer = getDimmer(comp);
  if (modalStack.length == 0 && dimmer && dimmer.classList.contains("visible")) {
    dimmer.classList.remove("visible");
    setBodyDimmed(false);
  }
  toggleClass(comp.classList, "visible");
}

function initModal(comp) {
  comp.addEventListener("click", function (e) {
    e.stopPropagation();
  });

  var closeButton = comp.querySelector(".ui.modal-close.button");
  if (closeButton) {
    closeButton.addEventListener("click",  function (e) {
      hideModal(e);
      e.stopPropagation();
    });
  }
}

modalStack = [];
function initModals() {
	
  var modals = document.querySelectorAll(".ui.modal");
  var length = modals.length;
  for (var i = 0; i < length; i ++) {
    var comp = modals[i];
    initModal(comp);
  }

  var dimmers = document.querySelectorAll(".ui.dimmer");
  for ( i = 0; i < dimmers.length; i ++) {
	  dimmers[i].addEventListener("click", function (e) {
        const modalDivArray = e.target.children;
        const visible = "visible";

        for( let idx = 0; idx < modalDivArray.length; idx++ ) {
          if (modalDivArray.item(idx).className.includes(visible)) {
            if(modalDivArray.item(idx).dataset.backdrop === "static") {
              return;
            }
          }
        }

		  while (modalStack.length > 0) {
		        hideModal(e);
		  }
		  e.stopPropagation();
	  });
  }
//  var dimmer = document.querySelector(".ui.dimmer");
//  if (dimmer) {
//    dimmer.addEventListener("click", function (e) {
//      while (modalStack.length > 0) {
//        hideModal(e);
//      }
//      e.stopPropagation();
//    });
//  }
}


function showAlertModal(message, buttonText, callback) {
  var messageContainer = document.querySelector(".ui.modal.alert .message");
  messageContainer.innerText = message;
  var button = document.querySelector(".ui.modal.alert .emphasize.button");
  button.innerText = buttonText;

  showModal({
    selector: ".ui.modal.alert",
    approve: {
      selector: ".emphasize.button",
      callback: callback
    }
  });
}

function showConfirmModal(payload) {	
  var messageContainer = document.querySelector(".ui.modal.confirm .message");
  messageContainer.innerText = payload.message;
  var approveButton = document.querySelector(".ui.modal.confirm .emphasize.button");
  approveButton.innerText = payload.approve.text;
  var negativeButton = document.querySelector(".ui.modal.confirm .normal.button");
  negativeButton.innerText = payload.negative.text;

  showModal({
    selector: ".ui.modal.confirm",
    approve: {
      selector: ".emphasize.button",
      callback: payload.approve.callback
    },
    negative: {
      selector: ".normal.button",
      callback: payload.negative.callback
    }
  });
}


function initTables() {
  forEach(document.querySelectorAll(".table-wrap th.column-header"), function (item, index, array) {
    item.addEventListener("click", function (e) {
      var optionSelectable = e.target.querySelector(".column-option-selectable");
      if (optionSelectable) {
        toggleClass(optionSelectable.classList, "opened");
      }
    });
  });

  forEach(document.querySelectorAll(".table-wrap th.column-header .column-option-selectable"), function (item, index, array) {
    item.addEventListener("click", function (e) {
      var optionSelectable = traceParentByClassName(e.target, "column-option-selectable");
      toggleClass(optionSelectable.classList, "opened");
    });
  });
}

function onClickTableDataInputAction(element) {
  var tbody = element.parentElement;
  var inputForm = tbody.querySelector(".add-new-item-form");
  if (element.classList.contains("inputting")) {
    inputForm.classList.add("hidden");
    element.classList.remove("inputting");
  } else {
    inputForm.classList.remove("hidden");
    element.classList.add("inputting");
  }
}

function onClickTableDataInputCloseButton(element) {
  var tbody = element.parentElement.parentElement.parentElement;
  tbody.querySelector(".add-new-item-form").classList.add("hidden");
  tbody.querySelector(".add-new-item-action").classList.remove("inputting");
}

function onClickTableDataEditAction(element, step, action, inputElementId) {
  var td = element.parentElement;
  for(i = 1 ; i < step ; i++){
	  td = td.parentElement;
  }
  toggleClass(td.classList, "editting");

  if (typeof inputElementId != "undefined" && inputElementId) {
    document.querySelector("#" + inputElementId).focus();
  }
}

function onClickTableMoreButton(element) {
  var overflowWrap = element.parentElement.querySelector(".overflow-wrap");
  var height = overflowWrap.offsetHeight;
  overflowWrap.style.maxHeight = (height + 300) + "px";
}

function toggleSearchResult(element) {
  var container = element.parentElement.querySelector(".search-result");
  toggleClass(container.classList, "hidden");
}


window.addEventListener("load", function (e) {
  initQuantityPickers();
  initDropdowns();
  initChooseDates();
  initModals();
  initTables();
});


// notificaitons
/*
function onClickOpenNotifications(e) {
  var container = document.querySelector(".notifications");
  toggleClass(container.classList, "open");
}
*/

function goUrlWithDate(url){
	var date = new Date();
	var separator = url.indexOf('?') > -1 ? '&' : '?';
	var newUrl = url + separator + "d=" + date.getTime();
	
	// 매출 또는 회원권/포인트 관리 또는 화면 잠금 관리 메뉴인 경우 fromMenu=true 파라미터 추가하여 화면 잠금 기능을 분기 처리한다. 해당 페이지 웹프론트로 전환 시 로직 제거 필요
	if (url === '/sale' || url === '/cust/membership' || url === '/shop/lock/pwd') {
		newUrl += "&fromMenu=true";
	}
	
	location.href = newUrl;
}
