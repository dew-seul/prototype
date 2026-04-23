const emojiRegex = /[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|\ud83c[\ude32-\ude3a]|\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff]/g;

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

if (typeof Object.assign != 'function') {
  // Must be writable: true, enumerable: false, configurable: true
  Object.defineProperty(Object, "assign", {
    value: function assign(target, varArgs) { // .length of function is 2
      'use strict';
      if (target == null) { // TypeError if undefined or null
        throw new TypeError('Cannot convert undefined or null to object');
      }

      var to = Object(target);

      for (var index = 1; index < arguments.length; index++) {
        var nextSource = arguments[index];

        if (nextSource != null) { // Skip over if undefined or null
          for (var nextKey in nextSource) {
            // Avoid bugs when hasOwnProperty is shadowed
            if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
              to[nextKey] = nextSource[nextKey];
            }
          }
        }
      }
      return to;
    },
    writable: true,
    configurable: true
  });
}

if (!Array.prototype.findIndex) {
  Object.defineProperty(Array.prototype, 'findIndex', {
    value: function(predicate) {
      'use strict';
      if (this == null) {
        throw new TypeError('Array.prototype.findIndex called on null or undefined');
      }
      if (typeof predicate !== 'function') {
        throw new TypeError('predicate must be a function');
      }
      var list = Object(this);
      var length = list.length >>> 0;
      var thisArg = arguments[1];
      var value;

      for (var i = 0; i < length; i++) {
        value = list[i];
        if (predicate.call(thisArg, value, i, list)) {
          return i;
        }
      }
      return -1;
    },
    enumerable: false,
    configurable: false,
    writable: false
  });
}

// 특수 문자가 있나 없나 체크
function checkSpecial(str) {
    var special_pattern = /[`~!@#$%^&*|\\\'\";:\/?]/gi;
    if (special_pattern.test(str) == true) {
        return false;
    } else {
        return true;
    }
}

// 공백이 있나 없나 체크
function checkSpace(str) {
    if (str.search(/\s/) != -1) {
        return false;
    } else {
        return true;
    }
}

function removeSpaceSpecialChar(event) {
	event = event || window.event;
	var keyID = (event.which) ? event.which : event.keyCode;
	if ( keyID == 8 || keyID == 46 || keyID == 37 || keyID == 39 ) {

	}
	else{
		event.target.value = event.target.value.replace(/\s/, "");
		event.target.value = event.target.value.replace(/[`~{}\+\-\=!@#$%^&*|\\\'\";:\/?\[\]]/gi, "");
	}

}

function removeEmojis (str) {
  const regex = /(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|\ud83c[\ude32-\ude3a]|\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])/g;
  return str.replace(regex, '');
}

function prependZero(num, len) {
    while(num.toString().length < len) {
        num = '0' + num;
    }
    return num;
}

function forEach(arr, callback) {
  var length = arr.length;
  for (var i = 0; i < length; i ++) {
    callback(arr[i], i, arr);
  }
}

function traceParentByClassName(element, className) {
  var curr = element;
  if (curr.classList.contains(className)) {
    return curr;
  }

  while (curr.parentElement) {
    curr = curr.parentElement;
    if (curr.classList.contains(className)) {
      return curr;
    }
  }
}

function checkPlatform(ua) {
	if(ua === undefined) {
		ua = window.navigator.userAgent;
	}

	ua = ua.toLowerCase();
	var platform = {};
	var matched = {};
	var userPlatform = "pc";
	var platform_match = /(ipad)/.exec(ua) || /(ipod)/.exec(ua)
		|| /(windows phone)/.exec(ua) || /(iphone)/.exec(ua)
		|| /(kindle)/.exec(ua) || /(silk)/.exec(ua) || /(android)/.exec(ua)
		|| /(win)/.exec(ua) || /(mac)/.exec(ua) || /(linux)/.exec(ua)
		|| /(cros)/.exec(ua) || /(playbook)/.exec(ua)
		|| /(bb)/.exec(ua) || /(blackberry)/.exec(ua)
		|| [];

	matched.platform = platform_match[0] || "";

	if(matched.platform) {
		platform[matched.platform] = true;
	}

	if(platform.android || platform.bb || platform.blackberry
			|| platform.ipad || platform.iphone
			|| platform.ipod || platform.kindle
			|| platform.playbook || platform.silk
			|| platform["windows phone"]) {
		userPlatform = "mobile";
	}

	if(platform.cros || platform.mac || platform.linux || platform.win) {
		userPlatform = "pc";
	}

	return userPlatform;
}



/*
 * classList.js: Cross-browser full element.classList implementation.
 * 1.1.20170427
 *
 * By Eli Grey, http://eligrey.com
 * License: Dedicated to the public domain.
 *   See https://github.com/eligrey/classList.js/blob/master/LICENSE.md
 */

/*global self, document, DOMException */

/*! @source http://purl.eligrey.com/github/classList.js/blob/master/classList.js */

if ("document" in self) {

// Full polyfill for browsers with no classList support
// Including IE < Edge missing SVGElement.classList
if (!("classList" in document.createElement("_"))
  || document.createElementNS && !("classList" in document.createElementNS("http://www.w3.org/2000/svg","g"))) {

(function (view) {

"use strict";

if (!('Element' in view)) return;

var
    classListProp = "classList"
  , protoProp = "prototype"
  , elemCtrProto = view.Element[protoProp]
  , objCtr = Object
  , strTrim = String[protoProp].trim || function () {
    return this.replace(/^\s+|\s+$/g, "");
  }
  , arrIndexOf = Array[protoProp].indexOf || function (item) {
    var
        i = 0
      , len = this.length
    ;
    for (; i < len; i++) {
      if (i in this && this[i] === item) {
        return i;
      }
    }
    return -1;
  }
  // Vendors: please allow content code to instantiate DOMExceptions
  , DOMEx = function (type, message) {
    this.name = type;
    this.code = DOMException[type];
    this.message = message;
  }
  , checkTokenAndGetIndex = function (classList, token) {
    if (token === "") {
      throw new DOMEx(
          "SYNTAX_ERR"
        , "An invalid or illegal string was specified"
      );
    }
    if (/\s/.test(token)) {
      throw new DOMEx(
          "INVALID_CHARACTER_ERR"
        , "String contains an invalid character"
      );
    }
    return arrIndexOf.call(classList, token);
  }
  , ClassList = function (elem) {
    var
        trimmedClasses = strTrim.call(elem.getAttribute("class") || "")
      , classes = trimmedClasses ? trimmedClasses.split(/\s+/) : []
      , i = 0
      , len = classes.length
    ;
    for (; i < len; i++) {
      this.push(classes[i]);
    }
    this._updateClassName = function () {
      elem.setAttribute("class", this.toString());
    };
  }
  , classListProto = ClassList[protoProp] = []
  , classListGetter = function () {
    return new ClassList(this);
  }
;
// Most DOMException implementations don't allow calling DOMException's toString()
// on non-DOMExceptions. Error's toString() is sufficient here.
DOMEx[protoProp] = Error[protoProp];
classListProto.item = function (i) {
  return this[i] || null;
};
classListProto.contains = function (token) {
  token += "";
  return checkTokenAndGetIndex(this, token) !== -1;
};
classListProto.add = function () {
  var
      tokens = arguments
    , i = 0
    , l = tokens.length
    , token
    , updated = false
  ;
  do {
    token = tokens[i] + "";
    if (checkTokenAndGetIndex(this, token) === -1) {
      this.push(token);
      updated = true;
    }
  }
  while (++i < l);

  if (updated) {
    this._updateClassName();
  }
};
classListProto.remove = function () {
  var
      tokens = arguments
    , i = 0
    , l = tokens.length
    , token
    , updated = false
    , index
  ;
  do {
    token = tokens[i] + "";
    index = checkTokenAndGetIndex(this, token);
    while (index !== -1) {
      this.splice(index, 1);
      updated = true;
      index = checkTokenAndGetIndex(this, token);
    }
  }
  while (++i < l);

  if (updated) {
    this._updateClassName();
  }
};
classListProto.toggle = function (token, force) {
  token += "";

  var
      result = this.contains(token)
    , method = result ?
      force !== true && "remove"
    :
      force !== false && "add"
  ;

  if (method) {
    this[method](token);
  }

  if (force === true || force === false) {
    return force;
  } else {
    return !result;
  }
};
classListProto.toString = function () {
  return this.join(" ");
};

if (objCtr.defineProperty) {
  var classListPropDesc = {
      get: classListGetter
    , enumerable: true
    , configurable: true
  };
  try {
    objCtr.defineProperty(elemCtrProto, classListProp, classListPropDesc);
  } catch (ex) { // IE 8 doesn't support enumerable:true
    // adding undefined to fight this issue https://github.com/eligrey/classList.js/issues/36
    // modernie IE8-MSW7 machine has IE8 8.0.6001.18702 and is affected
    if (ex.number === undefined || ex.number === -0x7FF5EC54) {
      classListPropDesc.enumerable = false;
      objCtr.defineProperty(elemCtrProto, classListProp, classListPropDesc);
    }
  }
} else if (objCtr[protoProp].__defineGetter__) {
  elemCtrProto.__defineGetter__(classListProp, classListGetter);
}

}(self));

}

// There is full or partial native classList support, so just check if we need
// to normalize the add/remove and toggle APIs.

(function () {
  "use strict";

  var testElement = document.createElement("_");

  testElement.classList.add("c1", "c2");

  // Polyfill for IE 10/11 and Firefox <26, where classList.add and
  // classList.remove exist but support only one argument at a time.
  if (!testElement.classList.contains("c2")) {
    var createMethod = function(method) {
      var original = DOMTokenList.prototype[method];

      DOMTokenList.prototype[method] = function(token) {
        var i, len = arguments.length;

        for (i = 0; i < len; i++) {
          token = arguments[i];
          original.call(this, token);
        }
      };
    };
    createMethod('add');
    createMethod('remove');
  }

  testElement.classList.toggle("c3", false);

  // Polyfill for IE 10 and Firefox <24, where classList.toggle does not
  // support the second argument.
  if (testElement.classList.contains("c3")) {
    var _toggle = DOMTokenList.prototype.toggle;

    DOMTokenList.prototype.toggle = function(token, force) {
      if (1 in arguments && !this.contains(token) === !force) {
        return force;
      } else {
        return _toggle.call(this, token);
      }
    };

  }

  testElement = null;
}());

}

function zeroPad(n, width) {
  n = n + '';
  return n.length >= width ?
      n : new Array(width - n.length + 1).join('0') + n;
}

// screenlock timer
let lockTime = 600;
setInterval(function() {
  let min = parseInt(lockTime/60);
  let sec = lockTime%60;
  let target = $('.lock-time');

  target.text('자동 잠금 ' + zeroPad(min, 2) + ':' + zeroPad(sec, 2));
  lockTime--;

  if (target.length > 0 && lockTime < 0) {
    $(location).attr('href', '/shop/lock/timeout?'
        + 'rtnUrl=' + $(location).attr('pathname')
        + '&rtnMenu=' + target.data('rtn-menu'));
  }
}, 1000);

function getParameter(key) {
  let result = null;
  let tmp = [];
  location.search
      .substr(1)
      .split("&")
      .forEach((item) => {
        tmp = item.split("=");
        if (tmp[0] === key) result = decodeURIComponent(tmp[1]);
      });
  return result;
}

function validateEmoji(target) {
  if (emojiRegex.test(target.value)) {
    alert("이모지는 입력할 수 없습니다.");
    target.value = target.value.replace(emojiRegex, '');
  }
}

function checkEmoji(target, event) {
  const inputType = event.originalEvent ? event.originalEvent.inputType : event.inputType;
  const ignoreType = 'insertCompositionText';

  if (inputType === ignoreType) {
    /*
     * 윈도우 이모지 입력시 input 이벤트가 두번 발생한다,
     * 먼저 발생하면서 MAC에 없는 inputType인 insertCompositionText 인 경우
     * replace 처리하면서 아무런 메시지 표현을 안하고 넘어간다.
     */
    target.value = target.value.replace(emojiRegex, '');
  }

  if (emojiRegex.test(target.value)) {
    alert("이모지는 입력할 수 없습니다.");
    target.value = target.value.replace(emojiRegex, '');
  }
}

function contains(string, findValue) {
  return string.indexOf(findValue) > -1;
}

/**
 * yyyy-MM-dd 포맷인지 확인한다.
 * @param date
 * @returns {boolean}
 */
function isDate(date){
  if(date === null || date === undefined  || date == "") {
    return false;
  }

  const pattern = /^\d{4}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[0-1])$/;

  return pattern.test(date);
}
/**
 * startDate, endDate가 yyyy-MM-dd 포맷인지 확인한다.
 * @param date
 * @returns {boolean}
 */
function isValidPeriod(startDate, endDate){
  return isDate(startDate) && isDate(endDate);
}


/**
 * 휴대폰 번호 포맷인지 확인한다
 * @param contact
 * @returns {boolean}
 */
function isContact(contact) {
  const contactRegex = /^([0-9]{8,11})$/;
  return contact.match(contactRegex);
}

/**
 * 빈 문자열인지 체크한다
 * @param str
 * @returns {boolean}
 */
function isBlank(str) {
  return str === undefined || str === null || str === "";
}


/**
 * @description 특정 시간이 범위 내에 있는지 확인합니다.
 * @param targetDateTime {string} - 대상 날짜
 * @param startDateTime {string} - 시작 날짜
 * @param endDateTime {string} - 끝 날짜
 * @param includeStart {boolean} - 시작 시간을 포함할지 여부
 * @param includeEnd {boolean} - 종료 시간을 포함할지 여부
 */
function isDateTimeWithinRange({
  targetDateTime,
  startDateTime,
  endDateTime,
  includeStart = false,
  includeEnd = false,
}) {
  const format = 'YYYY-MM-DD HH:mm:ss'

  // time을 dayjs 객체로 변환 및 포매팅
  const target = dayjs(targetDateTime, format)
  const start = dayjs(startDateTime, format)
  const end = dayjs(endDateTime, format)

  // 유효성 검사
  if (!target.isValid() || !start.isValid() || !end.isValid()) {
    throw new Error('잘못된 날짜 형식입니다. 입력된 날짜가 형식에 맞는지 확인하세요.')
  }

  return target.isBetween(start, end, null, getDayjsIsBetweenInclusiveOption(includeStart, includeEnd))
}

/**
 * @description dayjs isBetween 매서드의 옵션으로 두 문자로 구성된 문자열이며, 각 문자는 시작과 끝 날짜(시간)의 포함 여부를 나타냅니다
 * '[]': 시작 날짜와 끝 날짜 모두를 포함합니다.
 * '()': 시작 날짜와 끝 날짜 모두를 포함하지 않습니다 (기본값).
 * '[)': 시작 날짜는 포함하고, 끝 날짜는 포함하지 않습니다.
 * '(]': 시작 날짜는 포함하지 않고, 끝 날짜는 포함합니다.
 * @param includeStart {boolean}
 * @param includeEnd {boolean}
 */
const getDayjsIsBetweenInclusiveOption = (includeStart, includeEnd) => {
  return [includeStart ? '[' : '(', includeEnd ? ']' : ')'].join('')
}