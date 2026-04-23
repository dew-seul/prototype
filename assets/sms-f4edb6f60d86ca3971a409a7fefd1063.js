function onClickFindRecipient() {
  showModal({
    selector: ".modal.sms-find-recipient",
    approve: {
        selector: ".emphasize.button"
      },
      negative: {
        selector: ".normal.button"
      }
  });
}

function onClickChargeSms() {
  showModal({
    selector: ".modal.sms-charge",
    approve: {
      selector: ".emphasize.button"
    },
    negative: {
      selector: ".normal.button"
    }
  });
}

function onClickAutoSmsPreview() {
  showModal({
    selector: ".modal.sms-auto-preview",
    approve: {
        selector: ".emphasize.button"
      },
      negative: {
        selector: ".normal.button"
      }
  });
}

