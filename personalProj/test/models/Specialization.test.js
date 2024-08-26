const { Specialization } = require('../../models/Specialization');
const { Symptom } = require('../../models/Symptom');
const { Organ } = require('../../models/Organ');

const specializationFields = {
    name: 'TestSpecialization',
    description: 'TestSpecialization description text.',
    symptoms: [1, 2, 3],
    organs: [1, 2, 3],
    id: 13
};

const organs = [
    {
        name: 'Heart',
        description: 'Pumps blood throughout the body.',
        id: 1
    },
    {
        name: 'Lung',
        description: 'Proceeds oxygen for body.',
        id: 2
    },
    {
        name: 'Kidney',
        description: 'Cleans blood for body.',
        id: 3
    }
].map(fields => new Organ(fields.name, fields.description, fields.id));

const symptoms = [
    {
        name: 'Headache',
        description: 'Pain in the head or upper neck.',
        id: 1
    },
    {
        name: 'Fever',
        description: 'Body temperature above the normal range.',
        id: 2
    },
    {
        name: 'Nausea',
        description: 'Feeling of sickness with an inclination to vomit.',
        id: 3
    }
].map(fields => new Symptom(fields.name, fields.description, fields.id));

let specializationId = null;

describe('Specialization constructor', () => {
    let specialization = new Specialization(specializationFields.name,
        specializationFields.description, symptoms, organs, specializationFields.id);

    test('should return instance of Specialization', () => {
        expect(specialization).toBeInstanceOf(Specialization);
    });

    test('should return object with corresponding fields', () => {
        expect(specialization.name).toEqual(specializationFields.name);
        expect(specialization.description).toEqual(specializationFields.description);
        expect(specialization.symptoms).toEqual(symptoms);
        expect(specialization.organs).toEqual(organs);
        expect(specialization.id).toEqual(specializationFields.id);
    });

    test('should throw an error for invalid name', () => {
        expect(() => {
            new Specialization(12345, specializationFields.description, [], [], specializationFields.id);
        }).toThrow(Error);
    });

    test('should throw an error for invalid description', () => {
        expect(() => {
            new Specialization(specializationFields.name, 12345, [], [], specializationFields.id);
        }).toThrow(Error);
    });

    test('should throw an error for invalid symptoms', () => {
        expect(() => {
            new Specialization(specializationFields.name, specializationFields.description, 12345, [], specializationFields.id);
        }).toThrow(Error);
    });

    test('should throw an error for invalid organs', () => {
        expect(() => {
            new Specialization(specializationFields.name, specializationFields.description, [], 12345, specializationFields.id);
        }).toThrow(Error);
    });
});

describe('Get specializations array from DB records', () => {
    test('should return array of Specialization objects', async () => {
        const rows = [
            {
                specialization_name: 'Cardiology',
                specialization_description: 'Heart-related conditions and treatments.',
                symptoms: [1, 2],
                organs: [1],
                specialization_id: 1
            },
            {
                specialization_name: 'Neurology',
                specialization_description: 'Nervous system disorders.',
                symptoms: [3],
                organs: [2],
                specialization_id: 2
            }
        ];

        const specializations = await Specialization.getSpecializationsFromData(rows);

        expect(specializations).toBeInstanceOf(Array);
        expect(specializations.length).toBe(rows.length);

        specializations.forEach((specialization, index) => {
            const row = rows[index];
            expect(specialization).toBeInstanceOf(Specialization);
            expect(specialization.name).toEqual(row.specialization_name);
            expect(specialization.description).toEqual(row.specialization_description);
            expect(specialization.symptoms).toEqual(row.symptoms);
            expect(specialization.organs).toEqual(row.organs);
            expect(specialization.id).toEqual(row.specialization_id);
        });
    });
});

describe('Insert a specialization to DB', () => {
    test('should return an object with specialization\'s id', async () => {
        const specialization = new Specialization(
            specializationFields.name,
            specializationFields.description,
            specializationFields.symptoms.map(id => { return { id: id } }),
            specializationFields.organs.map(id => { return { id: id } })
        );
        const result = await specialization.insertSpecialization();
        const id = result.id;
        specializationId = id
        expect(id).toBeDefined();
        expect(id > 0).toBeTruthy();
    });
});

describe('Get all specializations from DB', () => {
    test('should return array of Specialization objects from getSpecializations()', async () => {
        const specializations = await Specialization.getSpecializations();
        expect(specializations).toBeInstanceOf(Array);
        specializations.forEach(specialization => {
            expect(specialization).toBeInstanceOf(Specialization);
        });
    });

    test('should return array with name filter applied in getSpecializations()', async () => {
        const specializations = await Specialization.getSpecializations({ name: 'l' });
        expect(specializations).toBeInstanceOf(Array);
        specializations.forEach(specialization => {
            expect(specialization).toBeInstanceOf(Specialization);
            expect(specialization.name.toLowerCase()).toContain('l');
        });
    });

    test('should return array with description filter applied in getSpecializations()', async () => {
        const specializations = await Specialization.getSpecializations({ description: 'ea' });
        expect(specializations).toBeInstanceOf(Array);
        specializations.forEach(specialization => {
            expect(specialization).toBeInstanceOf(Specialization);
            expect(specialization.description.toLowerCase()).toContain('ea');
        });
    });
});

describe('Get specialization by id from DB', () => {
    test('should return a Specialization object', async () => {
        const specialization = await Specialization.getSpecializationsByIds([specializationId]);
        expect(specialization).toBeInstanceOf(Array);
        expect(specialization.length).toBeGreaterThan(0);
        expect(specialization[0]).toBeInstanceOf(Specialization);
        expect(specialization[0].id).toEqual(specializationId);
    });
});

describe('Update specialization by id in DB', () => {
    test('should return a specialization with updated description', async () => {
        const updates = { description: 'Updated description' };
        const updatedSpecialization = await Specialization.updateSpecialization(specializationId, updates);

        expect(updatedSpecialization.description).toEqual('Updated description');

        const [specialization] = await Specialization.getSpecializationsByIds([specializationId]);
        expect(specialization.description).toEqual('Updated description');
    });

    test('should return a specialization with updated name', async () => {
        const updates = { name: 'Updated Specialization Name' };
        const updatedSpecialization = await Specialization.updateSpecialization(specializationId, updates);

        expect(updatedSpecialization.name).toEqual('Updated Specialization Name');

        const [specialization] = await Specialization.getSpecializationsByIds([specializationId]);
        expect(specialization.name).toEqual('Updated Specialization Name');
    });
});

describe('Remove specialization from DB', () => {
    test('should remove specialization from DB', async () => {
        const specialization = (await Specialization.getSpecializationsByIds([specializationId]))[0];
        expect(async () => await specialization.deleteSpecialization()).not.toThrow();
        const deletedSpecialization = await Specialization.getSpecializationsByIds([specializationId]);
        expect(deletedSpecialization.length).toBe(0);
    });
});
