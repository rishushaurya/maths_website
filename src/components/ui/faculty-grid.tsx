"use client";

import { AvatarHoverCard } from "@/components/ui/avatar-hover-card";
import { FacultyCard } from "@/components/ui/faculty-card";

// Higher level Faculty / Chancellors
const facultyMembers = [
  {
    name: "Dr. D. Hemachandra Sagar",
    role: "Chancellor, DSU",
    imageSrc: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=200&auto=format&fit=crop",
  },
  {
    name: "Dr. D. Premachandra Sagar",
    role: "Pro Chancellor, DSU",
    imageSrc: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop",
  },
  {
    name: "Dr. A. N. Kolmogorov",
    role: "Professor & HOD",
    imageSrc: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop",
  },
];

// Student Team / Math Club Members
const teamMembers = [
  {
    name: "Ramanujan Kumar",
    role: "Tech Lead",
    specialization: "Algorithms & Competitive Programming",
    imageSrc: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=200&auto=format&fit=crop",
  },
  {
    name: "Emmy Singh",
    role: "Design Lead",
    specialization: "UI/UX & Interactive Media",
    imageSrc: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop",
  },
  {
    name: "Alan Turing",
    role: "Event Coordinator",
    specialization: "Logistics & Outreach",
    imageSrc: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop",
  },
  {
    name: "Ada Lovelace",
    role: "Content Writer",
    specialization: "Publications & Blogs",
    imageSrc: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200&auto=format&fit=crop",
  },
];

interface GridProps {
  gridCols?: number;
}

export function FacultyGrid({ gridCols = 3 }: GridProps) {
  // Generate a dynamic grid class based on gridCols
  const colClass = 
    gridCols === 1 ? "grid-cols-1" :
    gridCols === 2 ? "grid-cols-1 md:grid-cols-2" :
    gridCols === 3 ? "grid-cols-1 md:grid-cols-3" :
    gridCols === 4 ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-4" :
    "grid-cols-1 md:grid-cols-3"; // default

  return (
    <div className={`grid ${colClass} gap-8 lg:gap-12 max-w-6xl mx-auto py-8 place-items-center`}>
      {facultyMembers.map((faculty, idx) => (
        <FacultyCard
          key={idx}
          name={faculty.name}
          role={faculty.role}
          imageSrc={faculty.imageSrc}
          className="w-full max-w-sm md:max-w-md lg:w-[350px]"
        />
      ))}
    </div>
  );
}

export function TeamGrid({ gridCols = 4 }: GridProps) {
  const colClass = 
    gridCols === 1 ? "grid-cols-1" :
    gridCols === 2 ? "grid-cols-1 md:grid-cols-2" :
    gridCols === 3 ? "grid-cols-1 md:grid-cols-3" :
    gridCols === 4 ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-4" :
    gridCols === 5 ? "grid-cols-2 md:grid-cols-3 lg:grid-cols-5" :
    gridCols === 6 ? "grid-cols-2 md:grid-cols-3 lg:grid-cols-6" :
    "grid-cols-1 md:grid-cols-2 lg:grid-cols-4"; // default

  return (
    <div className={`grid ${colClass} gap-12 lg:gap-16 max-w-5xl mx-auto py-8 place-items-center`}>
      {teamMembers.map((team, idx) => (
        <div key={idx} className="flex justify-center w-full">
          <AvatarHoverCard
            imageSrc={team.imageSrc}
            name={team.name}
            username={team.role}
            description={`Specialization: ${team.specialization}`}
            size="lg"
            variant="glass"
          />
        </div>
      ))}
    </div>
  );
}
