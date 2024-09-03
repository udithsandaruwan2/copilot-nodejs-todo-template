// Import Azure Cosmos SDK and task model
import { CosmosClient } from '@azure/cosmos';
import { Task } from '../models/task';

/*
  * Create a class for the database service
 */

export class DbService {
  private client: CosmosClient;
  private database: string;
  private container: string;

  // Create a singleton instance of DbService and get that instance
  private static instance: DbService;

  // Get the singleton instance of DbService
  static getInstance() {
    if (!DbService.instance) {
      DbService.instance = new DbService();
    }
    return DbService.instance;
  }

  constructor() {
    this.client = new CosmosClient({
      endpoint: process.env.COSMOSDB_URI || '',
      key: process.env.COSMOSDB_KEY || ''
    });
    this.database = 'todos';
    this.container = 'tasks';
  }

  async getTasks() {
    const { resources } = await this.client
      .database(this.database)
      .container(this.container)
      .items.readAll()
      .fetchAll();
    return resources;
  }

  async createTask(task: Task) {
    const { resource } = await this.client
      .database(this.database)
      .container(this.container)
      .items.create(task);
    return resource;
  }

  async updateTask(task: Task) {
    const { resource } = await this.client
      .database(this.database)
      .container(this.container)
      .item(task.id, task.id)
      .replace(task);
    return resource;
  }

  async deleteTask(task: Task) {
    await this.client
      .database(this.database)
      .container(this.container)
      .item(task.id, task.id)
      .delete();
  }
}
