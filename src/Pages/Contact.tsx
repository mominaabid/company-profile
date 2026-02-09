import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Phone, Mail, Send, Clock, Award, MessageSquare, User, AtSign, Hash, FileText, CheckCircle, Star, Heart } from 'lucide-react';
import Header from '../Components/Header';
import Footer from '../Components/footer';
import emailjs from 'emailjs-com';

interface VisibilityState {
  [key: string]: boolean;
}

interface FormData {
  [key: string]: string;
  name: string;
  email: string;
  whatsapp: string;
  subject: string;
  message: string;
}

interface ContactInfo {
  id: number;
  icon: string;
  title: string;
  info: string;
  link: string;
}

interface WhyChooseUs {
  id: number;
  icon: string;
  title: string;
  description: string;
  order: number;
}

interface HeroSection {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  badge_text: string;
  badge_icon: string;
  media_type: 'video' | 'image';
  media_url: string;
}

export default function ContactPage() {
  const [typewriterText, setTypewriterText] = useState<string>('');
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isVisible, setIsVisible] = useState<VisibilityState>({});
  const observerRef = useRef<IntersectionObserver | null>(null);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    whatsapp: '',
    subject: '',
    message: '',
  });
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [contactInfo, setContactInfo] = useState<ContactInfo[]>([]);
  const [reasons, setReasons] = useState<WhyChooseUs[]>([]);
  const [hero, setHero] = useState<HeroSection | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const iconComponents: { [key: string]: React.ComponentType<any> } = {
    Phone,
    Mail,
    MapPin,
    Clock,
    Award,
    Star,
    Heart,
    MessageSquare,
  };

  const renderIcon = (iconName: string, size: string = "w-6 h-6") => {
    const IconComponent = iconComponents[iconName] || Star;
    return <IconComponent className={size} />;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const contactInfoRes = await fetch('https://backendvideography.vercel.app/api/contact/info/');
        const reasonsRes = await fetch('https://backendvideography.vercel.app/api/contact/reasons/');
        const heroRes = await fetch('https://backendvideography.vercel.app/api/contact/hero/contact/');

        if (!contactInfoRes.ok || !reasonsRes.ok || !heroRes.ok) {
          throw new Error('Failed to fetch data from one or more endpoints');
        }

        const contactInfoData = await contactInfoRes.json();
        const reasonsData = await reasonsRes.json();
        const heroData = await heroRes.json();

        const parsedReasons = Array.isArray(reasonsData) ? reasonsData : reasonsData.results || [];
        setReasons(parsedReasons);

        setContactInfo(Array.isArray(contactInfoData) ? contactInfoData : contactInfoData.results || []);
        setHero(Array.isArray(heroData) ? heroData[0] : heroData.results?.[0] || heroData);
        setLoading(false);
      } catch (err) {
        console.error('Fetch Error:', err);
        setError('Failed to load dynamic content. Some sections may not display correctly.');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (hero && currentIndex < hero.subtitle.length) {
      const timeout = setTimeout(() => {
        setTypewriterText((prev) => prev + hero.subtitle[currentIndex]);
        setCurrentIndex((prev) => prev + 1);
      }, 80);
      return () => clearTimeout(timeout);
    }
  }, [currentIndex, hero]);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries: IntersectionObserverEntry[]) => {
        entries.forEach((entry: IntersectionObserverEntry) => {
          if (entry.isIntersecting) {
            const target = entry.target as HTMLElement;
            setIsVisible((prev: VisibilityState) => ({
              ...prev,
              [target.id]: true,
            }));
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = document.querySelectorAll('[data-animate]');
    elements.forEach((el: Element) => {
      if (observerRef.current) observerRef.current.observe(el);
    });

    return () => {
      if (observerRef.current) observerRef.current.disconnect();
    };
  }, [reasons, contactInfo]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFormError(null);
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();

    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      setFormError("Please fill in all required fields.");
      return;
    }

    try {
      await emailjs.send(
        "service_62k6n0x",
        "template_feji55x",
        formData,
        "qU_ljJITgXTBKHwWp"
      );

      await emailjs.send(
        "service_62k6n0x",
        "template_hcg887f",
        {
          name: formData.name,
          email: formData.email,
          whatsapp: formData.whatsapp,
          subject: formData.subject,
          message: formData.message
        },
        "qU_ljJITgXTBKHwWp"
      );

      setIsSubmitted(true);
      setFormError(null);
      setFormData({
        name: "",
        email: "",
        whatsapp: "",
        subject: "",
        message: "",
      });

      setTimeout(() => setIsSubmitted(false), 3000);
    } catch (error) {
      console.error("Error sending email:", error);
      setFormError("Something went wrong. Please try again later.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0b0f16] to-[#070a10] text-[#e9f1ff] overflow-hidden">
      <Header />

      <style
        dangerouslySetInnerHTML={{
          __html: `
            @keyframes fade-in {
              from { opacity: 0; transform: translateY(10px); }
              to { opacity: 1; transform: translateY(0); }
            }
            @keyframes slide-up {
              from { opacity: 0; transform: translateY(15px); }
              to { opacity: 1; transform: translateY(0); }
            }
            .animate-fade-in { animation: fade-in 0.8s ease-out; }
            .animate-slide-up { animation: slide-up 0.8s ease-out; }
          `,
        }}
      />

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden pt-16">
        {loading || error ? (
          <div className="absolute inset-0 bg-[#0b0f16]" />
        ) : hero?.media_type === 'video' && hero?.media_url ? (
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute top-0 left-0 w-full h-full object-cover"
          >
            <source src={hero.media_url} type="video/mp4" />
          </video>
        ) : hero?.media_type === 'image' && hero?.media_url ? (
          <img
            src={hero.media_url}
            alt={hero.title}
            className="absolute top-0 left-0 w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-[#0b0f16]" />
        )}

        <div className="absolute inset-0 bg-gradient-to-b from-[#0b0f16]/80 via-[#0b0f16]/50 to-[#070a10]/90" />

        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
          {hero?.badge_text && (
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#141b28] border border-[#2a2f3a] text-[#7c3aed] text-sm font-medium mb-6 animate-fade-in">
              {hero.badge_icon && renderIcon(hero.badge_icon, "w-5 h-5 text-[#7c3aed]")}
              <span>{hero.badge_text}</span>
            </div>
          )}

          <h1 className="text-4xl sm:text-5xl md:text-6xl xl:text-7xl font-bold leading-tight mb-6 animate-slide-up">
            {hero?.title || 'Get in Touch'}
          </h1>

          <div className="h-10 sm:h-16 flex items-center justify-center">
            <p className="text-xl sm:text-3xl text-[#cbd6ea] font-light">
              {typewriterText}
              <span className="animate-pulse">|</span>
            </p>
          </div>

          {hero?.description && (
            <p className="mt-6 text-lg text-[#cbd6ea] max-w-3xl mx-auto animate-fade-in">
              {hero.description}
            </p>
          )}
        </div>
      </section>

      {/* Contact Info Bar */}
      <section className="py-12 border-t border-[#2a2f3a] bg-gradient-to-b from-[#0b0f16] to-[#070a10]">
        <div className="max-w-7xl mx-auto px-4">
          {loading ? (
            <div className="text-center text-[#cbd6ea]">Loading contact information...</div>
          ) : error ? (
            <div className="text-center text-red-400">{error}</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {contactInfo.map((item) => (
                <a
                  key={item.id}
                  href={item.link}
                  className="flex items-center gap-4 p-6 rounded-2xl bg-[#0f1520] border border-[#2a2f3a] hover:border-[#7c3aed] hover:shadow-[0_0_20px_rgba(124,58,237,0.25)] transition-all duration-300 group"
                >
                  <div className="text-[#7c3aed] group-hover:scale-110 transition-transform">
                    {renderIcon(item.icon, "w-7 h-7")}
                  </div>
                  <div>
                    <h3 className="text-sm text-[#cbd6ea] mb-1">{item.title}</h3>
                    <p className="text-[#e9f1ff] font-medium">{item.info}</p>
                  </div>
                </a>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Form + Map Section */}
      <section className="py-24 bg-gradient-to-b from-[#0b0f16] to-[#070a10] border-t border-[#2a2f3a]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12" data-animate id="contact-section">
            {/* Map */}
            <div className={`transition-all duration-800 ${isVisible['contact-section'] ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Locate Our <span className="text-[#7c3aed]">Hub</span>
              </h2>
              <p className="text-lg text-[#cbd6ea] mb-8">
                Reach out online or visit us to discuss your next intelligent system.
              </p>

              <div className="rounded-2xl overflow-hidden border border-[#2a2f3a] hover:border-[#7c3aed] transition-all shadow-[0_0_25px_rgba(124,58,237,0.15)]">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d26565.10740840091!2d73.05255576450394!3d33.666529509507775!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38df9544389abb3f%3A0x8ea6e9c4c6afe851!2sI-8%2C%20Islamabad%2C%20Pakistan!5e0!3m2!1sen!2s!4v1759717562615!5m2!1sen!2s"
                  width="100%"
                  height="450"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>

            {/* Contact Form */}
            <div className={`transition-all duration-800 delay-200 ${isVisible['contact-section'] ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Send a <span className="text-[#7c3aed]">Message</span>
              </h2>
              <p className="text-lg text-[#cbd6ea] mb-8">
                Tell us about your project — we’ll respond within 24 hours.
              </p>

              <div className="space-y-6">
                {formError && (
                  <div className="p-4 bg-red-900/30 border border-red-500/30 rounded-xl text-red-300 text-center">
                    {formError}
                  </div>
                )}

                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-[#cbd6ea] mb-2">
                    <User className="w-5 h-5 text-[#7c3aed]" />
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-5 py-4 bg-[#0f1520] border border-[#2a2f3a] rounded-xl text-[#e9f1ff] placeholder-[#cbd6ea]/60 focus:outline-none focus:border-[#7c3aed] focus:shadow-[0_0_15px_rgba(124,58,237,0.3)] transition-all"
                    placeholder="Your name"
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-[#cbd6ea] mb-2">
                    <AtSign className="w-5 h-5 text-[#7c3aed]" />
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-5 py-4 bg-[#0f1520] border border-[#2a2f3a] rounded-xl text-[#e9f1ff] placeholder-[#cbd6ea]/60 focus:outline-none focus:border-[#7c3aed] focus:shadow-[0_0_15px_rgba(124,58,237,0.3)] transition-all"
                    placeholder="you@example.com"
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-[#cbd6ea] mb-2">
                    <Phone className="w-5 h-5 text-[#7c3aed]" />
                    WhatsApp Number
                  </label>
                  <input
                    type="tel"
                    name="whatsapp"
                    value={formData.whatsapp}
                    onChange={handleInputChange}
                    className="w-full px-5 py-4 bg-[#0f1520] border border-[#2a2f3a] rounded-xl text-[#e9f1ff] placeholder-[#cbd6ea]/60 focus:outline-none focus:border-[#7c3aed] focus:shadow-[0_0_15px_rgba(124,58,237,0.3)] transition-all"
                    placeholder="+92 300 1234567"
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-[#cbd6ea] mb-2">
                    <Hash className="w-5 h-5 text-[#7c3aed]" />
                    Subject *
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    className="w-full px-5 py-4 bg-[#0f1520] border border-[#2a2f3a] rounded-xl text-[#e9f1ff] placeholder-[#cbd6ea]/60 focus:outline-none focus:border-[#7c3aed] focus:shadow-[0_0_15px_rgba(124,58,237,0.3)] transition-all"
                    placeholder="Project Inquiry"
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-[#cbd6ea] mb-2">
                    <FileText className="w-5 h-5 text-[#7c3aed]" />
                    Message *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows={5}
                    className="w-full px-5 py-4 bg-[#0f1520] border border-[#2a2f3a] rounded-xl text-[#e9f1ff] placeholder-[#cbd6ea]/60 focus:outline-none focus:border-[#7c3aed] focus:shadow-[0_0_15px_rgba(124,58,237,0.3)] transition-all resize-none"
                    placeholder="Describe your idea or project..."
                  />
                </div>

                {isSubmitted ? (
                  <div className="flex items-center justify-center gap-3 p-5 bg-[#1a3a1a] border border-green-500/30 rounded-xl text-green-400 font-medium">
                    <CheckCircle className="w-6 h-6" />
                    Message Sent Successfully!
                  </div>
                ) : (
                  <button
                    onClick={handleSubmit}
                    className="w-full flex items-center justify-center gap-3 px-8 py-5 bg-[#7c3aed] text-[#0b0f16] rounded-xl font-medium hover:bg-[#8b4bff] transition-all shadow-[0_0_25px_rgba(124,58,237,0.4)] hover:shadow-[0_0_35px_rgba(124,58,237,0.6)]"
                  >
                    <Send className="w-6 h-6" />
                    Send Message
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-24 bg-gradient-to-b from-[#0b0f16] to-[#070a10] border-t border-[#2a2f3a]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16" data-animate id="reasons-title">
            <h2
              className={`text-4xl md:text-6xl font-bold mb-6 transition-all duration-800 ${
                isVisible['reasons-title'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
            >
              Why <span className="text-[#7c3aed]">Choose Us</span>
            </h2>
            <p
              className={`text-xl text-[#cbd6ea] max-w-3xl mx-auto transition-all duration-800 delay-200 ${
                isVisible['reasons-title'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
            >
              We build intelligent, scalable digital systems that drive real business impact.
            </p>
          </div>

          {loading ? (
            <div className="text-center text-[#cbd6ea]">Loading...</div>
          ) : error ? (
            <div className="text-center text-red-400">{error}</div>
          ) : reasons.length === 0 ? (
            <div className="text-center text-[#cbd6ea]">No reasons available</div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {reasons.map((reason, index) => {
                const IconComponent = iconComponents[reason.icon] || Star;
                return (
                  <div
                    key={reason.id}
                    data-animate
                    id={`reason-${index}`}
                    className={`p-8 rounded-2xl bg-[#0f1520] border border-[#2a2f3a] hover:border-[#7c3aed] hover:shadow-[0_0_30px_rgba(124,58,237,0.25)] transition-all duration-500 ${
                      isVisible[`reason-${index}`] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
                    }`}
                    style={{ transitionDelay: `${index * 100}ms` }}
                  >
                    <div className="flex justify-center mb-6">
                      <div className="p-4 rounded-xl bg-[#141b28] border border-[#2a2f3a]">
                        <IconComponent className="w-8 h-8 text-[#7c3aed]" />
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold mb-3">{reason.title}</h3>
                    <p className="text-[#cbd6ea] text-sm">{reason.description}</p>
                  </div>
                );
              })}
            </div>
          )}

          <div className="mt-20 text-center" data-animate id="final-cta">
            <div className={`transition-all duration-800 ${isVisible['final-cta'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <p className="text-2xl text-[#cbd6ea] mb-8">
                Ready to build something intelligent?
              </p>
              <a
                href="#contact-section"
                className="inline-flex items-center gap-3 px-10 py-5 bg-[#7c3aed] text-[#0b0f16] rounded-xl font-medium hover:bg-[#8b4bff] transition-all shadow-[0_0_30px_rgba(124,58,237,0.4)] hover:shadow-[0_0_40px_rgba(124,58,237,0.6)]"
              >
                <Heart className="w-6 h-6" />
                Start a Conversation
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}