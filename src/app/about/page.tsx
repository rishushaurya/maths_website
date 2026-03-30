import { MorphingCardStack } from "@/components/ui/morphing-card-stack";
import { Hexagon, Activity, Network, Cpu } from "lucide-react";

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

export default function AboutPage() {
  return (
    <main className="relative min-h-screen font-mono antialiased overflow-x-hidden uppercase tracking-wider transition-colors duration-400 pt-24 sm:pt-32 pb-16 sm:pb-24">
      <div className="relative z-10 max-w-5xl mx-auto px-4">
        <div className="text-center mb-8 sm:mb-16 relative z-20">
          <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold mb-4 sm:mb-8 tracking-widest uppercase border-b border-dotted pb-4 sm:pb-6 inline-block" style={{ color: 'var(--text-primary)', borderColor: 'var(--border)' }}>
            BRAHMAGUPTA MATHEMATICS CLUB
          </h1>
          <div className="text-sm sm:text-base md:text-lg leading-relaxed space-y-4 sm:space-y-6 font-mono normal-case tracking-normal max-w-4xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
            <p>
              Established by the Department of Mathematics, Dayananda Sagar School of Engineering (DSU), serving as a bridge between young engineering minds and advanced research in mathematics and Artificial Intelligence.
            </p>
            <p>
              As Dayananda Sagar University proudly positions itself as India's AI-first university, the club aligns its activities with this forward-looking vision. Mathematics forms the foundation of Artificial Intelligence, Data Science, Machine Learning, Computational Modeling, and emerging technologies. Recognizing this, the club aims to connect theoretical mathematical concepts with real-world engineering applications and AI-driven innovations.
            </p>
            <p>
              Inspired by the legacy of the great Indian mathematician Brahmagupta, the club fosters analytical thinking, computational skills, and research-oriented learning. Through workshops, technical talks, conferences, coding sessions, AI–math integration programs, blogging platforms, and collaborative research activities, the club nurtures curiosity and innovation among students. The Brahmagupta Mathematics Club is not merely an academic body; it is a platform that transforms mathematical knowledge into engineering solutions and AI-powered advancements.
            </p>
          </div>
        </div>
        
        <div className="w-full max-w-5xl mx-auto relative z-20">
          <MorphingCardStack cards={brahmaguptaCards} defaultLayout="grid" />
        </div>
      </div>
    </main>
  );
}
