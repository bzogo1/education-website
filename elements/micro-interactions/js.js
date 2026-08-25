const $ = (s, ctx = document) => ctx.querySelector(s);
const $$ = (s, ctx = document) => Array.from(ctx.querySelectorAll(s));

/* ============================================================
   PROGRESS + TOPBAR COUNT
   ============================================================ */
const stages = $$(".stage");
const progressFill = $("#progressFill");
const topbarCount = $("#topbarCount");

function updateProgress() {
  const doc = document.documentElement;
  const scrolled = doc.scrollTop;
  const max = doc.scrollHeight - doc.clientHeight;
  const pct = max > 0 ? (scrolled / max) * 100 : 0;
  progressFill.style.width = pct + "%";
}
window.addEventListener("scroll", updateProgress, { passive: true });
updateProgress();

const stageObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
        const idx = Number(entry.target.dataset.index);
        topbarCount.textContent = String(idx).padStart(2, "0") + " / 15";
      }
    });
  },
  { threshold: [0, 0.5, 1] }
);
stages.forEach((s) => stageObserver.observe(s));

/* ============================================================
   SIGNATURE: JUMP PALETTE (command-palette pattern)
   ============================================================ */
(function () {
  const overlay = $("#jumpOverlay");
  const palette = $("#jumpPalette");
  const input = $("#jumpInput");
  const list = $("#jumpList");
  const trigger = $("#jumpTrigger");

  const entries = stages.map((s) => ({
    index: s.dataset.index,
    name: s.dataset.name,
    question: s.dataset.question || "",
    search: (s.dataset.search || "").toLowerCase(),
    el: s
  }));

  let selectedIdx = 0;
  let filtered = entries;

  function render() {
    list.innerHTML = "";
    filtered.forEach((entry, i) => {
      const item = document.createElement("div");
      item.className = "jump-item" + (i === selectedIdx ? " selected" : "");
      item.innerHTML = `
        <span class="jump-item-index">${entry.index.padStart(2, "0")}</span>
        <span class="jump-item-name">${entry.name}</span>
        <span class="jump-item-tag">${entry.question}</span>
      `;
      item.addEventListener("click", () => jumpTo(entry));
      list.appendChild(item);
    });
  }

  function jumpTo(entry) {
    entry.el.scrollIntoView({ behavior: "smooth" });
    closePalette();
  }

  function openPalette() {
    overlay.classList.add("open");
    input.value = "";
    filtered = entries;
    selectedIdx = 0;
    render();
    setTimeout(() => input.focus(), 10);
  }

  function closePalette() {
    overlay.classList.remove("open");
  }

  trigger.addEventListener("click", openPalette);

  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) closePalette();
  });

  input.addEventListener("input", () => {
    const q = input.value.toLowerCase();
    filtered = entries.filter(
      (e) => e.name.toLowerCase().includes(q) || e.search.includes(q)
    );
    selectedIdx = 0;
    render();
  });

  input.addEventListener("keydown", (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      selectedIdx = Math.min(filtered.length - 1, selectedIdx + 1);
      render();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      selectedIdx = Math.max(0, selectedIdx - 1);
      render();
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filtered[selectedIdx]) jumpTo(filtered[selectedIdx]);
    } else if (e.key === "Escape") {
      closePalette();
    }
  });

  document.addEventListener("keydown", (e) => {
    if (
      e.key === "/" &&
      !overlay.classList.contains("open") &&
      document.activeElement.tagName !== "INPUT"
    ) {
      e.preventDefault();
      openPalette();
    } else if (e.key === "Escape" && overlay.classList.contains("open")) {
      closePalette();
    }
  });
})();

/* ============================================================
   01. Magnetic Pull
   ============================================================ */
(function () {
  const wrap = $("#magWrap");
  const btn = $("#magBtn");
  wrap.addEventListener("mousemove", (e) => {
    const rect = btn.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) * 0.3;
    const dy = (e.clientY - cy) * 0.3;
    btn.style.transform = `translate(${dx}px, ${dy}px)`;
  });
  wrap.addEventListener("mouseleave", () => {
    btn.style.transform = "translate(0, 0)";
  });
})();

/* ============================================================
   02. Cursor Highlight
   ============================================================ */
(function () {
  const spot = $("#spot");
  spot.addEventListener("mousemove", (e) => {
    const rect = spot.getBoundingClientRect();
    spot.style.setProperty("--x", e.clientX - rect.left + "px");
    spot.style.setProperty("--y", e.clientY - rect.top + "px");
  });
})();

/* ============================================================
   03. Border Trace — pure CSS
   04. Row Reveal — pure CSS
   ============================================================ */

/* ============================================================
   05. Hold Confirm
   ============================================================ */
(function () {
  const holdBtn = $("#holdBtn");
  let holdTimeout;
  holdBtn.addEventListener("pointerdown", () => {
    holdBtn.classList.add("holding");
    holdTimeout = setTimeout(() => {
      holdBtn.classList.remove("holding");
    }, 1200);
  });
  function cancelHold() {
    clearTimeout(holdTimeout);
    holdBtn.classList.remove("holding");
  }
  holdBtn.addEventListener("pointerup", cancelHold);
  holdBtn.addEventListener("pointerleave", cancelHold);
})();

/* ============================================================
   06. Swipe Reveal
   ============================================================ */
(function () {
  const swipeItem = $("#swipeItem");
  const swipeIcon = $("#swipeIcon");
  let startX = 0,
    currentX = 0,
    dragging = false;

  swipeItem.addEventListener("pointerdown", (e) => {
    dragging = true;
    startX = e.clientX;
    swipeItem.style.transition = "none";
  });
  window.addEventListener("pointermove", (e) => {
    if (!dragging) return;
    currentX = Math.min(0, e.clientX - startX);
    swipeItem.style.transform = `translateX(${currentX}px)`;
    const threshold = 100;
    const progress = Math.min(1, Math.abs(currentX) / threshold);
    swipeIcon.style.transform = `scale(${0.6 + progress * 0.6})`;
  });
  window.addEventListener("pointerup", () => {
    if (!dragging) return;
    dragging = false;
    swipeItem.style.transition = "transform 0.25s ease";
    swipeItem.style.transform = "translateX(0)";
    swipeIcon.style.transform = "scale(0.6)";
  });
})();

/* ============================================================
   07. Drag Lift
   ============================================================ */
(function () {
  const dragCard = $("#dragCard");
  dragCard.addEventListener("dragstart", () =>
    dragCard.classList.add("dragging")
  );
  dragCard.addEventListener("dragend", () =>
    dragCard.classList.remove("dragging")
  );
})();

/* ============================================================
   08. Elastic Scroll
   ============================================================ */
(function () {
  const scrollBox = $("#scrollBox");
  const scrollInner = $("#scrollInner");
  scrollBox.addEventListener(
    "wheel",
    (e) => {
      const atTop = scrollBox.scrollTop === 0;
      const atBottom =
        scrollBox.scrollTop + scrollBox.clientHeight >=
        scrollBox.scrollHeight - 1;
      if ((atTop && e.deltaY < 0) || (atBottom && e.deltaY > 0)) {
        e.preventDefault();
        const stretch = atTop ? 12 : -12;
        scrollInner.style.transform = `translateY(${stretch}px)`;
        clearTimeout(scrollInner._resetTimeout);
        scrollInner._resetTimeout = setTimeout(() => {
          scrollInner.style.transform = "translateY(0)";
        }, 150);
      }
    },
    { passive: false }
  );
})();

/* ============================================================
   09. Skeleton — pure CSS
   ============================================================ */

/* ============================================================
   10. Morph Spinner
   ============================================================ */
(function () {
  const morphBtn = $("#morphBtn");
  morphBtn.addEventListener("click", () => {
    morphBtn.classList.add("loading");
    setTimeout(() => morphBtn.classList.remove("loading"), 1800);
  });
})();

/* ============================================================
   11. Staged Progress
   ============================================================ */
(function () {
  const stageFill = $("#stageFill");
  const stageLabel = $("#stageLabel");
  const stageBtn = $("#stageBtn");
  const phases = [
    { label: "Uploading", percent: 35, duration: 900 },
    { label: "Processing", percent: 75, duration: 900 },
    { label: "Finalizing", percent: 100, duration: 700 }
  ];
  stageBtn.addEventListener("click", () => {
    stageBtn.disabled = true;
    stageFill.style.width = "0%";
    stageLabel.textContent = "Starting...";
    let delay = 300;
    phases.forEach((phase) => {
      setTimeout(() => {
        stageFill.style.width = phase.percent + "%";
        stageLabel.textContent = phase.label;
      }, delay);
      delay += phase.duration;
    });
    setTimeout(() => {
      stageLabel.textContent = "Done";
      stageBtn.disabled = false;
    }, delay);
  });
})();

/* ============================================================
   12. Optimistic UI
   ============================================================ */
(function () {
  const optimisticList = $("#optimisticList");
  const addBtn = $("#optimisticAddBtn");
  const todoCount = $("#todoCount");

  function updateCount() {
    const items = $$(".optimistic-item", optimisticList);
    const done = items.filter((i) => i.classList.contains("done")).length;
    todoCount.textContent = `${done} of ${items.length} done`;
  }

  optimisticList.addEventListener("click", (e) => {
    const check = e.target.closest(".todo-check");
    if (!check) return;
    check.closest(".optimistic-item").classList.toggle("done");
    updateCount();
  });

  addBtn.addEventListener("click", () => {
    const item = document.createElement("div");
    item.className = "optimistic-item pending";
    item.innerHTML = '<span class="todo-check"></span>Review new task copy';
    optimisticList.appendChild(item);
    setTimeout(() => {
      item.classList.remove("pending");
      updateCount();
    }, 1200);
  });

  updateCount();
})();

/* ============================================================
   13. Checkmark Morph
   ============================================================ */
(function () {
  const confirmBtn = $("#confirmBtn");
  confirmBtn.addEventListener("click", () => {
    confirmBtn.classList.add("success");
    setTimeout(() => confirmBtn.classList.remove("success"), 2000);
  });
})();

/* ============================================================
   14. Toast Exit
   ============================================================ */
(function () {
  const toast = $("#toast");
  const toastTrigger = $("#toastTrigger");
  let toastTimeout;
  toastTrigger.addEventListener("click", () => {
    clearTimeout(toastTimeout);
    toast.classList.remove("exit");
    toast.classList.add("enter");
    toastTimeout = setTimeout(() => {
      toast.classList.remove("enter");
      toast.classList.add("exit");
    }, 2200);
  });
})();

/* ============================================================
   15. Undo Bar
   ============================================================ */
(function () {
  const undoTrigger = $("#undoTrigger");
  const undoBar = $("#undoBar");
  const undoBtn = $("#undoBtn");
  const undoFill = $("#undoFill");
  let undoTimeout;

  undoTrigger.addEventListener("click", () => {
    undoBar.classList.add("show");
    undoFill.classList.remove("running");
    void undoFill.offsetWidth;
    undoFill.classList.add("running");
    clearTimeout(undoTimeout);
    undoTimeout = setTimeout(() => {
      undoBar.classList.remove("show");
    }, 5000);
  });
  undoBtn.addEventListener("click", () => {
    clearTimeout(undoTimeout);
    undoBar.classList.remove("show");
  });
})();
