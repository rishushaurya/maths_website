"use client";

import { useRouter } from "next/navigation";
import { MorphingCardStack, type CardData } from "@/components/ui/morphing-card-stack";

interface HomeEventsClientProps {
  cards: CardData[];
}

export function HomeEventsClient({ cards }: HomeEventsClientProps) {
  const router = useRouter();

  const handleCardClick = (card: CardData) => {
    // Navigate to events page
    router.push("/events");
  };

  return <MorphingCardStack cards={cards} defaultLayout="grid" onCardClick={handleCardClick} />;
}
