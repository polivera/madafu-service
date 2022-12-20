import { HttpStatus } from '@nestjs/common';
import { registerDecorator, ValidationOptions } from 'class-validator';
import { isAfter, isBefore, startOfMonth } from 'date-fns';

export enum ErrorCodes {
  NOT_EMPTY = 'NOT_EMPTY',
  INVALID_EMAIL = 'INVALID_EMAIL',
  REQUIREMENTS_NOT_MET = 'REQUIREMENTS_NOT_MET',
  INVALID_TYPE = 'INVALID_TYPE',
  INVALID_VALUE = 'INVALID_VALUE',
  DUPLICATE_VALUE = 'DUPLICATE_VALUE',
  RELATION_NOT_FOUND = 'RELATION_NOT_FOUND',
  CURRENCY_MISMATCH = 'CURRENCY_MISMATCH',
  SOURCE_CANT_PAY = 'SOURCE_CANT_PAY',
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

export function IsValidDailyEntryDate(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'isValidDailyEntryDate',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        validate(value: any) {
          const currentDate = new Date();
          const entryDate = new Date(value);
          return (
            isBefore(entryDate, currentDate) &&
            isAfter(entryDate, startOfMonth(currentDate))
          );
        },
      },
    });
  };
}

export class ValidationErrorResponse {
  private messages: string[] = [];
  private status: number;
  private error: string;

  static builder(): ValidationErrorResponse {
    return new ValidationErrorResponse();
  }

  addErrorMessage(message: string): ValidationErrorResponse {
    this.messages = [...this.messages, message];
    return this;
  }

  badRequestResponse() {
    this.status = HttpStatus.BAD_REQUEST;
    this.error = 'Bad Request';
    return this.getResponse();
  }

  internalServerError() {
    this.status = HttpStatus.INTERNAL_SERVER_ERROR;
    this.error = 'Internal Server Error';
    return this.getResponse();
  }

  private getResponse() {
    return {
      error: this.error,
      status: this.status,
      messages: this.messages,
    };
  }
}
