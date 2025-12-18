import z from 'zod';

export const stepOneSchema = z.object({
  bankId: z.string().min(1, 'Bank is required'),
  accountNumber: z.string().regex(/^\d{10}$/, 'Account number must be 10 digits'),
});

export const stepTwoSchema = z.object({
  email: z.string().email('Enter a valid email').optional().or(z.literal('')),
  phone: z.string().regex(/^\d{10}$/, 'Phone number must be 10 digits (no country code)'),
});
