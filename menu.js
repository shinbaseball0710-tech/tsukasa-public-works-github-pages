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

  const faqButtons = document.querySelectorAll(".faq-question");

  faqButtons.forEach((button) => {
    const item = button.closest(".faq-item");
    const answer = item?.querySelector(".faq-answer");

    if (!item || !answer) {
      return;
    }

    answer.hidden = true;
    answer.style.maxHeight = "0px";

    button.addEventListener("click", () => {
      const isOpen = button.getAttribute("aria-expanded") === "true";

      button.setAttribute("aria-expanded", String(!isOpen));
      item.classList.toggle("is-open", !isOpen);

      if (isOpen) {
        answer.style.maxHeight = `${answer.scrollHeight}px`;
        requestAnimationFrame(() => {
          answer.style.maxHeight = "0px";
        });

        window.setTimeout(() => {
          if (button.getAttribute("aria-expanded") === "false") {
            answer.hidden = true;
          }
        }, 340);
      } else {
        answer.hidden = false;
        answer.style.maxHeight = "0px";
        requestAnimationFrame(() => {
          answer.style.maxHeight = `${answer.scrollHeight}px`;
        });
      }
    });
  });

  const revealItems = document.querySelectorAll(".about-points article, .recruit-cta, .company-route, .friendly-contact, .representative-message [data-reveal], .recruit-promises [data-reveal], .after-join [data-reveal], .recruit-guideline-cta [data-reveal], .benefit-story [data-reveal], .company-trust [data-reveal]");

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

  const storyScenes = document.querySelectorAll(".company-story-scene");

  if (storyScenes.length) {
    const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
    let ticking = false;

    const updateStoryScenes = () => {
      const viewportHeight = window.innerHeight || 1;

      storyScenes.forEach((scene) => {
        const rect = scene.getBoundingClientRect();
        const progress = clamp((viewportHeight - rect.top) / (rect.height + viewportHeight), 0, 1);
        const focus = 1 - clamp(Math.abs(progress - 0.48) / 0.48, 0, 1);
        const image = scene.querySelector("img");
        const copy = scene.querySelector("div");
        const reveal = clamp((progress - 0.14) / 0.24, 0, 1);
        const exit = clamp((0.9 - progress) / 0.2, 0, 1);
        const copyOpacity = Math.min(reveal, exit);

        scene.style.setProperty("--story-progress", progress.toFixed(3));
        scene.classList.toggle("is-scroll-active", focus > 0.12);

        if (image) {
          const lift = -30 * progress;
          const scale = 1.035 + progress * 0.075;
          image.style.transform = `translate3d(0, ${lift.toFixed(1)}px, 0) scale(${scale.toFixed(3)})`;
        }

        if (copy) {
          const copyLift = 42 - copyOpacity * 42;
          copy.style.opacity = copyOpacity.toFixed(3);
          copy.style.transform = `translate3d(0, ${copyLift.toFixed(1)}px, 0)`;
        }
      });

      ticking = false;
    };

    const requestStoryUpdate = () => {
      if (ticking) {
        return;
      }

      ticking = true;
      window.requestAnimationFrame(updateStoryScenes);
    };

    updateStoryScenes();
    window.addEventListener("scroll", requestStoryUpdate, { passive: true });
    window.addEventListener("resize", requestStoryUpdate);
  }

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
