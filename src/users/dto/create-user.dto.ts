import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  MinLength,
  IsEmail,
  IsOptional,
  IsEnum,
  Matches,
  IsBoolean,
  IsMongoId,
  MaxLength,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { Types } from 'mongoose';
import { Role } from 'src/users/enums/role.enums';

export class CreateUserDto {
  @ApiProperty({
    description: 'Mongo Id (unique)',
    type: 'string',
    nullable: true,
    example: '67a1a6c23504ec3e184cc14a',
  })
  @IsOptional()
  @IsMongoId()
  @Transform(({ value }) =>
    Types.ObjectId.isValid(value) ? value.toString() : value,
  )
  _id?: string;

  @ApiProperty({
    description: 'User name',
    type: 'string',
    minLength: 2,
    maxLength: 50,
    nullable: false,
    example: 'Richard',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(50)
  @Matches(/^[^\s]+$/, { message: 'El nombre no puede contener espacioss' })
  @Transform(({ value }) => capitalize(value))
  name: string;

  @ApiProperty({
    description: 'User lastname',
    type: 'string',
    minLength: 2,
    maxLength: 50,
    nullable: false,
    example: 'Kendy',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(50)
  @Matches(/^[^\s]+$/, { message: 'El apellido no puede contener espacios' })
  @Transform(({ value }) => capitalize(value))
  lastname: string;

  @ApiProperty({
    description: 'User email',
    type: 'string',
    nullable: false,
    maxLength: 100,
    example: 'richard@gmail.com',
  })
  @IsEmail()
  @IsNotEmpty()
  @MaxLength(100)
  @Transform(({ value }) => value.toLowerCase().trim())
  email: string;

  @ApiProperty({
    description: 'User password',
    type: 'string',
    nullable: false,
    example: 'Test123##',
  })
  @IsString()
  @IsNotEmpty({ message: 'La contraseña es obligatoria' })
  @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
  @MaxLength(30, { message: 'La contraseña debe tener menos de 30 caracteres' })
  @Matches(/^\S*$/, { message: 'La contraseña no debe contener espacios' })
  @Matches(/(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'La contraseña debe tener una letra mayúscula, minúscula y un número.',
  })
  password: string;

  @ApiProperty({
    description: 'User confirm password',
    type: 'string',
    nullable: false,
    example: 'Test123##',
  })
  @IsString()
  @IsNotEmpty({ message: 'La contraseña es obligatoria' })
  @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
  @MaxLength(30, { message: 'La contraseña debe tener menos de 30 caracteres' })
  @Matches(/^\S*$/, {
    message: 'La confirmación de contraseña no debe contener espacios',
  })
  confirmPassword: string;

  @ApiProperty({
    description: 'User role',
    type: 'array',
    enum: Role,
    nullable: true,
    example: 'USER',
  })
  @IsOptional()
  @IsEnum(Role, { each: true })
  @Transform(({ value }) => value ?? [Role.USER])
  @Transform(({ value }) => {
    if (!value) return undefined;
    if (typeof value === 'string') {
      return [value.toUpperCase()];
    }
    if (Array.isArray(value)) {
      return value.map((v) => (typeof v === 'string' ? v.toUpperCase() : v));
    }
    return value;
  })
  roles?: Role[] | Role;

  @ApiProperty({
    description: 'User is active?',
    type: 'boolean',
    nullable: true,
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

}

function capitalize(value: string): string {
  if (!value) return value;
  return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
}
