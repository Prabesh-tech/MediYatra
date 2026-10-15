import { getRequestConfig } from "next-intl/server";
import { supportedLocaleSchema } from "@medibridge/shared";

export default getRequestConfig(async ({ requestLocale }) => {
  const locale = supportedLocaleSchema.catch("en").parse(await requestLocale);
  return {
    locale,
    messages: (await import(`./messages/${locale}.json`)).default,
  };
});
