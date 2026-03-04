function toEmbed(url) {
  if (!url) return "";
  if (url.includes("youtube.com/watch?v=")) return url.replace("watch?v=", "embed/");
  if (url.includes("youtu.be/")) {
    const id = url.split("youtu.be/")[1].split("?")[0];
    return "https://www.youtube.com/embed/" + id;
  }
  return url;
}

async function loadSermons() {
  const listEl = document.getElementById("sermonList");
  const msgEl = document.getElementById("sermonMsg");
  const searchEl = document.getElementById("sermonSearch");
  const seriesEl = document.getElementById("sermonSeries");
  if (!listEl || !msgEl || !searchEl || !seriesEl) return;

  let sermons = [];
  try {
    const res = await fetch("./sermons.json", { cache: "no-store" });
    sermons = await res.json();
  } catch (e) {
    msgEl.textContent = "Could not load sermons right now.";
    console.error(e);
    return;
  }

  // Build series dropdown once
  const seriesSet = new Set(sermons.map(s => s.series).filter(Boolean));
  [...seriesSet].sort().forEach(series => {
    const opt = document.createElement("option");
    opt.value = series;
    opt.textContent = series;
    seriesEl.appendChild(opt);
  });

  function render() {
    const q = (searchEl.value || "").toLowerCase().trim();
    const seriesFilter = seriesEl.value;

    const filtered = sermons
      .filter(s => !seriesFilter || s.series === seriesFilter)
      .filter(s => {
        if (!q) return true;
        const hay = `${s.title} ${s.speaker} ${s.series} ${s.scripture} ${s.date}`.toLowerCase();
        return hay.includes(q);
      })
      .sort((a,b) => (b.date || "").localeCompare(a.date || ""));

    listEl.innerHTML = "";
    if (!filtered.length) {
      msgEl.textContent = "No sermons found. Try another search.";
      return;
    }
    msgEl.textContent = `${filtered.length} sermon(s) shown.`;

    filtered.forEach(s => {
      const card = document.createElement("div");
      card.className = "card";

      const embed = toEmbed(s.videoUrl);
      const watchLink = s.videoUrl ? `<p style="margin-top:10px;"><a class="btn btn-primary" href="${s.videoUrl}" target="_blank" rel="noopener">Open on YouTube</a></p>` : "";

      card.innerHTML = `
        <h3 style="margin:0 0 6px;">${s.title || "Sermon"}</h3>
        <p style="margin:0 0 10px; color:#555;">
          <strong>Date:</strong> ${s.date || ""}<br>
          <strong>Speaker:</strong> ${s.speaker || ""}<br>
          <strong>Series:</strong> ${s.series || ""}<br>
          <strong>Scripture:</strong> ${s.scripture || ""}
        </p>
        ${embed ? `
          <div style="position:relative; padding-top:56.25%; border-radius:12px; overflow:hidden; border:1px solid var(--border); background:#fff;">
            <iframe title="${s.title}" src="${embed}" style="position:absolute; inset:0; width:100%; height:100%; border:0;"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowfullscreen></iframe>
          </div>` : ""}
        ${watchLink}
      `;
      listEl.appendChild(card);
    });
  }

  searchEl.addEventListener("input", render);
  seriesEl.addEventListener("change", render);
  render();
}

loadSermons();
