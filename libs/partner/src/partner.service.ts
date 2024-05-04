import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Partner } from './schema/partner.schema';

@Injectable()
export class PartnerService {
  constructor(
    @InjectModel(Partner.name)
    private readonly partnerModel: Model<Partner>,
  ) {}

  public findById(partnerId: string) {
    return this.partnerModel.findById(partnerId);
  }

  public findByPhone(phone: string) {
    return this.partnerModel.findOne({ phone });
  }

  public create(partner: Partner) {
    return this.partnerModel.create(partner);
  }
}
