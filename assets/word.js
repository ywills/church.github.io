async function loadVerseOfDay() {
  const verseEl = document.getElementById("vodVerse");
  const refEl = document.getElementById("vodRef");
  const errEl = document.getElementById("vodError");
  if (!verseEl || !refEl) return;

  try {
    const url = "https://beta.ourmanna.com/api/v1/get/?format=json";
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) throw new Error("Verse API request failed");
    const data = await res.json();
    const verseText = data?.verse?.details?.text;
    const reference = data?.verse?.details?.reference;
    if (!verseText || !reference) throw new Error("Verse data missing");

    verseEl.innerHTML = `<strong>"${verseText}"</strong>`;
    refEl.textContent = `— ${reference}`;
  } catch (e) {
    if (errEl) {
      errEl.style.display = "block";
      errEl.textContent = "Today’s verse couldn’t load right now. Please refresh in a moment.";
    }
    console.error(e);
  }
}

async function loadDailyInspiration() {
  const textEl = document.getElementById("inspoText");
  const refEl = document.getElementById("inspoRef");
  const errEl = document.getElementById("inspoError");
  if (!textEl || !refEl) return;

  try {
    const res = await fetch("./inspiration.json", { cache: "no-store" });
    if (!res.ok) throw new Error("Could not load inspiration.json");
    const items = await res.json();
    if (!Array.isArray(items) || items.length === 0) throw new Error("No inspiration items found");

    const today = new Date();
    const start = new Date(today.getFullYear(), 0, 0);
    const diff = today - start;
    const dayOfYear = Math.floor(diff / 86400000);
    const idx = dayOfYear % items.length;
    const item = items[idx];

    textEl.innerHTML = `<strong>${item.text}</strong>`;
    refEl.textContent = item.ref ? `— ${item.ref}` : "";
  } catch (e) {
    if (errEl) {
      errEl.style.display = "block";
      errEl.textContent = "Today’s inspiration couldn’t load right now.";
    }
    console.error(e);
  }
}

loadVerseOfDay();
loadDailyInspiration();
