import { ALT_QRCODE_IMAGE } from "./constants.js";

export default function addQrCodeToElement(element, idRoom) {
  const qrCodeImg = document.createElement("img");

  qrCodeImg.src = `../images/qrCodes/${idRoom}.png`;
  qrCodeImg.alt = ALT_QRCODE_IMAGE;

  element.appendChild(qrCodeImg);
}
