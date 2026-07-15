export function getBaseUrl() {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL?.trim();

  if (appUrl) {
    return appUrl.replace(/\/$/, "");
  }

  const vercelUrl = process.env.VERCEL_URL?.trim();

  if (vercelUrl) {
    return vercelUrl.startsWith("http")
      ? vercelUrl.replace(/\/$/, "")
      : `https://${vercelUrl}`.replace(/\/$/, "");
  }

  return "http://localhost:3000";
}

export function getHealthUrl() {
  return `${getBaseUrl()}/api/health`;
}
