import type { Metadata } from "next";
import "@fontsource/poppins/400.css";
import "@fontsource/poppins/500.css";
import "@fontsource/poppins/600.css";
import "@fontsource/poppins/700.css";
import "@fontsource/poppins/800.css";
import { ThemeProvider } from "../components/layout/theme-provider";
import { ServiceWorkerRegister } from "../components/layout/service-worker-register";
import "../styles/globals.css";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.brand.siteUrl),
  title: { default: `${siteConfig.brand.displayName} | ${siteConfig.brand.tagline.replace(/\.$/, "")}`, template: `%s | ${siteConfig.brand.displayName}` },
  description: siteConfig.brand.description,
  manifest: "/manifest.webmanifest",
  icons: { icon: [{ url: siteConfig.brand.logoPath, type: "image/svg+xml" }] },
  applicationName: siteConfig.brand.displayName,
  openGraph: {
    type: "website",
    title: `${siteConfig.brand.displayName} | ${siteConfig.brand.tagline.replace(/\.$/, "")}`,
    description: siteConfig.brand.description,
    locale: "en_US",
  },
  twitter: { card: "summary", title: siteConfig.brand.displayName, description: siteConfig.brand.description },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <ServiceWorkerRegister />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
