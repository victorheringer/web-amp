import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { playlistService } from "@/services";
import { FileJson, Upload } from "lucide-react";

const ImportPlaylist = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [jsonInput, setJsonInput] = useState("");
  const [error, setError] = useState("");

  const handleImport = () => {
    setError("");

    if (!jsonInput.trim()) {
      setError("Por favor, cole o JSON da playlist.");
      return;
    }

    try {
      const data = JSON.parse(jsonInput);
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
        description: "O texto colado não é um JSON válido.",
        variant: "destructive",
      });
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
              Cole o código JSON de uma playlist para importá-la para sua
              biblioteca.
            </p>
          </div>

          <div className="space-y-6">
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
                <div className="absolute top-3 right-3 text-muted-foreground opacity-20 pointer-events-none">
                  <FileJson className="h-8 w-8" />
                </div>
              </div>
              {error && (
                <p className="text-sm text-destructive font-medium">{error}</p>
              )}
            </div>

            <div className="flex gap-4">
              <Button
                onClick={handleImport}
                className="flex-1 bg-primary hover:bg-primary-glow"
                disabled={!jsonInput.trim()}
              >
                <Upload className="h-4 w-4 mr-2" />
                Importar Playlist
              </Button>
              <Button variant="outline" onClick={() => navigate("/")}>
                Cancelar
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ImportPlaylist;
