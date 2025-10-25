import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 5001;
console.log('🚀 Starting server on port:', PORT);

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'OK', message: 'Local Elections API is running' });
});

// Get all elections
app.get('/api/elections', async (req: Request, res: Response) => {
  try {
    const elections = await prisma.election.findMany({
      include: {
        races: {
          include: {
            candidates: true
          }
        }
      },
      orderBy: {
        date: 'asc'
      }
    });
    res.json(elections);
  } catch (error) {
    console.error('Error fetching elections:', error);
    res.status(500).json({ error: 'Failed to fetch elections' });
  }
});

// Get election by ID
app.get('/api/elections/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const election = await prisma.election.findUnique({
      where: { id },
      include: {
        races: {
          include: {
            candidates: true
          }
        }
      }
    });

    if (!election) {
      return res.status(404).json({ error: 'Election not found' });
    }

    res.json(election);
  } catch (error) {
    console.error('Error fetching election:', error);
    res.status(500).json({ error: 'Failed to fetch election' });
  }
});

// Get all open seats
app.get('/api/open-seats', async (req: Request, res: Response) => {
  try {
    const { state } = req.query;

    const whereClause: any = {
      isOpenSeat: true,
      election: {
        date: {
          gte: new Date() // Only future elections
        }
      }
    };

    if (state) {
      whereClause.election.state = state as string;
    }

    const openSeats = await prisma.race.findMany({
      where: whereClause,
      include: {
        election: true,
        candidates: true
      },
      orderBy: {
        election: {
          date: 'asc'
        }
      }
    });

    res.json(openSeats);
  } catch (error) {
    console.error('Error fetching open seats:', error);
    res.status(500).json({ error: 'Failed to fetch open seats' });
  }
});

// Get statistics
app.get('/api/stats', async (req: Request, res: Response) => {
  try {
    const totalElections = await prisma.election.count({
      where: {
        date: {
          gte: new Date() // Only future elections
        }
      }
    });
    const totalRaces = await prisma.race.count({
      where: {
        election: {
          date: {
            gte: new Date() // Only future elections
          }
        }
      }
    });
    const totalOpenSeats = await prisma.race.count({
      where: { 
        isOpenSeat: true,
        election: {
          date: {
            gte: new Date() // Only future elections
          }
        }
      }
    });

    const openSeatsByState = await prisma.race.groupBy({
      by: ['electionId'],
      where: { isOpenSeat: true },
      _count: true
    });

    // Get unique states with open seats
    const statesWithOpenSeats = await prisma.election.findMany({
      where: {
        races: {
          some: {
            isOpenSeat: true
          }
        }
      },
      select: {
        state: true
      },
      distinct: ['state']
    });

    res.json({
      totalElections,
      totalRaces,
      totalOpenSeats,
      statesWithOpenSeats: statesWithOpenSeats.length
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
});

// Get races by state
app.get('/api/races/state/:state', async (req: Request, res: Response) => {
  try {
    const { state } = req.params;
    const races = await prisma.race.findMany({
      where: {
        election: {
          state: state
        }
      },
      include: {
        election: true,
        candidates: true
      }
    });

    res.json(races);
  } catch (error) {
    console.error('Error fetching races by state:', error);
    res.status(500).json({ error: 'Failed to fetch races' });
  }
});

// Get all unique states
app.get('/api/states', async (req: Request, res: Response) => {
  try {
    const states = await prisma.election.findMany({
      where: {
        date: {
          gte: new Date() // Only future elections
        }
      },
      select: {
        state: true
      },
      distinct: ['state']
    });

    const stateNames = states.map(s => s.state).sort();
    res.json(stateNames);
  } catch (error) {
    console.error('Error fetching states:', error);
    res.status(500).json({ error: 'Failed to fetch states' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});
