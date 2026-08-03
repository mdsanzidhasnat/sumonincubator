import { env } from '../config/env.js';
import { AppError } from '../errors/app-error.js';

export interface SteadfastConsignment {
  consignmentId: string;
  trackingCode: string;
  trackingLink: string;
  invoice: string;
}

export interface SteadfastOrderInput {
  invoice: string;
  recipientName: string;
  recipientPhone: string;
  recipientAddress: string;
  codAmount: number;
  note?: string;
}

interface SteadfastConsignmentResponse {
  consignment_id: string | number;
  tracking_code: string;
  tracking_link?: string;
  invoice: string;
}

interface SteadfastResponse {
  status?: number;
  message?: string;
  errors?: Record<string, string[] | string>;
  consignment?: SteadfastConsignmentResponse;
}

function extractErrorMessage(json: SteadfastResponse): string {
  if (typeof json?.message === 'string' && json.message.trim()) {
    return json.message;
  }
  if (json?.errors) {
    const parts: string[] = [];
    for (const [field, value] of Object.entries(json.errors)) {
      const messages = Array.isArray(value) ? value : [value];
      for (const message of messages) {
        parts.push(String(message));
      }
    }
    if (parts.length > 0) return parts.join('; ');
  }
  return '';
}

export class SteadfastService {
  isConfigured(): boolean {
    return Boolean(env.STEADFAST_API_KEY && env.STEADFAST_SECRET_KEY);
  }

  async createConsignment(input: SteadfastOrderInput): Promise<SteadfastConsignment> {
    if (!this.isConfigured()) {
      throw new AppError(400, 'Steadfast is not configured', 'STEADFAST_NOT_CONFIGURED');
    }

    let response: Response;
    try {
      response = await fetch(`${env.STEADFAST_BASE_URL}/create_order`, {
        method: 'POST',
        headers: {
          'Api-Key': env.STEADFAST_API_KEY as string,
          'Secret-Key': env.STEADFAST_SECRET_KEY as string,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          invoice: input.invoice,
          recipient_name: input.recipientName,
          recipient_phone: input.recipientPhone,
          recipient_address: input.recipientAddress,
          cod_amount: input.codAmount,
          ...(input.note ? { note: input.note } : {}),
        }),
      });
    } catch (err) {
      throw new AppError(
        502,
        'Steadfast courier service is unreachable',
        'STEADFAST_NETWORK_ERROR',
      );
    }

    const json = (await response.json().catch(() => ({}))) as SteadfastResponse;

    const consignment = json?.consignment;
    if (json?.status === 200 && consignment?.consignment_id && consignment?.tracking_code) {
      return {
        consignmentId: String(consignment.consignment_id),
        trackingCode: consignment.tracking_code,
        trackingLink: consignment.tracking_link ?? '',
        invoice: consignment.invoice,
      };
    }

    const message = extractErrorMessage(json) || `Steadfast returned status ${json?.status ?? response.status}`;
    throw new AppError(502, message, 'STEADFAST_API_ERROR');
  }
}

