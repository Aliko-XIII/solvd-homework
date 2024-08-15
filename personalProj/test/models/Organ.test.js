const { Organ } = require('../../models/Organ');

const organFields = {
    name: 'Heart',
    description: 'Pumps blood throughout the body.',
    id: 1
};
let organId = null;

describe('Organ constructor', () => {
    const organ = new Organ(organFields.name, organFields.description, organFields.id);
    
    test('should return instance of Organ', () => {
        expect(organ).toBeInstanceOf(Organ);
    });

    test('should return object with corresponding fields', () => {
        expect(organ.name).toEqual(organFields.name);
        expect(organ.description).toEqual(organFields.description);
        expect(organ.id).toEqual(organFields.id);
    });

    test('should throw an error for invalid name or description', () => {
        expect(() => {
            new Organ(123, organFields.description);
        }).toThrow(Error);

        expect(() => {
            new Organ(organFields.name, {});
        }).toThrow(Error);
    });
});

describe('Get organs array from DB records', () => {
    test('should return array of Organ objects', async () => {
        const organs = await Organ.getOrgansFromData([
            { organ_name: "Heart", organ_description: "Pumps blood throughout the body.", organ_id: 1 },
            { organ_name: "Lung", organ_description: "Helps in breathing.", organ_id: 2 },
        ]);

        expect(organs).toBeInstanceOf(Array);
        organs.forEach(organ => {
            expect(organ).toBeInstanceOf(Organ);
        });
    });
});

describe('Get all organs from DB', () => {
    test('should return array of Organ objects', async () => {
        const organs = await Organ.getOrgans({});
        expect(organs).toBeInstanceOf(Array);
        organs.forEach(organ => {
            expect(organ).toBeInstanceOf(Organ);
        });
    });

    test('should return array with name filter applied', async () => {
        const organs = await Organ.getOrgans({ name: 'Heart' });
        expect(organs).toBeInstanceOf(Array);
        organs.forEach(organ => {
            expect(organ.name.indexOf('Heart') !== -1).toBeTruthy();
        });
    });

    test('should return array with description filter applied', async () => {
        const organs = await Organ.getOrgans({ description: 'b' });
        expect(organs).toBeInstanceOf(Array);
        organs.forEach(organ => {
            expect(organ.description.indexOf('b') !== -1).toBeTruthy();
        });
    });
});

describe('Get organ by id from DB', () => {
    test('should return an Organ object', async () => {
        const organ = await Organ.getOrganById(organFields.id);
        expect(organ).toBeInstanceOf(Organ);
        expect(organ.id).toEqual(organFields.id);
    });
});

describe('Insert an organ to DB', () => {
    test('should return an object with organ\'s id', async () => {
        const organ = new Organ(organFields.name, organFields.description);
        const result = await organ.insertOrgan();
        organId = result.id;
        expect(organId).toBeTruthy();
    });
});

describe('Update organ by id in DB', () => {
    test('should return an organ with updated name', async () => {
        const updatedOrgan = await Organ.updateOrgan(organId, { name: 'Liver' });
        expect(updatedOrgan.name).toEqual('Liver');
        const organ = await Organ.getOrganById(organId);
        expect(organ.name).toEqual('Liver');
    });

    test('should return an organ with updated description', async () => {
        const updatedOrgan = await Organ.updateOrgan(organId, { description: 'Detoxifies the blood.' });
        expect(updatedOrgan.description).toEqual('Detoxifies the blood.');
        const organ = await Organ.getOrganById(organId);
        expect(organ.description).toEqual('Detoxifies the blood.');
    });
});

describe('Remove organ from DB', () => {
    test('should remove organ from DB', async () => {
        const organ = await Organ.getOrganById(organId);
        expect(async () => { await organ.deleteOrgan() }).not.toThrow();
    });
});
