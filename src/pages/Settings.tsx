import { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import Player from "@/components/Player";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { settingsService } from "@/services";
import { useToast } from "@/hooks/use-toast";
import { Save, Trash2, LayoutGrid, List, Search } from "lucide-react";
import VideoModal from "@/components/VideoModal";

const Settings = () => {
  const [token, setToken] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchProvider, setSearchProvider] = useState<"youtube">("youtube");
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const settings = settingsService.get();
    if (settings.token) {
      setToken(settings.token);
    }
    if (settings.viewMode) {
      setViewMode(settings.viewMode);
    }
    if (settings.searchProvider) {
      setSearchProvider(settings.searchProvider);
    }
  }, []);

  const handleSaveToken = () => {
    if (token.trim()) {
      settingsService.setToken(token.trim());
      toast({
        title: "Token salvo",
        description: "Suas configurações foram salvas com sucesso.",
      });
    } else {
      toast({
        title: "Erro",
        description: "O token não pode estar vazio.",
        variant: "destructive",
      });
    }
  };

  const handleRemoveToken = () => {
    settingsService.removeToken();
    setToken("");
    toast({
      title: "Token removido",
      description: "O token foi removido das configurações.",
    });
  };

  const handleViewModeChange = (value: "grid" | "list") => {
    setViewMode(value);
    settingsService.setViewMode(value);
    toast({
      title: "Modo de visualização salvo",
      description: `O modo de visualização foi alterado para ${
        value === "grid" ? "Grade" : "Lista"
      }.`,
    });
  };

  const handleSearchProviderChange = (value: "youtube") => {
    setSearchProvider(value);
    settingsService.setSearchProvider(value);
    toast({
      title: "Provedor de busca salvo",
      description: `O provedor de busca foi alterado para ${
        value === "youtube" ? "YouTube" : value
      }.`,
    });
  };

  return (
    <div className="flex h-screen bg-background text-foreground">
      <Sidebar />

      <main className="flex-1 overflow-y-auto pb-32">
        <div className="p-8">
          <div className="max-w-2xl mx-auto">
            <div className="mb-8">
              <h1 className="text-4xl font-bold mb-2 bg-gradient-primary bg-clip-text text-transparent">
                Configurações
              </h1>
              <p className="text-muted-foreground">
                Gerencie as configurações da sua aplicação
              </p>
            </div>

            <div className="space-y-6">
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle>Visualização</CardTitle>
                  <CardDescription>
                    Escolha como você prefere visualizar suas playlists
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <RadioGroup
                    defaultValue="grid"
                    value={viewMode}
                    onValueChange={(value) =>
                      handleViewModeChange(value as "grid" | "list")
                    }
                    className="grid grid-cols-2 gap-4"
                  >
                    <div>
                      <RadioGroupItem
                        value="grid"
                        id="grid"
                        className="peer sr-only"
                      />
                      <Label
                        htmlFor="grid"
                        className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                      >
                        <LayoutGrid className="mb-3 h-6 w-6" />
                        Grid
                      </Label>
                    </div>
                    <div>
                      <RadioGroupItem
                        value="list"
                        id="list"
                        className="peer sr-only"
                      />
                      <Label
                        htmlFor="list"
                        className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                      >
                        <List className="mb-3 h-6 w-6" />
                        Lista
                      </Label>
                    </div>
                  </RadioGroup>
                </CardContent>
              </Card>

              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle>Provedor de Busca</CardTitle>
                  <CardDescription>
                    Escolha onde as recomendações serão abertas
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-4">
                    <Search className="h-5 w-5 text-muted-foreground" />
                    <Select
                      value={searchProvider}
                      onValueChange={(value: "youtube") =>
                        handleSearchProviderChange(value)
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecione um provedor" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="youtube">YouTube</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle>Token de Autenticação (OpenRouter)</CardTitle>
                  <CardDescription>
                    Configure seu token do OpenRouter para receber recomendações
                    de artistas baseadas nas suas playlists.
                    <br />
                    <a
                      href="https://openrouter.ai/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline inline-flex items-center mt-1"
                    >
                      Obter token no OpenRouter.ai
                    </a>
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="token">Token OpenRouter</Label>
                    <Input
                      id="token"
                      type="password"
                      placeholder="sk-or-..."
                      value={token}
                      onChange={(e) => setToken(e.target.value)}
                      className="bg-input border-border"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={handleSaveToken}
                      className="bg-primary hover:bg-primary-glow"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      Salvar Token
                    </Button>
                    {token && (
                      <Button onClick={handleRemoveToken} variant="destructive">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Remover Token
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
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

export default Settings;
