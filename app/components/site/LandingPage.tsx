import CtaSection from './CtaSection';
import FaqSection from './FaqSection';
import FeaturesSection from './FeaturesSection';
import HeroSection from './HeroSection';
import HowItWorksSection from './HowItWorksSection';
import LogosStrip from './LogosStrip';
import PricingSection from './PricingSection';
import SiteFooter from './SiteFooter';
import SiteNav from './SiteNav';
import StatsBand from './StatsBand';
import TestimonialsSection from './TestimonialsSection';

export default function LandingPage() {
  return (
    <div>
      <SiteNav />
      <HeroSection />
      <LogosStrip />
      <FeaturesSection />
      <StatsBand />
      <HowItWorksSection />
      <PricingSection />
      <TestimonialsSection />
      <FaqSection />
      <CtaSection />
      <SiteFooter />
    </div>
  );
}
