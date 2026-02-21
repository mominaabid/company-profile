import { useState, useEffect, useRef } from "react";
import {
  Camera,
  Award,
  Heart,
  Users,
  Briefcase,
  Globe,
  PlayCircle,
  ArrowRight,
  Sparkles,
  Film,
  Eye,
  Lightbulb,
  Zap,
  Target,
} from "lucide-react";
import Footer from "../Components/footer";

interface Stat {
  id: number;
  name: string;
  value: number;
}
interface CoreValue {
  id: number;
  title: string;
  description: string;
}
interface TimelineEvent {
  id: number;
  year: string;
  title: string;
  description: string;
}
interface Skill {
  id: number;
  name: string;
  level: number;
}
interface CTA {
  id: number;
  title: string;
  description: string;
  button_text: string;
}
interface TabContent {
  id: number;
  tab_name: string;
  title: string;
  content: string;
  image?: string;
  image_url?: string;
}
interface Hero {
  id: number;
  title: string;
  subtitle: string;
  video_url: string;
  button_text: string;
}

const About = () => {
  const [hero, setHero] = useState<Hero | null>(null);
  const [stats, setStats] = useState<Stat[]>([]);
  const [coreValues, setCoreValues] = useState<CoreValue[]>([]);
  const [timeline, setTimeline] = useState<TimelineEvent[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [cta, setCTA] = useState<CTA | null>(null);
  const [tabContent, setTabContent] = useState<TabContent[]>([]);
  const [activeTab, setActiveTab] = useState<"story" | "philosophy" | "approach">("story");
  const [counters, setCounters] = useState<Record<string, number>>({});
  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const BASE_URL = "https://backendvideography.vercel.app";
        const endpoints = {
          hero: `${BASE_URL}/about/hero/`,
          stats: `${BASE_URL}/about/stats/`,
          core: `${BASE_URL}/about/core-values/`,
          timeline: `${BASE_URL}/about/timeline/`,
          skills: `${BASE_URL}/about/skills/`,
          cta: `${BASE_URL}/about/cta/`,
          tabs: `${BASE_URL}/about/tab-content/`,
        };

        const [
          heroRes,
          statsRes,
          coreRes,
          timelineRes,
          skillsRes,
          ctaRes,
          tabsRes,
        ] = await Promise.all([
          fetch(endpoints.hero),
          fetch(endpoints.stats),
          fetch(endpoints.core),
          fetch(endpoints.timeline),
          fetch(endpoints.skills),
          fetch(endpoints.cta),
          fetch(endpoints.tabs),
        ]);

        const [
          heroJson,
          statsJson,
          coreJson,
          timelineJson,
          skillsJson,
          ctaJson,
          tabsJson,
        ] = await Promise.all([
          heroRes.json(),
          statsRes.json(),
          coreRes.json(),
          timelineRes.json(),
          skillsRes.json(),
          ctaRes.json(),
          tabsRes.json(),
        ]);

        const getResults = (data: any) => (Array.isArray(data) ? data : data?.results || []);

        setHero(getResults(heroJson)[0] || null);
        setStats(getResults(statsJson));
        setCoreValues(getResults(coreJson));
        setTimeline(getResults(timelineJson));
        setSkills(getResults(skillsJson));
        setCTA(getResults(ctaJson)[0] || null);
        setTabContent(getResults(tabsJson));
      } catch (err) {
        console.error("❌ Failed to fetch about page data:", err);
      }
    };

    fetchAll();
  }, []);

  // Counter Animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && stats.length > 0) {
          const duration = 2000;
          const startTime = Date.now();

          const interval = setInterval(() => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);

            const updated = stats.reduce((acc, stat) => {
              acc[stat.name] = Math.floor(stat.value * progress);
              return acc;
            }, {} as Record<string, number>);

            setCounters(updated);
            if (progress >= 1) clearInterval(interval);
          }, 30);
        }
      },
      { threshold: 0.3 }
    );

    if (statsRef.current) observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, [stats]);

  // Simple reveal for scroll sections
  useEffect(() => {
    const sections = document.querySelectorAll(".scroll-reveal");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("revealed");
        });
      },
      { threshold: 0.1 }
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  const valueIcons = [Heart, Eye, Lightbulb, Users];
  const timelineIcons = [PlayCircle, Award, Briefcase, Globe, Sparkles];
  const skillIcons = [Camera, Sparkles, Film, Zap, Target, Eye];
  const getTab = (name: string) => tabContent.find((t) => t.tab_name === name);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-900 to-black text-white overflow-x-hidden">
      {/* HERO */}
      {hero && (
        <section className="relative overflow-hidden min-h-[80vh] sm:min-h-screen">
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-transparent z-10"></div>
          <video autoPlay loop muted playsInline className="absolute top-0 left-0 w-full h-full object-cover opacity-50">
            <source src={hero.video_url} type="video/mp4" />
          </video>

          <div className="relative z-20 flex items-center justify-center text-center px-4 sm:px-8 py-20 sm:py-32">
            <div className="max-w-2xl sm:max-w-3xl scroll-reveal">
              <div className="inline-flex items-center gap-2 bg-purple-600/20 border border-purple-500/30 px-3 py-1 rounded-full mb-4 sm:mb-6 text-sm sm:text-base">
                <Sparkles size={14} className="text-purple-400" />
                <span>About Me</span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-bold mb-4 leading-snug">
                {hero.title.split(" ").slice(0, -2).join(" ")}
                <span className="block bg-gradient-to-r from-purple-400 via-pink-500 to-purple-600 bg-clip-text text-transparent mt-1">
                  {hero.title.split(" ").slice(-2).join(" ")}
                </span>
              </h1>
              <p className="text-gray-300 text-base sm:text-lg mb-6">{hero.subtitle}</p>
              <button className="group bg-gradient-to-r from-purple-600 to-pink-600 hover:scale-105 transition-transform px-6 py-3 rounded-lg font-semibold flex items-center gap-2 mx-auto text-sm sm:text-base">
                <PlayCircle size={18} />
                {hero.button_text}
              </button>
            </div>
          </div>

          <div className="absolute bottom-0 h-16 bg-gradient-to-t from-gray-900 to-transparent w-full z-10"></div>
        </section>
      )}

      {/* STATS */}
      {stats.length > 0 && (
        <section ref={statsRef} className="py-12 sm:py-16 px-4 sm:px-8 bg-gradient-to-br from-gray-900 to-[#1A0D2A]">
          <div className="max-w-6xl mx-auto grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {stats.map((stat, i) => {
              const Icon = [Briefcase, Users, Award, Globe][i % 4];
              return (
                <div key={stat.id} className="bg-gray-800/50 p-4 sm:p-6 rounded-2xl border border-gray-700/50 text-center hover:scale-105 transition-transform scroll-reveal">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 mx-auto bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mb-3 sm:mb-4">
                    <Icon size={20} />
                  </div>
                  <div className="text-2xl sm:text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                    {counters[stat.name] || 0}+
                  </div>
                  <div className="text-gray-400 mt-1 sm:mt-2 text-sm sm:text-base">{stat.name}</div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* TABS */}
      {/* {tabContent.length > 0 && (
        <section className="py-12 sm:py-16 px-4 sm:px-8 bg-gray-900">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-wrap justify-center gap-3 sm:gap-4 mb-8 sm:mb-12">
              {['story', 'philosophy', 'approach'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab as any)}
                  className={`px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold text-sm sm:text-base transition-all ${
                    activeTab === tab
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                      : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>

            <div className="flex flex-col lg:flex-row gap-8 lg:gap-10 items-center justify-center">
              <div className="w-full lg:w-5/12 flex justify-center">
                <div className="w-full max-w-[400px] sm:max-w-[500px]">
                  {getTab(activeTab)?.image ? (
                    <img
  src={getTab(activeTab)?.image_url || getTab(activeTab)?.image}
  alt={getTab(activeTab)?.title || 'Tab Image'}
  className="w-full h-auto object-cover rounded-3xl shadow-xl border-2 border-purple-500/30 hover:border-purple-500/60 transition-all duration-500 hover:scale-105"
/>
                  ) : (
                    <div className="w-full h-48 sm:h-64 bg-gray-800 rounded-3xl flex items-center justify-center text-gray-400 text-sm">
                      No Image Available
                    </div>
                  )}
                </div>
              </div>

              <div className="w-full lg:w-7/12 text-center lg:text-left space-y-4 sm:space-y-6">
                <h2 className="text-2xl sm:text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-500 to-purple-600 bg-clip-text text-transparent">
                  {getTab(activeTab)?.title || 'No Title'}
                </h2>
                <div className="h-1 w-20 sm:w-24 mx-auto lg:mx-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
                {getTab(activeTab)?.content
                  ?.split('\n')
                  .filter((p) => p.trim())
                  .map((para, i) => (
                    <p key={i} className="text-gray-300 text-base sm:text-lg leading-relaxed">
                      {para}
                    </p>
                  )) || <p>No content available</p>}
              </div>
            </div>
          </div>
        </section>
      )} */}
      {/* TABS */}
{tabContent.length > 0 && (
  <section className="py-12 sm:py-16 px-4 sm:px-8 bg-gray-900">
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-wrap justify-center gap-3 sm:gap-4 mb-8 sm:mb-12">
        {['story', 'philosophy', 'approach'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={`px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold text-sm sm:text-base transition-all ${
              activeTab === tab
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      <div className="flex flex-col lg:flex-row gap-8 lg:gap-10 items-center justify-center">
        <div className="w-full lg:w-5/12 flex justify-center">
          <div className="w-full max-w-[400px] sm:max-w-[500px]">
            {getTab(activeTab)?.image_url ? (
              <img
                src={getTab(activeTab)?.image_url}
                alt={getTab(activeTab)?.title || 'Tab Image'}
                className="w-full h-auto object-cover rounded-3xl shadow-xl border-2 border-purple-500/30 hover:border-purple-500/60 transition-all duration-500 hover:scale-105"
              />
            ) : (
              <div className="w-full h-48 sm:h-64 bg-gray-800 rounded-3xl flex flex-col items-center justify-center text-gray-400 text-sm gap-2">
                <Camera size={48} className="text-gray-600" />
                <p>No Image Available</p>
              </div>
            )}
          </div>
        </div>

        <div className="w-full lg:w-7/12 text-center lg:text-left space-y-4 sm:space-y-6">
          <h2 className="text-2xl sm:text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-500 to-purple-600 bg-clip-text text-transparent">
            {getTab(activeTab)?.title || 'Loading...'}
          </h2>
          <div className="h-1 w-20 sm:w-24 mx-auto lg:mx-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
          {getTab(activeTab)?.content ? (
            getTab(activeTab)?.content
              .split('\n')
              .filter((p) => p.trim())
              .map((para, i) => (
                <p key={i} className="text-gray-300 text-base sm:text-lg leading-relaxed">
                  {para}
                </p>
              ))
          ) : (
            <p className="text-gray-400">Content loading or not set yet.</p>
          )}
        </div>
      </div>
    </div>
  </section>
)}

      {/* CORE VALUES */}
      {coreValues.length > 0 && (
        <section className="py-12 sm:py-16 px-4 sm:px-8 bg-gradient-to-br from-[#1A0D2A] to-gray-900">
          <div className="max-w-7xl mx-auto text-center mb-8 sm:mb-12">
            <h2 className="text-3xl sm:text-5xl font-bold mb-3 sm:mb-4">Core Values</h2>
            <div className="w-20 sm:w-24 h-1 mx-auto bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 max-w-7xl mx-auto">
            {coreValues.map((val, i) => {
              const Icon = valueIcons[i % valueIcons.length];
              return (
                <div key={val.id} className="bg-gray-800/80 p-4 sm:p-6 rounded-2xl border border-gray-700/50 hover:border-purple-500/80 transition-all hover:scale-105 scroll-reveal">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-3 sm:mb-4 mx-auto">
                    <Icon size={20} />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold mb-1 sm:mb-2">{val.title}</h3>
                  <p className="text-gray-400 text-sm sm:text-base">{val.description}</p>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* SKILLS */}
      {skills.length > 0 && (
        <section className="py-12 sm:py-16 px-4 sm:px-8 bg-gray-900">
          <div className="max-w-4xl mx-auto text-center mb-8 sm:mb-12">
            <h2 className="text-3xl sm:text-5xl font-bold mb-3 sm:mb-4">Skills & Expertise</h2>
            <div className="w-20 sm:w-24 h-1 mx-auto bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 max-w-4xl mx-auto">
            {skills.map((s, i) => {
              const Icon = skillIcons[i % skillIcons.length];
              return (
                <div key={s.id} className="scroll-reveal">
                  <div className="flex justify-between mb-2 sm:mb-3 items-center flex-wrap gap-2">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                        <Icon size={16} />
                      </div>
                      <span className="font-semibold text-base sm:text-lg">{s.name}</span>
                    </div>
                    <span className="text-purple-400 font-bold text-sm sm:text-base">{s.level}%</span>
                  </div>
                  <div className="h-2 sm:h-3 bg-gray-800 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-purple-500 via-pink-500 to-purple-600 rounded-full" style={{ width: `${s.level}%` }}></div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* TIMELINE */}
      {timeline.length > 0 && (
        <section className="py-12 sm:py-16 px-4 sm:px-8 bg-gradient-to-br from-gray-900 to-[#1A0D2A]">
          <div className="max-w-5xl mx-auto text-center mb-8 sm:mb-12">
            <h2 className="text-3xl sm:text-5xl font-bold mb-3 sm:mb-4">The Journey</h2>
            <div className="w-20 sm:w-24 h-1 mx-auto bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
          </div>

          <div className="relative">
            <div className="hidden sm:block absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-purple-500 to-pink-500"></div>
            {timeline.map((item, i) => {
              const Icon = timelineIcons[i % timelineIcons.length];
              return (
                <div key={item.id} className={`mb-10 flex flex-col sm:flex-row ${i % 2 === 0 ? '' : 'sm:flex-row-reverse'} items-center scroll-reveal`}>
                  <div className="w-full sm:w-5/12 p-4 bg-gray-800/80 rounded-2xl border border-gray-700/50 hover:border-purple-500/80 transition-all">
                    <div className="flex items-center gap-3 mb-3 justify-center sm:justify-start">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                        <Icon size={16} />
                      </div>
                      <div className="text-2xl sm:text-3xl font-bold text-transparent bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text">{item.year}</div>
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold mb-2">{item.title}</h3>
                    <p className="text-gray-400 text-sm sm:text-base">{item.description}</p>
                  </div>

                  <div className="w-full sm:w-2/12 flex justify-center py-4">
                    <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full border-4 border-gray-900"></div>
                  </div>

                  <div className="w-full sm:w-5/12"></div>
                </div>
              );
            })}
          </div>
        </section>
      )}

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
};

export default About;
