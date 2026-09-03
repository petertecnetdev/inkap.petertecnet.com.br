const HOST_ID = "inkap-dashboard-insights";

const normalizeNumber = (value) => {
  const text = String(value ?? "").trim().replace(/[^0-9,.-]/g, "");
  if (!text) return 0;
  const normalized = text.includes(",") ? text.replaceAll(".", "").replace(",", ".") : text;
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : 0;
};

function readMetric(card, title) {
  const metricCard = Array.from(card.querySelectorAll(".card")).find((node) =>
    node.querySelector(".card-title")?.textContent?.trim().toLowerCase() === title.toLowerCase()
  );
  return normalizeNumber(metricCard?.querySelector(".card-text")?.textContent);
}

function collect() {
  return Array.from(document.querySelectorAll(".dashboard-establishment-card")).map((card) => ({
    label: card.querySelector(".dashboard-establishment-name")?.textContent?.trim() || "Estabelecimento",
    orders: readMetric(card, "Atendimentos"),
    revenue: readMetric(card, "Faturamento"),
    averageTicket: readMetric(card, "Ticket médio"),
  }));
}

function makeChart({ type = "bar", title, subtitle, data, valueKey, secondaryKey, primaryLabel, secondaryLabel, format }) {
  const chart = document.createElement("peter-insight-chart");
  chart.setAttribute("type", type);
  chart.setAttribute("title", title);
  chart.setAttribute("subtitle", subtitle);
  chart.setAttribute("data", JSON.stringify(data));
  chart.setAttribute("label-key", "label");
  chart.setAttribute("value-key", valueKey);
  chart.setAttribute("primary-label", primaryLabel);
  if (secondaryKey) chart.setAttribute("secondary-key", secondaryKey);
  if (secondaryLabel) chart.setAttribute("secondary-label", secondaryLabel);
  if (format) chart.setAttribute("format", format);
  return chart;
}

function render() {
  const section = document.querySelector(".dashboard-section");
  const heading = section?.querySelector(".dashboard-section-title");
  const cards = collect();

  if (!section || !heading || !cards.length || !customElements.get("peter-insight-chart")) {
    document.getElementById(HOST_ID)?.remove();
    return;
  }

  let host = document.getElementById(HOST_ID);
  if (!host) {
    host = document.createElement("section");
    host.id = HOST_ID;
    host.setAttribute("aria-label", "Análises visuais da operação Inkap");
    Object.assign(host.style, {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(290px, 1fr))",
      gap: "16px",
      margin: "0 0 24px",
    });
    heading.insertAdjacentElement("afterend", host);
  }

  host.replaceChildren(
    makeChart({
      title: "Atendimentos por estabelecimento",
      subtitle: "Compare o movimento de hoje entre as unidades que você administra.",
      data: cards,
      valueKey: "orders",
      primaryLabel: "Atendimentos hoje",
    }),
    makeChart({
      title: "Faturamento por estabelecimento",
      subtitle: "Veja onde está concentrado o faturamento do dia e compare o ticket médio.",
      data: cards,
      valueKey: "revenue",
      secondaryKey: "averageTicket",
      primaryLabel: "Faturamento",
      secondaryLabel: "Ticket médio",
      format: "currency",
    })
  );
}

export function installInkapInsights() {
  let timer = null;
  const schedule = () => {
    window.clearTimeout(timer);
    timer = window.setTimeout(render, 80);
  };

  const observer = new MutationObserver(schedule);
  observer.observe(document.body, { childList: true, subtree: true, characterData: true });
  window.addEventListener("popstate", schedule);
  schedule();

  return () => {
    observer.disconnect();
    window.removeEventListener("popstate", schedule);
    window.clearTimeout(timer);
    document.getElementById(HOST_ID)?.remove();
  };
}
