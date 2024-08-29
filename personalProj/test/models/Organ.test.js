const { Organ } = require('../../models/Organ');
const { query } = require('../../config/database');

// Mock the query method
jest.mock('../../config/database', () => ({
    query: jest.fn(),
}));

describe('Organ Class', () => {
    describe('Organ constructor', () => {
        test('should create a valid Organ instance', () => {
            const organ = new Organ('Heart', 'Pumps blood through the body');
            expect(organ.name).toBe('Heart');
            expect(organ.description).toBe('Pumps blood through the body');
        });

        test('should throw error for invalid name', () => {
            expect(() => new Organ('', 'Pumps blood through the body')).toThrow(Error);
        });

        test('should throw error for invalid description', () => {
            expect(() => new Organ('Heart', 123)).toThrow(Error);
        });
    });

    describe('Insert an organ into DB', () => {
        test('should insert a new organ', async () => {
            query.mockResolvedValue({
                rows: [{ organ_id: 1 }],
            });

            const organ = new Organ('Liver', 'Filters toxins from the blood');
            const { id } = await organ.insertOrgan();

            expect(query).toHaveBeenCalledWith(expect.stringContaining('INSERT INTO organs'));
            expect(id).toBe(1);
            expect(organ.id).toBe(1);
        });
    });

    describe('Get organs from DB', () => {
        test('should return an array of Organ objects', async () => {
            query.mockResolvedValue({
                rows: [
                    { organ_name: 'Kidney', organ_description: 'Filters waste from blood', organ_id: 1 },
                    { organ_name: 'Lung', organ_description: 'Helps with breathing', organ_id: 2 }
                ],
            });

            const organs = await Organ.getOrgans({});
            expect(organs).toBeInstanceOf(Array);
            organs.forEach(organ => {
                expect(organ).toBeInstanceOf(Organ);
            });
        });

        test('should call query with proper filters', async () => {
            query.mockResolvedValue({ rows: [] });
            await Organ.getOrgans({ name: 'Lung' });

            expect(query).toHaveBeenCalledWith(expect.stringContaining("organ_name ILIKE '%Lung%'"));
        });
    });

    describe('Get organ by ID from DB', () => {
        test('should return an organ by ID', async () => {
            query.mockResolvedValue({
                rows: [
                    { organ_name: 'Spleen', organ_description: 'Filters blood', organ_id: 3 }
                ],
            });

            const organ = await Organ.getOrganById(3);
            expect(organ).toBeInstanceOf(Organ);
            expect(organ.name).toBe('Spleen');
        });
    });

    describe('Update organ in DB', () => {
        test('should throw an error if no ID is provided', async () => {
            await expect(Organ.updateOrgan(null, { name: 'Liver' })).rejects.toThrow('There is no id passed to update organ record.');
        });

        test('should throw an error if no parameters to update', async () => {
            await expect(Organ.updateOrgan(1, {})).rejects.toThrow('There are no params to update.');
        });

        test('should update organ information', async () => {
            query.mockResolvedValue({
                rows: [
                    { organ_name: 'Liver', organ_description: 'Updated description', organ_id: 1 }
                ],
            });

            const updatedOrgan = await Organ.updateOrgan(1, { description: 'Updated description' });
            expect(query).toHaveBeenCalledWith(expect.stringContaining('UPDATE organs SET'));
            expect(updatedOrgan.description).toBe('Updated description');
        });
    });

    describe('Delete organ from DB', () => {
        test('should delete an organ', async () => {
            query.mockResolvedValue({
                rows: [{ organ_id: 1 }],
            });

            const organ = new Organ('Liver', 'Filters toxins from the blood', 1);
            await organ.deleteOrgan();

            expect(query).toHaveBeenCalledWith(expect.stringContaining("DELETE FROM organs WHERE organ_id = 1"));
        });
    });
});
