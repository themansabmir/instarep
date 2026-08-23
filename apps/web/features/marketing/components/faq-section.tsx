import { JsonLd, faqSchema } from "@/lib/seo/json-ld";
import { faqItems } from "@/features/marketing/data/faq";

export function FaqSection() {
  return (
    <section id="faq" className="mx-auto max-w-3xl scroll-mt-20 px-4 py-20">
      <h2 className="mb-8 text-center text-3xl font-bold tracking-tight">
        Frequently asked questions
      </h2>
      <dl className="divide-y">
        {faqItems.map((item) => (
          <div key={item.question} className="py-5">
            <dt className="font-medium">{item.question}</dt>
            <dd className="mt-2 text-muted-foreground">{item.answer}</dd>
          </div>
        ))}
      </dl>
      <JsonLd schema={faqSchema([...faqItems])} />
    </section>
  );
}
