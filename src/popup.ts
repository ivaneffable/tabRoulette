import ExtPay from "extpay";

import { EXTENSION_ID } from "./background";

const tipButton = document.getElementById("tip");
const spinButton = document.getElementById("spin");
spinButton?.addEventListener("click", () => {
  chrome.runtime.sendMessage({ type: "spin" });
});

const extpay = ExtPay(EXTENSION_ID);
extpay.getUser().then((user) => {
  console.log(user);
  if (!user.paid && tipButton) {
    tipButton.style.display = "block";
    tipButton.addEventListener("click", (evt) => {
      evt.preventDefault();
      extpay.openPaymentPage();
    });
  }
});
