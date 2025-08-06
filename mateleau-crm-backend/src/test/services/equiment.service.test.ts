import * as EquipmentService from '../../services/EquipmentService';
import { Equipment } from '../../models/Equipment';
import { IEquipment } from '../../models/Equipment';

jest.mock('../../models/Equipment');

describe('EquipmentService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createEquipment', () => {
    it('should create and return equipment', async () => {
      const mockData: Partial<IEquipment> = {
        nature: 'bouteille',
        reference: 'REF123',
        nextMaintenanceDate: new Date(),
      };

      const saveMock = jest.fn().mockResolvedValue(mockData);
      (Equipment as any).mockImplementation(() => ({ save: saveMock }));

      const result = await EquipmentService.createEquipment(mockData);
      expect(result).toEqual(mockData);
      expect(saveMock).toHaveBeenCalled();
    });
  });

  describe('createMultipleEquipment', () => {
    it('should insert and return multiple equipment items', async () => {
      const mockData: IEquipment[] = [
  {
    nature: 'masque',
    reference: 'REF1',
    nextMaintenanceDate: new Date(),
    _id: 'id1', // si nécessaire selon tes types Mongoose
  } as IEquipment,
  {
    nature: 'tuba',
    reference: 'REF2',
    nextMaintenanceDate: new Date(),
    _id: 'id2',
  } as IEquipment,
];

      (Equipment.insertMany as jest.Mock).mockResolvedValue(mockData);

      const result = await EquipmentService.createMultipleEquipment(mockData);
      expect(result).toEqual(mockData);
      expect(Equipment.insertMany).toHaveBeenCalledWith(mockData);
    });
  });

  describe('getAllEquipment', () => {
    it('should return all equipment', async () => {
      const mockData = [{ reference: 'REF1' }, { reference: 'REF2' }];
      (Equipment.find as jest.Mock).mockResolvedValue(mockData);

      const result = await EquipmentService.getAllEquipment();
      expect(result).toEqual(mockData);
      expect(Equipment.find).toHaveBeenCalled();
    });
  });

  describe('getEquipmentById', () => {
    it('should return equipment by ID', async () => {
      const mockEquipment = { reference: 'REF123' };
      (Equipment.findById as jest.Mock).mockResolvedValue(mockEquipment);

      const result = await EquipmentService.getEquipmentById('id123');
      expect(result).toEqual(mockEquipment);
      expect(Equipment.findById).toHaveBeenCalledWith('id123');
    });
  });

  describe('updateEquipment', () => {
    it('should update and return the equipment', async () => {
      const updatedEquipment = { reference: 'REF999' };
      (Equipment.findByIdAndUpdate as jest.Mock).mockResolvedValue(updatedEquipment);

      const result = await EquipmentService.updateEquipment('id999', { reference: 'REF999' });
      expect(result).toEqual(updatedEquipment);
      expect(Equipment.findByIdAndUpdate).toHaveBeenCalledWith('id999', { reference: 'REF999' }, { new: true });
    });
  });

  describe('deleteEquipment', () => {
    it('should delete equipment by ID', async () => {
      const deletedEquipment = { reference: 'REF123' };
      (Equipment.findByIdAndDelete as jest.Mock).mockResolvedValue(deletedEquipment);

      const result = await EquipmentService.deleteEquipment('id123');
      expect(result).toEqual(deletedEquipment);
      expect(Equipment.findByIdAndDelete).toHaveBeenCalledWith('id123');
    });
  });
});
