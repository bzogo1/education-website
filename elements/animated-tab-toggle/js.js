gsap.registerPlugin(SplitText);

const TAB_CONTENT = [
  {
    id: "teams",
    label: "Teams",
    text: "Work that moves at the speed of trust. Shared language, aligned direction, and a process that makes collaboration feel genuinely effortless."
  },
  {
    id: "founders",
    label: "Founders",
    text: "Turn early conviction into something people actually want. From rough idea to refined product — without losing what made it compelling."
  },
  {
    id: "designers",
    label: "Designers",
    text: "Craft interfaces that speak before a single word is read. Visual systems built to carry meaning across every touchpoint of a product."
  },
  {
    id: "engineers",
    label: "Engineers",
    text: "Build with precision on a foundation that scales. Architecture decisions that outlast the brief and hold up under real-world pressure."
  }
];

const DURATION = 0.4;
const STAGGER = 0.06;
const OVERLAP = "<0.24";
const Y_OFFSET = 150;

const tabsEl = document.getElementById("tabs");
const wrapper = document.getElementById("contentWrapper");

let activeIndex = 0;
let isAnimating = false;
let queuedIndex = null;
let tl = null;

TAB_CONTENT.forEach((item, i) => {
  const btn = document.createElement("button");
  btn.className = "tab" + (i === 0 ? " active" : "");
  btn.textContent = item.label;
  tabsEl.appendChild(btn);

  const panel = document.createElement("div");
  panel.className = "role-content";
  panel.textContent = item.text;
  wrapper.appendChild(panel);
});

const panels = [...document.querySelectorAll(".role-content")];

const splits = panels.map((el, i) => {
  return SplitText.create(el, {
    type: "lines",
    mask: "lines",
    linesClass: "himaaax-split-line",
    autoSplit: true,
    onSplit(self) {
      gsap.set(el, { opacity: 1 });
      if (i === activeIndex) {
        gsap.set(self.lines, { yPercent: 0, opacity: 1 });
      } else {
        gsap.set(self.lines, { yPercent: Y_OFFSET, opacity: 1 });
      }
    }
  });
});

function runTransition(nextIndex) {
  const currentLines = splits[activeIndex].lines;
  const nextLines = splits[nextIndex].lines;

  gsap.killTweensOf(currentLines);
  gsap.killTweensOf(nextLines);

  gsap.set(currentLines, { yPercent: 0, opacity: 1 });
  gsap.set(nextLines, { yPercent: Y_OFFSET, opacity: 1 });

  tl?.kill();

  tl = gsap.timeline({
    onComplete: () => {
      activeIndex = nextIndex;
      isAnimating = false;

      if (queuedIndex !== null && queuedIndex !== activeIndex) {
        const q = queuedIndex;
        queuedIndex = null;
        switchTab(q);
      }
    }
  });

  tl.to(currentLines, {
    yPercent: Y_OFFSET,
    duration: DURATION,
    stagger: STAGGER,
    ease: "power1.in"
  });

  tl.to(nextLines, {
    yPercent: 0,
    duration: DURATION,
    stagger: STAGGER,
    ease: "power1.out"
  }, OVERLAP);
}

function switchTab(nextIndex) {
  if (nextIndex === activeIndex) return;

  if (isAnimating) {
    queuedIndex = nextIndex;
    return;
  }

  isAnimating = true;

  // update UI immediately
  document.querySelectorAll(".tab")
    .forEach((b, i) => b.classList.toggle("active", i === nextIndex));

  runTransition(nextIndex);
}

document.querySelectorAll(".tab").forEach((btn, i) => {
  btn.addEventListener("click", () => switchTab(i));
});