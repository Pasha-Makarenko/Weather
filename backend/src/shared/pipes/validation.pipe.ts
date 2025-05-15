import { ArgumentMetadata, Injectable, PipeTransform } from "@nestjs/common"
import { ClassConstructor, plainToClass } from "class-transformer"
import { validate } from "class-validator"
import { ValidationException } from "../exceptions/validation.exception"

@Injectable()
export class ValidationPipe implements PipeTransform<any> {
  async transform(value: any, metadata: ArgumentMetadata) {
    const obj = plainToClass(metadata.metatype as ClassConstructor<any>, value)
    const errors = await validate(obj)

    if (errors.length) {
      const messages = errors.map(error => {
        return {
          property: error.property,
          constraints: error.constraints
        }
      })
      throw new ValidationException(messages)
    }

    return value
  }
}