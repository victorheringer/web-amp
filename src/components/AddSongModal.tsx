import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { VideoProvider } from "@/services";
import { Loader2, Download } from "lucide-react";
import {
  extractYouTubeVideoId,
  getYouTubeEmbedUrl,
  getYouTubeThumbnail,
} from "@/lib/videoUtils";
import { useToast } from "@/hooks/use-toast";

// Declaração global para o YouTube IFrame API
declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

const formSchema = z.object({
  title: z.string().min(1, "O título é obrigatório"),
  artist: z.string().min(1, "O artista é obrigatório"),
  url: z.string().min(1, "A URL é obrigatória"),
  originalUrl: z.string().optional(),
  provider: z.enum(["youtube"], {
    required_error: "Selecione um provedor",
  }),
  thumbnail: z.string().optional().or(z.literal("")),
  duration: z.string().optional().or(z.literal("")),
});

type FormValues = z.infer<typeof formSchema>;

interface AddSongModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddSong: (song: FormValues) => void;
}

const AddSongModal = ({ isOpen, onClose, onAddSong }: AddSongModalProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isExtracting, setIsExtracting] = useState(false);
  const [hasExtracted, setHasExtracted] = useState(false);
  const playerRef = useRef<any>(null);
  const playerContainerRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      artist: "",
      url: "",
      originalUrl: "",
      provider: "youtube",
      thumbnail: "",
      duration: "",
    },
  });

  // Cleanup player on unmount
  useEffect(() => {
    return () => {
      if (playerRef.current) {
        playerRef.current.destroy();
        playerRef.current = null;
      }
    };
  }, []);

  const extractVideoMetadata = async () => {
    const url = form.getValues("url");
    const provider = form.getValues("provider");

    if (!url) {
      toast({
        title: "URL necessária",
        description: "Por favor, insira uma URL antes de extrair informações.",
        variant: "destructive",
      });
      return;
    }

    if (provider !== "youtube") {
      toast({
        title: "Provedor não suportado",
        description:
          "Extração automática disponível apenas para YouTube no momento.",
        variant: "destructive",
      });
      return;
    }

    setIsExtracting(true);

    try {
      const videoId = extractYouTubeVideoId(url);

      if (!videoId) {
        toast({
          title: "URL inválida",
          description:
            "Não foi possível extrair o ID do vídeo da URL fornecida.",
          variant: "destructive",
        });
        setIsExtracting(false);
        return;
      }

      // Aguardar API do YouTube estar pronta
      if (!window.YT || !window.YT.Player) {
        toast({
          title: "Carregando...",
          description: "Aguardando API do YouTube...",
        });

        await new Promise((resolve) => {
          const checkYT = setInterval(() => {
            if (window.YT && window.YT.Player) {
              clearInterval(checkYT);
              resolve(true);
            }
          }, 100);
        });
      }

      // Criar player temporário oculto para extrair dados
      const tempContainer = document.createElement("div");
      tempContainer.style.display = "none";
      document.body.appendChild(tempContainer);

      const player = new window.YT.Player(tempContainer, {
        height: "0",
        width: "0",
        videoId: videoId,
        events: {
          onReady: (event: any) => {
            try {
              const videoData = event.target.getVideoData();
              const duration = event.target.getDuration();

              // Formatar duração (segundos para MM:SS)
              const minutes = Math.floor(duration / 60);
              const seconds = Math.floor(duration % 60);
              const formattedDuration = `${minutes}:${seconds
                .toString()
                .padStart(2, "0")}`;

              // Preencher campos automaticamente
              form.setValue("title", videoData.title || "");
              form.setValue("artist", videoData.author || "");
              form.setValue("originalUrl", url);
              form.setValue("url", getYouTubeEmbedUrl(videoId));
              form.setValue("thumbnail", getYouTubeThumbnail(videoId));
              form.setValue("duration", formattedDuration);

              setHasExtracted(true);

              toast({
                title: "Informações extraídas!",
                description: `"${videoData.title}" carregado com sucesso.`,
              });

              // Limpar player temporário
              event.target.destroy();
              document.body.removeChild(tempContainer);
              setIsExtracting(false);
            } catch (error) {
              console.error("Erro ao extrair dados:", error);
              toast({
                title: "Erro",
                description:
                  "Não foi possível extrair as informações do vídeo.",
                variant: "destructive",
              });
              event.target.destroy();
              document.body.removeChild(tempContainer);
              setIsExtracting(false);
            }
          },
          onError: (event: any) => {
            console.error("Erro no player:", event);
            toast({
              title: "Erro",
              description:
                "Não foi possível carregar o vídeo. Verifique a URL.",
              variant: "destructive",
            });
            event.target.destroy();
            document.body.removeChild(tempContainer);
            setIsExtracting(false);
          },
        },
      });
    } catch (error) {
      console.error("Erro ao extrair metadados:", error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao extrair as informações.",
        variant: "destructive",
      });
      setIsExtracting(false);
    }
  };

  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    try {
      onAddSong(values);
      form.reset();
      setHasExtracted(false);
      onClose();
    } catch (error) {
      console.error("Erro ao adicionar música:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-2xl bg-gradient-primary bg-clip-text text-transparent">
            Adicionar Música
          </DialogTitle>
          <DialogDescription>
            Preencha as informações da música que deseja adicionar à playlist
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="provider"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Provedor *</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="bg-input border-border">
                        <SelectValue placeholder="Selecione o provedor" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="youtube">YouTube</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL do Vídeo *</FormLabel>
                  <div className="flex gap-2">
                    <FormControl>
                      <Input
                        placeholder="https://www.youtube.com/watch?v=..."
                        {...field}
                        className="bg-input border-border flex-1"
                      />
                    </FormControl>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={extractVideoMetadata}
                      disabled={isExtracting || !field.value}
                      className="shrink-0"
                    >
                      {isExtracting ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Download className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  <FormMessage />
                  <p className="text-xs text-muted-foreground">
                    Cole a URL e clique no botão para extrair informações
                    automaticamente
                  </p>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Título *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={
                        hasExtracted
                          ? "Título do vídeo"
                          : "Extraído automaticamente..."
                      }
                      {...field}
                      className="bg-input border-border"
                      disabled={!hasExtracted}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="artist"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Artista/Canal *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={
                        hasExtracted
                          ? "Nome do canal"
                          : "Extraído automaticamente..."
                      }
                      {...field}
                      className="bg-input border-border"
                      disabled={!hasExtracted}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="duration"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Duração</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={
                        hasExtracted ? "MM:SS" : "Extraída automaticamente..."
                      }
                      {...field}
                      className="bg-input border-border"
                      disabled
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="thumbnail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Thumbnail</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={
                        hasExtracted
                          ? "URL da imagem"
                          : "Extraída automaticamente..."
                      }
                      {...field}
                      className="bg-input border-border"
                      disabled
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-2 pt-4">
              <Button
                type="button"
                variant="ghost"
                onClick={onClose}
                className="flex-1"
                disabled={isSubmitting}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-primary hover:bg-primary-glow"
                disabled={isSubmitting}
              >
                {isSubmitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Adicionar
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddSongModal;
