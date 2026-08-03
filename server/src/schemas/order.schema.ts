import { z } from 'zod';

import { ORDER_PAYMENT_METHODS } from '../models/order.model.js';

const optionalEmail = z
  .union([z.literal(''), z.string().trim().email('Invalid email address').max(200)])
  .optional();

const customerSchema = z.object({
  firstName: z.string().trim().min(1, 'First name is required').max(100),
  lastName: z.string().trim().min(1, 'Last name is required').max(100),
  phone: z
    .string()
    .trim()
    .min(8, 'Phone number is too short')
    .max(30, 'Phone number is too long'),
  email: optionalEmail,
  district: z.string().trim().min(1, 'District is required').max(100),
  thana: z.string().trim().min(1, 'Thana is required').max(100),
  address: z.string().trim().min(1, 'Address is required').max(500),
  location: z
    .object({
      lat: z.number().min(-90).max(90),
      lng: z.number().min(-180).max(180),
    })
    .nullable()
    .optional(),
});

const itemSchema = z.object({
  productId: z.string().min(1).max(64),
  title: z.string().min(1).max(200),
  titleBn: z.string().max(200).default(''),
  slug: z.string().max(200).default(''),
  image: z.string().max(1000).default(''),
  price: z.number().min(0),
  quantity: z.number().int().min(1).max(999),
});

export const createOrderSchema = z.object({
  body: z.object({
    customer: customerSchema,
    items: z.array(itemSchema).min(1).max(50),
    subtotal: z.number().min(0),
    deliveryCharge: z.number().min(0),
    total: z.number().min(0),
    paymentMethod: z.enum(ORDER_PAYMENT_METHODS),
  }),
});

const orderIdParamsSchema = z.object({
  params: z.object({
    id: z.string().min(1).max(64),
  }),
});

export const updateStatusSchema = z.object({
  params: orderIdParamsSchema.shape.params,
  body: z.object({
    status: z.enum(['pending', 'confirmed', 'delivered', 'cancelled', 'returned']),
  }),
});

export const retryCourierParamsSchema = z.object({
  params: orderIdParamsSchema.shape.params,
});

const listQuerySchema = z.object({
  q: z.string().max(100).optional(),
  status: z
    .enum(['pending', 'confirmed', 'delivered', 'cancelled', 'returned'])
    .optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export const listOrdersSchema = z.object({
  query: listQuerySchema,
});
