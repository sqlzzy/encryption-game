function createMetatag(property, content) {
  const meta = document.createElement("meta");
  meta.setAttribute("property", property);
  meta.content = content;
  document.getElementsByTagName("head")[0].appendChild(meta);
}

export default function addMetatags(data) {
  const { title, descr, url } = data;

  createMetatag("og:title", title);
  createMetatag("og:description", descr);
  createMetatag("og:image", `${url}/common/images/favicon.ico`);
  createMetatag("og:type", "website");
  createMetatag("og:url", url);
}
