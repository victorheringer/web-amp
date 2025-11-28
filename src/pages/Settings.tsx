import { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import Player from "@/components/Player";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { settingsService } from "@/services";
import { useToast } from "@/hooks/use-toast";
import { Save, Trash2 } from "lucide-react";
import VideoModal from "@/components/VideoModal";

const Settings = () => {
  const [token, setToken] = useState("");
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const settings = settingsService.get();
    if (settings.token) {
      setToken(settings.token);
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

  return (
    <div className="flex h-screen bg-background text-foreground">
      <Sidebar />

      <main className="flex-1 overflow-y-auto pb-24">
        <div className="p-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2 bg-gradient-primary bg-clip-text text-transparent">
              Configurações
            </h1>
            <p className="text-muted-foreground">
              Gerencie as configurações da sua aplicação
            </p>
          </div>

          <div className="max-w-2xl">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle>Token de Autenticação</CardTitle>
                <CardDescription>
                  Configure seu token para acessar recursos externos
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="token">Token</Label>
                  <Input
                    id="token"
                    type="password"
                    placeholder="Digite seu token"
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
                    <Button
                      onClick={handleRemoveToken}
                      variant="destructive"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Remover Token
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
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
