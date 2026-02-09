// src/pages/Details.tsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '../Components/Header';
import Footer from '../Components/footer';
import { ArrowLeft, ExternalLink, Star } from 'lucide-react';

const API_BASE_URL = 'https://backendvideography.vercel.app/api';

interface ProjectDetail {
  id: number;
  title: string;
  description: string;
  details: string;
  media_type: 'image' | 'video';
  media_url: string;
  thumbnail_url: string;
  client: string;
  project_url: string | null;
  technologies_list: string[];
  is_featured: boolean;
  created_at: string;
  updated_at: string;
}

const Details: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<ProjectDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchProjectDetails(id);
    }
  }, [id]);

  const fetchProjectDetails = async (projectId: string) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/projects/${projectId}/`);

      if (!response.ok) {
        throw new Error('Project not found');
      }

      const data = await response.json();
      setProject(data);
      setLoading(false);
    } catch (err) {
      setError('Failed to load project details');
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
            <p className="text-xl text-[#cbd6ea]">Loading project details...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (error || !project) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gradient-to-b from-[#0b0f16] to-[#070a10] flex items-center justify-center text-[#e9f1ff]">
          <div className="text-center px-6 max-w-lg">
            <p className="text-xl text-red-400 mb-8">{error || 'Project not found'}</p>
            <Link
              to="/projects"
              className="inline-flex items-center gap-3 px-8 py-5 bg-[#7c3aed] text-[#0b0f16] rounded-xl font-medium hover:bg-[#8b4bff] transition shadow-[0_0_25px_rgba(124,58,237,0.4)] hover:shadow-[0_0_35px_rgba(124,58,237,0.6)]"
            >
              <ArrowLeft className="w-6 h-6" />
              Back to Projects
            </Link>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0b0f16] to-[#070a10] text-[#e9f1ff]">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        {/* Back Button */}
        <Link
          to="/projects"
          className="inline-flex items-center gap-3 text-[#cbd6ea] hover:text-[#7c3aed] transition mb-10 group text-lg font-medium"
        >
          <ArrowLeft className="w-6 h-6 group-hover:-translate-x-1 transition-transform" />
          Back to Projects
        </Link>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Media Section */}
          <div className="space-y-8">
            <div className="relative rounded-2xl overflow-hidden border border-[#2a2f3a] bg-[#0f1520] shadow-[0_0_30px_rgba(0,0,0,0.5)]">
              {project.media_type === 'video' ? (
                <video
                  controls
                  className="w-full h-auto aspect-video object-cover"
                  poster={project.thumbnail_url}
                >
                  <source src={project.media_url} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              ) : (
                <img
                  src={project.media_url}
                  alt={project.title}
                  className="w-full h-auto object-cover"
                />
              )}

              {project.is_featured && (
                <div className="absolute top-5 right-5 flex items-center gap-2 bg-[#7c3aed]/90 text-[#0b0f16] px-4 py-2 rounded-full font-medium shadow-[0_0_20px_rgba(124,58,237,0.5)] backdrop-blur-sm">
                  <Star className="w-5 h-5 fill-current" />
                  Featured Project
                </div>
              )}
            </div>
          </div>

          {/* Content Section */}
          <div className="space-y-10">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-5">
                {project.title}
              </h1>
              {project.client && (
                <p className="text-xl text-[#7c3aed] font-medium">
                  Client: {project.client}
                </p>
              )}
            </div>

            <div className="space-y-6">
              <div>
                <h2 className="text-2xl md:text-3xl font-semibold mb-4 text-[#e9f1ff]">
                  Overview
                </h2>
                <p className="text-[#cbd6ea] leading-relaxed text-lg">
                  {project.description}
                </p>
              </div>

              <div>
                <h2 className="text-2xl md:text-3xl font-semibold mb-4 text-[#e9f1ff]">
                  Project Details
                </h2>
                <p className="text-[#cbd6ea] leading-relaxed whitespace-pre-line text-lg">
                  {project.details}
                </p>
              </div>

              {project.technologies_list.length > 0 && (
                <div>
                  <h2 className="text-2xl md:text-3xl font-semibold mb-5 text-[#e9f1ff]">
                    Technologies
                  </h2>
                  <div className="flex flex-wrap gap-3">
                    {project.technologies_list.map((tech, index) => (
                      <span
                        key={index}
                        className="px-5 py-2.5 rounded-xl bg-[#141b28] border border-[#2a2f3a] text-[#cbd6ea] text-sm font-medium"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {project.project_url && (
                <div className="pt-6">
                  <a
                    href={project.project_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-3 px-8 py-5 bg-[#7c3aed] text-[#0b0f16] rounded-xl font-medium hover:bg-[#8b4bff] transition shadow-[0_0_25px_rgba(124,58,237,0.4)] hover:shadow-[0_0_40px_rgba(124,58,237,0.6)] text-lg"
                  >
                    View Live Project
                    <ExternalLink className="w-6 h-6" />
                  </a>
                </div>
              )}

              <div className="pt-8 border-t border-[#2a2f3a] text-sm text-[#cbd6ea]/80 space-y-1">
                <p>Created: {new Date(project.created_at).toLocaleDateString()}</p>
                <p>Updated: {new Date(project.updated_at).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Details;