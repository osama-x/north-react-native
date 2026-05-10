import * as SQLite from 'expo-sqlite';
import { TripItinerary } from '../components/planner/itinerary/types';

const dbName = 'north_planner.db';

export interface SavedPlanRecord {
  id: string;
  title: string;
  startDate: string;
  totalCost: number;
  data: TripItinerary; // JSON parsed
  createdAt: number;
  updatedAt: number;
}

class DatabaseService {
  private db: SQLite.SQLiteDatabase | null = null;
  private isReady = false;

  async init() {
    if (this.isReady) return;

    try {
      this.db = await SQLite.openDatabaseAsync(dbName);
      
      await this.db.execAsync(`
        CREATE TABLE IF NOT EXISTS saved_plans (
          id TEXT PRIMARY KEY NOT NULL,
          title TEXT NOT NULL,
          startDate TEXT NOT NULL,
          totalCost REAL NOT NULL,
          data TEXT NOT NULL,
          createdAt INTEGER NOT NULL,
          updatedAt INTEGER NOT NULL
        );
      `);
      this.isReady = true;
    } catch (error) {
      console.error('Failed to initialize database:', error);
      throw error;
    }
  }

  async savePlan(plan: TripItinerary, totalCost: number): Promise<void> {
    await this.init();
    if (!this.db) throw new Error('Database not initialized');

    const now = Date.now();
    const startDate = plan.days[0]?.date || new Date().toISOString();

    const statement = await this.db.prepareAsync(`
      INSERT OR REPLACE INTO saved_plans (id, title, startDate, totalCost, data, createdAt, updatedAt)
      VALUES ($id, $title, $startDate, $totalCost, $data, $createdAt, $updatedAt)
    `);

    try {
      await statement.executeAsync({
        $id: plan.id,
        $title: plan.title,
        $startDate: startDate,
        $totalCost: totalCost,
        $data: JSON.stringify(plan),
        $createdAt: now,
        $updatedAt: now,
      });
    } finally {
      await statement.finalizeAsync();
    }
  }

  async updatePlan(plan: TripItinerary, totalCost: number): Promise<void> {
    await this.init();
    if (!this.db) throw new Error('Database not initialized');

    const now = Date.now();
    const startDate = plan.days[0]?.date || new Date().toISOString();

    const statement = await this.db.prepareAsync(`
      UPDATE saved_plans 
      SET title = $title, startDate = $startDate, totalCost = $totalCost, data = $data, updatedAt = $updatedAt
      WHERE id = $id
    `);

    try {
      await statement.executeAsync({
        $id: plan.id,
        $title: plan.title,
        $startDate: startDate,
        $totalCost: totalCost,
        $data: JSON.stringify(plan),
        $updatedAt: now,
      });
    } finally {
      await statement.finalizeAsync();
    }
  }

  async getSavedPlans(): Promise<SavedPlanRecord[]> {
    await this.init();
    if (!this.db) throw new Error('Database not initialized');

    const result = await this.db.getAllAsync<any>('SELECT * FROM saved_plans ORDER BY updatedAt DESC');
    
    return result.map(row => ({
      ...row,
      data: JSON.parse(row.data)
    }));
  }

  async getPlanById(id: string): Promise<SavedPlanRecord | null> {
    await this.init();
    if (!this.db) throw new Error('Database not initialized');

    const result = await this.db.getFirstAsync<any>('SELECT * FROM saved_plans WHERE id = ?', [id]);
    
    if (!result) return null;

    return {
      ...result,
      data: JSON.parse(result.data)
    };
  }

  async deletePlan(id: string): Promise<void> {
    await this.init();
    if (!this.db) throw new Error('Database not initialized');

    await this.db.runAsync('DELETE FROM saved_plans WHERE id = ?', [id]);
  }
}

export const dbService = new DatabaseService();
