// Light / dark theme button. The choice is remembered in this browser.
(function () {
  var root = document.documentElement;
  var button = document.getElementById("theme-toggle");

  function currentTheme() {
    var set = root.getAttribute("data-theme");
    if (set) return set;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }

  button.addEventListener("click", function () {
    var next = currentTheme() === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", next);
    try { localStorage.setItem("theme", next); } catch (e) {}
  });
})();

// Phone menu: open/close the nav links.
(function () {
  var button = document.getElementById("menu-toggle");
  var links = document.getElementById("nav-links");

  function setOpen(open) {
    links.classList.toggle("open", open);
    button.setAttribute("aria-expanded", String(open));
    button.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  }

  button.addEventListener("click", function () {
    setOpen(!links.classList.contains("open"));
  });
  links.addEventListener("click", function (e) {
    if (e.target.tagName === "A") setOpen(false);
  });
})();

// Fade sections in as they scroll into view.
(function () {
  var items = document.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window)) {
    items.forEach(function (el) { el.classList.add("visible"); });
    return;
  }
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
  items.forEach(function (el) { observer.observe(el); });
})();

document.getElementById("year").textContent = new Date().getFullYear();
