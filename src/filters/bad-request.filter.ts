import {
  type ArgumentsHost,
  Catch,
  type ExceptionFilter,
  UnprocessableEntityException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { type ValidationError } from 'class-validator';
import { type Response } from 'express';

@Catch(UnprocessableEntityException)
export class HttpExceptionFilter
  implements ExceptionFilter<UnprocessableEntityException>
{
  constructor(public reflector: Reflector) {}

  catch(exception: UnprocessableEntityException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const statusCode = exception.getStatus();
    const r = exception.getResponse() as { message: ValidationError[] };

    const validationErrors = r.message;

    // Map validation errors safely
    const formattedErrors = validationErrors.map((err) => {
      const errorMessage = err.constraints
        ? Object.values(err.constraints)[0].charAt(0).toUpperCase() +
          Object.values(err.constraints)[0].slice(1)
        : 'Validation error';
      return {
        fieldName: err.property,
        errorMessage,
      };
    });

    response.status(statusCode).json({
      message: formattedErrors,
      error: 'Unprocessable Entity',
      statusCode,
    });
  }
}
