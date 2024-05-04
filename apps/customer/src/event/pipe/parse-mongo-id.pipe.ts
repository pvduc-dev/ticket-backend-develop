import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { isValidObjectId } from 'mongoose';

@Injectable()
export class ParseMongoIdPipe implements PipeTransform<string, string> {
  transform(value: string): any {
    if (!isValidObjectId(value)) {
      throw new BadRequestException('Validation failed');
    }
    return value;
  }
}
