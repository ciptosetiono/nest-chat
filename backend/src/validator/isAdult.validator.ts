import { registerDecorator, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';

const minAge: number = 17;

@ValidatorConstraint({ async: false })
export class IsAdultConstraint implements ValidatorConstraintInterface {
  validate(value: any) {
    if (!(value instanceof Date) || isNaN(value.getTime())) {
      return false; // Invalid date
    }

    const today = new Date();
 
    const minBirthday = new Date(today.getFullYear() - minAge, today.getMonth(), today.getDate());

    return value <= minBirthday; // Must be at least 18 years old
  }

  defaultMessage() {
    return 'User must be at least '+minAge+' years old';
  }
}

export function IsAdult(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsAdultConstraint,
    });
  };
}
