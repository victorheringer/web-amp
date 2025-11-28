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
import { FileJson, Upload, Link as LinkIcon, Loader2 } from "lucide-react";

const ImportPlaylist = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("json");
  const [jsonInput, setJsonInput] = useState("");
  const [urlInput, setUrlInput] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

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

      <main className="flex-1 overflow-y-auto p-8">
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
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="json">
                <FileJson className="h-4 w-4 mr-2" />
                Colar JSON
              </TabsTrigger>
              <TabsTrigger value="url">
                <LinkIcon className="h-4 w-4 mr-2" />
                Importar de URL
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
                <Label htmlFor="url-input">URL do Arquivo JSON</Label>
                <div className="relative">
                  <Input
                    id="url-input"
                    placeholder="https://exemplo.com/playlist.json"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                  />
                </div>
                <p className="text-sm text-muted-foreground">
                  O link deve apontar diretamente para um arquivo JSON raw.
                </p>
              </div>
            </TabsContent>

            {error && (
              <p className="text-sm text-destructive font-medium">{error}</p>
            )}

            <Button
              onClick={handleImport}
              className="w-full bg-primary hover:bg-primary-glow"
              disabled={
                isLoading ||
                (activeTab === "json" ? !jsonInput.trim() : !urlInput.trim())
              }
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Importando...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  Importar Playlist
                </>
              )}
            </Button>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default ImportPlaylist;
