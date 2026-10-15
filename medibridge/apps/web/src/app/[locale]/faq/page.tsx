import { StaticPage } from "@/components/shared/static-page";
import { AnimatedAccordion } from "@/components/shared/animated-accordion";
import { Reveal } from "@/components/shared/reveal";
import { faqItems } from "@/lib/site-content";

export default function FAQPage() {
  return (
    <StaticPage eyebrow="Help center" title="Frequently asked questions" description="General information to help you decide what to ask next. This page is not a substitute for advice from clinicians or official authorities.">
      <div className="prose faq-list">
        {faqItems.map((item, index) => (
          <Reveal key={item.question} delay={index * 0.055}>
            <AnimatedAccordion question={item.question} answer={item.answer} />
          </Reveal>
        ))}
      </div>
    </StaticPage>
  );
}
