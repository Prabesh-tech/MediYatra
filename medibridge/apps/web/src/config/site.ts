const address = {
  streetAddress: "Tripureshwor",
  city: "Kathmandu",
  region: "Bagmati",
  postalCode: "",
  country: "Nepal",
  latitude: 27.6926021,
  longitude: 85.3145333,
} as const;

const phones = [
  { display: "+977 9851423888", nationalDisplay: "9851423888", href: "tel:+9779851423888" },
  { display: "+977 9801021362", nationalDisplay: "9801021362", href: "tel:+9779801021362" },
  { display: "+977 9767992467", nationalDisplay: "9767992467", href: "tel:+9779767992467" },
] as const;
const addressDisplay = `${address.streetAddress}, ${address.city}, ${address.country}`;

export const siteConfig = {
  brand: {
    name: "MediYatra",
    displayName: "Mediyatra",
    tagline: "Your Healthcare Journey, Coordinated with Care.",
    description: "Healthcare coordination from Nepal to India, nursing care at home, and practical support for patients and families.",
    logoPath: "/icons/mediyatra-logo.svg",
    siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.mediyatra.com",
  },
  contact: {
    detailsConfirmed: false,
    address,
    addressDisplay,
    phones,
    email: "info.mediyatra@gmail.com",
    whatsappNumber: "9779851423888",
    openingHours: [] as readonly string[],
    directionsUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${address.streetAddress}, ${address.city}, ${address.country}`)}`,
    osmUrl: `https://www.openstreetmap.org/?mlat=${address.latitude}&mlon=${address.longitude}#map=17/${address.latitude}/${address.longitude}`,
    mapEmbedUrl: `https://www.openstreetmap.org/export/embed.html?bbox=85.307%2C27.688%2C85.322%2C27.697&layer=mapnik&marker=${address.latitude}%2C${address.longitude}`,
  },
  socialLinks: [] as readonly { label: string; href: string }[],
  googleReviewUrl: process.env.NEXT_PUBLIC_GOOGLE_REVIEW_URL || "https://www.google.com/search?q=MediYatra+reviews",
  navigation: {
    main: [
      { label: "Home", href: "" },
      { label: "About Us", href: "about" },
      { label: "Our Team", href: "team" },
      { label: "Success Stories", href: "success-stories" },
      { label: "Blog", href: "blog" },
      { label: "Clinic", href: "clinic" },
      { label: "Contact Us", href: "contact" },
    ],
    services: [
      { label: "Medical tourism", href: "medical-tourism", description: "Nepal to India patient coordination" },
      { label: "Nursing care at home", href: "nursing-care", description: "Professional support at home" },
      { label: "Treatments", href: "treatments", description: "Explore areas of care" },
      { label: "Hospitals", href: "hospitals", description: "Provider listings are being reviewed" },
      { label: "Doctors", href: "doctors", description: "Profiles appear after verification" },
      { label: "Locations", href: "destinations", description: "Nepal base and India care journey" },
      { label: "Packages", href: "packages", description: "Build a plan around your needs" },
      { label: "Travel assistance", href: "travel-assistance", description: "Visa and arrival planning" },
    ],
    footer: {
      company: [
        { label: "About Us", href: "about" },
        { label: "How It Works", href: "#journey" },
        { label: "Our Team", href: "team" },
        { label: "Success Stories", href: "success-stories" },
        { label: "Blog", href: "blog" },
        { label: "Contact", href: "contact" },
      ],
      services: [
        { label: "Medical Tourism", href: "medical-tourism" },
        { label: "Nursing Care", href: "nursing-care" },
        { label: "Clinic Coordination", href: "clinic" },
        { label: "Treatments", href: "treatments" },
        { label: "Hospitals", href: "hospitals" },
        { label: "Doctors", href: "doctors" },
        { label: "Destinations", href: "destinations" },
      ],
      help: [
        { label: "FAQ and help", href: "faq" },
        { label: "Request a quote", href: "quote" },
        { label: "Travel assistance", href: "travel-assistance" },
      ],
      policies: [
        { label: "Privacy", href: "legal/privacy" },
        { label: "Terms", href: "legal/terms" },
        { label: "Cookies", href: "legal/cookies" },
        { label: "Medical disclaimer", href: "legal/medical-disclaimer" },
        { label: "Refunds", href: "legal/refunds" },
      ],
    },
  },
  routes: {
    public: [
      "/",
      "/about",
      "/team",
      "/success-stories",
      "/blog",
      "/clinic",
      "/contact",
      "/medical-tourism",
      "/nursing-care",
      "/treatments",
      "/hospitals",
      "/doctors",
      "/destinations",
      "/destinations/nepal",
      "/packages",
      "/quote",
      "/consultation",
      "/travel-assistance",
      "/faq",
      "/legal/privacy",
      "/legal/terms",
      "/legal/cookies",
      "/legal/medical-disclaimer",
      "/legal/refunds",
    ],
    disallowedRobots: ["/api/", "/en/admin", "/en/dashboard", "/en/login", "/en/register", "/en/reset-password"],
  },
  theme: {
    color: "#0B4D9B",
    background: "#FFFFFF",
  },
} as const;

export function localizedHref(locale: string, path: string) {
  if (path.startsWith("#")) return `/${locale}${path}`;
  return path ? `/${locale}/${path.replace(/^\/+/, "")}` : `/${locale}`;
}

export function getWhatsAppHref(message?: string) {
  const base = `https://wa.me/${siteConfig.contact.whatsappNumber}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}
