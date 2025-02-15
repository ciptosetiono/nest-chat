import { registerDecorator, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';

const minAge: number = 17;

@ValidatorConstraint({ async: false })
export class IsAdultConstraint implements ValidatorConstraintInterface {
  validate(value: any) {

    //if value is not a date or is not a valid date, return false
    if (!(value instanceof Date) || isNaN(value.getTime())) {
      return false;
    }

    //get today's date
    const today = new Date();
 
    //Birthday is today's date minus minAge years
    const minBirthday = new Date(today.getFullYear() - minAge, today.getMonth(), today.getDate());

    // Must be at least 18 years old
    return value <= minBirthday; 
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
