import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import VideoCard from "@/components/VideoCard";
import Player from "@/components/Player";
import VideoModal from "@/components/VideoModal";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { Song } from "@/services/types";

const Index = () => {
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  // Mock videos converted to Song format
  const videos: Song[] = [
    {
      id: "1",
      title: "Amazing Rock Performance Live",
      artist: "Rock Band",
      url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      provider: "youtube",
      thumbnail:
        "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=225&fit=crop",
      duration: "4:12",
      addedAt: Date.now(),
    },
    {
      id: "2",
      title: "Acoustic Session in Studio",
      artist: "Indie Artist",
      url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      provider: "youtube",
      thumbnail:
        "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&h=225&fit=crop",
      duration: "3:45",
      addedAt: Date.now(),
    },
    {
      id: "3",
      title: "Electronic Dance Mix 2024",
      artist: "DJ Master",
      url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      provider: "youtube",
      thumbnail:
        "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&h=225&fit=crop",
      duration: "5:30",
      addedAt: Date.now(),
    },
    {
      id: "4",
      title: "Jazz Evening Performance",
      artist: "Jazz Quartet",
      url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      provider: "youtube",
      thumbnail:
        "https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?w=400&h=225&fit=crop",
      duration: "6:15",
      addedAt: Date.now(),
    },
    {
      id: "5",
      title: "Pop Hits Medley",
      artist: "Various Artists",
      url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      provider: "youtube",
      thumbnail:
        "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=400&h=225&fit=crop",
      duration: "3:20",
      addedAt: Date.now(),
    },
    {
      id: "6",
      title: "Classical Piano Concert",
      artist: "Piano Virtuoso",
      url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      provider: "youtube",
      thumbnail:
        "https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?w=400&h=225&fit=crop",
      duration: "8:45",
      addedAt: Date.now(),
    },
  ];

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden">
      <Sidebar />

      <main className="flex-1 flex flex-col">
        <ScrollArea className="flex-1 pb-32">
          <div className="p-6">
            <div className="mb-8">
              <h2 className="text-3xl font-bold mb-2">Bem-vindo de volta</h2>
              <p className="text-muted-foreground">
                Continue ouvindo suas músicas favoritas
              </p>
            </div>

            <section className="mb-8">
              <h3 className="text-xl font-semibold mb-4">
                Recomendados para você
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {videos.map((video) => (
                  <VideoCard key={video.id} song={video} playlist={videos} />
                ))}
              </div>
            </section>

            <section>
              <h3 className="text-xl font-semibold mb-4">
                Adicionados recentemente
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {videos.slice(0, 4).map((video) => (
                  <VideoCard key={video.id} song={video} />
                ))}
              </div>
            </section>
          </div>
        </ScrollArea>

        <Player onExpand={() => setIsVideoModalOpen(true)} />
      </main>

      <VideoModal
        isOpen={isVideoModalOpen}
        onClose={() => setIsVideoModalOpen(false)}
      />
    </div>
  );
};

export default Index;
