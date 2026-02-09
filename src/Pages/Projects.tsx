// src/pages/Projects.tsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../Components/Header';
import Footer from '../Components/footer';
import { ArrowRight, Star } from 'lucide-react';

const API_BASE_URL = 'https://backendvideography.vercel.app/api';

interface HeroSection {
  id: number;
  title: string;
  subtitle: string;
  button_text: string;
  media_type: 'image' | 'video';
  media_url: string;
}

interface Project {
  id: number;
  title: string;
  description: string;
  media_type: 'image' | 'video';
  media_url: string;
  thumbnail_url: string;
  client: string;
  technologies_list: string[];
  is_featured: boolean;
}

const Projects: React.FC = () => {
  const [heroData, setHeroData] = useState<HeroSection | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);

      const heroResponse = await fetch(`${API_BASE_URL}/portfolio-hero/active/`);
      if (heroResponse.ok) {
        const heroJson = await heroResponse.json();
        setHeroData(heroJson);
      }

      const projectsResponse = await fetch(`${API_BASE_URL}/projects/`);
      if (projectsResponse.ok) {
        const projectsJson = await projectsResponse.json();
        setProjects(projectsJson.results || projectsJson);
      }

      setLoading(false);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to load projects. Please try again later.');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gradient-to-b from-[#0b0f16] to-[#070a10] flex items-center justify-center text-[#e9f1ff]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-14 w-14 border-t-2 border-b-2 border-[#7c3aed] mx-auto mb-6"></div>
            <p className="text-xl text-[#cbd6ea]">Loading projects...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gradient-to-b from-[#0b0f16] to-[#070a10] flex items-center justify-center text-[#e9f1ff]">
          <div className="text-center px-4">
            <p className="text-xl text-red-400 mb-6">{error}</p>
            <button
              onClick={fetchData}
              className="px-8 py-4 bg-[#7c3aed] text-[#0b0f16] rounded-xl font-medium hover:bg-[#8b4bff] transition shadow-[0_0_20px_rgba(124,58,237,0.4)] hover:shadow-[0_0_30px_rgba(124,58,237,0.6)]"
            >
              Try Again
            </button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0b0f16] to-[#070a10] text-[#e9f1ff]">
      <Header />

      {/* Hero Section */}
      {heroData && (
        <section className="relative h-[70vh] min-h-[500px] flex items-center justify-center overflow-hidden">
          {heroData.media_type === 'video' ? (
            <video
              autoPlay
              loop
              muted
              playsInline
              className="absolute inset-0 w-full h-full object-cover"
            >
              <source src={heroData.media_url} type="video/mp4" />
            </video>
          ) : (
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${heroData.media_url})` }}
            />
          )}

          <div className="absolute inset-0 bg-gradient-to-b from-[#0b0f16]/70 via-[#0b0f16]/50 to-[#070a10]/90" />

          <div className="relative z-10 text-center px-6 max-w-5xl">
            <h1 className="text-4xl sm:text-5xl md:text-6xl xl:text-7xl font-bold leading-tight mb-6">
              {heroData.title}
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-[#cbd6ea] mb-10 max-w-3xl mx-auto">
              {heroData.subtitle}
            </p>
            <button className="inline-flex items-center gap-3 px-8 py-5 bg-[#7c3aed] text-[#0b0f16] rounded-xl font-medium hover:bg-[#8b4bff] transition shadow-[0_0_25px_rgba(124,58,237,0.4)] hover:shadow-[0_0_35px_rgba(124,58,237,0.6)]">
              {heroData.button_text}
              <ArrowRight className="w-6 h-6" />
            </button>
          </div>
        </section>
      )}

      {/* Projects Grid */}
      <section className="py-20 md:py-24 px-4 border-t border-[#2a2f3a]">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">
            Our <span className="text-[#7c3aed]">Work</span>
          </h2>

          {projects.length === 0 ? (
            <div className="text-center py-20 text-[#cbd6ea] text-xl">
              No projects available at the moment.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects.map((project) => (
                <Link
                  key={project.id}
                  to={`/projects/${project.id}`}
                  className="group relative rounded-2xl overflow-hidden bg-[#0f1520] border border-[#2a2f3a] hover:border-[#7c3aed] hover:shadow-[0_0_30px_rgba(124,58,237,0.25)] transition-all duration-500 transform hover:-translate-y-2"
                >
                  <div className="relative h-56 overflow-hidden">
                    {project.media_type === 'video' ? (
                      <video
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        muted
                        loop
                        playsInline
                      >
                        <source src={project.media_url} type="video/mp4" />
                      </video>
                    ) : (
                      <img
                        src={project.thumbnail_url || project.media_url}
                        alt={project.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    )}

                    {project.is_featured && (
                      <div className="absolute top-4 right-4 flex items-center gap-2 bg-[#7c3aed]/90 text-[#0b0f16] text-xs font-medium px-3 py-1.5 rounded-full shadow-[0_0_15px_rgba(124,58,237,0.5)]">
                        <Star className="w-4 h-4 fill-current" />
                        Featured
                      </div>
                    )}
                  </div>

                  <div className="p-7">
                    <h3 className="text-2xl font-bold mb-3 group-hover:text-[#7c3aed] transition-colors">
                      {project.title}
                    </h3>

                    {project.client && (
                      <p className="text-sm text-[#7c3aed] mb-4">
                        {project.client}
                      </p>
                    )}

                    <p className="text-[#cbd6ea] mb-6 line-clamp-3 text-base leading-relaxed">
                      {project.description}
                    </p>

                    {project.technologies_list.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {project.technologies_list.map((tech, idx) => (
                          <span
                            key={idx}
                            className="text-xs px-3 py-1.5 rounded-lg bg-[#141b28] border border-[#2a2f3a] text-[#cbd6ea]"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Projects;