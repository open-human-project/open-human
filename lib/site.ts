const configuredSiteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/$/, "");
const vercelHost = process.env.VERCEL_PROJECT_PRODUCTION_URL ?? process.env.VERCEL_URL;
const repositoryUrl = process.env.NEXT_PUBLIC_GITHUB_URL?.trim().replace(/\/$/, "") || null;

export const siteConfig = {
  name: "Open Human",
  description:
    "An open-source manual for understanding your body, mind, behavior, and the systems around you.",
  url: configuredSiteUrl || (vercelHost ? `https://${vercelHost}` : "http://localhost:3000"),
  repositoryUrl,
  contributeHref: repositoryUrl ?? "/about#contribute",
};
