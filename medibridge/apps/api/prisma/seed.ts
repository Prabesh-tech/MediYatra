import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const treatmentAreas = [
  ["cardiac-care", "Cardiac care"],
  ["orthopedics", "Orthopedics"],
  ["cancer-care", "Cancer care"],
  ["fertility-ivf", "Fertility and IVF"],
  ["dental-care", "Dental care"],
  ["cosmetic-care", "Cosmetic care"],
  ["eye-care", "Eye care"],
  ["transplant-consultation", "Transplant consultation"],
  ["bariatric-care", "Bariatric care"],
  ["wellness-ayurveda", "Wellness and Ayurveda"],
] as const;

async function main() {
  for (const [slug, name] of treatmentAreas) {
    const specialty = await prisma.specialty.upsert({
      where: { slug },
      update: {},
      create: { slug, name, description: "Placeholder category; clinical suitability must be assessed by a qualified clinician." },
    });

    await prisma.treatment.upsert({
      where: { slug },
      update: {},
      create: {
        slug,
        name,
        summary: "General information only; suitability must be assessed by a qualified clinician.",
        overview: "This is a navigation placeholder, not clinical guidance. Ask a qualified treating clinician about assessment, alternatives, risks, recovery, and follow-up.",
        procedureSteps: [],
        priceMinUsd: null,
        priceMaxUsd: null,
        successRate: null,
        published: true,
        specialtyId: specialty.id,
      },
    });
  }
}

main()
  .catch((error: unknown) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => prisma.$disconnect());
