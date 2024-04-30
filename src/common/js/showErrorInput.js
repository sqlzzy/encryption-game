export default function showErrorInput(inputWrapper, input, errorText) {
  inputWrapper.classList.add("error");
  input.value = errorText;

  setTimeout(() => {
    if (inputWrapper.classList.contains("error")) {
      inputWrapper.classList.remove("error");
    }

    input.value = "";
  }, 1500);
}
