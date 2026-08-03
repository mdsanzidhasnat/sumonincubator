import { Schema, model, type HydratedDocument, type InferSchemaType, type Types } from 'mongoose';

const analyticsEventSchema = new Schema(
  {
    sessionId: { type: String, required: true, index: true },
    path: { type: String, required: true, index: true },
    title: { type: String, default: '' },
    referrer: { type: String, default: '' },
    ip: { type: String, default: '' },
    userAgent: { type: String, default: '' },
    deviceType: { type: String, default: 'desktop' },
    browser: { type: String, default: 'unknown' },
    createdAt: { type: Date, default: Date.now, index: true },
  },
  { timestamps: { createdAt: false, updatedAt: false } },
);

analyticsEventSchema.index({ createdAt: 1 }, { expireAfterSeconds: 60 * 60 * 24 * 30 });
analyticsEventSchema.index({ path: 1, createdAt: -1 });

export type AnalyticsEventSchemaType = InferSchemaType<typeof analyticsEventSchema>;
export type AnalyticsEventDoc = HydratedDocument<AnalyticsEventSchemaType> & {
  _id: Types.ObjectId;
};

export const AnalyticsEventModel = model('AnalyticsEvent', analyticsEventSchema);
