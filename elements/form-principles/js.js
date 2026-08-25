      /* 1. Disable submit */
      (() => {
        const n = document.getElementById("d1n"),
          e = document.getElementById("d1e"),
          b = document.getElementById("d1b"),
          h = document.getElementById("d1h");
        const upd = () => {
          const nv = n.value.trim(),
            ev = e.value.trim();
          b.disabled = !(nv && ev);
          if (!nv && !ev) {
            h.style.color = "";
            h.textContent = "Fill in both fields to continue.";
          } else if (!nv) {
            h.style.color = "var(--r)";
            h.textContent = "Name is required.";
          } else if (!ev) {
            h.style.color = "var(--r)";
            h.textContent = "Email is required.";
          } else {
            h.style.color = "var(--g)";
            h.textContent = "Everything looks good.";
          }
        };
        n.addEventListener("input", upd);
        e.addEventListener("input", upd);
      })();

      /* 2. Inline validation */
      (() => {
        function wire(inId, msgId, fn) {
          const el = document.getElementById(inId),
            mg = document.getElementById(msgId);
          el.addEventListener("blur", () => {
            const v = el.value.trim(),
              r = fn(v);
            el.classList.remove("ok", "no");
            mg.className = "msg";
            mg.textContent = r.t;
            if (r.s === "ok") {
              el.classList.add("ok");
              mg.classList.add("ok");
            }
            if (r.s === "no") {
              el.classList.add("no");
              mg.classList.add("no");
            }
          });
          el.addEventListener("focus", () => {
            el.classList.remove("ok", "no");
            mg.className = "msg";
            mg.textContent = "";
          });
        }
        wire("d2e", "d2em", (v) => {
          if (!v) return { s: "", t: "" };
          if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v))
            return { s: "no", t: "That doesn't look like a valid email." };
          return { s: "ok", t: "Looks good." };
        });
        wire("d2u", "d2um", (v) => {
          if (!v) return { s: "", t: "" };
          if (v.length < 3)
            return { s: "no", t: "Must be at least 3 characters." };
          if (/[^a-zA-Z0-9_]/.test(v))
            return { s: "no", t: "Letters, numbers, and underscores only." };
          return { s: "ok", t: "Username is available." };
        });
      })();

      /* 3. Char count */
      (() => {
        const ta = document.getElementById("d3b"),
          fi = document.getElementById("d3f"),
          lb = document.getElementById("d3l"),
          M = 150;
        ta.addEventListener("input", () => {
          const u = ta.value.length,
            r = M - u,
            p = (u / M) * 100;
          lb.textContent = r === 1 ? "1 left" : `${r} left`;
          fi.style.width = p + "%";
          fi.style.background =
            p > 90 ? "var(--r)" : p > 70 ? "var(--a)" : "var(--v)";
          lb.className =
            "cbar-lbl" + (p > 90 ? " over" : p > 70 ? " warn" : "");
        });
      })();

      /* 4. Prefill */
      (() => {
        document.getElementById("d4n").value = "Alex Johnson";
        document.getElementById("d4e").value = "alex@example.com";
      })();

      /* 5. Password */
      (() => {
        const inp = document.getElementById("d5p");
        const rules = [
          { id: "rl", t: "8+ characters", fn: (v) => v.length >= 8 },
          { id: "ru", t: "Uppercase letter", fn: (v) => /[A-Z]/.test(v) },
          { id: "rn", t: "Number", fn: (v) => /[0-9]/.test(v) },
          {
            id: "rs",
            t: "Special character",
            fn: (v) => /[!@#$%^&*()\-_=+\[\]{};:'",.<>/?\\|`~]/.test(v),
          },
        ];
        inp.addEventListener("input", () => {
          rules.forEach(({ id, t, fn }) => {
            const el = document.getElementById(id),
              p = fn(inp.value);
            el.className = "pw-rule" + (p ? " pass" : "");
            el.innerHTML = `<span class="ck">${p ? "✓" : ""}</span>${t}`;
          });
        });
      })();

      /* 6. Phone */
      (() => {
        const inp = document.getElementById("d6p"),
          out = document.getElementById("d6o"),
          chips = document.querySelectorAll("#d6c .chip");
        const norm = (r) => {
          const d = r.replace(/\D/g, "");
          if (d.length === 10)
            return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`;
          if (d.length === 11 && d[0] === "1")
            return `+1 (${d.slice(1, 4)}) ${d.slice(4, 7)}-${d.slice(7)}`;
          return null;
        };
        inp.addEventListener("input", () => {
          const f = norm(inp.value);
          out.textContent = f ? `Stored as: ${f}` : "";
          chips.forEach((c) =>
            c.classList.toggle("on", c.textContent.trim() === inp.value.trim())
          );
        });
        chips.forEach((c) =>
          c.addEventListener("click", () => {
            inp.value = c.textContent.trim();
            inp.dispatchEvent(new Event("input"));
            inp.focus();
          })
        );
      })();