
import { Player, Match } from '@/context/AppContext';

export const mockPlayers: Player[] = [
  {
    id: '1',
    name: 'Alex Chen',
    avatar: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=Alex&backgroundColor=0ea5e9',
    wins: 8,
    losses: 2,
    pointsScored: 107,
    rating: 1150
  },
  {
    id: '2',
    name: 'Morgan Smith',
    avatar: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=Morgan&backgroundColor=d946ef',
    wins: 6,
    losses: 4,
    pointsScored: 92,
    rating: 1080
  },
  {
    id: '3',
    name: 'Taylor Johnson',
    avatar: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=Taylor&backgroundColor=8b5cf6',
    wins: 5,
    losses: 5,
    pointsScored: 85,
    rating: 1000
  },
  {
    id: '4',
    name: 'Jamie Williams',
    avatar: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=Jamie&backgroundColor=f97316',
    wins: 4,
    losses: 6,
    pointsScored: 78,
    rating: 950
  },
  {
    id: '5',
    name: 'Casey Brown',
    avatar: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=Casey&backgroundColor=4ade80',
    wins: 2,
    losses: 8,
    pointsScored: 65,
    rating: 900
  }
];

export const mockMatches: Match[] = [
  {
    id: '1',
    player1Id: '1',
    player2Id: '2',
    player1Score: 11,
    player2Score: 7,
    date: '2023-05-16T14:30:00Z',
    status: 'completed',
    winner: '1'
  },
  {
    id: '2',
    player1Id: '3',
    player2Id: '4',
    player1Score: 11,
    player2Score: 9,
    date: '2023-05-17T12:15:00Z',
    status: 'completed',
    winner: '3'
  },
  {
    id: '3',
    player1Id: '2',
    player2Id: '5',
    player1Score: 11,
    player2Score: 5,
    date: '2023-05-17T16:45:00Z',
    status: 'completed',
    winner: '2'
  },
  {
    id: '4',
    player1Id: '1',
    player2Id: '3',
    player1Score: 11,
    player2Score: 8,
    date: '2023-05-18T13:00:00Z',
    status: 'completed',
    winner: '1'
  },
  {
    id: '5',
    player1Id: '4',
    player2Id: '5',
    player1Score: 11,
    player2Score: 7,
    date: '2023-05-18T15:30:00Z',
    status: 'completed',
    winner: '4'
  },
  {
    id: '6',
    player1Id: '1',
    player2Id: '4',
    player1Score: 0,
    player2Score: 0,
    date: '2023-05-19T11:00:00Z',
    status: 'in-progress'
  },
  {
    id: '7',
    player1Id: '2',
    player2Id: '3',
    player1Score: 0,
    player2Score: 0,
    date: '2023-05-20T14:00:00Z',
    status: 'scheduled'
  }
];
