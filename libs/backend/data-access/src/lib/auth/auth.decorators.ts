import { applyDecorators } from '@nestjs/common';
import { ApiBadRequestResponse, ApiResponse, ApiUnauthorizedResponse } from '@nestjs/swagger';

// TODO: Decide if to keep it or not

export const ApiAuthResponses = (responseType: any) => {
  return applyDecorators(
    ApiResponse({
      status: 200,
      description: 'Successful operation',
      type: responseType,
    }),
    ApiBadRequestResponse({
      description: 'Validation failed',
      schema: {
        properties: {
          code: {
            type: 'string',
            example: 'AUTH/INVALID_INPUT',
          },
          message: {
            type: 'string',
            example: 'Validation failed',
          },
          metadata: {
            type: 'object',
            properties: {
              details: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    field: { type: 'string' },
                    message: { type: 'string' },
                  },
                },
              },
            },
          },
        },
      },
    }),
    ApiUnauthorizedResponse({
      description: 'Unauthorized',
    })
  );
};
