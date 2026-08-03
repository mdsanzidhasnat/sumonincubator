import { Schema, model, type HydratedDocument, type InferSchemaType, type Types } from 'mongoose';

export const ORDER_PAYMENT_METHODS = ['cod', 'bkash', 'nagad'] as const;
export const ORDER_STATUSES = ['pending', 'confirmed', 'delivered', 'cancelled', 'returned'] as const;
export const COURIER_STATUSES = ['pending', 'created', 'failed', 'not_configured'] as const;

export type OrderPaymentMethod = (typeof ORDER_PAYMENT_METHODS)[number];
export type OrderStatus = (typeof ORDER_STATUSES)[number];
export type CourierStatus = (typeof COURIER_STATUSES)[number];

const locationSchema = new Schema(
  {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
  },
  { _id: false },
);

const itemSchema = new Schema(
  {
    productId: { type: String, required: true },
    title: { type: String, required: true },
    titleBn: { type: String, default: '' },
    slug: { type: String, default: '' },
    image: { type: String, default: '' },
    price: { type: Number, required: true, min: 0 },
    quantity: { type: Number, required: true, min: 1 },
  },
  { _id: false },
);

const customerSchema = new Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, default: '' },
    district: { type: String, required: true },
    thana: { type: String, required: true },
    address: { type: String, required: true },
    location: { type: locationSchema, default: null },
  },
  { _id: false },
);

const courierSchema = new Schema(
  {
    status: { type: String, enum: COURIER_STATUSES, default: 'pending' },
    consignmentId: { type: String, default: '' },
    trackingCode: { type: String, default: '' },
    trackingLink: { type: String, default: '' },
    invoice: { type: String, default: '' },
    error: { type: String, default: '' },
    attemptedAt: { type: Date, default: null },
  },
  { _id: false },
);

const orderSchema = new Schema(
  {
    orderId: { type: String, required: true, unique: true },
    customer: { type: customerSchema, required: true },
    items: { type: [itemSchema], default: [] },
    subtotal: { type: Number, required: true, min: 0 },
    deliveryCharge: { type: Number, required: true, min: 0 },
    total: { type: Number, required: true, min: 0 },
    paymentMethod: { type: String, enum: ORDER_PAYMENT_METHODS, required: true },
    status: { type: String, enum: ORDER_STATUSES, default: 'pending' },
    courier: { type: courierSchema, default: () => ({}) },
  },
  { timestamps: true },
);

orderSchema.index({ status: 1 });
orderSchema.index({ createdAt: -1 });
orderSchema.index({ 'customer.phone': 1 });

export type OrderSchemaType = InferSchemaType<typeof orderSchema>;
export type OrderDoc = HydratedDocument<OrderSchemaType> & {
  _id: Types.ObjectId;
};

export const OrderModel = model('Order', orderSchema);
