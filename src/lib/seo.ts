import type { Metadata } from "next";
import { absoluteUrl } from "@/lib/utils";
import { siteConfig } from "@/lib/site";

type SeoInput = {
  title: string;
  description: string;
  path?: string;
  image?: string;
  noindex?: boolean;
  keywords?: string[];
  type?: "website" | "article";
  canonicalUrl?: string;
  publishedTime?: string | Date;
  modifiedTime?: string | Date;
  section?: string;
  authors?: string[];
};

function normalizeDate(value?: string | Date) {
  if (!value) return undefined;
  return new Date(value).toISOString();
}

export function buildMetadata({
  title,
  description,
  path = "/",
  image = siteConfig.ogImage,
  noindex = false,
  keywords,
  type = "website",
  canonicalUrl,
  publishedTime,
  modifiedTime,
  section,
  authors
}: SeoInput): Metadata {
  const url = canonicalUrl || absoluteUrl(path);
  const published = normalizeDate(publishedTime);
  const modified = normalizeDate(modifiedTime);

  return {
    title,
    description,
    keywords,
    metadataBase: new URL(siteConfig.url),
    alternates: {
      canonical: url
    },
    robots: noindex
      ? { index: false, follow: false }
      : { index: true, follow: true },
    openGraph: {
      title,
      description,
      url,
      type,
      siteName: siteConfig.name,
      locale: "it_IT",
      publishedTime: type === "article" ? published : undefined,
      modifiedTime: type === "article" ? modified : undefined,
      section: type === "article" ? section : undefined,
      authors: type === "article" ? authors : undefined,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title
        }
      ]
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image]
    }
  };
}

export function organizationJsonLd() {
  const sameAs = Object.values(siteConfig.social).filter(Boolean);

  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    url: siteConfig.url,
    logo: absoluteUrl("/logo.svg"),
    sameAs,
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "customer support",
        email: siteConfig.contact.email,
        telephone: siteConfig.contact.phone,
        areaServed: "IT",
        availableLanguage: ["it-IT"]
      }
    ]
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    alternateName: siteConfig.shortName,
    url: siteConfig.url,
    inLanguage: "it-IT",
    description: siteConfig.description,
    publisher: {
      "@type": "Organization",
      name: siteConfig.name
    }
  };
}

export function articleJsonLd({
  title,
  description,
  path,
  image,
  publishedAt,
  updatedAt,
  authorName,
  section
}: {
  title: string;
  description: string;
  path: string;
  image?: string;
  publishedAt?: string | Date | null;
  updatedAt?: string | Date | null;
  authorName: string;
  section?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: title,
    description,
    url: absoluteUrl(path),
    image: image ? [image] : [siteConfig.ogImage],
    datePublished: publishedAt ? new Date(publishedAt).toISOString() : undefined,
    dateModified: updatedAt ? new Date(updatedAt).toISOString() : undefined,
    articleSection: section,
    author: {
      "@type": "Person",
      name: authorName
    },
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      logo: {
        "@type": "ImageObject",
        url: absoluteUrl("/logo.svg")
      }
    },
    mainEntityOfPage: absoluteUrl(path)
  };
}

export function breadcrumbJsonLd(items: { name: string; item: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((entry, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: entry.name,
      item: absoluteUrl(entry.item)
    }))
  };
}
