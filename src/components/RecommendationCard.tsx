import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Song } from "@/services";
import { settingsService } from "@/services";

interface RecommendationCardProps {
  song: Song;
}

const RecommendationCard = ({ song }: RecommendationCardProps) => {
  const handleOpenSearch = () => {
    const provider = settingsService.getSearchProvider();
    const query = encodeURIComponent(`${song.title} ${song.artist}`);

    let url = "";
    if (provider === "youtube") {
      url = `https://www.youtube.com/results?search_query=${query}`;
    }

    if (url) {
      window.open(url, "_blank");
    }
  };

  return (
    <Card className="group relative overflow-hidden border-border bg-card hover:bg-card/80 transition-all duration-300">
      <div className="p-4 flex flex-col h-full">
        <div className="flex-1">
          <h3 className="font-semibold text-lg line-clamp-1 group-hover:text-primary transition-colors">
            {song.title}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-1 mb-2">
            {song.artist}
          </p>

          {song.recommendationReason && (
            <div className="bg-primary/10 p-2 rounded-md mb-4">
              <p className="text-xs text-primary italic line-clamp-2">
                "{song.recommendationReason}"
              </p>
            </div>
          )}
        </div>

        <Button
          onClick={handleOpenSearch}
          className="w-full mt-auto gap-2 bg-secondary hover:bg-secondary/80 text-secondary-foreground"
        >
          <Search className="h-4 w-4" />
          Buscar música
        </Button>
      </div>
    </Card>
  );
};

export default RecommendationCard;
