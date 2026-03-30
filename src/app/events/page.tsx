import { MorphingCardStack } from "@/components/ui/morphing-card-stack";
import { AnimatedTabs, type Tab } from "@/components/ui/animated-tabs";
import { getEvents, EventData } from "@/lib/data";

export const dynamic = "force-dynamic";
import { 
  Infinity as InfinityIcon, Divide, FunctionSquare, Variable, 
  Hexagon, Activity, Network, Cpu, Calendar, MapPin, 
  ChevronRight, Camera, FileSignature, Link2, Download
} from "lucide-react";

const getIcon = (name: string) => {
  const props = { className: "h-6 w-6" };
  switch (name) {
    case 'FunctionSquare': return <FunctionSquare {...props} />;
    case 'Divide': return <Divide {...props} />;
    case 'Variable': return <Variable {...props} />;
    case 'Hexagon': return <Hexagon {...props} />;
    case 'Activity': return <Activity {...props} />;
    case 'Network': return <Network {...props} />;
    case 'Cpu': return <Cpu {...props} />;
    default: return <InfinityIcon {...props} />;
  }
};

export default async function EventsPage() {
  const allEvents = await getEvents();
  const eventPageEvents = allEvents.filter(e => e.showOnEventPage !== false); // Handle older missing flags too

  // Prepare featured tabs (using up to 4 upcoming/ongoing events)
  const featured = eventPageEvents
    .filter(e => e.status !== "ended")
    .slice(0, 4);

  const featureTabs: Tab[] = featured.map((event) => ({
    id: event.id,
    label: event.title,
    content: (
      <div 
        className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8 w-full h-full p-4 sm:p-6 md:p-8 relative backdrop-blur-sm"
        style={{ border: '1px solid var(--border)', backgroundColor: 'var(--card-bg)' }}
      >
        <div className="w-full h-64 md:h-full relative overflow-hidden" style={{ border: '1px solid var(--border)' }}>
          {event.image ? (
            <img src={event.image} alt={event.title} className="w-full h-full object-cover grayscale opacity-80 hover:grayscale-0 hover:opacity-100 transition-all duration-700" />
          ) : (
             <div className="w-full h-full flex items-center justify-center bg-black/50">
               <span className="font-mono text-xs text-white/30 tracking-[0.2em]">[ NO IMAGE FOUND ]</span>
             </div>
          )}
          <div className="absolute top-4 left-4 p-2 bg-black/60 backdrop-blur-md border border-white/20 text-[var(--accent)]">
            {getIcon(event.icon)}
          </div>
          
          {event.status === "ongoing" && (
             <div className="absolute top-4 right-4 px-3 py-1 bg-green-500/20 text-green-400 border border-green-500/50 backdrop-blur-md text-xs font-bold tracking-widest uppercase flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" /> LIVE
             </div>
          )}
        </div>

        <div className="flex flex-col gap-y-4 justify-center">
          <h2 className="text-xl sm:text-3xl font-bold font-mono tracking-widest uppercase border-b border-dotted pb-3 sm:pb-4" style={{ color: 'var(--text-primary)', borderColor: 'var(--border)' }}>
            {event.title}
          </h2>
          
          <p className="font-mono text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            {event.description}
          </p>

          {event.images && event.images.length > 0 && (
            <div className="flex gap-2 mt-2 overflow-x-auto pb-2 custom-scroll">
              {event.images.map((img, i) => (
                <img key={i} src={img} alt={`Gallery ${i}`} className="h-16 w-16 sm:h-20 sm:w-20 object-cover border opacity-80 hover:opacity-100 transition-opacity flex-shrink-0" style={{ borderColor: 'var(--border)' }} />
              ))}
            </div>
          )}

          <div className="flex flex-col gap-2 mt-4 font-mono text-xs tracking-wider" style={{ color: 'var(--text-muted)' }}>
            {event.date && (
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>DATE: {event.date}</span>
              </div>
            )}
            {event.venue && (
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>VENUE: {event.venue}</span>
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-2 sm:gap-4 mt-4 sm:mt-8">
            {event.links.map((link, i) => (
               <a key={i} href={link.url} target="_blank" rel="noreferrer"
                className="flex items-center gap-2 px-4 py-2 font-mono text-xs tracking-widest uppercase transition-colors hover:bg-white/10"
                style={{ background: i === 0 ? 'var(--accent)' : 'transparent', color: i === 0 ? 'var(--bg-primary)' : 'var(--text-primary)', border: `1px solid ${i === 0 ? 'var(--accent)' : 'var(--border)'}` }}>
                {i === 0 ? <Link2 className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />} {link.label}
              </a>
            ))}
            {event.downloads.map((dl, i) => (
                <a key={`dl-${i}`} href={dl.url} download target="_blank" rel="noreferrer"
                  className="flex items-center gap-2 px-4 py-2 font-mono text-xs tracking-widest uppercase hover:bg-white/10 transition-colors"
                  style={{ color: 'var(--text-primary)', border: '1px solid var(--border)' }}>
                  <Download className="w-4 h-4" /> {dl.name}
                </a>
            ))}
          </div>
        </div>
      </div>
    ),
  }));

  // Group events by status
  const ongoing = eventPageEvents.filter(e => e.status === "ongoing");
  const upcoming = eventPageEvents.filter(e => e.status === "upcoming" || !e.status); // Default unstructured to upcoming
  const ended = eventPageEvents.filter(e => e.status === "ended");

  const SectionLine = ({ label }: { label: string }) => (
    <div className="w-full flex items-center justify-center py-8 sm:py-16">
       <div className="w-full h-px border-t border-dotted flex-1" style={{ borderColor: 'var(--border)' }} />
       <div className="px-6 text-sm font-bold tracking-[0.3em] uppercase" style={{ color: 'var(--text-secondary)' }}>{label}</div>
       <div className="w-full h-px border-t border-dotted flex-1" style={{ borderColor: 'var(--border)' }} />
    </div>
  );

  return (
    <main className="relative min-h-screen font-mono antialiased overflow-x-hidden transition-colors duration-400">
      <div className="relative z-10 flex flex-col min-h-screen items-center justify-start pt-24 sm:pt-32 pb-12 sm:pb-16 px-4">
        
        {/* Header Section */}
        <div className="w-full max-w-6xl mx-auto flex flex-col items-center mb-8 sm:mb-16">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold tracking-widest drop-shadow-lg mb-3 sm:mb-4 uppercase text-center" style={{ color: 'var(--accent)' }}>
            <span className="opacity-50">&gt;_ </span>EVENTS
          </h1>
          <p className="text-center max-w-2xl text-xs sm:text-sm font-mono tracking-widest uppercase mb-6 sm:mb-12 px-2" style={{ color: 'var(--text-muted)' }}>
            [System Log] Directory of all mathematical challenges, symposiums, and research workshops.
          </p>
          
          {/* Animated Tabs Integration */}
          {featureTabs.length > 0 && (
             <AnimatedTabs tabs={featureTabs} className="max-w-5xl" />
          )}
        </div>

        <div className="w-full max-w-5xl mx-auto flex flex-col items-center">
            {ongoing.length > 0 && (
               <>
                 <SectionLine label="ONGOING EVENTS" />
                 <MorphingCardStack cards={ongoing.map(e => ({...e, icon: getIcon(e.icon)}))} defaultLayout="grid" />
               </>
            )}

            {upcoming.length > 0 && (
               <>
                 <SectionLine label="UPCOMING EVENTS" />
                 <MorphingCardStack cards={upcoming.map(e => ({...e, icon: getIcon(e.icon)}))} defaultLayout="grid" />
               </>
            )}

            {ended.length > 0 && (
               <>
                 <SectionLine label="ARCHIVE (ENDED)" />
                 <MorphingCardStack cards={ended.map(e => ({...e, icon: getIcon(e.icon)}))} defaultLayout="grid" />
               </>
            )}
            
            {eventPageEvents.length === 0 && (
               <div className="p-12 text-center border border-dashed mt-12" style={{ borderColor: "var(--border)" }}>
                  <p className="text-sm tracking-widest uppercase opacity-50" style={{ color: "var(--text-secondary)" }}>No events populated yet.</p>
               </div>
            )}
        </div>

      </div>
    </main>
  );
}
