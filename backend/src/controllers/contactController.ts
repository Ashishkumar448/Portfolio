import { Request, Response, NextFunction } from 'express';
import Contact from '../models/Contact';
import { AuthRequest } from '../types';
import { AppError } from '../utils/AppError';
import { sendSuccess, sendCreated } from '../utils/response';
import emailService from '../services/emailService';
import logger from '../config/logger';
import { sanitizeInput } from '../utils/sanitizer';

export const submitContact = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const name = sanitizeInput.string(req.body.name);
    const email = sanitizeInput.email(req.body.email);
    const subject = sanitizeInput.string(req.body.subject);
    const message = sanitizeInput.string(req.body.message);

    // Create contact record
    const contact = new Contact({
      name,
      email,
      subject,
      message,
    });

    await contact.save();

    // Send notification email to admin
    try {
      await emailService.sendContactFormNotification(contact);
    } catch (emailError) {
      logger.error('Failed to send contact notification:', emailError);
    }

    // Send confirmation email to user
    try {
      await emailService.sendContactConfirmation(contact);
    } catch (emailError) {
      logger.error('Failed to send contact confirmation:', emailError);
    }

    sendCreated(res, 'Message sent successfully! We will get back to you soon.');
  } catch (error) {
    next(error);
  }
};

export const getContacts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page = 1, limit = 10, status } = req.query;

    const filter: any = {};
    if (status) filter.status = status;

    const skip = (Number(page) - 1) * Number(limit);
    
    const [contacts, total] = await Promise.all([
      Contact.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Contact.countDocuments(filter),
    ]);

    const pagination = {
      page: Number(page),
      limit: Number(limit),
      total,
      pages: Math.ceil(total / Number(limit)),
    };

    sendSuccess(res, 'Contacts retrieved successfully', contacts, 200, pagination);
  } catch (error) {
    next(error);
  }
};

export const getContact = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const contact = await Contact.findById(id);
    if (!contact) {
      return next(new AppError('Contact not found', 404));
    }

    // Mark as read if it's new
    if (contact.status === 'new') {
      contact.status = 'read';
      await contact.save();
    }

    sendSuccess(res, 'Contact retrieved successfully', contact);
  } catch (error) {
    next(error);
  }
};

export const updateContactStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const status = sanitizeInput.string(req.body.status);

    const contact = await Contact.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    );

    if (!contact) {
      return next(new AppError('Contact not found', 404));
    }

    sendSuccess(res, 'Contact status updated successfully', contact);
  } catch (error) {
    next(error);
  }
};

export const deleteContact = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const contact = await Contact.findByIdAndDelete(id);
    if (!contact) {
      return next(new AppError('Contact not found', 404));
    }

    sendSuccess(res, 'Contact deleted successfully');
  } catch (error) {
    next(error);
  }
};