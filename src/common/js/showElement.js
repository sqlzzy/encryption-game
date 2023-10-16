import { CLASS_SHOW_ELEMENT, CLASS_HIDE_ELEMENT } from "./constants.js";

export default function showElement(element) {
  if (element.classList.contains(CLASS_HIDE_ELEMENT)) {
    element.classList.remove(CLASS_HIDE_ELEMENT);
  }

  element.classList.add(CLASS_SHOW_ELEMENT);
}
