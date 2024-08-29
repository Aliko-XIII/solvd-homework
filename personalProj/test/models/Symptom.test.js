const { Symptom } = require('../../models/Symptom');
const { query } = require('../../config/database');

// Mock the query method
jest.mock('../../config/database', () => ({
    query: jest.fn(),
}));

describe('Symptom Class', () => {
    describe('Symptom constructor', () => {
        test('should create a valid Symptom instance', () => {
            const symptom = new Symptom('Headache', 'Throbbing pain in the head');
            expect(symptom.name).toBe('Headache');
            expect(symptom.description).toBe('Throbbing pain in the head');
        });

        test('should throw error for invalid name', () => {
            expect(() => new Symptom('', 'Throbbing pain in the head')).toThrow(Error);
        });

        test('should throw error for invalid description', () => {
            expect(() => new Symptom('Headache', 3)).toThrow(Error);
        });
    });

    describe('Insert a symptom into DB', () => {
        test('should insert a new symptom', async () => {
            query.mockResolvedValue({
                rows: [{ symptom_id: 1 }],
            });

            const symptom = new Symptom('Nausea', 'Feeling of sickness');
            const { id } = await symptom.insertSymptom();

            expect(query).toHaveBeenCalledWith(expect.stringContaining('INSERT INTO symptoms'));
            expect(id).toBe(1);
            expect(symptom.id).toBe(1);
        });
    });

    describe('Get symptoms from DB', () => {
        test('should return an array of Symptom objects', async () => {
            query.mockResolvedValue({
                rows: [
                    { symptom_name: 'Nausea', symptom_description: 'Feeling of sickness', symptom_id: 1 },
                    { symptom_name: 'Cough', symptom_description: 'Persistent cough', symptom_id: '2' }
                ],
            });

            const symptoms = await Symptom.getSymptoms({});
            expect(symptoms).toBeInstanceOf(Array);
            symptoms.forEach(symptom => {
                expect(symptom).toBeInstanceOf(Symptom);
            });
        });

        test('should call query with proper filters', async () => {
            query.mockResolvedValue({ rows: [] });
            await Symptom.getSymptoms({ name: 'Cough' });

            expect(query).toHaveBeenCalledWith(expect.stringContaining("symptom_name ILIKE '%Cough%'"));
        });
    });

    describe('Get symptom by ID from DB', () => {
        test('should return a symptom by ID', async () => {
            query.mockResolvedValue({
                rows: [
                    { symptom_name: 'Fever', symptom_description: 'High body temperature', symptom_id: '3' }
                ],
            });

            const symptom = await Symptom.getSymptomById('3');
            expect(symptom).toBeInstanceOf(Symptom);
            expect(symptom.name).toBe('Fever');
        });
    });

    describe('Update symptom in DB', () => {
        test('should throw an error if no ID is provided', async () => {
            await expect(Symptom.updateSymptom(null, { name: 'Nausea' })).rejects.toThrow('There is no id passed to update symptom record.');
        });

        test('should throw an error if no parameters to update', async () => {
            await expect(Symptom.updateSymptom(1, {})).rejects.toThrow('There are no params to update.');
        });

        test('should update symptom information', async () => {
            query.mockResolvedValue({
                rows: [
                    { symptom_name: 'Nausea', symptom_description: 'Updated description', symptom_id: 1 }
                ],
            });

            const updatedSymptom = await Symptom.updateSymptom(1, { description: 'Updated description' });
            expect(query).toHaveBeenCalledWith(expect.stringContaining('UPDATE symptoms SET'));
            expect(updatedSymptom.description).toBe('Updated description');
        });
    });

    describe('Delete symptom from DB', () => {
        test('should delete a symptom', async () => {
            query.mockResolvedValue({
                rows: [{ symptom_id: 1 }],
            });

            const symptom = new Symptom('Nausea', 'Feeling of sickness', 1);
            await symptom.deleteSymptom();

            expect(query).toHaveBeenCalledWith(expect.stringContaining("DELETE FROM symptoms WHERE symptom_id = 1"));
        });
    });
});
