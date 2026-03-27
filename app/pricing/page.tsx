import PricingSection from '@/app/components/site/PricingSection';
import SiteFooter from '@/app/components/site/SiteFooter';
import SiteNav from '@/app/components/site/SiteNav';

export default function PricingPage() {
  return (
    <div>
      <SiteNav isPricingPage />
      <PricingSection id="pricing-page" />
      <SiteFooter />
    </div>
  );
}
