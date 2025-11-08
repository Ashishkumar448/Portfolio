declare namespace Express {
  interface Request {
    requestMetadata?: {
      ip: string;
      userAgent: string;
      timestamp: Date;
      method: string;
      path: string;
    };
  }
}