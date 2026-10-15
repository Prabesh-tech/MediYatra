import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

/** @type {import('next').NextConfig} */
const nextConfig = {
	distDir: process.env.NODE_ENV === "development" ? ".next-dev" : ".next",
	transpilePackages: ["@medibridge/shared"],
	images: {
		remotePatterns: [{ protocol: "https", hostname: "images.unsplash.com" }],
	},
};

export default withNextIntl(nextConfig);
