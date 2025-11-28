import { useParams } from "react-router-dom";
import Sidebar from "@/components/Sidebar";
import Player from "@/components/Player";
import VideoCard from "@/components/VideoCard";
import { useState } from "react";
import VideoModal from "@/components/VideoModal";
import { Button } from "@/components/ui/button";
import { LayoutGrid, List, Play } from "lucide-react";

const Playlist = () => {
  const { id } = useParams();
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Mock data - em produção viria de um estado global ou API
  const playlists = [
    { id: 1, name: "Minhas Favoritas" },
    { id: 2, name: "Rock Clássico" },
    { id: 3, name: "Workout Mix" },
    { id: 4, name: "Chill Vibes" },
  ];

  const playlist = playlists.find((p) => p.id === Number(id));

  // Mock videos - em produção viria de um estado global ou API
  const videos = [
    {
      id: "1",
      title: "Bohemian Rhapsody",
      artist: "Queen",
      thumbnail: "https://img.youtube.com/vi/fJ9rUzIMcZQ/maxresdefault.jpg",
      videoId: "fJ9rUzIMcZQ",
      duration: "5:55",
    },
    {
      id: "2",
      title: "Stairway to Heaven",
      artist: "Led Zeppelin",
      thumbnail: "https://img.youtube.com/vi/QkF3oxziUI4/maxresdefault.jpg",
      videoId: "QkF3oxziUI4",
      duration: "8:02",
    },
    {
      id: "3",
      title: "Hotel California",
      artist: "Eagles",
      thumbnail: "https://img.youtube.com/vi/09839DpTctU/maxresdefault.jpg",
      videoId: "09839DpTctU",
      duration: "6:30",
    },
    {
      id: "4",
      title: "Sweet Child O' Mine",
      artist: "Guns N' Roses",
      thumbnail: "https://img.youtube.com/vi/1w7OgIMMRc4/maxresdefault.jpg",
      videoId: "1w7OgIMMRc4",
      duration: "5:56",
    },
  ];

  return (
    <div className="flex h-screen bg-background text-foreground">
      <Sidebar />

      <main className="flex-1 overflow-y-auto pb-24">
        <div className="p-8">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2 bg-gradient-primary bg-clip-text text-transparent">
                {playlist?.name || "Playlist não encontrada"}
              </h1>
              <p className="text-muted-foreground">
                {videos.length} {videos.length === 1 ? "música" : "músicas"}
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                size="icon"
                variant={viewMode === "grid" ? "default" : "ghost"}
                onClick={() => setViewMode("grid")}
              >
                <LayoutGrid className="h-5 w-5" />
              </Button>
              <Button
                size="icon"
                variant={viewMode === "list" ? "default" : "ghost"}
                onClick={() => setViewMode("list")}
              >
                <List className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {viewMode === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {videos.map((video) => (
                <VideoCard
                  key={video.id}
                  title={video.title}
                  artist={video.artist}
                  thumbnail={video.thumbnail}
                  duration={video.duration}
                  onPlay={() => setSelectedVideo(video.videoId)}
                />
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {videos.map((video) => (
                <div
                  key={video.id}
                  className="flex items-center gap-4 p-3 rounded-lg bg-card hover:bg-card/80 transition-colors group cursor-pointer"
                  onClick={() => setSelectedVideo(video.videoId)}
                >
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-10 w-10 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedVideo(video.videoId);
                    }}
                  >
                    <Play className="h-5 w-5 fill-current" />
                  </Button>

                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-16 h-16 object-cover rounded"
                  />

                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm truncate">
                      {video.title}
                    </h3>
                    <p className="text-xs text-muted-foreground truncate">
                      {video.artist}
                    </p>
                  </div>

                  <div className="text-sm text-muted-foreground">
                    {video.duration}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Player onExpand={() => setSelectedVideo(videos[0]?.videoId || null)} />

      <VideoModal
        isOpen={!!selectedVideo}
        onClose={() => setSelectedVideo(null)}
      />
    </div>
  );
};

export default Playlist;
