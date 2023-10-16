import { CLASS_SHOW_ELEMENT, CLASS_HIDE_ELEMENT } from "./constants.js";

export default function hideElement(element) {
  if (element.classList.contains(CLASS_SHOW_ELEMENT)) {
    element.classList.remove(CLASS_SHOW_ELEMENT);
  }

  element.classList.add(CLASS_HIDE_ELEMENT);
}
