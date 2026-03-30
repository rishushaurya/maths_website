import { FacultyGrid, TeamGrid } from "@/components/ui/faculty-grid";
import { PromptingIsAllYouNeed } from "@/components/ui/animated-hero-section";
import { TestimonialSlider, type Review } from "@/components/ui/testimonial-slider-1";
import { getSettings } from "@/lib/data";

const devTeamReviews: Review[] = [
  {
    id: 1,
    name: "Ashley Right",
    affiliation: "Pinterest",
    quote:
      "Professionals in their craft! All products were super amazing with strong attention to details, comps and overall vibe.",
    imageSrc:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=600&fit=crop&q=80",
    thumbnailSrc:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=120&fit=crop&q=80",
  },
  {
    id: 2,
    name: "Jacob Jose",
    affiliation: "New York Times",
    quote:
      "Unlimited, instant access to hundreds of premium quality resources created by designers for designers.",
    imageSrc:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop&q=80",
    thumbnailSrc:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=120&fit=crop&q=80",
  },
  {
    id: 3,
    name: "Elara Sands",
    affiliation: "Behance",
    quote:
      "The attention to detail is immaculate. Every component feels polished and ready for production.",
    imageSrc:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=600&fit=crop&q=80",
    thumbnailSrc:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=120&fit=crop&q=80",
  },
  {
    id: 4,
    name: "Marcus Cole",
    affiliation: "Dribbble",
    quote:
      "A true time-saver. I can focus on my core logic instead of pixel-pushing. Highly recommended.",
    imageSrc:
      "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&h=600&fit=crop&q=80",
    thumbnailSrc:
      "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&h=120&fit=crop&q=80",
  },
  {
    id: 5,
    name: "Serena V.",
    affiliation: "Figma",
    quote:
      "This is the design system I've been waiting for. It's flexible, accessible, and beautiful.",
    imageSrc:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&h=600&fit=crop&q=80",
    thumbnailSrc:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=100&h=120&fit=crop&q=80",
  },
];

export default function TeamPage() {
  const settings = getSettings();
  
  return (
    <main className="relative min-h-screen font-mono antialiased overflow-x-hidden transition-colors duration-400 pt-32 pb-24">
      <div className="relative z-10 container mx-auto px-4 lg:px-12">
        
        {/* Teams Section */}
        <div className="mb-16 md:mb-24 flex flex-col items-center justify-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold tracking-widest text-center" style={{ color: 'var(--text-primary)' }}>
            {settings.studentHeading}
          </h1>
          <div className="h-1 w-24 rounded" style={{ background: 'var(--accent)' }} />
          <p className="max-w-2xl text-center text-sm md:text-base opacity-80" style={{ color: 'var(--text-secondary)' }}>
            Visionaries modeling the abstract universe of logic to drive the concrete engineering breakthroughs of tomorrow.
          </p>
        </div>

        <div className="space-y-24 border border-[var(--border)] p-8 mt-12 backdrop-blur-md mb-32" style={{ background: 'transparent' }}>
          <TeamGrid gridCols={settings.studentGridCols} />
        </div>

        {/* Developers Section */}
        <section id="devs" className="flex flex-col items-center justify-center border-t border-dotted pt-32" style={{ borderColor: 'var(--border)' }}>
          <div className="max-w-4xl mx-auto text-center mb-16 relative z-20">
            <h2 className="text-4xl md:text-5xl font-bold mb-8 tracking-widest uppercase border-b border-dotted pb-6 inline-block" style={{ color: 'var(--text-primary)', borderColor: 'var(--border)' }}>
              {settings.developerHeading}
            </h2>
            <p className="text-xl font-mono normal-case tracking-normal max-w-2xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
              The architects and engineers behind the interactive ecosystem of this platform.
            </p>
          </div>
          
          <div className="w-full relative z-20 mb-16">
            <PromptingIsAllYouNeed />
          </div>

          <div className="w-full relative z-20">
            <TestimonialSlider reviews={devTeamReviews} />
          </div>
        </section>

      </div>
    </main>
  );
}
