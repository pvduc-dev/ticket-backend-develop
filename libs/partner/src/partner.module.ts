import { Module } from '@nestjs/common';
import { PartnerService } from './partner.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Partner, PartnerSchema } from './schema/partner.schema';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: Partner.name,
        useFactory: () => {
          const schema = PartnerSchema;
          schema.plugin(require('mongoose-paginate-v2'));
          return schema;
        },
      },
    ]),
  ],
  providers: [PartnerService],
  exports: [PartnerService],
})
export class PartnerModule {}
