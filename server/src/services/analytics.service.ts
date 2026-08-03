import { AnalyticsEventModel } from '../models/analytics.model.js';

export interface TrackEventInput {
  sessionId: string;
  path: string;
  title?: string;
  referrer?: string;
  ip: string;
  userAgent: string;
}

export interface AnalyticsEventDto {
  id: string;
  sessionId: string;
  path: string;
  title: string;
  referrer: string;
  ip: string;
  deviceType: string;
  browser: string;
  createdAt: Date;
}

export interface AnalyticsListInput {
  page?: number;
  limit?: number;
  path?: string;
  deviceType?: string;
}

export interface AnalyticsListResponse {
  items: AnalyticsEventDto[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface AnalyticsStatsDto {
  totals: {
    pageViews: number;
    uniqueVisitors: number;
    todayViews: number;
    todayVisitors: number;
    onlineNow: number;
  };
  topPages: Array<{ path: string; views: number; visitors: number }>;
  byDevice: Array<{ deviceType: string; count: number }>;
  recent: AnalyticsEventDto[];
}

const ONLINE_WINDOW_SECONDS = 5 * 60;

function toDto(doc: {
  _id: unknown;
  sessionId: string;
  path: string;
  title?: string;
  referrer?: string;
  ip?: string;
  deviceType?: string;
  browser?: string;
  createdAt?: Date;
}): AnalyticsEventDto {
  return {
    id: String(doc._id),
    sessionId: doc.sessionId,
    path: doc.path,
    title: doc.title ?? '',
    referrer: doc.referrer ?? '',
    ip: doc.ip ?? '',
    deviceType: doc.deviceType ?? 'desktop',
    browser: doc.browser ?? 'unknown',
    createdAt: doc.createdAt ?? new Date(),
  };
}

function parseDeviceType(userAgent: string): string {
  if (/Mobi|Android|iPhone|iPad|iPod/i.test(userAgent)) {
    if (/iPad|Tablet/i.test(userAgent)) return 'tablet';
    return 'mobile';
  }
  if (/Tablet/i.test(userAgent)) return 'tablet';
  return 'desktop';
}

function parseBrowser(userAgent: string): string {
  const ua = userAgent;
  if (/Edg\//.test(ua)) return 'Edge';
  if (/OPR\/|Opera/.test(ua)) return 'Opera';
  if (/SamsungBrowser/.test(ua)) return 'Samsung Internet';
  if (/Chrome\//.test(ua)) return 'Chrome';
  if (/Firefox\//.test(ua)) return 'Firefox';
  if (/Safari\//.test(ua)) return 'Safari';
  if (/MSIE|Trident/.test(ua)) return 'IE';
  return 'unknown';
}

function startOfToday(): Date {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

export class AnalyticsService {
  async track(input: TrackEventInput): Promise<void> {
    const userAgent = input.userAgent || 'unknown';
    await AnalyticsEventModel.create({
      sessionId: input.sessionId,
      path: input.path,
      title: input.title ?? '',
      referrer: input.referrer ?? '',
      ip: input.ip,
      userAgent,
      deviceType: parseDeviceType(userAgent),
      browser: parseBrowser(userAgent),
      createdAt: new Date(),
    });
  }

  async listEvents(input: AnalyticsListInput = {}): Promise<AnalyticsListResponse> {
    const page = input.page ?? 1;
    const limit = input.limit ?? 20;

    const filter: Record<string, unknown> = {};
    if (input.path) filter.path = input.path;
    if (input.deviceType) filter.deviceType = input.deviceType;

    const [total, items] = await Promise.all([
      AnalyticsEventModel.countDocuments(filter),
      AnalyticsEventModel.find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
    ]);

    return {
      items: items.map(toDto),
      page,
      limit,
      total,
      totalPages: Math.max(1, Math.ceil(total / limit)),
    };
  }

  async getStats(): Promise<AnalyticsStatsDto> {
    const today = startOfToday();
    const onlineSince = new Date(Date.now() - ONLINE_WINDOW_SECONDS * 1000);

    const [pageViews, uniqueVisitors, todayViews, todayVisitors, onlineNow, recent, topPagesAgg, byDeviceAgg] =
      await Promise.all([
        AnalyticsEventModel.countDocuments(),
        AnalyticsEventModel.distinct('sessionId'),
        AnalyticsEventModel.countDocuments({ createdAt: { $gte: today } }),
        AnalyticsEventModel.distinct('sessionId', { createdAt: { $gte: today } }),
        AnalyticsEventModel.distinct('sessionId', { createdAt: { $gte: onlineSince } }),
        AnalyticsEventModel.find().sort({ createdAt: -1 }).limit(8).lean(),
        AnalyticsEventModel.aggregate<{ path: string; views: number; visitors: number }>([
          { $group: { _id: '$path', views: { $sum: 1 }, visitors: { $addToSet: '$sessionId' } } },
          { $project: { path: '$_id', views: 1, visitors: { $size: '$visitors' } } },
          { $sort: { views: -1 } },
          { $limit: 10 },
        ]),
        AnalyticsEventModel.aggregate<{ deviceType: string; count: number }>([
          { $group: { _id: '$deviceType', count: { $sum: 1 } } },
          { $project: { deviceType: '$_id', count: 1 } },
          { $sort: { count: -1 } },
        ]),
      ]);

    return {
      totals: {
        pageViews,
        uniqueVisitors: uniqueVisitors.length,
        todayViews,
        todayVisitors: todayVisitors.length,
        onlineNow: onlineNow.length,
      },
      topPages: topPagesAgg.map((row) => ({ path: row.path, views: row.views, visitors: row.visitors })),
      byDevice: byDeviceAgg.map((row) => ({ deviceType: row.deviceType, count: row.count })),
      recent: recent.map(toDto),
    };
  }
}
