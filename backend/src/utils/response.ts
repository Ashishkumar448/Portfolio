import { Response } from 'express';
import { ApiResponse } from '../types';

export const sendResponse = <T>(
  res: Response,
  statusCode: number,
  success: boolean,
  message: string,
  data?: T,
  pagination?: any
): Response => {
  const response: ApiResponse<T> = {
    success,
    message,
    ...(data && { data }),
    ...(pagination && { pagination }),
  };

  return res.status(statusCode).json(response);
};

export const sendSuccess = <T>(
  res: Response,
  message: string,
  data?: T,
  statusCode: number = 200,
  pagination?: any
): Response => {
  return sendResponse(res, statusCode, true, message, data, pagination);
};

export const sendError = (
  res: Response,
  message: string,
  statusCode: number = 500,
  error?: string
): Response => {
  const response: ApiResponse = {
    success: false,
    message,
    ...(error && { error }),
  };

  return res.status(statusCode).json(response);
};

export const sendCreated = <T>(
  res: Response,
  message: string,
  data?: T
): Response => {
  return sendSuccess(res, message, data, 201);
};

export const sendNoContent = (res: Response): Response => {
  return res.status(204).send();
};