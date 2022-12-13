import { registerDecorator, ValidationOptions } from 'class-validator';

export enum ValidationErrors {
  NOT_EMPTY = 'NOT_EMPTY',
  INVALID_EMAIL = 'INVALID_EMAIL',
  REQUIREMENTS_NOT_MET = 'REQUIREMENTS_NOT_MET',
  INVALID_TYPE = 'INVALID_TYPE',
  INVALID_VALUE = 'INVALID_VALUE',
}

export function IsValidPassword(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'isValidPassword',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        validate(value: any) {
          return (
            typeof value === 'string' &&
            value.length >= 8 &&
            value.search(/[0-9]+/) >= 0 &&
            value.search(/[a-z]+/) >= 0 &&
            value.search(/[A-Z]+/) >= 0 &&
            value.search(/[^a-zA-Z0-9]+/) >= 0
          );
        },
      },
    });
  };
}
