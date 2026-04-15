import { useEffect } from "react";

const DEFAULT_OG_IMAGE = "https://www.mackenzie.br/fileadmin/user_upload/portal.jpg";

interface SeoProps {
  title: string;
  description: string;
  canonicalPath?: string;
  type?: "website" | "article";
}

function ensureMetaByName(name: string): HTMLMetaElement {
  let tag = document.querySelector<HTMLMetaElement>(`meta[name=\"${name}\"]`);

  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute("name", name);
    document.head.appendChild(tag);
  }

  return tag;
}

function ensureMetaByProperty(property: string): HTMLMetaElement {
  let tag = document.querySelector<HTMLMetaElement>(`meta[property=\"${property}\"]`);

  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute("property", property);
    document.head.appendChild(tag);
  }

  return tag;
}

function ensureCanonical(): HTMLLinkElement {
  let tag = document.querySelector("link[rel='canonical']");

  if (!tag) {
    tag = document.createElement("link");
    tag.setAttribute("rel", "canonical");
    document.head.appendChild(tag);
  }

  return tag as HTMLLinkElement;
}

export default function Seo({
  title,
  description,
  canonicalPath,
  type = "website",
}: SeoProps) {
  useEffect(() => {
    const origin = window.location.origin;
    const canonicalUrl = canonicalPath
      ? new URL(canonicalPath, origin).toString()
      : window.location.href;
    const fullTitle = title.includes("MackSeguro") ? title : `${title} | MackSeguro`;

    document.title = fullTitle;

    ensureMetaByName("description").setAttribute("content", description);
    ensureMetaByName("robots").setAttribute("content", "index,follow");

    ensureMetaByProperty("og:site_name").setAttribute("content", "MackSeguro");
    ensureMetaByProperty("og:title").setAttribute("content", fullTitle);
    ensureMetaByProperty("og:description").setAttribute("content", description);
    ensureMetaByProperty("og:type").setAttribute("content", type);
    ensureMetaByProperty("og:url").setAttribute("content", canonicalUrl);
    ensureMetaByProperty("og:image").setAttribute("content", DEFAULT_OG_IMAGE);

    ensureMetaByName("twitter:card").setAttribute("content", "summary");
    ensureMetaByName("twitter:title").setAttribute("content", fullTitle);
    ensureMetaByName("twitter:description").setAttribute("content", description);
    ensureMetaByName("twitter:image").setAttribute("content", DEFAULT_OG_IMAGE);

    ensureCanonical().setAttribute("href", canonicalUrl);
  }, [canonicalPath, description, title, type]);

  return null;
}
