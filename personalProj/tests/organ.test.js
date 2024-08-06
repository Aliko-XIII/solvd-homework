const { Organ } = require('../models/Organ');
const { query } = require('../config/database');

// Mock the database query function
jest.mock('../config/database', () => ({
  query: jest.fn(),
}));

describe('Organ Class', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should create an Organ instance', () => {
    const organ = new Organ('Heart', 'Pumps blood');
    expect(organ.name).toBe('Heart');
    expect(organ.description).toBe('Pumps blood');
  });

  test('should convert Organ to string', () => {
    const organ = new Organ('Heart', 'Pumps blood');
    expect(organ.toString()).toBe('Organ "Heart"\n        Description: Pumps blood');
  });

  test('should get organs from data', async () => {
    const rows = [
      { organ_id: 1, organ_name: 'Heart', organ_description: 'Pumps blood' },
      { organ_id: 2, organ_name: 'Liver', organ_description: 'Detoxifies' },
    ];
    const organs = await Organ.getOrgansFromData(rows);
    expect(organs).toHaveLength(2);
    expect(organs[0].name).toBe('Heart');
  });

  test('should get all organs from the database', async () => {
    query.mockResolvedValue({ rows: [{ organ_id: 1, organ_name: 'Heart', organ_description: 'Pumps blood' }] });
    const organs = await Organ.getOrgans();
    expect(query).toHaveBeenCalledWith('SELECT * FROM organs;');
    expect(organs).toHaveLength(1);
    expect(organs[0].name).toBe('Heart');
  });

  test('should get organs by their IDs from the database', async () => {
    query.mockResolvedValue({ rows: [{ organ_id: 1, organ_name: 'Heart', organ_description: 'Pumps blood' }] });
    const organs = await Organ.getOrgansById(1);
    expect(query).toHaveBeenCalledWith('SELECT * FROM organs WHERE organ_id IN (1);');
    expect(organs).toHaveLength(1);
    expect(organs[0].name).toBe('Heart');
  });

  test('should get an organ by its ID from the database', async () => {
    query.mockResolvedValue({ rows: [{ organ_id: 1, organ_name: 'Heart', organ_description: 'Pumps blood' }] });
    const organ = await Organ.getOrganById(1);
    expect(query).toHaveBeenCalledWith('SELECT * FROM organs WHERE organ_id IN (1);');
    expect(organ.name).toBe('Heart');
  });

  test('should insert an organ into the database', async () => {
    const organ = new Organ('Heart', 'Pumps blood');
    query.mockResolvedValue({ rows: [{ organ_id: 1, organ_name: 'Heart', organ_description: 'Pumps blood' }] });
    await organ.insertOrgan();
    expect(query).toHaveBeenCalledWith(`INSERT INTO organs(
	        organ_name, organ_description)
            VALUES ('Heart', 'Pumps blood') RETURNING *;`);
    expect(organ.id).toBe(1);
  });

  test('should update an organ in the database', async () => {
    query.mockResolvedValue({ rows: [{ organ_id: 1, organ_name: 'Heart', organ_description: 'Pumps blood' }] });
    await Organ.updateOrgan(1, { name: 'Liver', description: 'Detoxifies' });
    expect(query).toHaveBeenCalledWith(`UPDATE organs SET
organ_name = 'Liver', 
        organ_description = 'Detoxifies', 
WHERE organ_id='1';`);
  });

  test('should delete an organ from the database', async () => {
    const organ = new Organ('Heart', 'Pumps blood', 1);
    query.mockResolvedValue({ rows: [{ organ_id: 1, organ_name: 'Heart', organ_description: 'Pumps blood' }] });
    await organ.deleteOrgan();
    expect(query).toHaveBeenCalledWith('DELETE FROM organs WHERE organ_id = 1 RETURNING *;');
  });
});
