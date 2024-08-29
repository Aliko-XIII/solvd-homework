const { Specialization } = require('../../models/Specialization');
const { Symptom } = require('../../models/Symptom');
const { Organ } = require('../../models/Organ');
const { query } = require('../../config/database');

// Mock the query method
jest.mock('../../config/database', () => ({
    query: jest.fn(),
}));

describe('Specialization Class', () => {
    describe('Constructor', () => {
        test('should create a valid Specialization instance', () => {
            const specialization = new Specialization('Cardiology', 'Heart diseases', [], []);
            expect(specialization.name).toBe('Cardiology');
            expect(specialization.description).toBe('Heart diseases');
            expect(specialization.symptoms).toEqual([]);
            expect(specialization.organs).toEqual([]);
        });

        test('should throw error for invalid name', () => {
            expect(() => new Specialization(123, 'Heart diseases')).toThrow(Error);
        });

        test('should throw error for invalid description', () => {
            expect(() => new Specialization('Cardiology', 123)).toThrow(Error);
        });

        test('should throw error for invalid symptoms', () => {
            expect(() => new Specialization('Cardiology', 'Heart diseases', 'Not an array')).toThrow(Error);
        });

        test('should throw error for invalid organs', () => {
            expect(() => new Specialization('Cardiology', 'Heart diseases', [], 'Not an array')).toThrow(Error);
        });
    });

    describe('Insert Specialization into DB', () => {
        test('should insert a new specialization', async () => {
            query.mockResolvedValue({
                rows: [{ specialization_id: 1 }],
            });

            const specialization = new Specialization('Cardiology', 'Heart diseases');
            const { id } = await specialization.insertSpecialization();

            expect(query).toHaveBeenCalledWith(expect.stringContaining('INSERT INTO specializations'));
            expect(id).toBe(1);
            expect(specialization.id).toBe(1);
        });
    });

    describe('Get Specializations from DB', () => {
        test('should return an array of Specialization objects', async () => {
            query.mockResolvedValue({
                rows: [
                    {
                        specialization_name: 'Cardiology',
                        specialization_description: 'Heart diseases',
                        symptoms: [{ id: 1, name: 'Chest Pain' }],
                        organs: [{ id: 1, name: 'Heart' }],
                        specialization_id: 1,
                    },
                ],
            });

            const specializations = await Specialization.getSpecializations({});
            expect(specializations).toBeInstanceOf(Array);
            specializations.forEach(spec => {
                expect(spec).toBeInstanceOf(Specialization);
            });
        });

        test('should call query with proper filters', async () => {
            query.mockResolvedValue({ rows: [] });
            await Specialization.getSpecializations({ name: 'Cardiology' });

            expect(query).toHaveBeenCalledWith(expect.stringContaining("s.specialization_name ILIKE '%Cardiology%'"));
        });
    });

    describe('Get Specialization by ID from DB', () => {
        test('should return a specialization by ID', async () => {
            query.mockResolvedValue({
                rows: [
                    {
                        specialization_name: 'Cardiology',
                        specialization_description: 'Heart diseases',
                        symptoms: [{ id: 1, name: 'Chest Pain' }],
                        organs: [{ id: 1, name: 'Heart' }],
                        specialization_id: 1,
                    },
                ],
            });

            const specialization = await Specialization.getSpecializationById(1);
            expect(specialization).toBeInstanceOf(Specialization);
            expect(specialization.name).toBe('Cardiology');
        });
    });

    describe('Update Specialization in DB', () => {
        test('should throw an error if no ID is provided', async () => {
            await expect(Specialization.updateSpecialization(null, { name: 'New Name' })).rejects.toThrow('No ID provided to update specialization record.');
        });

        test('should throw an error if no parameters to update', async () => {
            await expect(Specialization.updateSpecialization(1, {})).rejects.toThrow('No parameters to update.');
        });

        test('should update specialization information', async () => {
            query.mockResolvedValue({
                rows: [
                    { specialization_name: 'Cardiology', specialization_description: 'Updated description', specialization_id: 1 }
                ],
            });

            const updatedSpec = await Specialization.updateSpecialization(1, { description: 'Updated description' });
            expect(query).toHaveBeenCalledWith(expect.stringContaining('UPDATE specializations SET'));
            expect(updatedSpec.description).toBe('Updated description');
        });
    });

    describe('Delete Specialization from DB', () => {
        test('should delete a specialization', async () => {
            query.mockResolvedValue({
                rows: [{ specialization_id: 1 }],
            });

            const specialization = new Specialization('Cardiology', 'Heart diseases', [], [], 1);
            await specialization.deleteSpecialization();

            expect(query).toHaveBeenCalledWith(expect.stringContaining("DELETE FROM specializations WHERE specialization_id = 1"));
        });
    });
});
