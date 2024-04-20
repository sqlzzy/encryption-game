export default function showMessageAfterElement(text, element) {
  const spanMessage = document.createElement("span");
  spanMessage.textContent = text;
  spanMessage.style.color = "#40cd18";
  spanMessage.style.marginTop = "12px";
  spanMessage.setAttribute("id", "info-message");

  element.insertAdjacentElement("afterend", spanMessage);
}
