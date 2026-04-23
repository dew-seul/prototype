// 다양한 문자 샘플 모달 — 인터랙션
// 외부에서 window.openSampleModal() 호출하여 모달 오픈
(function() {
  const modal = document.getElementById('gbzMmodal');
  const dim = document.getElementById('gbzMdim');
  const closeBtn = document.getElementById('gbzMclose');

  window.openSampleModal = function() {
    dim.classList.add('is-show');
    modal.classList.add('is-show');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };
  function closeModal() {
    dim.classList.remove('is-show');
    modal.classList.remove('is-show');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }
  closeBtn.addEventListener('click', closeModal);
  dim.addEventListener('click', closeModal);
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && modal.classList.contains('is-show')) closeModal();
  });

  function highlightVars(raw) {
    return raw.replace(/\[([^\]]+)\]/g, function(m, inner) {
      const sysVars = ['고객이름', '시술이름', '예약일시'];
      if (sysVars.indexOf(inner) !== -1) return '<span class="gbz-m-var">[' + inner + ']</span>';
      return m;
    });
  }
  function getByteLength(str) {
    let b = 0;
    for (const ch of str) b += ch.charCodeAt(0) > 127 ? 2 : 1;
    return b;
  }

  const tpls = document.querySelectorAll('.gbz-m-tpl');
  tpls.forEach(function(tpl) {
    const raw = tpl.getAttribute('data-msg') || '';
    tpl.querySelector('.gbz-m-tpl-msg').innerHTML = highlightVars(raw);
    const bytes = getByteLength(raw);
    const byteEl = tpl.querySelector('.gbz-m-tpl-byte');
    byteEl.textContent = bytes + 'byte' + (bytes > 90 ? ' · 90byte 초과 시 LMS 발송' : '');
    if (bytes > 90) byteEl.classList.add('is-over');
  });

  const toast = document.getElementById('gbzMtoast');
  const toastMsg = toast.querySelector('.gbz-m-toast-msg');
  let toastTimer;
  function showToast(text) {
    toastMsg.textContent = text;
    toast.classList.add('is-show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function() { toast.classList.remove('is-show'); }, 2000);
  }

  document.querySelectorAll('.gbz-m-tpl-copy').forEach(function(btn) {
    btn.addEventListener('click', async function() {
      const tpl = btn.closest('.gbz-m-tpl');
      const raw = tpl.getAttribute('data-msg') || '';
      try {
        await navigator.clipboard.writeText(raw);
      } catch (e) {
        const ta = document.createElement('textarea');
        ta.value = raw;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
      }
      showToast('문자 내용을 복사했어요. 입력란에 붙여넣어 주세요.');
    });
  });

  const chips = document.querySelectorAll('.gbz-m-chip');
  const empty = document.getElementById('gbzMempty');
  function applyFilter() {
    const activeChip = document.querySelector('.gbz-m-chip[aria-pressed="true"]');
    const cat = activeChip ? activeChip.dataset.cat : 'all';
    let visible = 0;
    tpls.forEach(function(tpl) {
      const show = cat === 'all' || tpl.dataset.cat === cat;
      tpl.style.display = show ? '' : 'none';
      if (show) visible++;
    });
    empty.style.display = visible === 0 ? '' : 'none';
  }
  chips.forEach(function(chip) {
    chip.addEventListener('click', function() {
      chips.forEach(function(c) { c.setAttribute('aria-pressed', 'false'); });
      chip.setAttribute('aria-pressed', 'true');
      applyFilter();
      /* 선택된 칩이 좌/우 fade 영역에 걸치면 자동으로 보이는 영역으로 스크롤 */
      chip.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
    });
  });

  /* 칩 가로 스크롤 힌트 */
  const chipGroup = document.getElementById('gbzMchipGroup');
  const chipFade = document.getElementById('gbzMchipFade');
  const chipFadeL = document.getElementById('gbzMchipFadeL');
  const chipNext = document.getElementById('gbzMchipNext');
  const chipPrev = document.getElementById('gbzMchipPrev');

  function updateFade() {
    const max = chipGroup.scrollWidth - chipGroup.clientWidth;
    const sl = chipGroup.scrollLeft;
    const atEnd = sl >= max - 2;
    const atStart = sl <= 2;
    chipFade.classList.toggle('is-hide', atEnd || max <= 0);
    chipFadeL.classList.toggle('is-hide', atStart || max <= 0);
  }
  chipGroup.addEventListener('scroll', updateFade);
  window.addEventListener('resize', updateFade);
  /* 한 번에 약 2칩 정도만 이동 (예측 가능한 인터랙션) */
  const CHIP_STEP = 160;
  chipNext.addEventListener('click', function() {
    chipGroup.scrollBy({ left: CHIP_STEP, behavior: 'smooth' });
  });
  chipPrev.addEventListener('click', function() {
    chipGroup.scrollBy({ left: -CHIP_STEP, behavior: 'smooth' });
  });
  // 모달 열릴 때 초기화
  const origOpen = window.openSampleModal;
  window.openSampleModal = function() {
    origOpen();
    requestAnimationFrame(updateFade);
  };
  requestAnimationFrame(updateFade);
})();