import { Customer } from '@app/customer/schema/customer.schema';

export class OtpVerifyResDto {
  secret: string;
  user?: Customer;
}
