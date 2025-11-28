import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { playlistService } from "@/services";
import { FileJson, Upload, LinkIcon, Loader2 } from "lucide-react";
import Player from "@/components/Player";
import VideoModal from "@/components/VideoModal";

const ImportPlaylist = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("json");
  const [jsonInput, setJsonInput] = useState("");
  const [urlInput, setUrlInput] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const data = JSON.parse(content);

        // Check if it's a single playlist or array
        if (Array.isArray(data)) {
          const count = playlistService.importPlaylists(data);
          if (count > 0) {
            toast({
              title: "Importação concluída",
              description: `${count} playlists foram importadas com sucesso.`,
            });
            navigate("/");
          } else {
            toast({
              title: "Erro na importação",
              description: "Nenhuma playlist válida encontrada no arquivo.",
              variant: "destructive",
            });
          }
        } else {
          // Try single playlist import
          const newPlaylist = playlistService.importPlaylist(data);
          if (newPlaylist) {
            toast({
              title: "Playlist importada!",
              description: `A playlist "${newPlaylist.name}" foi criada com sucesso.`,
            });
            navigate(`/playlist/${newPlaylist.id}`);
          } else {
            toast({
              title: "Erro na importação",
              description: "Formato de arquivo inválido.",
              variant: "destructive",
            });
          }
        }
      } catch (error) {
        console.error("Error parsing file:", error);
        toast({
          title: "Erro na importação",
          description: "O arquivo não é um JSON válido.",
          variant: "destructive",
        });
      }
    };
    reader.readAsText(file);
  };

  const handleImport = async () => {
    setError("");
    setIsLoading(true);

    try {
      let data;

      if (activeTab === "json") {
        if (!jsonInput.trim()) {
          setError("Por favor, cole o JSON da playlist.");
          setIsLoading(false);
          return;
        }
        data = JSON.parse(jsonInput);
      } else {
        if (!urlInput.trim()) {
          setError("Por favor, insira a URL do JSON.");
          setIsLoading(false);
          return;
        }

        try {
          const response = await fetch(urlInput);
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          data = await response.json();
        } catch (fetchError) {
          console.error("Erro ao buscar URL:", fetchError);
          setError(
            "Erro ao baixar o JSON da URL. Verifique o link e tente novamente."
          );
          toast({
            title: "Erro na importação",
            description: "Não foi possível carregar o JSON da URL fornecida.",
            variant: "destructive",
          });
          setIsLoading(false);
          return;
        }
      }

      const newPlaylist = playlistService.importPlaylist(data);

      if (newPlaylist) {
        toast({
          title: "Playlist importada!",
          description: `A playlist "${newPlaylist.name}" foi criada com sucesso.`,
        });
        navigate(`/playlist/${newPlaylist.id}`);
      } else {
        setError(
          "O formato do JSON é inválido ou está faltando informações obrigatórias."
        );
        toast({
          title: "Erro na importação",
          description: "Verifique se o JSON está correto.",
          variant: "destructive",
        });
      }
    } catch (e) {
      console.error("Erro ao importar:", e);
      setError("JSON inválido. Verifique a sintaxe.");
      toast({
        title: "Erro na importação",
        description: "O conteúdo não é um JSON válido.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-background text-foreground">
      <Sidebar />

      <main className="flex-1 overflow-y-auto pb-32 p-8">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2 bg-gradient-primary bg-clip-text text-transparent">
              Importar Playlist
            </h1>
            <p className="text-muted-foreground">
              Importe uma playlist colando o código JSON ou fornecendo uma URL.
            </p>
          </div>

          <Tabs
            defaultValue="json"
            value={activeTab}
            onValueChange={setActiveTab}
            className="space-y-6"
          >
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="json">
                <FileJson className="h-4 w-4 mr-2" />
                Colar JSON
              </TabsTrigger>
              <TabsTrigger value="url">
                <LinkIcon className="h-4 w-4 mr-2" />
                Importar de URL
              </TabsTrigger>
              <TabsTrigger value="file">
                <Upload className="h-4 w-4 mr-2" />
                Upload de Arquivo
              </TabsTrigger>
            </TabsList>

            <TabsContent value="json" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="json-input">Código JSON da Playlist</Label>
                <div className="relative">
                  <Textarea
                    id="json-input"
                    placeholder='{ "name": "Minha Playlist", "songs": [...] }'
                    className="min-h-[300px] font-mono text-sm"
                    value={jsonInput}
                    onChange={(e) => setJsonInput(e.target.value)}
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="url" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="url-input">URL do JSON</Label>
                <Input
                  id="url-input"
                  placeholder="https://exemplo.com/playlist.json"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  A URL deve retornar um JSON válido com a estrutura da
                  playlist.
                </p>
              </div>
            </TabsContent>

            <TabsContent value="file" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="file-upload">Selecione o arquivo JSON</Label>
                <div className="flex items-center justify-center w-full">
                  <label
                    htmlFor="file-upload"
                    className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-muted/50 hover:bg-muted transition-colors border-muted-foreground/25 hover:border-primary/50"
                  >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="w-10 h-10 mb-3 text-muted-foreground" />
                      <p className="mb-2 text-sm text-muted-foreground">
                        <span className="font-semibold">
                          Clique para enviar
                        </span>{" "}
                        ou arraste e solte
                      </p>
                      <p className="text-xs text-muted-foreground">
                        JSON (MAX. 10MB)
                      </p>
                    </div>
                    <input
                      id="file-upload"
                      type="file"
                      accept=".json"
                      className="hidden"
                      onChange={handleFileUpload}
                    />
                  </label>
                </div>
              </div>
            </TabsContent>

            {activeTab !== "file" && (
              <Button
                onClick={handleImport}
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Importando...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Importar Playlist
                  </>
                )}
              </Button>
            )}
          </Tabs>
        </div>
      </main>

      <Player onExpand={() => setIsVideoModalOpen(true)} />

      <VideoModal
        isOpen={isVideoModalOpen}
        onClose={() => setIsVideoModalOpen(false)}
      />
    </div>
  );
};

export default ImportPlaylist;
