import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthModule as CoreAuthModule } from '@app/auth';
import { CustomerModule, CustomerService } from '@app/customer';

@Module({
  imports: [
    CustomerModule,
    CoreAuthModule.registerAsync({
      imports: [CustomerModule],
      inject: [CustomerService],
      useFactory: (customerService: CustomerService) => customerService,
    }),
  ],
  controllers: [AuthController],
})
export class AuthModule {}
