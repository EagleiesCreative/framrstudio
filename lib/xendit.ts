import { env } from 'process';

const XENDIT_SECRET_KEY = env.XENDIT_SECRET_KEY || '';
const XENDIT_BASE_URL = 'https://api.xendit.co';

function getAuthHeaders() {
  const encodedKey = Buffer.from(XENDIT_SECRET_KEY + ':').toString('base64');
  return {
    'Content-Type': 'application/json',
    Authorization: `Basic ${encodedKey}`,
  };
}

export type SubscriptionItem = {
  type: string;
  name: string;
  net_unit_amount: number;
  quantity: number;
  description?: string;
};

export type CreateSubscriptionParams = {
  reference_id: string;
  amount: number;
  interval: 'MONTH' | 'YEAR';
  interval_count: number;
  items?: SubscriptionItem[];
  success_return_url?: string;
  failure_return_url?: string;
  customer_id?: string;
};

export async function createSubscriptionPlan(params: CreateSubscriptionParams) {
  const response = await fetch(`${XENDIT_BASE_URL}/recurring/plans`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({
      reference_id: params.reference_id,
      customer_id: params.customer_id,
      recurring_action: 'PAYMENT',
      currency: 'IDR',
      amount: params.amount,
      schedule: {
        reference_id: `schedule-${params.reference_id}`,
        interval: params.interval,
        interval_count: params.interval_count,
        retry_interval: 'DAY',
        retry_interval_count: 1,
        total_retry: 3,
      },
      items: params.items,
      immediate_action_type: 'FULL_AMOUNT',
      success_return_url: params.success_return_url,
      failure_return_url: params.failure_return_url,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Xendit Subscription API Error:', response.status, errorText);
    throw new Error(`Xendit API returned ${response.status}: ${errorText}`);
  }

  return response.json();
}
export async function createOrGetXenditCustomer(params: {
  reference_id: string;
  email: string;
  given_names: string;
}) {
  try {
    // Try to create the customer first
    const response = await fetch(`${XENDIT_BASE_URL}/customers`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({
        reference_id: params.reference_id,
        type: 'INDIVIDUAL',
        individual_detail: {
          given_names: params.given_names,
        },
        email: params.email,
      }),
    });

    if (response.ok) {
      return response.json();
    }

    // If duplicate, fetch by reference_id
    const errBody = await response.json().catch(() => ({}));
    if (errBody?.error_code === 'DUPLICATE_ERROR') {
      const getResponse = await fetch(
        `${XENDIT_BASE_URL}/customers?reference_id=${encodeURIComponent(params.reference_id)}`,
        { headers: getAuthHeaders() }
      );
      if (getResponse.ok) {
        const data = await getResponse.json();
        return Array.isArray(data?.data) ? data.data[0] : data;
      }
    }

    console.error('Failed to create Xendit customer', errBody);
    return null;
  } catch (err) {
    console.error('createOrGetXenditCustomer error', err);
    return null;
  }
}
