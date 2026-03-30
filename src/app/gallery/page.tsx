import { ImageAutoSlider, type MediaItem } from "@/components/ui/image-auto-slider";
import { getGallerySections, type GallerySection } from "@/lib/data";

export const dynamic = "force-dynamic";

// Fallback data if no admin-managed content exists
const fallbackSections = [
  {
    name: "Topology Hackathon 2025",
    items: [
      { id: 'hk-1', type: 'image' as const, src: 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?q=80&w=600&auto=format&fit=crop' },
      { id: 'hk-2', type: 'image' as const, src: 'https://images.unsplash.com/photo-1472396961693-142e6e269027?q=80&w=600&auto=format&fit=crop' },
      { id: 'hk-vid-1', type: 'video' as const, src: 'https://videos.pexels.com/video-files/30333849/13003128_2560_1440_25fps.mp4' },
      { id: 'hk-3', type: 'image' as const, src: 'https://images.unsplash.com/photo-1505142468610-359e7d316be0?q=80&w=600&auto=format&fit=crop' },
    ],
  },
  {
    name: "Calculus Symposium",
    items: [
      { id: 'sym-1', type: 'image' as const, src: 'https://plus.unsplash.com/premium_photo-1673264933212-d78737f38e48?q=80&w=600&auto=format&fit=crop' },
      { id: 'sym-2', type: 'image' as const, src: 'https://plus.unsplash.com/premium_photo-1711434824963-ca894373272e?q=80&w=600&auto=format&fit=crop' },
      { id: 'sym-vid-1', type: 'video' as const, src: 'https://videos.pexels.com/video-files/30333849/13003128_2560_1440_25fps.mp4' },
    ],
  },
  {
    name: "Non-Linear Dynamics Lecture",
    items: [
      { id: 'lc-1', type: 'image' as const, src: 'https://images.unsplash.com/photo-1524799526615-766a9833dec0?q=80&w=600&auto=format&fit=crop' },
      { id: 'lc-2', type: 'video' as const, src: 'https://videos.pexels.com/video-files/30333849/13003128_2560_1440_25fps.mp4' },
      { id: 'lc-3', type: 'image' as const, src: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?q=80&w=600&auto=format&fit=crop' },
    ],
  },
];

function sectionToMediaItems(section: GallerySection): MediaItem[] {
  return section.items.map((item) => ({
    id: item.id,
    type: item.type,
    src: item.url,
  }));
}

export default async function GalleryPage() {
  const dbSections = (await getGallerySections()).filter((s) => s.showOnGalleryPage !== false);
  const hasDBData = dbSections.length > 0;

  return (
    <main className="relative min-h-screen font-mono antialiased overflow-x-hidden uppercase tracking-wider transition-colors duration-400">
      <div className="relative z-10 flex flex-col min-h-screen items-center justify-center pt-24 sm:pt-32 pb-12 sm:pb-16 px-4">
        <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold tracking-widest drop-shadow-lg mb-8 sm:mb-16" style={{ color: 'var(--accent)' }}>GALLERY</h1>
        <div className="w-full relative z-20 space-y-8 sm:space-y-16">
          {hasDBData ? (
            dbSections.map((section) => (
              <ImageAutoSlider key={section.id} eventName={section.name} items={sectionToMediaItems(section)} />
            ))
          ) : (
            fallbackSections.map((section, i) => (
              <ImageAutoSlider key={i} eventName={section.name} items={section.items} />
            ))
          )}
        </div>
      </div>
    </main>
  );
}
