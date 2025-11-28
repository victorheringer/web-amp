import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Sparkles } from "lucide-react";

interface VibeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (vibe: string) => Promise<void>;
}

const VibeModal = ({ isOpen, onClose, onSubmit }: VibeModalProps) => {
  const [vibe, setVibe] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!vibe.trim()) return;

    setIsSubmitting(true);
    try {
      await onSubmit(vibe);
      setVibe("");
      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] bg-card border-border">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Sparkles className="h-6 w-6 text-primary" />
            Minha Vibe
          </DialogTitle>
          <DialogDescription>
            Conte como você está se sentindo ou o que gostaria de ouvir agora. A
            IA vai criar uma playlist personalizada baseada nas suas músicas.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <Textarea
            placeholder="Ex: Estou me sentindo nostálgico e quero ouvir rock dos anos 2000..."
            value={vibe}
            onChange={(e) => setVibe(e.target.value)}
            className="min-h-[120px] bg-input border-border resize-none"
          />
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={onClose} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!vibe.trim() || isSubmitting}
            className="bg-primary hover:bg-primary-glow"
          >
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Criar Vibe
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default VibeModal;
