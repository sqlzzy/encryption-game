export default function changeTextElement(element, text) {
  const defaultText = element.textContent;

  element.textContent = text;

  setTimeout(() => {
    element.textContent = defaultText;
  }, 1000);
}
