import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Customer } from '@app/customer/schema/customer.schema';
import { Model } from 'mongoose';

@Injectable()
export class CustomerService {
  constructor(
    @InjectModel(Customer.name)
    private readonly customerModel: Model<Customer>,
  ) {}

  public findById(customerId: string) {
    return this.customerModel.findById(customerId);
  }

  public findByPhone(phone: string) {
    return this.customerModel.findOne({ phone });
  }

  public create(customer: Customer) {
    return this.customerModel.create(customer);
  }
}
