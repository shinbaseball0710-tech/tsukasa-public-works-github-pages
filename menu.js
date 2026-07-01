document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.querySelector("#site-menu-toggle");
  const header = document.querySelector(".site-header");
  const nav = document.querySelector(".nav");

  if (!menuToggle || !header || !nav) {
    return;
  }

  const closeMenu = () => {
    menuToggle.checked = false;
    nav.querySelectorAll("details[open]").forEach((details) => {
      details.removeAttribute("open");
    });
  };

  document.addEventListener("click", (event) => {
    if (menuToggle.checked && !header.contains(event.target)) {
      closeMenu();
    }
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMenu();
    }
  });

  const revealItems = document.querySelectorAll(".about-points article, .recruit-cta, .company-route, .friendly-contact, .representative-message [data-reveal], .recruit-promises [data-reveal], .after-join [data-reveal], .recruit-guideline-cta [data-reveal]");

  if (!revealItems.length) {
    return;
  }

  if (!("IntersectionObserver" in window)) {
    revealItems.forEach((item) => item.classList.add("is-visible"));
    return;
  }

  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      rootMargin: "0px 0px -12% 0px",
      threshold: 0.18
    }
  );

  revealItems.forEach((item) => revealObserver.observe(item));

  const afterBlocks = document.querySelectorAll("[data-after-block]");

  if (!afterBlocks.length) {
    return;
  }

  const setAfterScene = (block, index) => {
    block.querySelectorAll("[data-after-image]").forEach((image) => {
      image.classList.toggle("is-active", image.dataset.afterImage === index);
    });

    block.querySelectorAll("[data-after-time]").forEach((item) => {
      item.classList.toggle("is-active", item.dataset.afterTime === index);
    });
  };

  const sceneObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        const block = entry.target.closest("[data-after-block]");
        if (!block) {
          return;
        }

        setAfterScene(block, entry.target.dataset.afterStep);
      });
    },
    {
      rootMargin: "-42% 0px -42% 0px",
      threshold: 0
    }
  );

  afterBlocks.forEach((block) => {
    block.querySelectorAll("[data-after-step]").forEach((step) => {
      sceneObserver.observe(step);
    });
  });
});
