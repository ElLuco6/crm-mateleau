import mongoose from 'mongoose';
import { DivingGroup } from '../../models/DivingGroup';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { Schema } from 'mongoose';

let mongo: MongoMemoryServer;

// Schéma temporaire pour mocker Equipment
const EquipmentSchema = new Schema({
  nature: { type: String, required: true }
});
const Equipment = mongoose.model('Equipment', EquipmentSchema);

// Augmente un peu le timeout global du fichier si besoin (téléchargement binaire la 1ère fois)
jest.setTimeout(60_000);

beforeAll(async () => {
  mongo = await MongoMemoryServer.create();
  const uri = mongo.getUri();
  await mongoose.connect(uri);
});

afterAll(async () => {
  if (mongoose.connection.readyState !== 0 && mongoose.connection.db) {
    await mongoose.connection.db.dropDatabase();
  }
  await mongoose.disconnect();
  await mongo.stop();
});

afterAll(async () => {
  if (mongoose.connection.readyState !== 0 && mongoose.connection.db) {
    await mongoose.connection.db.dropDatabase();
  }
  await mongoose.disconnect();
});

describe('DivingGroup model middleware', () => {
  it('should calculate groupSize and save a valid group', async () => {
    const group = new DivingGroup({
      guide: new mongoose.Types.ObjectId(),
      divers: [new mongoose.Types.ObjectId(), new mongoose.Types.ObjectId()],
      rentedEquipment: [],
    });

    await group.save();

    expect(group.groupSize).toBe(3);
  });

  it('should throw if group size exceeds 5', async () => {
    const divers = Array.from({ length: 5 }, () => new mongoose.Types.ObjectId());

    const group = new DivingGroup({
      guide: new mongoose.Types.ObjectId(),
      divers,
      rentedEquipment: [],
    });

    await expect(group.save()).rejects.toThrow('Group size cannot exceed 5 members');
  });

  it('should throw if there are duplicate divers', async () => {
    const diverId = new mongoose.Types.ObjectId();

    const group = new DivingGroup({
      guide: new mongoose.Types.ObjectId(),
      divers: [diverId, diverId],
      rentedEquipment: [],
    });

    await expect(group.save()).rejects.toThrow('Divers must be unique');
  });

  it('should throw if equipment not found', async () => {
    const diverId = new mongoose.Types.ObjectId();
    const equipmentId = new mongoose.Types.ObjectId();

    // Supprime tout Equipment existant
    await Equipment.deleteMany({});

    const group = new DivingGroup({
      guide: new mongoose.Types.ObjectId(),
      divers: [diverId],
      rentedEquipment: [
        {
          diverId,
          equipmentIds: [equipmentId],
        },
      ],
    });

    await expect(group.save()).rejects.toThrow(`Equipment with ID ${equipmentId} not found`);
  });

  it('should throw if two divers have same equipment nature', async () => {
    const diver1 = new mongoose.Types.ObjectId();
    const diver2 = new mongoose.Types.ObjectId();
    const eq1 = new mongoose.Types.ObjectId();
    const eq2 = new mongoose.Types.ObjectId();

    // Mock les équipements en base
    await Equipment.create({ _id: eq1, nature: 'bottle' });
    await Equipment.create({ _id: eq2, nature: 'bottle' });

    const group = new DivingGroup({
      guide: new mongoose.Types.ObjectId(),
      divers: [diver1, diver2],
      rentedEquipment: [
        { diverId: diver1, equipmentIds: [eq1] },
        { diverId: diver2, equipmentIds: [eq2] },
      ],
    });

    await expect(group.save()).rejects.toThrow(
      'Equipment of nature bottle is already rented by another diver'
    );
  });
});
