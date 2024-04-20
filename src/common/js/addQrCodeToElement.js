export default function addQrCodeToElement(element, idRoom) {
  const qrCodeImg = document.createElement("img");

  qrCodeImg.src = `../images/qrCodes/${idRoom}.png`;
  qrCodeImg.alt = "Qr-код ссылки на комнату";

  element.appendChild(qrCodeImg);
}
