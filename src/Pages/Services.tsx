import { useState, useEffect, useRef } from 'react';
import {
  Cpu,
  Code2,
  Database,
  Cloud,
  Shield,
  Workflow,
  TrendingUp,
  CheckCircle,
  ArrowRight,
 
  Users,
  Award,
  Star,
} from 'lucide-react';
import Header from '../Components/Header';
import Footer from '../Components/footer';

// API Base URL
const API_BASE_URL = 'https://backendvideography.vercel.app/api';

interface ServiceFeature {
  id: number;
  feature_text: string;
  order: number;
}

interface Service {
  id: number;
  title: string;
  icon: string;
  video_url: string;
  description: string;
  features: ServiceFeature[];
  is_active: boolean;
  order: number;
}

interface ProcessStep {
  id: number;
  step_number: string;
  title: string;
  description: string;
  order: number;
}

interface EquipmentItem {
  id: number;
  item_name: string;
  order: number;
}

interface EquipmentCategory {
  id: number;
  name: string;
  items: EquipmentItem[];
  order: number;
}

interface Testimonial {
  id: number;
  name: string;
  role: string;
  text: string;
  rating: number;
}

interface Stats {
  projects_completed: number;
  happy_clients: number;
  industry_awards: number;
  client_satisfaction: number;
}

interface VisibilityState {
  [key: string]: boolean;
}

export default function ServicesPage() {
  const [typewriterText, setTypewriterText] = useState<string>('');
  const fullText = 'Engineering Intelligent Digital Systems for Tomorrow';
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isVisible, setIsVisible] = useState<VisibilityState>({});
  const observerRef = useRef<IntersectionObserver | null>(null);

  const [services, setServices] = useState<Service[]>([]);
  const [processSteps, setProcessSteps] = useState<ProcessStep[]>([]);
  const [equipment, setEquipment] = useState<EquipmentCategory[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [stats, setStats] = useState<Stats>({
    projects_completed: 0,
    happy_clients: 0,
    industry_awards: 0,
    client_satisfaction: 0,
  });
  const [animatedStats, setAnimatedStats] = useState<Stats>({
    projects_completed: 0,
    happy_clients: 0,
    industry_awards: 0,
    client_satisfaction: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [servicesRes, processRes, equipmentRes, testimonialsRes, statsRes] = await Promise.all([
          fetch(`${API_BASE_URL}/services/`),
          fetch(`${API_BASE_URL}/process-steps/`),
          fetch(`${API_BASE_URL}/equipment/`),
          fetch(`${API_BASE_URL}/testimonials/`),
          fetch(`${API_BASE_URL}/stats/`),
        ]);

        if (!servicesRes.ok || !processRes.ok || !equipmentRes.ok || !testimonialsRes.ok || !statsRes.ok) {
          throw new Error('Failed to fetch data');
        }

        const servicesData = await servicesRes.json();
        const processData = await processRes.json();
        const equipmentData = await equipmentRes.json();
        const testimonialsData = await testimonialsRes.json();
        const statsData = await statsRes.json();

        setServices(Array.isArray(servicesData) ? servicesData : servicesData.results || []);
        setProcessSteps(Array.isArray(processData) ? processData : processData.results || []);
        setEquipment(Array.isArray(equipmentData) ? equipmentData : equipmentData.results || []);
        setTestimonials(Array.isArray(testimonialsData) ? testimonialsData : testimonialsData.results || []);

        setStats({
          projects_completed: statsData.projects_completed,
          happy_clients: statsData.happy_clients,
          industry_awards: statsData.industry_awards,
          client_satisfaction: statsData.client_satisfaction,
        });
        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load data. Please try again later.');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Icon mapping adjusted for tech context
  const getIcon = (iconName: string): React.ReactElement => {
    const iconMap: { [key: string]: React.ReactElement } = {
      Cpu: <Cpu className="w-10 h-10 sm:w-12 sm:h-12" />,
      Code2: <Code2 className="w-10 h-10 sm:w-12 sm:h-12" />,
      Database: <Database className="w-10 h-10 sm:w-12 sm:h-12" />,
      Cloud: <Cloud className="w-10 h-10 sm:w-12 sm:h-12" />,
      Shield: <Shield className="w-10 h-10 sm:w-12 sm:h-12" />,
      Workflow: <Workflow className="w-10 h-10 sm:w-12 sm:h-12" />,
    };
    return iconMap[iconName] || <Cpu className="w-10 h-10 sm:w-12 sm:h-12" />;
  };

  // Typewriter
  useEffect(() => {
    if (currentIndex < fullText.length) {
      const timeout = setTimeout(() => {
        setTypewriterText((prev) => prev + fullText[currentIndex]);
        setCurrentIndex((prev) => prev + 1);
      }, 80);
      return () => clearTimeout(timeout);
    }
  }, [currentIndex]);

  // Intersection Observer
  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const target = entry.target as HTMLElement;
            setIsVisible((prev) => ({ ...prev, [target.id]: true }));
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll('[data-animate]').forEach((el) => {
      if (observerRef.current) observerRef.current.observe(el);
    });

    return () => {
      if (observerRef.current) observerRef.current.disconnect();
    };
  }, [loading]);

  // Animated stats
  useEffect(() => {
    if (isVisible['stats-title'] && stats.projects_completed > 0) {
      let start = 0;
      const duration = 2000;
      const increment = 20;

      const counter = setInterval(() => {
        start += increment;
        setAnimatedStats({
          projects_completed: Math.min(Math.floor((stats.projects_completed * start) / duration), stats.projects_completed),
          happy_clients: Math.min(Math.floor((stats.happy_clients * start) / duration), stats.happy_clients),
          industry_awards: Math.min(Math.floor((stats.industry_awards * start) / duration), stats.industry_awards),
          client_satisfaction: Math.min(Math.floor((stats.client_satisfaction * start) / duration), stats.client_satisfaction),
        });
        if (start >= duration) clearInterval(counter);
      }, increment);
    }
  }, [isVisible['stats-title'], stats]);

  const statsDisplay = [
    { icon: <Star className="w-6 h-6 sm:w-8 sm:h-8" />, number: animatedStats.projects_completed + '+', label: 'Projects Delivered' },
    { icon: <Users className="w-6 h-6 sm:w-8 sm:h-8" />, number: animatedStats.happy_clients + '+', label: 'Clients Served' },
    { icon: <Award className="w-6 h-6 sm:w-8 sm:h-8" />, number: animatedStats.industry_awards + '+', label: 'Industry Recognitions' },
    { icon: <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8" />, number: animatedStats.client_satisfaction + '%', label: 'Satisfaction Rate' },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0b0f16] to-[#070a10] flex items-center justify-center text-[#e9f1ff]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#7c3aed] mx-auto mb-4"></div>
          <p className="text-xl">Loading services...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0b0f16] to-[#070a10] flex items-center justify-center text-[#e9f1ff]">
        <div className="text-center">
          <p className="text-xl text-red-400 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-8 py-4 bg-[#7c3aed] text-[#0b0f16] rounded-xl font-medium hover:bg-[#8b4bff] transition shadow-[0_0_20px_rgba(124,58,237,0.4)]"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0b0f16] to-[#070a10] text-[#e9f1ff] overflow-hidden">
      <Header />

      <style
        dangerouslySetInnerHTML={{
          __html: `
            @keyframes fade-in { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
            @keyframes slide-up { from { opacity: 0; transform: translateY(15px); } to { opacity: 1; transform: translateY(0); } }
            .animate-fade-in { animation: fade-in 0.8s ease-out; }
            .animate-slide-up { animation: slide-up 0.8s ease-out; }
          `,
        }}
      />

      {/* Hero */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden pt-16">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute top-0 left-0 w-full h-full object-cover"
        >
          <source src="/Service2.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-[#0b0f16]/80 via-[#0b0f16]/50 to-[#070a10]/90" />

        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
          <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-[#141b28] border border-[#2a2f3a] text-[#7c3aed] text-sm font-medium mb-8 animate-fade-in">
            <Award className="w-5 h-5" />
            <span>Engineering Excellence</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl xl:text-7xl font-bold leading-tight mb-6 animate-slide-up">
            Our <span className="text-[#7c3aed]">Services</span>
          </h1>

          <p className="text-xl sm:text-3xl text-[#cbd6ea] font-light">
            {typewriterText}
            <span className="animate-pulse">|</span>
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-24 px-4 bg-gradient-to-b from-[#0b0f16] to-[#070a10] border-t border-[#2a2f3a]">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">
            Core <span className="text-[#7c3aed]">Capabilities</span>
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div
                key={service.id}
                data-animate
                id={`service-${index}`}
                className={`group relative p-8 rounded-2xl bg-[#0f1520] border border-[#2a2f3a] hover:border-[#7c3aed] hover:shadow-[0_0_30px_rgba(124,58,237,0.25)] transition-all duration-500 overflow-hidden ${
                  isVisible[`service-${index}`] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
                }`}
              >
                <div className="absolute inset-0">
                  <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover opacity-20 transition-opacity group-hover:opacity-30"
                  >
                    <source src={service.video_url} type="video/mp4" />
                  </video>
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0f1520] via-transparent to-[#0f1520]/80" />
                </div>

                <div className="relative z-10">
                  <div className="text-[#7c3aed] mb-6">{getIcon(service.icon)}</div>
                  <h3 className="text-2xl font-bold mb-4">{service.title}</h3>
                  <p className="text-[#cbd6ea] mb-6 text-base leading-relaxed">
                    {service.description}
                  </p>
                  <div className="space-y-3">
                    {service.features.map((feature) => (
                      <div key={feature.id} className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-[#7c3aed]" />
                        <span className="text-[#cbd6ea]">{feature.feature_text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-24 px-4 bg-gradient-to-b from-[#0b0f16] to-[#070a10] border-t border-[#2a2f3a]">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">
            Our <span className="text-[#7c3aed]">Development Process</span>
          </h2>

          <div className="grid md:grid-cols-4 gap-8">
            {processSteps.map((step, index) => (
              <div
                key={step.id}
                className="text-center"
                data-animate
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-[#141b28] border border-[#2a2f3a] flex items-center justify-center text-2xl font-bold text-[#7c3aed] shadow-[0_0_20px_rgba(124,58,237,0.2)]">
                  {step.step_number}
                </div>
                <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                <p className="text-[#cbd6ea] text-sm">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack / Tools */}
      <section className="py-24 px-4 bg-gradient-to-b from-[#0b0f16] to-[#070a10] border-t border-[#2a2f3a]">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">
            Our <span className="text-[#7c3aed]">Technology Stack</span>
          </h2>

          <div className="grid md:grid-cols-4 gap-6">
            {equipment.map((category) => (
              <div
                key={category.id}
                className="p-6 rounded-2xl bg-[#0f1520] border border-[#2a2f3a] hover:border-[#7c3aed] hover:shadow-[0_0_25px_rgba(124,58,237,0.2)] transition-all"
              >
                <h3 className="text-xl font-semibold mb-5 flex items-center gap-3">
                  <Cpu className="w-6 h-6 text-[#7c3aed]" />
                  {category.name}
                </h3>
                <ul className="space-y-3">
                  {category.items.map((item) => (
                    <li key={item.id} className="flex items-center gap-3 text-[#cbd6ea] text-sm">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#7c3aed]" />
                      {item.item_name}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-4 bg-gradient-to-b from-[#0b0f16] to-[#070a10] border-t border-[#2a2f3a]">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">
            What Our <span className="text-[#7c3aed]">Clients</span> Say
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.id}
                className="p-8 rounded-2xl bg-[#0f1520] border border-[#2a2f3a] hover:border-[#7c3aed] hover:shadow-[0_0_30px_rgba(124,58,237,0.25)] transition-all"
              >
                <div className="flex gap-1 mb-5">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-[#7c3aed] text-[#7c3aed]" />
                  ))}
                </div>
                <p className="text-[#cbd6ea] italic mb-6 text-base">"{testimonial.text}"</p>
                <div>
                  <h4 className="font-semibold text-lg">{testimonial.name}</h4>
                  <p className="text-[#7c3aed] text-sm">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-24 px-4 bg-gradient-to-b from-[#0b0f16] to-[#070a10] border-t border-[#2a2f3a]">
        <div className="max-w-7xl mx-auto text-center">
          <h2
            className={`text-4xl md:text-5xl font-bold mb-16 transition-all duration-800 ${
              isVisible['stats-title'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
            }`}
            id="stats-title"
            data-animate
          >
            Performance <span className="text-[#7c3aed]">Metrics</span>
          </h2>

          <div className="grid md:grid-cols-4 gap-8">
            {statsDisplay.map((stat, index) => (
              <div
                key={index}
                className="p-8 rounded-2xl bg-[#0f1520] border border-[#2a2f3a] hover:border-[#7c3aed] hover:shadow-[0_0_30px_rgba(124,58,237,0.25)] transition-all"
              >
                <div className="text-[#7c3aed] flex justify-center mb-6">{stat.icon}</div>
                <div className="text-4xl md:text-5xl font-bold mb-3 text-[#e9f1ff]">
                  {stat.number}
                </div>
                <p className="text-[#cbd6ea]">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-28 px-4 bg-gradient-to-b from-[#0b0f16] to-[#070a10] border-t border-[#2a2f3a]">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-4xl md:text-6xl font-bold mb-8">
            Ready to Build <span className="text-[#7c3aed]">Intelligent</span> Software?
          </h2>
          <p className="text-xl text-[#cbd6ea] mb-10 max-w-3xl mx-auto">
            Partner with us to design, develop, and scale your next-generation digital product.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <a
              href="/contact"
              className="inline-flex items-center gap-3 px-10 py-5 bg-[#7c3aed] text-[#0b0f16] rounded-xl font-medium hover:bg-[#8b4bff] transition-all shadow-[0_0_30px_rgba(124,58,237,0.4)] hover:shadow-[0_0_45px_rgba(124,58,237,0.6)]"
            >
              Start a Project
              <ArrowRight className="w-6 h-6" />
            </a>

            <a
              href="/contact"
              className="inline-flex items-center px-10 py-5 border border-[#2a2f3a] rounded-xl font-medium hover:bg-[#0f1520] hover:border-[#7c3aed] transition-all"
            >
              Book a Strategy Call
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}