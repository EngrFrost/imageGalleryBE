import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export type IPagination = {
  page: number;
  limit: number;
  offset: number;
};

export const PaginationParams = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): IPagination => {
    const request = ctx.switchToHttp().getRequest();
    const { page: pageStr = '1', limit: limitStr = '12' } = request.query;

    const page = parseInt(pageStr, 10);
    const limit = parseInt(limitStr, 10);

    const offset = (page - 1) * limit;

    return { page, limit, offset };
  },
);
