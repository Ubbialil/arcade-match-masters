import { Match } from '@/services/api';
import { Calendar, Clock, Trophy, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

type MatchItemProps = {
  match: Match;
  showActions?: boolean;
  onClick?: () => void;
  compact?: boolean;
  onDelete?: (matchId: string) => void;
};

const MatchItem = ({ match, showActions = false, onClick, compact = false, onDelete }: MatchItemProps) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const matchDate = new Date(match.playedAt);
  const isToday = new Date().toDateString() === matchDate.toDateString();
  const isPast = matchDate < new Date();
  
  const winner = match.player1Score > match.player2Score ? match.player1 : match.player2;

  const handleDelete = async () => {
    if (onDelete) {
      try {
        await onDelete(match._id);
        toast.success('Match eliminato con successo');
      } catch (error) {
        toast.error('Errore durante l\'eliminazione del match');
      }
    }
    setIsDeleteDialogOpen(false);
  };

  return (
    <>
      <div 
        className={cn(
          "arcade-card cursor-pointer transition-transform hover:scale-[1.02] border-arcade-green/20",
          compact ? "p-3" : "p-4"
        )}
        onClick={onClick}
      >
        <div className={cn(
          "flex items-center justify-between",
          compact ? "mb-2" : "mb-4"
        )}>
          <div className={cn(
            "flex items-center text-white/60 font-pixel gap-2",
            compact ? "text-xs" : "text-sm"
          )}>
            <Calendar className={cn("text-primary", compact ? "w-3 h-3" : "w-4 h-4")} />
            <span>{isToday ? 'Today' : format(matchDate, 'MMM d')}</span>
          </div>
          
          {showActions && onDelete && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsDeleteDialogOpen(true);
              }}
              className="text-red-400 hover:text-red-300 transition-colors"
              aria-label="Elimina match"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex flex-col items-center">
            <div className={cn(
              "rounded-full overflow-hidden bg-black/30 mb-1",
              compact ? "w-8 h-8" : "w-12 h-12 mb-2"
            )}>
              <img 
                src={`https://api.dicebear.com/7.x/pixel-art/svg?seed=${encodeURIComponent(match.player1.name)}&backgroundColor=0ea5e9`} 
                alt={match.player1.name} 
                className="w-full h-full object-cover"
              />
            </div>
            <span className={cn(
              "text-white font-pixel text-center max-w-[100px] truncate",
              compact ? "text-xs" : "text-sm"
            )}>
              {match.player1.name}
            </span>
            
            {winner._id === match.player1._id && !compact && (
              <div className="mt-1 flex items-center gap-1 text-yellow-400 text-xs font-pixel">
                <Trophy className="w-3 h-3" />
                <span>Winner</span>
              </div>
            )}
          </div>
          
          <div className="flex flex-col items-center px-2">
            <div className="flex items-center gap-2">
              <span className={cn(
                compact ? "text-xl" : "text-3xl",
                "font-digital",
                winner._id === match.player1._id ? "text-arcade-green" : "text-white"
              )}>
                {match.player1Score}
              </span>
              <span className={cn(
                "text-white/50 font-pixel",
                compact ? "text-xs" : "text-sm"
              )}>vs</span>
              <span className={cn(
                compact ? "text-xl" : "text-3xl",
                "font-digital",
                winner._id === match.player2._id ? "text-arcade-green" : "text-white"
              )}>
                {match.player2Score}
              </span>
            </div>
          </div>
          
          <div className="flex flex-col items-center">
            <div className={cn(
              "rounded-full overflow-hidden bg-black/30 mb-1",
              compact ? "w-8 h-8" : "w-12 h-12 mb-2"
            )}>
              <img 
                src={`https://api.dicebear.com/7.x/pixel-art/svg?seed=${encodeURIComponent(match.player2.name)}&backgroundColor=0ea5e9`} 
                alt={match.player2.name} 
                className="w-full h-full object-cover"
              />
            </div>
            <span className={cn(
              "text-white font-pixel text-center max-w-[100px] truncate",
              compact ? "text-xs" : "text-sm"
            )}>
              {match.player2.name}
            </span>
            
            {winner._id === match.player2._id && !compact && (
              <div className="mt-1 flex items-center gap-1 text-yellow-400 text-xs font-pixel">
                <Trophy className="w-3 h-3" />
                <span>Winner</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="bg-arcade-dark border-arcade-blue/20">
          <DialogHeader>
            <DialogTitle className="text-white font-arcade">Elimina Match</DialogTitle>
            <DialogDescription className="text-white/70 font-pixel">
              Sei sicuro di voler eliminare questo match? Questa azione non può essere annullata.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
              className="font-pixel"
            >
              Annulla
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              className="font-pixel"
            >
              Elimina
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default MatchItem;
