import type { PipeTransform, Type } from '@nestjs/common';
import {
  applyDecorators,
  Param,
  ParseUUIDPipe, SetMetadata, UseGuards, UseInterceptors,
} from '@nestjs/common';
import {ApiBearerAuth, ApiUnauthorizedResponse} from "@nestjs/swagger";
import {AuthUserInterceptor} from "../interceptors/auth-user.interceptor";
import {RoleEnum} from "../constants/role.enum";
import {RolesGuard} from "../guards/roles.guard";
import {AuthGuard} from "../guards/auth.guard";

export function Auth(...roles: RoleEnum[]) {
  return applyDecorators(
      SetMetadata('roles', roles),
      UseGuards(AuthGuard, RolesGuard),
      ApiBearerAuth(),
      UseInterceptors(AuthUserInterceptor),
      ApiUnauthorizedResponse({ description: 'Unauthorized' }),
  );
}

export function UUIDParam(
  property: string,
  ...pipes: Array<Type<PipeTransform> | PipeTransform>
): ParameterDecorator {
  return Param(property, new ParseUUIDPipe({ version: '4' }), ...pipes);
}
