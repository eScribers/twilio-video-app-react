
import { Request, Response } from 'express';
import { createLogger } from 'logzio-nodejs';
import { LOGZIO_TOKEN } from '../../config.json';

export const initiateLogger = async (req: Request, res: Response, next: () => void) => {
  const logger = createLogger({
    token: LOGZIO_TOKEN,
    protocol: 'http',
    port: '8070',
  });
  
  let context = {
    environment: {
      environment: 'dvlp-gal-01'
    },
    httpRequest: {
      headers: JSON.stringify(req.headers)
    }
  };

  const sendLog = (type: 'warn' | 'error' | 'log' | 'info') => (longDescription: string | object | any[]) => {
    logger.log({
      ...context,
      message: {
        severity: type,
        longDescription: longDescription
      }
    })
  }
  
  req.logger = {
    warn: sendLog('warn'),
    error: sendLog('error'),
    log: sendLog('log'),
    info: sendLog('info'),
  };
  next();
}
