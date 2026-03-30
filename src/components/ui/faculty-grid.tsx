"use client";

import { AvatarHoverCard } from "@/components/ui/avatar-hover-card";
import { FacultyCard } from "@/components/ui/faculty-card";
import type { TeamMember } from "@/lib/data";

interface GridProps {
  gridCols?: number;
  members: TeamMember[];
}

export function FacultyGrid({ gridCols = 3, members }: GridProps) {
  // Generate a dynamic grid class based on gridCols
  const colClass = 
    gridCols === 1 ? "grid-cols-1" :
    gridCols === 2 ? "grid-cols-1 md:grid-cols-2" :
    gridCols === 3 ? "grid-cols-1 md:grid-cols-3" :
    gridCols === 4 ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-4" :
    "grid-cols-1 md:grid-cols-3"; // default

  return (
    <div className={`grid ${colClass} gap-8 lg:gap-12 max-w-6xl mx-auto py-8 place-items-center`}>
      {members.map((faculty, idx) => (
        <FacultyCard
          key={faculty.id || idx}
          name={faculty.name}
          role={faculty.role}
          imageSrc={faculty.image}
          className="w-full max-w-sm md:max-w-md lg:w-[350px]"
        />
      ))}
    </div>
  );
}

export function TeamGrid({ gridCols = 4, members }: GridProps) {
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
      {members.map((team, idx) => (
        <div key={team.id || idx} className="flex justify-center w-full">
          <AvatarHoverCard
            imageSrc={team.image}
            name={team.name}
            username={team.role}
            description={team.affiliation ? `Affiliation: ${team.affiliation}` : "Mathematics Club Member"}
            size="lg"
            variant="glass"
          />
        </div>
      ))}
    </div>
  );
}
