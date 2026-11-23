import { readFile } from "node:fs/promises";
import { describe, expect, it } from "vitest";

const messages = JSON.parse(
  await readFile(new URL("../src/i18n/messages/en.json", import.meta.url), "utf8"),
);

describe("homepage route and specialty copy", () => {
  it("describes the Nepal-to-India route and care specialties", () => {
    expect(messages.home.journey.route).toEqual(["Nepal", "India", "Home"]);
    expect(messages.home.journey.routeLabel).toBe("The journey from Nepal to India and home");
    expect(messages.home.specialties.heading).toBe("Explore care specialties");
    expect(messages.home.specialties.items).toContain("Cardiology");
    expect(messages.home.specialties.items).toContain("Oncology");
    expect(messages.home.specialties.clinicalNotice).toBeTruthy();
  });
});
