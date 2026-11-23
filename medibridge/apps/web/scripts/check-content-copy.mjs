import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const messagePath = fileURLToPath(new URL("../src/i18n/messages/en.json", import.meta.url));
const messages = JSON.parse(readFileSync(messagePath, "utf8"));
const home = messages.home;
const aboutPage = messages.aboutPage;
const medicalTourismPage = messages.medicalTourismPage;
const errors = [];

function wordCount(value) {
  return (value.match(/[\p{L}\p{N}]+(?:['’-][\p{L}\p{N}]+)*/gu) ?? []).length;
}

function collectStrings(value) {
  if (typeof value === "string") return [value];
  if (Array.isArray(value)) return value.flatMap(collectStrings);
  if (value && typeof value === "object") return Object.values(value).flatMap(collectStrings);
  return [];
}

function check(value, path, limit, label) {
  const count = wordCount(value);
  if (count > limit) errors.push(`${path}: ${label} has ${count} words (maximum ${limit}).`);
}

function inspect(value, path = "home") {
  if (typeof value === "string") {
    const key = path.split(".").at(-1).replace(/\[\d+\]$/u, "");

    if (key === "eyebrow") {
      check(value, path, 3, "Eyebrow");
      if (wordCount(value) < 2) errors.push(`${path}: Eyebrow has fewer than 2 words.`);
    }
    if (key === "heading") check(value, path, 8, "Section heading");
    if (key === "headlineLead" || key === "headlineEmphasis") check(value, path, 8, "Hero headline part");
    if (key === "title") check(value, path, 4, "Card title");
    if (key === "description") check(value, path, path.includes(".journey.steps[") ? 8 : 12, "Description");
    if (key === "summary") check(value, path, 18, "Section subtext");
    if (key === "subtext") check(value, path, path === "home.hero.subtext" ? 15 : 18, "Subtext");
    if (key === "answer") {
      check(value, path, 20, "FAQ answer");
      const sentences = value.trim().split(/[.!?]+/u).filter(Boolean).length;
      if (sentences > 2) errors.push(`${path}: FAQ answer has ${sentences} sentences (maximum 2).`);
    }
    if (key === "quote") check(value, path, 20, "Testimonial");
    if (key === "question") check(value, path, 8, "FAQ question");
    if (key.toLowerCase().endsWith("action") || key.toLowerCase() === "link") {
      check(value, path, 3, "Button or link");
    }
    if (path.includes(".story.bullets[")) check(value, path, 5, "Story bullet");
    if (key === "serviceLine") check(value, path, 3, "Service label");
    if (key === "trustPoints") check(value, path, 5, "Trust point");
    if (key === "route") check(value, path, 1, "Journey route label");
    if (key === "items" && path.includes(".specialties.")) check(value, path, 5, "Specialty tag");
    if (key === "items" && path.includes(".reasons.")) check(value, path, 3, "Reason label");
    if (key === "title" && path.includes(".journey.steps[")) check(value, path, 2, "Journey step");
    if (["description", "summary", "subtext", "answer", "emptyMessage", "appointmentNote", "clinicalNotice"].includes(key) && wordCount(value) > 20) {
      errors.push(`${path}: Paragraph has ${wordCount(value)} words (maximum 20).`);
    }
    return;
  }

  if (Array.isArray(value)) {
    value.forEach((item, index) => inspect(item, `${path}[${index}]`));
    return;
  }

  if (value && typeof value === "object") {
    Object.entries(value).forEach(([key, child]) => inspect(child, `${path}.${key}`));
  }
}

inspect(home, "home");
inspect(aboutPage, "aboutPage");
inspect(medicalTourismPage, "medicalTourismPage");
check(`${home.hero.headlineLead} ${home.hero.headlineEmphasis}`, "home.hero.headline", 8, "Hero headline");

if (errors.length > 0) {
  console.error(`Content copy check failed with ${errors.length} issue(s):`);
  errors.forEach((error) => console.error(`- ${error}`));
  process.exitCode = 1;
} else {
  const totalWords = wordCount(collectStrings({ home, aboutPage, medicalTourismPage }).join(" "));
  console.log(`Content copy check passed (${totalWords} words across homepage and current inner-page copy).`);
}
