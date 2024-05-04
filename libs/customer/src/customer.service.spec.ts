import { Test, TestingModule } from '@nestjs/testing';
import { CustomerService } from './customer.service';
import { getModelToken } from '@nestjs/mongoose';
import { Customer } from '@app/customer/schema/customer.schema';

describe('CustomerService', () => {
  let service: CustomerService;
  let customerModelMock: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CustomerService,
        {
          provide: getModelToken(Customer.name),
          useValue: {
            findById: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<CustomerService>(CustomerService);
    customerModelMock = module.get(getModelToken(Customer.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findById', () => {
    it('should find customer by ID successfully', async () => {
      const customerId = 'mocked_customer_id';
      const mockCustomer = { _id: customerId, name: 'Mocked Customer' };
      customerModelMock.findById.mockResolvedValue(mockCustomer);

      const result = await service.findById(customerId);

      expect(result).toEqual(mockCustomer);
      expect(customerModelMock.findById).toHaveBeenCalledWith(customerId);
    });
  });

  describe('findByPhone', () => {
    it('should find customer by phone number successfully', async () => {
      const phone = '1234567890';
      const mockCustomer = { phone, name: 'Mocked Customer' };
      customerModelMock.findOne.mockResolvedValue(mockCustomer);

      const result = await service.findByPhone(phone);

      expect(result).toEqual(mockCustomer);
      expect(customerModelMock.findOne).toHaveBeenCalledWith({ phone });
    });
  });

  describe('create', () => {
    it('should create a new customer successfully', async () => {
      const newCustomer = { phone: '1234567890', name: 'New Customer' };
      const mockCreatedCustomer = { ...newCustomer, _id: 'mocked_customer_id' };
      customerModelMock.create.mockResolvedValue(mockCreatedCustomer);

      const result = await service.create(newCustomer);

      expect(result).toEqual(mockCreatedCustomer);
      expect(customerModelMock.create).toHaveBeenCalledWith(newCustomer);
    });
  });
});
