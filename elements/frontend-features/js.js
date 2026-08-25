      (function () {
        /* ---- Sidebar active state ---- */
        const sections = document.querySelectorAll(".section");
        const sideLinks = document.querySelectorAll(".sidebar-nav a");

        const io = new IntersectionObserver(
          (entries) => {
            entries.forEach((e) => {
              if (e.isIntersecting) {
                sideLinks.forEach((a) => {
                  a.classList.toggle(
                    "active",
                    a.getAttribute("href") === "#" + e.target.id
                  );
                });
              }
            });
          },
          { threshold: 0.4 }
        );

        sections.forEach((s) => io.observe(s));

        /* ---- 01: Infinite scroll ---- */
        const infList = document.getElementById("infinite-list");
        const infLoader = document.getElementById("inf-loader");
        const infEnd = document.getElementById("inf-end");
        const sentinelEl = document.getElementById("sentinel");
        const scrollCont = document.getElementById("scroll-container");

        let infPage = 1,
          infFetching = false,
          infHasMore = true;
        const TOTAL_ITEMS = 48;

        function makeItems(page) {
          const perPage = 8;
          const start = (page - 1) * perPage + 1;
          const end = Math.min(start + perPage - 1, TOTAL_ITEMS);
          const items = [];
          const types = ["feature", "fix", "refactor", "docs", "test"];
          for (let i = start; i <= end; i++) {
            items.push({
              id: i,
              title: types[(i - 1) % types.length] + ": update module " + i,
              sub: "Commit #" + (1000 + i) + " to main",
            });
          }
          return { items, hasNextPage: end < TOTAL_ITEMS };
        }

        function loadInfItems() {
          if (infFetching || !infHasMore) return;
          infFetching = true;
          infLoader.style.display = "block";

          setTimeout(() => {
            const data = makeItems(infPage);
            data.items.forEach((item) => {
              const li = document.createElement("li");
              li.className = "infinite-item";
              li.innerHTML =
                '<span class="infinite-item-dot"></span><div><div class="infinite-item-title">' +
                item.title +
                '</div><div class="infinite-item-sub">' +
                item.sub +
                "</div></div>";
              infList.appendChild(li);
            });

            infPage++;
            infFetching = false;
            infLoader.style.display = "none";

            if (!data.hasNextPage) {
              infHasMore = false;
              infEnd.style.display = "block";
              scrollObserver.disconnect();
            }
          }, 600);
        }

        const scrollObserver = new IntersectionObserver(
          (entries) => {
            if (entries[0].isIntersecting) loadInfItems();
          },
          { root: scrollCont, rootMargin: "120px" }
        );

        scrollObserver.observe(sentinelEl);
        loadInfItems();

        /* ---- 02: Debounced search ---- */
        const searchInput = document.getElementById("search-input");
        const searchStatus = document.getElementById("search-status");
        const searchResults = document.getElementById("search-results");

        let searchTimer = null,
          searchController = null;

        const MOCK_DATA = [
          "IntersectionObserver API",
          "AbortController pattern",
          "Debounce and throttle differences",
          "CSS shimmer animation",
          "Focus trap in modals",
          "Drag and drop with pointer events",
          "Virtual scrolling technique",
          "Toast notification queue",
          "Skeleton UI best practices",
          "Web Animations API",
        ];

        function highlight(text, query) {
          const esc = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
          return text.replace(
            new RegExp("(" + esc + ")", "gi"),
            "<mark>$1</mark>"
          );
        }

        searchInput.addEventListener("input", () => {
          clearTimeout(searchTimer);
          const q = searchInput.value.trim();
          if (!q) {
            searchResults.innerHTML = "";
            searchStatus.textContent = "";
            return;
          }
          searchStatus.textContent = "Searching...";
          searchTimer = setTimeout(() => doSearch(q), 350);
        });

        function doSearch(q) {
          if (searchController) searchController.abort();
          searchController = new AbortController();

          setTimeout(() => {
            const hits = MOCK_DATA.filter((d) =>
              d.toLowerCase().includes(q.toLowerCase())
            );
            searchResults.innerHTML = "";
            if (hits.length === 0) {
              searchStatus.textContent = "No results found.";
              return;
            }
            searchStatus.textContent =
              hits.length + " result" + (hits.length > 1 ? "s" : "");
            hits.forEach((h) => {
              const li = document.createElement("li");
              li.innerHTML = highlight(h, q);
              searchResults.appendChild(li);
            });
          }, 250);
        }

        /* ---- 03: Skeleton toggle ---- */
        let skeletonVisible = true;

        document
          .getElementById("skeleton-toggle-btn")
          .addEventListener("click", function () {
            skeletonVisible = !skeletonVisible;
            document.getElementById("skeleton-view").style.display =
              skeletonVisible ? "block" : "none";
            document.getElementById("real-content").style.display =
              skeletonVisible ? "none" : "block";
            this.textContent = skeletonVisible
              ? "Toggle state"
              : "Toggle state";
          });

        /* ---- 04: Toast notifications ---- */
        const toastArea = document.getElementById("toast-area");
        const MAX_TOASTS = 4;

        document
          .getElementById("toast-success")
          .addEventListener("click", function () {
            showToast("Profile saved successfully.", "success");
          });
        document
          .getElementById("toast-error")
          .addEventListener("click", function () {
            showToast("Could not connect to server.", "error");
          });
        document
          .getElementById("toast-warning")
          .addEventListener("click", function () {
            showToast("Session expires in 5 minutes.", "warning");
          });
        document
          .getElementById("toast-info")
          .addEventListener("click", function () {
            showToast("New comment on your post.", "info");
          });

        function showToast(message, type, duration) {
          duration = duration || 4000;
          const toasts = toastArea.querySelectorAll(".toast");
          if (toasts.length >= MAX_TOASTS) dismissToast(toasts[0]);

          const t = document.createElement("div");
          t.className = "toast toast-" + type;
          t.setAttribute("role", "alert");

          const msg = document.createElement("span");
          msg.textContent = message;

          const btn = document.createElement("button");
          btn.className = "toast-close";
          btn.textContent = "\u00d7";
          btn.setAttribute("aria-label", "Dismiss");
          btn.addEventListener("click", () => dismissToast(t));

          t.appendChild(msg);
          t.appendChild(btn);
          toastArea.appendChild(t);

          requestAnimationFrame(() => {
            requestAnimationFrame(() => t.classList.add("show"));
          });

          let timer = setTimeout(() => dismissToast(t), duration);
          t.addEventListener("mouseenter", () => clearTimeout(timer));
          t.addEventListener("mouseleave", () => {
            timer = setTimeout(() => dismissToast(t), 1200);
          });
        }

        function dismissToast(t) {
          t.classList.remove("show");
          t.addEventListener("transitionend", () => t.remove(), { once: true });
        }

        /* ---- 05: Modal ---- */
        const backdrop = document.getElementById("modal-backdrop");
        const modalBox = document.getElementById("modal-box");
        const openBtn = document.getElementById("open-modal-btn");
        const closeBtn2 = document.getElementById("modal-close-btn");
        const cancelBtn = document.getElementById("modal-cancel-btn");
        let prevFocus = null;

        function getFocusable() {
          return [
            ...modalBox.querySelectorAll(
              'button:not([disabled]), [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
            ),
          ];
        }

        function openModal() {
          prevFocus = document.activeElement;
          backdrop.classList.add("open");
          const els = getFocusable();
          if (els.length) els[0].focus();
        }

        function closeModal() {
          backdrop.classList.remove("open");
          if (prevFocus) prevFocus.focus();
        }

        openBtn.addEventListener("click", openModal);
        closeBtn2.addEventListener("click", closeModal);
        cancelBtn.addEventListener("click", closeModal);
        document
          .getElementById("modal-confirm-btn")
          .addEventListener("click", closeModal);

        backdrop.addEventListener("click", (e) => {
          if (e.target === backdrop) closeModal();
        });

        document.addEventListener("keydown", (e) => {
          if (!backdrop.classList.contains("open")) return;
          if (e.key === "Escape") {
            closeModal();
            return;
          }
          if (e.key === "Tab") {
            const els = getFocusable();
            const first = els[0],
              last = els[els.length - 1];
            if (e.shiftKey) {
              if (document.activeElement === first) {
                e.preventDefault();
                last.focus();
              }
            } else {
              if (document.activeElement === last) {
                e.preventDefault();
                first.focus();
              }
            }
          }
        });

        /* ---- 06: Drag and drop ---- */
        const dragList = document.getElementById("drag-list");
        const orderStatus = document.getElementById("order-status");
        let dragged = null;

        function updateOrderLabels() {
          dragList.querySelectorAll(".drag-item").forEach((el, i) => {
            el.querySelector(".drag-order").textContent = "#" + (i + 1);
          });
        }

        dragList.addEventListener("dragstart", (e) => {
          dragged = e.target.closest(".drag-item");
          dragged.classList.add("dragging");
          e.dataTransfer.effectAllowed = "move";
        });

        dragList.addEventListener("dragend", () => {
          dragged.classList.remove("dragging");
          dragList
            .querySelectorAll(".drag-item")
            .forEach((el) => el.classList.remove("drag-over"));
          dragged = null;
          updateOrderLabels();
          const order = [...dragList.querySelectorAll(".drag-item")].map(
            (el) => el.dataset.id
          );
          orderStatus.textContent = "Order saved: " + order.join(", ");
          setTimeout(() => {
            orderStatus.textContent = "";
          }, 2500);
        });

        dragList.addEventListener("dragover", (e) => {
          e.preventDefault();
          e.dataTransfer.dropEffect = "move";
          const target = e.target.closest(".drag-item");
          if (!target || target === dragged) return;
          dragList
            .querySelectorAll(".drag-item")
            .forEach((el) => el.classList.remove("drag-over"));
          target.classList.add("drag-over");
          const items = [...dragList.querySelectorAll(".drag-item")];
          if (items.indexOf(dragged) < items.indexOf(target))
            target.after(dragged);
          else target.before(dragged);
        });

        dragList.addEventListener("dragleave", (e) => {
          const t = e.target.closest(".drag-item");
          if (t) t.classList.remove("drag-over");
        });
      })();