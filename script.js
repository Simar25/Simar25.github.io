// Small extras: local time in the hero, header progress bar, the hero easing
// back as you scroll, current section in the nav, scroll reveals and counters.
(function () {
  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Local time in Chennai
  var clock = document.getElementById("clock");
  if (clock && window.Intl) {
    var fmt = new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: "Asia/Kolkata" });
    var tick = function () { clock.textContent = fmt.format(new Date()) + " IST"; };
    tick();
    setInterval(tick, 15000);
  }

  // Header hairline, reading progress, and the hero receding under the next section
  var header = document.querySelector(".site-header");
  var progress = document.querySelector(".progress");
  var hero = document.querySelector(".hero-inner");
  var ticking = false;
  var onScroll = function () {
    var y = window.scrollY;
    var max = document.documentElement.scrollHeight - window.innerHeight;
    header.classList.toggle("is-stuck", y > 4);
    if (progress) progress.style.transform = "scaleX(" + (max > 0 ? Math.min(y / max, 1) : 0) + ")";
    if (hero && !reduceMotion) {
      var h = hero.offsetHeight;
      if (y <= h) {
        hero.style.transform = "translate3d(0," + (y * 0.35).toFixed(1) + "px,0)";
        hero.style.opacity = Math.max(1 - y / (h * 0.9), 0).toFixed(3);
      }
    }
    ticking = false;
  };
  onScroll();
  window.addEventListener("scroll", function () {
    if (!ticking) { ticking = true; requestAnimationFrame(onScroll); }
  }, { passive: true });
  window.addEventListener("resize", onScroll);

  // Order for staggered children and diagram boxes
  document.querySelectorAll('[data-reveal="stagger"]').forEach(function (group) {
    Array.prototype.forEach.call(group.children, function (child, i) { child.style.setProperty("--i", i); });
  });
  document.querySelectorAll(".flow").forEach(function (flow) {
    flow.querySelectorAll(".node, .flow-arrow").forEach(function (el, i) {
      el.setAttribute("data-step", "");
      el.style.setProperty("--step", i);
    });
  });

  // Numbers count up from zero the first time they are seen
  var countUp = function (el, delay) {
    var target = parseFloat(el.getAttribute("data-count"));
    var decimals = parseInt(el.getAttribute("data-decimals") || "0", 10);
    var suffix = el.getAttribute("data-suffix") || "";
    var format = function (n) {
      return n.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals }) + suffix;
    };
    var start = null;
    var duration = 1600;
    var step = function (now) {
      if (start === null) start = now;
      var t = Math.min((now - start) / duration, 1);
      var eased = 1 - Math.pow(1 - t, 4);
      el.textContent = format(target * eased);
      if (t < 1) requestAnimationFrame(step);
    };
    el.textContent = format(0);
    setTimeout(function () { requestAnimationFrame(step); }, delay);
    // make sure the real number lands even if animation frames are throttled
    setTimeout(function () { el.textContent = format(target); }, delay + duration + 300);
  };

  var revealItems = document.querySelectorAll("[data-reveal]");
  var reveal = function (el) {
    el.classList.add("is-in");
    if (!reduceMotion) {
      el.querySelectorAll("[data-count]").forEach(function (n) { countUp(n, 350); });
    }
    // once the entrance is over, hover effects shouldn't wait for the stagger delays
    setTimeout(function () { el.classList.add("is-done"); }, 2400);
  };

  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealItems.forEach(reveal);
  } else {
    var revealer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        reveal(entry.target);
        revealer.unobserve(entry.target);
      });
    }, { rootMargin: "0px 0px -12% 0px" });
    revealItems.forEach(function (el) { revealer.observe(el); });
  }

  // Underline the nav link for the section on screen
  if (!("IntersectionObserver" in window)) return;
  var links = {};
  document.querySelectorAll('.site-header nav a[href^="#"]').forEach(function (a) {
    links[a.getAttribute("href").slice(1)] = a;
  });
  var spy = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      var link = links[entry.target.id];
      if (!link) return;
      if (entry.isIntersecting) {
        Object.keys(links).forEach(function (id) { links[id].removeAttribute("aria-current"); });
        link.setAttribute("aria-current", "true");
      } else {
        link.removeAttribute("aria-current");
      }
    });
  }, { rootMargin: "-45% 0px -50% 0px" });
  ["top", "work", "about", "contact"].forEach(function (id) {
    var el = document.getElementById(id);
    if (el) spy.observe(el);
  });
})();
