import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const SITE_URL = "https://inkap.petertecnet.com.br";
const DEFAULT_TITLE = "Inkap | Tatuadores, Estúdios e Serviços";
const DEFAULT_DESCRIPTION = "Encontre estúdios, tatuadores, serviços e portfólios na Inkap, a plataforma da Peter Tecnet para o mercado de tatuagem.";

const resolvePublicRoute = (path) => {
  if (path === "/") return { title: DEFAULT_TITLE, description: DEFAULT_DESCRIPTION };
  if (path === "/establishments") return { title: "Estúdios de tatuagem | Inkap", description: "Encontre estúdios de tatuagem publicados na Inkap." };
  if (path.startsWith("/establishment/view/")) return { title: "Estúdio de tatuagem | Inkap", description: "Veja informações, artistas e serviços deste estúdio na Inkap." };
  if (path === "/employers") return { title: "Tatuadores e artistas | Inkap", description: "Conheça tatuadores e artistas publicados na Inkap." };
  if (path.startsWith("/employer/view/")) return { title: "Tatuador | Inkap", description: "Veja informações e trabalhos deste profissional na Inkap." };
  if (path === "/item/services") return { title: "Serviços de tatuagem | Inkap", description: "Explore serviços de tatuagem publicados na Inkap." };
  if (path === "/item/products") return { title: "Produtos | Inkap", description: "Explore produtos publicados por estúdios e profissionais na Inkap." };
  if (path.startsWith("/item/view/")) return { title: "Serviço ou produto | Inkap", description: "Veja detalhes deste item publicado na Inkap." };
  return null;
};

const PRIVATE_PREFIXES = ["/dashboard", "/order/", "/user/", "/item/list/", "/item/create/", "/item/update/", "/employer/list/", "/employer/create/", "/employer/update/", "/employer/dashboard", "/employer/schedules", "/employer/orders", "/establishment/create", "/establishment/update/", "/establishment/my", "/establishment/orders/", "/establishment/item/", "/establishment/employers/", "/login", "/register", "/password", "/email-verify", "/logout", "/invite"];

function setMeta(selector, attributes) {
  let element = document.head.querySelector(selector);
  if (!element) { element = document.createElement("meta"); document.head.appendChild(element); }
  Object.entries(attributes).forEach(([key, value]) => element.setAttribute(key, value));
}
function setCanonical(href) {
  let element = document.head.querySelector('link[rel="canonical"]');
  if (!element) { element = document.createElement("link"); element.rel = "canonical"; document.head.appendChild(element); }
  element.href = href;
}

export default function SeoManager() {
  const location = useLocation();
  useEffect(() => {
    const path = location.pathname.replace(/\/+$/, "") || "/";
    const route = resolvePublicRoute(path);
    const indexable = Boolean(route) && !PRIVATE_PREFIXES.some((prefix) => path === prefix || path.startsWith(prefix));
    const title = route?.title || DEFAULT_TITLE;
    const description = route?.description || DEFAULT_DESCRIPTION;
    const url = `${SITE_URL}${path === "/" ? "/" : path}`;
    document.title = title;
    setMeta('meta[name="description"]', { name: "description", content: description });
    setMeta('meta[name="robots"]', { name: "robots", content: indexable ? "index, follow, max-image-preview:large" : "noindex, nofollow" });
    setMeta('meta[property="og:title"]', { property: "og:title", content: title });
    setMeta('meta[property="og:description"]', { property: "og:description", content: description });
    setMeta('meta[property="og:url"]', { property: "og:url", content: url });
    setMeta('meta[name="twitter:card"]', { name: "twitter:card", content: "summary_large_image" });
    setCanonical(url);
  }, [location.pathname]);
  return null;
}
