import { DbService } from './db';
import { CosmosClient } from '@azure/cosmos';

jest.mock('@azure/cosmos');

describe('DbService', () => {
  const mockDatabase = {
    container: jest.fn().mockReturnThis(),
  };
  const mockClient = {
    database: jest.fn().mockReturnValue(mockDatabase),
  };

  beforeAll(() => {
    // Set environment variables
    process.env.COSMOS_ENDPOINT = 'dummy';
    process.env.COSMOS_KEY = '123';

    // Mock the CosmosClient constructor and its methods
    (CosmosClient as jest.Mock).mockImplementation(() => mockClient);
  });

  it('should get all tasks for a user', async () => {
    const dbService = new DbService();

    // Mock the readAll method for fetching tasks
    mockDatabase.container.mockReturnValueOnce({
      items: {
        readAll: jest.fn().mockReturnValue({
          fetchAll: jest.fn().mockResolvedValue({ resources: [] }),
        }),
      },
    });

    const tasks = await dbService.getTasks('123');
    expect(tasks).toEqual([]);
  });

  it('should create a task', async () => {
    const dbService = new DbService();
    const task = {
      id: '123',
      title: 'Test task',
      completed: false,
      userId: '123',
    };

    // Mock the create method for creating a task
    mockDatabase.container.mockReturnValueOnce({
      items: {
        create: jest.fn().mockResolvedValue({ resource: task }),
      },
    });

    const createdTask = await dbService.createTask(task);
    expect(createdTask).toEqual(task);
  });

  it('should update a task', async () => {
    const dbService = new DbService();
    const task = {
      id: '123',
      title: 'Test task',
      completed: false,
      userId: '123',
    };

    // Mock the replace method for updating a task
    mockDatabase.container.mockReturnValueOnce({
      item: jest.fn().mockReturnValue({
        replace: jest.fn().mockResolvedValue({ resource: task }),
      }),
    });

    const updatedTask = await dbService.updateTask(task);
    expect(updatedTask).toEqual(task);
  });

  it('should delete a task', async () => {
    const dbService = new DbService();
    const task = {
      id: '123',
      title: 'Test task',
      completed: false,
      userId: '123',
    };

    // Mock the delete method for deleting a task
    mockDatabase.container.mockReturnValueOnce({
      item: jest.fn().mockReturnValue({
        delete: jest.fn().mockResolvedValue({}),
      }),
    });

    await dbService.deleteTask(task);
  });

  afterAll(() => {
    jest.clearAllMocks();
  });
});
