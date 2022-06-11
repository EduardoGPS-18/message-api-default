import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { I18nService } from 'nestjs-i18n';

//TODO: Make it global
@Catch(HttpException)
export class ExceptionResponseFilter implements ExceptionFilter {
  constructor(private readonly i18n: I18nService) {}

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const query = ctx.getRequest<Request>().query;
    const response = ctx.getResponse<Response>();

    const status = exception.getStatus();
    const r = <any>exception.getResponse();

    if (!(r.message instanceof Array)) {
      const translatedMessage = this.i18n.t(r.message, {
        lang: query?.lang ? `${query.lang}` : null,
      });
      response.status(status).json({
        statusCode: status,
        message: translatedMessage,
      });
    } else {
      const translatedMessages: string[] = r.message.map((message: string) => {
        return this.i18n.t(message, {
          lang: query?.lang ? `${query.lang}` : null,
        });
      });
      response.status(status).json({
        statusCode: status,
        message: translatedMessages,
      });
    }
  }
}
