export default function initTabs() {
  const tabs = document.getElementsByClassName("tab");

  for (let i = 0; i < tabs.length; i++) {
    tabs[i].addEventListener("click", (event) => {
      const clickedTab = event.currentTarget;
      const tabnameClickedTab = clickedTab.getAttribute("data-tabname");
      const currentActiveTab =
        document.getElementsByClassName("tab_state_active")[0];
      const currentActiveTabContent = document.getElementsByClassName(
        "tab-content_state_show"
      )[0];

      if (currentActiveTab && currentActiveTabContent) {
        currentActiveTab.classList.remove("tab_state_active");
        currentActiveTabContent.classList.remove("tab-content_state_show");
      }

      clickedTab.classList.add("tab_state_active");
      document
        .getElementById(tabnameClickedTab)
        .classList.add("tab-content_state_show");
    });
  }
}
