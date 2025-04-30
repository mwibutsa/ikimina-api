import { createParamDecorator, ExecutionContext } from '@nestjs/common';

interface RequestWithUser {
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email?: string;
    phoneNumber: string;
  };
}

export const CurrentUser = createParamDecorator(
  (data: keyof RequestWithUser['user'] | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<RequestWithUser>();

    if (!request.user) {
      return undefined;
    }

    return data ? request.user[data] : request.user;
  },
);
