export type PlanItem = {
  name: string;
  description: string;
  amount: number;
  note: string;
};

export type AddonItem = {
  name: string;
  description: string;
  amount: number;
};

export const PLAN_ITEMS: Record<string, PlanItem> = {
  growth: {
    name: 'Growth Plan',
    description: 'Perfect for solo operators starting their first booth business.',
    amount: 350000,
    note: 'Billed annually. Cancel anytime.',
  },
  professional: {
    name: 'Professional Plan',
    description: 'Best for growing studios with high event volume and premium needs.',
    amount: 650000,
    note: 'Billed annually. Cancel anytime.',
  },
  'panoramic-plus': {
    name: 'Panoramic+ Plan',
    description: 'Enterprise-ready package for 360° experiences and white-label operations.',
    amount: 800000,
    note: 'Billed annually. Contact sales after checkout for onboarding.',
  },
};

export const ADDON_ITEMS: Record<string, AddonItem> = {
  'voucher-system': {
    name: 'Voucher System Add-on',
    description: 'Generate and validate vouchers for promo campaigns in your booth flow.',
    amount: 500000,
  },
  'live-mode-streaming': {
    name: 'Live Mode Streaming Add-on',
    description: 'Display the running photobooth gallery on external screens in real time.',
    amount: 1000000,
  },
  'multiangle-view': {
    name: 'Multiangle View Add-on',
    description: 'Capture synchronized outputs from multiple cameras for immersive results.',
    amount: 1500000,
  },
};

export const PLAN_KEYS = ['growth', 'professional', 'panoramic-plus'];
export const ADDON_KEYS = ['voucher-system', 'live-mode-streaming', 'multiangle-view'];
