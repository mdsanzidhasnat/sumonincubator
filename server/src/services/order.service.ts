import { Types } from 'mongoose';

import { AppError } from '../errors/app-error.js';
import { OrderModel, type OrderDoc, type OrderPaymentMethod, type OrderStatus } from '../models/order.model.js';
import { SteadfastService } from './steadfast.service.js';

export interface OrderListInput {
  q?: string;
  status?: OrderStatus;
  page?: number;
  limit?: number;
}

export interface OrderListResponse {
  items: OrderDto[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface OrderDto {
  id: string;
  orderId: string;
  status: OrderStatus;
  paymentMethod: OrderPaymentMethod;
  customer: {
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
    district: string;
    thana: string;
    address: string;
    location: { lat: number; lng: number } | null;
  };
  items: Array<{
    productId: string;
    title: string;
    titleBn: string;
    slug: string;
    image: string;
    price: number;
    quantity: number;
  }>;
  subtotal: number;
  deliveryCharge: number;
  total: number;
  courier: {
    status: string;
    consignmentId: string;
    trackingCode: string;
    trackingLink: string;
    invoice: string;
    error: string;
    attemptedAt: Date | null;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderStatsDto {
  totals: {
    orders: number;
    pending: number;
    confirmed: number;
    delivered: number;
    cancelled: number;
    returned: number;
    cod: number;
    prepaid: number;
    revenue: number;
  };
  recent: OrderDto[];
}

export interface OrderCreateInput {
  customer: {
    firstName: string;
    lastName: string;
    phone: string;
    email?: string;
    district: string;
    thana: string;
    address: string;
    location?: { lat: number; lng: number } | null;
  };
  items: Array<{
    productId: string;
    title: string;
    titleBn?: string;
    slug?: string;
    image?: string;
    price: number;
    quantity: number;
  }>;
  subtotal: number;
  deliveryCharge: number;
  total: number;
  paymentMethod: OrderPaymentMethod;
}

function toDto(order: OrderDoc): OrderDto {
  return {
    id: order._id.toString(),
    orderId: order.orderId,
    status: order.status,
    paymentMethod: order.paymentMethod,
    customer: {
      firstName: order.customer.firstName,
      lastName: order.customer.lastName,
      phone: order.customer.phone,
      email: order.customer.email,
      district: order.customer.district,
      thana: order.customer.thana,
      address: order.customer.address,
      location: order.customer.location ?? null,
    },
    items: order.items.map((item) => ({
      productId: item.productId,
      title: item.title,
      titleBn: item.titleBn,
      slug: item.slug,
      image: item.image,
      price: item.price,
      quantity: item.quantity,
    })),
    subtotal: order.subtotal,
    deliveryCharge: order.deliveryCharge,
    total: order.total,
    courier: {
      status: order.courier.status,
      consignmentId: order.courier.consignmentId,
      trackingCode: order.courier.trackingCode,
      trackingLink: order.courier.trackingLink,
      invoice: order.courier.invoice,
      error: order.courier.error,
      attemptedAt: order.courier.attemptedAt ?? null,
    },
    createdAt: order.createdAt,
    updatedAt: order.updatedAt,
  };
}

export class OrderService {
  constructor(private readonly steadfast: SteadfastService) {}

  async createOrder(input: OrderCreateInput): Promise<OrderDto> {
    const orderId = await this.uniqueOrderId();

    const order = new OrderModel({
      orderId,
      customer: {
        firstName: input.customer.firstName,
        lastName: input.customer.lastName,
        phone: input.customer.phone,
        email: input.customer.email ?? '',
        district: input.customer.district,
        thana: input.customer.thana,
        address: input.customer.address,
        location: input.customer.location ?? null,
      },
      items: input.items.map((item) => ({
        productId: item.productId,
        title: item.title,
        titleBn: item.titleBn ?? '',
        slug: item.slug ?? '',
        image: item.image ?? '',
        price: item.price,
        quantity: item.quantity,
      })),
      subtotal: input.subtotal,
      deliveryCharge: input.deliveryCharge,
      total: input.total,
      paymentMethod: input.paymentMethod,
    });

    await order.save();
    await this.attachCourier(order);

    return toDto(order);
  }

  async listOrders(input: OrderListInput): Promise<OrderListResponse> {
    const page = input.page && input.page > 0 ? Math.floor(input.page) : 1;
    const limit = input.limit && input.limit > 0 ? Math.min(Math.floor(input.limit), 100) : 20;

    const filter: Record<string, unknown> = {};
    if (input.status) {
      filter.status = input.status;
    }
    if (input.q) {
      const q = input.q.trim();
      const phoneOnly = /^\+?[0-9]{6,}$/.test(q);
      if (phoneOnly) {
        filter['customer.phone'] = { $regex: q.replace(/[+\s-]/g, ''), $options: 'i' };
      } else {
        filter.$or = [
          { orderId: { $regex: q, $options: 'i' } },
          { 'customer.firstName': { $regex: q, $options: 'i' } },
          { 'customer.lastName': { $regex: q, $options: 'i' } },
          { 'customer.district': { $regex: q, $options: 'i' } },
        ];
      }
    }

    const [items, total] = await Promise.all([
      OrderModel.find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit),
      OrderModel.countDocuments(filter),
    ]);

    return {
      items: items.map(toDto),
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getOrder(id: string): Promise<OrderDto> {
    const order = await this.findOrderById(id);
    if (!order) throw new AppError(404, 'Order not found', 'ORDER_NOT_FOUND');
    return toDto(order);
  }

  async updateStatus(id: string, status: OrderStatus): Promise<OrderDto> {
    const order = await this.findOrderById(id);
    if (!order) throw new AppError(404, 'Order not found', 'ORDER_NOT_FOUND');

    order.status = status;
    await order.save();
    return toDto(order);
  }

  async retryCourier(id: string): Promise<OrderDto> {
    const order = await this.findOrderById(id);
    if (!order) throw new AppError(404, 'Order not found', 'ORDER_NOT_FOUND');

    await this.attachCourier(order);
    return toDto(order);
  }

  async getStats(): Promise<OrderStatsDto> {
    const [total, pending, confirmed, delivered, cancelled, returned, cod, prepaid, recent] =
      await Promise.all([
        OrderModel.countDocuments(),
        OrderModel.countDocuments({ status: 'pending' }),
        OrderModel.countDocuments({ status: 'confirmed' }),
        OrderModel.countDocuments({ status: 'delivered' }),
        OrderModel.countDocuments({ status: 'cancelled' }),
        OrderModel.countDocuments({ status: 'returned' }),
        OrderModel.countDocuments({ paymentMethod: 'cod' }),
        OrderModel.countDocuments({ paymentMethod: { $in: ['bkash', 'nagad'] } }),
        OrderModel.find().sort({ createdAt: -1 }).limit(5),
      ]);

    const revenueAgg = await OrderModel.aggregate<{ total: number }>([
      { $match: { status: { $nin: ['cancelled', 'returned'] } } },
      { $group: { _id: null, total: { $sum: '$total' } } },
    ]);

    return {
      totals: {
        orders: total,
        pending,
        confirmed,
        delivered,
        cancelled,
        returned,
        cod,
        prepaid,
        revenue: Math.round((revenueAgg[0]?.total ?? 0) * 100) / 100,
      },
      recent: recent.map(toDto),
    };
  }

  private async attachCourier(order: OrderDoc): Promise<void> {
    order.courier = {
      status: 'pending',
      consignmentId: '',
      trackingCode: '',
      trackingLink: '',
      invoice: '',
      error: '',
      attemptedAt: new Date(),
    };

    const codAmount = order.paymentMethod === 'cod' ? order.total : 0;
    const itemsSummary = order.items.map((item) => `${item.quantity} x ${item.title}`).join(', ');

    try {
      const consignment = await this.steadfast.createConsignment({
        invoice: order.orderId,
        recipientName: `${order.customer.firstName} ${order.customer.lastName}`.trim(),
        recipientPhone: order.customer.phone,
        recipientAddress: `${order.customer.address}, ${order.customer.thana}, ${order.customer.district}`,
        codAmount,
        note: itemsSummary,
      });
      order.courier = {
        status: 'created',
        consignmentId: consignment.consignmentId,
        trackingCode: consignment.trackingCode,
        trackingLink: consignment.trackingLink,
        invoice: consignment.invoice,
        error: '',
        attemptedAt: new Date(),
      };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Courier order creation failed';
      if (err instanceof AppError && err.code === 'STEADFAST_NOT_CONFIGURED') {
        order.courier.status = 'not_configured';
      } else {
        order.courier.status = 'failed';
      }
      order.courier.error = message;
    }

    await order.save();
  }

  private async findOrderById(id: string): Promise<OrderDoc | null> {
    if (Types.ObjectId.isValid(id)) {
      const byId = await OrderModel.findById(id);
      if (byId) return byId;
    }
    return OrderModel.findOne({ orderId: id });
  }

  private async uniqueOrderId(): Promise<string> {
    for (let i = 0; i < 1000; i++) {
      const candidate = `AF-${Math.floor(100000 + Math.random() * 900000)}`;
      const existing = await OrderModel.findOne({ orderId: candidate }).select('_id');
      if (!existing) return candidate;
    }
    throw new AppError(500, 'Could not generate a unique order id', 'ORDER_ID_GENERATION');
  }
}
