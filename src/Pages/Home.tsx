import { useEffect, useState } from "react";
import axios from "axios";
import Header from "../Components/Header";
import Footer from "../Components/footer";
import Testimonials from "../Components/Testimonials";
import {
  Cpu,
  Laptop,
  Workflow,
  ArrowRight,
  Database,
  Shield,
  Search,
  Layers,
  Code2,
  TrendingUp,
  Cloud,
} from "lucide-react";

interface Service {
  id: number;
  title: string;
  description: string;
  icon: string;
  is_active: boolean;
}

interface Process {
  id: number;
  title: string;
  description: string;
  icon: string;
  is_active: boolean;
}

const BASE_URL = "https://backendvideography.vercel.app";

const iconMap: any = {
  Cpu,
  Laptop,
  Workflow,
  Database,
  Shield,
  Search,
  Layers,
  Code2,
  TrendingUp,
  Cloud,
};

const Home = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [processes, setProcesses] = useState<Process[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const [servicesRes, processRes] = await Promise.all([
        axios.get(`${BASE_URL}/home/services/`),
        axios.get(`${BASE_URL}/home/processes/`),
      ]);

      setServices(servicesRes.data.results || servicesRes.data);
      setProcesses(processRes.data.results || processRes.data);
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0b0f16] to-[#070a10] text-[#e9f1ff]">
      <Header />

      {/* HERO */}
      <section className="pt-28 pb-24 px-4 bg-gradient-to-b from-[#0b0f16] to-[#070a10]">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-14 items-center">
          <div>
            <span className="inline-block mb-5 px-4 py-1 rounded-full bg-[#141b28] text-[#7c3aed] text-sm font-medium border border-[#2a2f3a]">
              AI-Driven Digital Systems
            </span>

            <h1 className="text-4xl sm:text-5xl xl:text-6xl font-bold leading-tight">
              Building intelligent
              <span className="text-[#7c3aed]"> digital platforms</span>
              <br />for modern businesses
            </h1>

            <p className="mt-6 text-lg text-[#cbd6ea] max-w-xl">
              Aivora designs and engineers AI-powered software, scalable web
              platforms, and automation systems for forward-thinking companies.
            </p>

            <div className="mt-10 flex gap-4">
              <a
                href="/contact"
                className="px-6 py-3 rounded-lg bg-[#7c3aed] text-[#0b0f16] font-medium hover:bg-[#8b4bff] transition shadow-[0_0_20px_rgba(124,58,237,0.35)]"
              >
                Start a Project
              </a>

              <a
                href="/services"
                className="px-6 py-3 rounded-lg border border-[#2a2f3a] text-[#e9f1ff] hover:bg-[#0f1520] transition"
              >
                View Services
              </a>
            </div>
          </div>

          <div className="rounded-3xl border border-[#2a2f3a] bg-[#0f1520] p-8 shadow-[0_0_30px_rgba(124,58,237,0.18)]">
            <ul className="space-y-5 text-[#cbd6ea]">
              <li className="flex gap-4">
                <Cpu className="text-[#7c3aed]" />
                AI automation & intelligent workflows
              </li>
              <li className="flex gap-4">
                <Laptop className="text-[#7c3aed]" />
                Modern frontend engineering (React, Next.js)
              </li>
              <li className="flex gap-4">
                <Workflow className="text-[#7c3aed]" />
                Secure, scalable backend systems (Django)
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="py-24 bg-gradient-to-b from-[#0b0f16] to-[#070a10] border-t border-[#2a2f3a]">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-14">
            Core Capabilities
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {services.map((service) => {
              const Icon = iconMap[service.icon] || Cpu;
              return (
                <div
                  key={service.id}
                  className="p-8 rounded-2xl bg-[#0f1520] border border-[#2a2f3a] hover:border-[#7c3aed] hover:shadow-[0_0_30px_rgba(124,58,237,0.25)] transition"
                >
                  <Icon className="text-[#7c3aed] mb-5" size={32} />
                  <h3 className="text-xl font-semibold mb-2">
                    {service.title}
                  </h3>
                  <p className="text-sm text-[#cbd6ea]">
                    {service.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* PROCESS */}
      <section className="py-24 bg-gradient-to-b from-[#0b0f16] to-[#070a10] border-t border-[#2a2f3a]">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-16">Our Process</h2>

          <div className="grid md:grid-cols-4 gap-10">
            {processes.map((step) => {
              const Icon = iconMap[step.icon] || Workflow;
              return (
                <div key={step.id} className="text-center">
                  <div className="mx-auto w-14 h-14 rounded-xl bg-[#0f1520] border border-[#2a2f3a] flex items-center justify-center mb-4 shadow-[0_0_25px_rgba(124,58,237,0.20)]">
                    <Icon className="text-[#7c3aed]" />
                  </div>
                  <h3 className="font-semibold">{step.title}</h3>
                  <p className="text-sm text-[#cbd6ea] mt-2">
                    {step.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <Testimonials />

      {/* CTA */}
      <section className="py-28 bg-gradient-to-r from-[#1b0a2a] to-[#0a2a3a]">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl sm:text-4xl font-bold text-[#e9f1ff] mb-6">
            Ready to build intelligent software?
          </h2>
          <p className="text-[#cbd6ea] mb-8 text-lg">
            Partner with Aivora to design, build, and scale your next product.
          </p>
          <a
            href="/contact"
            className="inline-flex items-center gap-2 bg-[#0b0f16] text-[#e9f1ff] px-8 py-3 rounded-lg font-medium hover:bg-[#0f1520] transition shadow-[0_0_30px_rgba(124,58,237,0.35)] border border-[#2a2f3a]"
          >
            Talk to Us <ArrowRight size={18} />
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
