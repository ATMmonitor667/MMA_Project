import express from 'express';
import dotenv from 'dotenv';
dotenv.config({});
import pool from '../config/db';
import cors from 'cors';
import fighterRoutes from './routes/fighterRoutes';
import authRoutes from './routes/authRoutes';
import packRoutes from './routes/packRoutes';
import tradeRoutes from './routes/tradeRoutes';
import battleRoutes from './routes/battleRoutes';
import walletRoutes from './routes/walletRoutes';
import { createUserTable } from './models/User';
import { createCardTables, seedCardPacks } from './models/Card';
import { createWalletTable } from './models/Wallet';
import { createTradeTable } from './models/Trade';
import { createBattleTable } from './models/Battle';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));

app.use(express.json());

const initializeDatabase = async () => {
  try {
    await createUserTable();
    await createCardTables();
    await createWalletTable();
    await createTradeTable();
    await createBattleTable();
    await seedCardPacks();
    console.log('All database tables initialized successfully');
  } catch (error) {
    console.error('Error initializing database tables:', error);
  }
};

app.get('/', (_req, res) => {
  res.json({ message: 'MMA Card Game API', version: '1.0.0' });
});

pool.connect();
initializeDatabase();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api', fighterRoutes);
app.use('/api', packRoutes);
app.use('/api', tradeRoutes);
app.use('/api', battleRoutes);
app.use('/api', walletRoutes);

app.listen(PORT, () => {
  console.log(`The application is running on port: ${PORT}`);
});