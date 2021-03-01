chrome.tabs.getSelected((tab) => {
  let url = new URL(tab.url);
  if (
    url.hostname !== "www.amazon.co.jp" &&
    url.hostname !== "www.amazon.com"
  ) {
    setResponse("Invalid domain", false);
    return;
  }

  let res = checkURL(tab.url);
  if (!res.isOK) {
    setResponse("Invalid URL", false);
    return;
  }

  let shortURL = `${url.protocol}//${url.hostname}/${res.term}`;
  res = copyToClipboard(shortURL);
  if (res) {
    setResponse("Copied!!", true);
  } else {
    setResponse("Not copied", false);
  }
});

function setResponse(text, isOK) {
  let e = document.getElementById("res");
  e.textContent = text;
  if (isOK) {
    e.style.color = "green";
  } else {
    e.style.color = "red";
  }
}

function checkURL(url) {
  let terms = url.split("/");

  let idx = terms.indexOf("dp");
  if (idx > 0) {
    return {
      term: `dp/${terms[idx + 1].substr(0, 10)}`,
      isOK: true,
    };
  }

  idx = terms.indexOf("gp");
  if (idx > 0) {
    return {
      term: `gp/product/${terms[idx + 2].substr(0,10)}`,
      isOK: true,
    };
  }

  return {
    term: "",
    isOK: false,
  };
}

function copyToClipboard(value) {
  let copyForm = document.createElement("textarea");
  copyForm.textContent = value;

  let body = document.getElementsByTagName("body")[0];
  body.appendChild(copyForm);

  copyForm.select();
  let res = document.execCommand("copy");
  body.removeChild(copyForm);
  return res;
}
