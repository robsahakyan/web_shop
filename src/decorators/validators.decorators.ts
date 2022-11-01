import type { ValidationArguments, ValidationOptions } from 'class-validator';
import { registerDecorator } from 'class-validator';
import { trim } from 'lodash';

export function IsPassword(
  validationOptions?: ValidationOptions,
): PropertyDecorator {
  return (object, propertyName: string) => {
    registerDecorator({
      propertyName,
      name: 'isPassword',
      target: object.constructor,
      constraints: [],
      options: validationOptions,
      validator: {
        validate(value: string, _args: ValidationArguments) {
          if (value.length < 8) {
            return false;
          }

          return (/((?=.*\W+)(?![.\n])(?=.*[A-Z])(?=.*[a-z]))/).test(value);
        },
      },
    });
  };
}

export function IsFullName(
  validationOptions?: ValidationOptions,
): PropertyDecorator {
  return (object, propertyName: string) => {
    registerDecorator({
      propertyName,
      name: 'isFullName',
      target: object.constructor,
      constraints: [],
      options: validationOptions,
      validator: {
        validate(value: string, _args: ValidationArguments) {
          const trimValue = trim(value);

          if (trimValue) {
            const names = trimValue.split(' ');
            const regExp = /^[A-Za-z]+$/;

            if (
              names.length === 2 &&
              regExp.test(names[0] as string) &&
              regExp.test(names[1] as string)
            ) {
              return true;
            }
          }

          return false;
        },
      },
    });
  };
}
