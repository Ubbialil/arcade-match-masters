import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Players from "./pages/Players";
import PlayerProfile from "./pages/PlayerProfile";
import Matches from "./pages/Matches";
import CreateMatch from "./pages/CreateMatch";
import NotFound from "./pages/NotFound";
import Navbar from "./components/Navbar";
import { AppProvider } from "./context/AppContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <TooltipProvider>
        <AppProvider>
          <Toaster />
          <Sonner />
          <div className="min-h-screen bg-arcade-darker flex flex-col">
            <Navbar />
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/players" element={<Players />} />
                <Route path="/players/:id" element={<PlayerProfile />} />
                <Route path="/matches" element={<Matches />} />
                <Route path="/create-match" element={<CreateMatch />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
          </div>
        </AppProvider>
      </TooltipProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
