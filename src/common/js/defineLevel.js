import {
  LEVEL_EASY_ENG,
  LEVEL_MEDIUM_ENG,
  LEVEL_HARD_ENG,
  LEVEL_EASY_RU,
  LEVEL_MEDIUM_RU,
  LEVEL_HARD_RU,
} from "/common/js/constants.js";

export default function defineLevel(level) {
  let nameLevel = "";

  if (level === LEVEL_EASY_ENG) {
    nameLevel = LEVEL_EASY_RU;
  } else if (level === LEVEL_MEDIUM_ENG) {
    nameLevel = LEVEL_MEDIUM_RU;
  } else if (level === LEVEL_HARD_ENG) {
    nameLevel = LEVEL_HARD_RU;
  }

  return nameLevel;
}
