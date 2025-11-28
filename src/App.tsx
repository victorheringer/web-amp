import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Routes, Route } from "react-router-dom";
import { PlayerProvider } from "@/contexts/PlayerContext";
import Index from "./pages/Index";
import Playlist from "./pages/Playlist";
import Settings from "./pages/Settings";
import ImportPlaylist from "./pages/ImportPlaylist";
import Search from "./pages/Search";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";

const AppContent = () => {
  useKeyboardShortcuts();
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/playlist/:id" element={<Playlist />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="/import" element={<ImportPlaylist />} />
      <Route path="/search" element={<Search />} />
      {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <PlayerProvider>
        <Toaster />
        <Sonner />
        <HashRouter>
          <AppContent />
        </HashRouter>
      </PlayerProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
