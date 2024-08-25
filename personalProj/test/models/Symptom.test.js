const { Symptom } = require('../../models/Symptom');

const symptomFields = {
    name: 'Headache',
    description: 'A continuous pain in the head.',
    id: 1
};
let symptomId = null;

describe('Symptom constructor', () => {
    const symptom = new Symptom(symptomFields.name, symptomFields.description, symptomFields.id);
    
    test('should return instance of Symptom', () => {
        expect(symptom).toBeInstanceOf(Symptom);
    });

    test('should return object with corresponding fields', () => {
        expect(symptom.name).toEqual(symptomFields.name);
        expect(symptom.description).toEqual(symptomFields.description);
        expect(symptom.id).toEqual(symptomFields.id);
    });

    test('should throw an error for invalid name or description', () => {
        expect(() => {
            new Symptom(123, symptomFields.description);
        }).toThrow(Error);

        expect(() => {
            new Symptom(symptomFields.name, {});
        }).toThrow(Error);
    });
});

describe('Get symptoms array from DB records', () => {
    test('should return array of Symptom objects', async () => {
        const symptoms = await Symptom.getSymptomsFromData([
            { symptom_name: "Headache", symptom_description: "Pain in the head.", symptom_id: 1 },
            { symptom_name: "Cough", symptom_description: "Persistent cough.", symptom_id: 2 },
        ]);

        expect(symptoms).toBeInstanceOf(Array);
        symptoms.forEach(symptom => {
            expect(symptom).toBeInstanceOf(Symptom);
        });
    });
});

describe('Insert a symptom to DB', () => {
    test('should return an object with symptom\'s id', async () => {
        const symptom = new Symptom(symptomFields.name, symptomFields.description);
        const result = await symptom.insertSymptom();
        symptomId = result.id;
        expect(symptomId).toBeTruthy();
    });
});

describe('Get symptom by id from DB', () => {
    test('should return a Symptom object', async () => {
        const symptom = await Symptom.getSymptomById(symptomId);
        expect(symptom).toBeInstanceOf(Symptom);
        expect(symptom.id).toEqual(symptomId);
    });
});

describe('Get all symptoms from DB', () => {
    test('should return array of Symptom objects', async () => {
        const symptoms = await Symptom.getSymptoms({});
        expect(symptoms).toBeInstanceOf(Array);
        symptoms.forEach(symptom => {
            expect(symptom).toBeInstanceOf(Symptom);
        });
    });

    test('should return array with name filter applied', async () => {
        const symptoms = await Symptom.getSymptoms({ name: 'Head' });
        expect(symptoms).toBeInstanceOf(Array);
        symptoms.forEach(symptom => {
            expect(symptom.name.indexOf('Head') !== -1).toBeTruthy();
        });
    });

    test('should return array with description filter applied', async () => {
        const symptoms = await Symptom.getSymptoms({ description: 'a' });
        expect(symptoms).toBeInstanceOf(Array);
        symptoms.forEach(symptom => {
            expect(symptom.description.indexOf('a') !== -1).toBeTruthy();
        });
    });
});

describe('Update symptom by id in DB', () => {
    test('should return a symptom with updated name', async () => {
        const updatedSymptom = await Symptom.updateSymptom(symptomId, { name: 'Severe Headache' });
        expect(updatedSymptom.name).toEqual('Severe Headache');
        const symptom = await Symptom.getSymptomById(symptomId);
        expect(symptom.name).toEqual('Severe Headache');
    });

    test('should return a symptom with updated description', async () => {
        const updatedSymptom = await Symptom.updateSymptom(symptomId, { description: 'Intense pain in the head.' });
        expect(updatedSymptom.description).toEqual('Intense pain in the head.');
        const symptom = await Symptom.getSymptomById(symptomId);
        expect(symptom.description).toEqual('Intense pain in the head.');
    });
});

describe('Remove symptom from DB', () => {
    test('should remove symptom from DB', async () => {
        const symptom = await Symptom.getSymptomById(symptomId);
        expect(async () => { await symptom.deleteSymptom() }).not.toThrow();
    });
});
