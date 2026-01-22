import { Quote } from "lucide-react";

const testimonials = [
  {
    name: "Enterprise Client",
    role: "Product Lead",
    company: "SaaS Platform",
    quote:
      "Aivora delivered a highly reliable system with exceptional attention to scalability and performance. Their technical depth and execution speed set them apart.",
  },
  {
    name: "Startup Founder",
    role: "CEO",
    company: "AI Startup",
    quote:
      "From architecture to delivery, Aivora demonstrated clarity, discipline, and strong engineering standards. The end result exceeded expectations.",
  },
  {
    name: "Operations Director",
    role: "Head of Operations",
    company: "Technology Firm",
    quote:
      "We partnered with Aivora to automate complex workflows. The outcome was a measurable improvement in efficiency and system reliability.",
  },
];

const Testimonials = () => {
  return (
    <section className="pt-32 pb-28 px-4 bg-gradient-to-b from-[#0b0f16] to-[#0f1520] border-t border-[#2a2f3a]">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <span className="inline-block mb-4 px-4 py-1 rounded-full bg-[#141b28] text-[#7c3aed] text-sm font-medium border border-[#2a2f3a]">
            Client Feedback
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#e9f1ff]">
            Trusted by teams building
            <span className="text-[#7c3aed]"> critical systems</span>
          </h2>
          <p className="mt-4 text-[#cbd6ea]">
            We work with companies that value reliability, scalability, and
            long-term technical excellence.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((t, index) => (
            <div
              key={index}
              className="relative p-8 rounded-2xl bg-[#0f1520] border border-[#2a2f3a] hover:border-[#7c3aed] hover:shadow-[0_0_30px_rgba(124,58,237,0.25)] transition"
            >
              <Quote
                className="absolute top-6 right-6 text-[#7c3aed]/25"
                size={36}
              />

              <p className="text-[#e9f1ff] text-sm leading-relaxed mb-6">
                “{t.quote}”
              </p>

              <div className="border-t border-[#2a2f3a] pt-4">
                <p className="font-semibold text-[#e9f1ff]">{t.name}</p>
                <p className="text-xs text-[#cbd6ea]">
                  {t.role} · {t.company}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
