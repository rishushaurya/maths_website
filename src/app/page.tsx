import HeroAsciiOne from "@/components/ui/hero-ascii-one";
import { FacultyGrid, TeamGrid } from "@/components/ui/faculty-grid";

import { ImageAutoSlider, type MediaItem } from "@/components/ui/image-auto-slider";
import { HomeEventsClient } from "@/components/ui/home-events-client";
import { EventCountdown } from "@/components/ui/event-countdown";
import { MorphingCardStack } from "@/components/ui/morphing-card-stack";
import { PromptingIsAllYouNeed } from "@/components/ui/animated-hero-section";
import { TestimonialSlider, type Review } from "@/components/ui/testimonial-slider-1";
import { Infinity, Divide, FunctionSquare, Variable, Hexagon, Activity, Network, Cpu } from "lucide-react";
import { getHomeGallerySections, getHomeEvents, getAboutContent, getSettings, type GallerySection } from "@/lib/data";

export const dynamic = "force-dynamic";

const eventCards = [
  {
    id: "hackathon",
    title: "Topology Hackathon",
    description: "48-hour challenge: Model complex manifolds and compute Betti numbers in real-time. Prizes for the most elegant computational solutions.",
    icon: <Infinity className="h-6 w-6" />,
  },
  {
    id: "lecture",
    title: "Non-Linear Dynamics Lecture",
    description: "Guest lecture by Dr. Aris: 'Chaos Theory and its Applications to Modern Fluid Mechanics Engineering'.",
    icon: <FunctionSquare className="h-6 w-6" />,
  },
  {
    id: "symposium",
    title: "Calculus Symposium 2026",
    description: "A gathering of minds to discuss advanced integration techniques and their practical implementation in optimizing structural load bearing.",
    icon: <Divide className="h-6 w-6" />,
  },
  {
    id: "workshop",
    title: "Algorithmic Logic Workshop",
    description: "Hands-on workshop focusing on translating continuous equations into discrete, computable algorithms for machine learning architectures.",
    icon: <Variable className="h-6 w-6" />,
  },
];

const brahmaguptaCards = [
  {
    id: "mission",
    title: "Mission",
    description: "Bridging the gap between foundational mathematics and modern engineering applications, especially AI. Cultivating research, workshops, and interdisciplinary ecosystems.",
    icon: <Hexagon className="h-6 w-6" />,
  },
  {
    id: "vision",
    title: "Vision",
    description: "Becoming a leading platform connecting mathematics, engineering, and AI. Inspiring curiosity, critical thinking, and global problem solving.",
    icon: <Activity className="h-6 w-6" />,
  },
  {
    id: "logo-description",
    title: "Logo Description",
    description: "Reflecting knowledge and innovation with Brahmagupta symbolizing Indian heritage. The circular design represents unity and the infinite nature of mathematics.",
    icon: <Network className="h-6 w-6" />,
  },
  {
    id: "about-brahmagupta",
    title: "About Brahmagupta",
    description: "(598–668 CE) Pioneered algebra and number theory, including rules for zero and negative numbers mapping fundamental concepts still active today.",
    icon: <Cpu className="h-6 w-6" />,
  },
];

const devTeamReviews: Review[] = [
  {
    id: 1,
    name: "Ashley Right",
    affiliation: "Pinterest",
    quote: "Professionals in their craft! All products were super amazing with strong attention to details, comps and overall vibe.",
    imageSrc: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=600&fit=crop&q=80",
    thumbnailSrc: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=120&fit=crop&q=80",
  },
  {
    id: 2,
    name: "Jacob Jose",
    affiliation: "New York Times",
    quote: "Unlimited, instant access to hundreds of premium quality resources created by designers for designers.",
    imageSrc: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop&q=80",
    thumbnailSrc: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=120&fit=crop&q=80",
  },
  {
    id: 3,
    name: "Elara Sands",
    affiliation: "Behance",
    quote: "The attention to detail is immaculate. Every component feels polished and ready for production.",
    imageSrc: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=600&fit=crop&q=80",
    thumbnailSrc: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=120&fit=crop&q=80",
  },
  {
    id: 4,
    name: "Marcus Cole",
    affiliation: "Dribbble",
    quote: "A true time-saver. I can focus on my core logic instead of pixel-pushing. Highly recommended.",
    imageSrc: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&h=600&fit=crop&q=80",
    thumbnailSrc: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&h=120&fit=crop&q=80",
  },
  {
    id: 5,
    name: "Serena V.",
    affiliation: "Figma",
    quote: "This is the design system I've been waiting for. It's flexible, accessible, and beautiful.",
    imageSrc: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&h=600&fit=crop&q=80",
    thumbnailSrc: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=100&h=120&fit=crop&q=80",
  },
];

const hackathonMedia: MediaItem[] = [
  { id: 'hk-1', type: 'image', src: 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?q=80&w=600&auto=format&fit=crop' },
  { id: 'hk-2', type: 'image', src: 'https://images.unsplash.com/photo-1472396961693-142e6e269027?q=80&w=600&auto=format&fit=crop' },
  { id: 'hk-vid-1', type: 'video', src: 'https://videos.pexels.com/video-files/30333849/13003128_2560_1440_25fps.mp4' },
  { id: 'hk-3', type: 'image', src: 'https://images.unsplash.com/photo-1505142468610-359e7d316be0?q=80&w=600&auto=format&fit=crop' },
  { id: 'hk-4', type: 'image', src: 'https://images.unsplash.com/photo-1482881497185-d4a9ddbe4151?q=80&w=600&auto=format&fit=crop' },
];

const lectureMedia: MediaItem[] = [
  { id: 'lc-1', type: 'image', src: 'https://images.unsplash.com/photo-1524799526615-766a9833dec0?q=80&w=600&auto=format&fit=crop' },
  { id: 'lc-2', type: 'video', src: 'https://videos.pexels.com/video-files/30333849/13003128_2560_1440_25fps.mp4' },
  { id: 'lc-3', type: 'image', src: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?q=80&w=600&auto=format&fit=crop' },
  { id: 'lc-4', type: 'image', src: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=600&auto=format&fit=crop' },
];

export default function Home() {
  const dbGallery = getHomeGallerySections();
  const dbEvents = getHomeEvents();
  const dbAbout = getAboutContent();
  const settings = getSettings();

  const dynamicEventCards = dbEvents.length > 0 ? dbEvents.map((e) => ({
    id: e.id,
    title: e.title,
    description: e.description,
    icon: <Infinity className="h-6 w-6" />,
  })) : eventCards;

  const dynamicGallery: { name: string; items: MediaItem[] }[] = dbGallery.length > 0
    ? dbGallery.map((s: GallerySection) => ({ name: s.name, items: s.items.map((i) => ({ id: i.id, type: i.type, src: i.url })) }))
    : [{ name: "Topology Hackathon", items: hackathonMedia }, { name: "Non-Linear Dynamics Lecture", items: lectureMedia }];

  const aboutParagraphs = dbAbout && dbAbout.paragraphs.length > 0 ? dbAbout.paragraphs : null;
  const countdownEvent = dbEvents.find(e => e.isCountdownEvent);

  return (
    <main className="relative min-h-screen font-mono antialiased overflow-x-hidden uppercase tracking-wider transition-colors duration-400"
      style={{ color: 'var(--text-primary)' }}
    >
      <div className="relative z-10">
        
        {/* Full-screen Hero */}
        <section id="home">
          <HeroAsciiOne />
        </section>

        <div className="bg-transparent flex flex-col">

          {/* EVENTS SECTION */}
          <section id="events" className="min-h-screen py-16 sm:py-32 px-4 flex flex-col items-center justify-center">
            
            {countdownEvent && (
              <div className="w-full max-w-5xl mx-auto relative z-20 mb-12 sm:mb-24">
                <EventCountdown event={countdownEvent} />
              </div>
            )}

            <div className="max-w-4xl mx-auto text-center mb-8 sm:mb-16 relative z-20">
              <h2 className="text-3xl sm:text-5xl font-bold mb-4 sm:mb-8 tracking-widest uppercase border-b border-dotted pb-4 sm:pb-6 inline-block" style={{ color: 'var(--text-primary)', borderColor: 'var(--border)' }}>UPCOMING EVENTS</h2>
              <p className="text-sm sm:text-xl font-mono normal-case tracking-normal max-w-2xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
                Symposiums, hackathons, and guest lectures designed to push your analytical boundaries.
              </p>
            </div>
            
            <div className="w-full max-w-5xl mx-auto relative z-20">
              <HomeEventsClient cards={dynamicEventCards} />
            </div>
          </section>

          {/* TEAM SECTION */}
          <section id="team" className="min-h-screen py-16 sm:py-32 px-4 flex flex-col items-center justify-center">
            <div className="max-w-4xl mx-auto text-center mb-8 sm:mb-16 relative z-20">
              <h2 className="text-3xl sm:text-5xl font-bold mb-4 sm:mb-8 tracking-widest uppercase" style={{ color: 'var(--text-primary)' }}>
                {settings.facultyHeading}
              </h2>
              <p className="text-sm sm:text-xl font-mono normal-case tracking-normal max-w-2xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
                Meet the visionary educators and researchers mentoring the next generation of engineers.
              </p>
            </div>
            
            <div className="w-full relative z-20 space-y-16 sm:space-y-32">
              <FacultyGrid gridCols={settings.facultyGridCols} />
              
              <div className="flex flex-col items-center">
                <h3 className="text-2xl sm:text-4xl font-bold mb-8 sm:mb-12 tracking-widest uppercase border-b border-dotted pb-4" style={{ color: 'var(--text-primary)', borderColor: 'var(--border)' }}>
                  {settings.studentHeading}
                </h3>
                <TeamGrid gridCols={settings.studentGridCols} />
              </div>
            </div>
          </section>

          {/* GALLERY SECTION */}
          <section id="gallery" className="min-h-screen py-16 sm:py-32 px-4 flex flex-col items-center justify-center border-t border-dotted" style={{ borderColor: 'var(--border)' }}>
            <div className="max-w-4xl mx-auto text-center mb-8 sm:mb-16 relative z-20">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-8 tracking-widest uppercase border-b border-dotted pb-4 sm:pb-6 inline-block" style={{ color: 'var(--text-primary)', borderColor: 'var(--border)' }}>GALLERY</h2>
              <p className="text-sm sm:text-xl font-mono normal-case tracking-normal max-w-2xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
                A visual journey through our department&apos;s greatest moments, symposiums, and breakthroughs.
              </p>
            </div>
            
            <div className="w-full relative z-20 space-y-6 sm:space-y-8">
              {dynamicGallery.map((g, i) => (
                <ImageAutoSlider key={i} eventName={g.name} items={g.items} />
              ))}
            </div>
          </section>

          {/* DEVS SECTION */}
          <section id="devs" className="min-h-screen py-16 sm:py-32 px-4 flex flex-col items-center justify-center border-t border-dotted" style={{ borderColor: 'var(--border)' }}>
            <div className="max-w-4xl mx-auto text-center mb-8 sm:mb-16 relative z-20">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-8 tracking-widest uppercase border-b border-dotted pb-4 sm:pb-6 inline-block" style={{ color: 'var(--text-primary)', borderColor: 'var(--border)' }}>
                {settings.developerHeading}
              </h2>
              <p className="text-sm sm:text-xl font-mono normal-case tracking-normal max-w-2xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
                The architects and engineers behind the interactive ecosystem of this platform.
              </p>
            </div>
            
            <div className="w-full relative z-20 mb-8 sm:mb-16">
              <PromptingIsAllYouNeed />
            </div>

            <div className="w-full relative z-20">
              <TestimonialSlider reviews={devTeamReviews} />
            </div>
          </section>

          {/* ABOUT SECTION */}
          <section id="about" className="min-h-screen py-16 sm:py-32 px-4 flex flex-col items-center justify-center border-t border-dotted" style={{ borderColor: 'var(--border)' }}>
            <div className="max-w-5xl mx-auto text-center mb-8 sm:mb-16 relative z-20">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-8 tracking-widest uppercase border-b border-dotted pb-4 sm:pb-6 inline-block" style={{ color: 'var(--text-primary)', borderColor: 'var(--border)' }}>
                BRAHMAGUPTA MATHEMATICS CLUB
              </h2>
              <div className="text-sm sm:text-lg leading-relaxed space-y-4 sm:space-y-6 font-mono normal-case tracking-normal max-w-4xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
                {aboutParagraphs ? (
                  aboutParagraphs.map((p, i) => <p key={i}>{p}</p>)
                ) : (
                  <>
                    <p>Established by the Department of Mathematics, Dayananda Sagar School of Engineering (DSU), serving as a bridge between young engineering minds and advanced research in mathematics and Artificial Intelligence.</p>
                    <p>As Dayananda Sagar University proudly positions itself as India&apos;s AI-first university, the club aligns its activities with this forward-looking vision. Mathematics forms the foundation of Artificial Intelligence, Data Science, Machine Learning, Computational Modeling, and emerging technologies.</p>
                    <p>Inspired by the legacy of the great Indian mathematician Brahmagupta, the club fosters analytical thinking, computational skills, and research-oriented learning.</p>
                  </>
                )}
              </div>
            </div>
            
            <div className="w-full max-w-5xl mx-auto relative z-20">
              <MorphingCardStack cards={brahmaguptaCards} defaultLayout="grid" />
            </div>
          </section>

        </div>
      </div>
    </main>
  );
}
