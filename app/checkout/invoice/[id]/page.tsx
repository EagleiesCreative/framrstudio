import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ChevronLeft, Clock, CheckCircle2 } from 'lucide-react';
import { PLAN_ITEMS, ADDON_ITEMS } from '@/lib/pricing';
import { supabase } from '@/lib/supabase-server';
import { PrintButton } from './PrintButton';

function formatRupiah(value: number) {
  return `Rp ${new Intl.NumberFormat('id-ID').format(value)}`;
}

export default async function InvoicePage(props: { 
  params: Promise<{ id: string }>;
  searchParams: Promise<{ payment_status?: string }>;
}) {
  const { id } = await props.params;
  const { payment_status } = await props.searchParams;

  // Fetch invoice securely from Supabase
  const { data: invoice } = await (supabase as any)
    .from('invoices')
    .select(`
      *,
      organization:organizations(name),
      booth:booths(location)
    `)
    .eq('id', id)
    .single();

  if (!invoice) {
    notFound();
  }

  const invoiceDate = new Date(invoice.created_at);
  const dueDate = new Date(invoice.expires_at);
  const now = new Date();
  
  // Optimistically assume paid if the redirect says so, to account for webhook delay
  const isOptimisticPaid = payment_status === 'success';
  const displayStatus = isOptimisticPaid ? 'PAID' : invoice.status;
  
  const isExpired = now > dueDate && displayStatus !== 'PAID';

  const planName = PLAN_ITEMS[invoice.plan_key]?.name || 'Subscription Plan';
  
  // Reconstruct items safely
  const discountedPlanAmount = invoice.total_amount - (invoice.addons || []).reduce((sum: number, addonKey: string) => sum + (ADDON_ITEMS[addonKey]?.amount || 0) * (invoice.billing_cycle === 'annual' ? 12 * 0.8 : 4), 0);
  
  const mainPlanItem = {
    name: planName,
    net_unit_amount: discountedPlanAmount,
  };

  const addonItems = (invoice.addons || []).map((addonKey: string) => {
    const addon = ADDON_ITEMS[addonKey];
    return {
      name: addon?.name || addonKey,
      net_unit_amount: (addon?.amount || 0) * (invoice.billing_cycle === 'annual' ? 12 * 0.8 : 4) // Simplified calculation matching checkout logic
    };
  });

  const totalAddonAmount = addonItems.reduce((sum: number, item: any) => sum + item.net_unit_amount, 0);
  const billingText = invoice.billing_cycle === 'annual' ? '1 Tahun' : '4 Bulan';

  const companyName = invoice.organization?.name || 'Personal';
  const locationName = invoice.booth?.location || 'N/A';

  return (
      <div className="invoice-web-root min-h-screen bg-[#f9fafb] text-gray-900 selection:bg-[var(--accent)] selection:text-white pb-20 print:hidden">
        {/* Header Section */}
        <header className="mx-auto max-w-[1200px] px-6 pb-8 pt-16">
          <Link href="/checkout" className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors mb-8">
            <ChevronLeft className="h-4 w-4" />
            Back to Checkout
          </Link>
          <h1 className="mb-4 font-[var(--font-syne)] text-4xl font-bold tracking-tight text-gray-900">Invoice</h1>
          <p className="max-w-md text-gray-500 text-[15px] leading-relaxed">
            Please review the details below. This invoice is generated automatically and serves as a formal request for payment.
          </p>
        </header>

        {/* Invoice Content */}
        <main className="mx-auto max-w-[1200px] px-6">
          {payment_status === 'success' && (
            <div className="mb-8 rounded-xl border border-green-200 bg-green-50 p-4 text-green-800 flex items-center gap-3">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              <p className="font-medium">Payment completed successfully! Your subscription is now active.</p>
            </div>
          )}
          {payment_status === 'failed' && (
            <div className="mb-8 rounded-xl border border-red-200 bg-red-50 p-4 text-red-800 flex items-center gap-3">
              <Clock className="h-5 w-5 text-red-600" />
              <p className="font-medium">Payment processing failed or was cancelled. Please try again.</p>
            </div>
          )}
          {isExpired && !isOptimisticPaid && (
            <div className="mb-8 rounded-xl border border-red-200 bg-red-50 p-4 text-red-800 flex items-center gap-3">
              <Clock className="h-5 w-5 text-red-600" />
              <p className="font-medium">This invoice has expired. Please create a new checkout session.</p>
            </div>
          )}

          <div className="grid grid-cols-[1fr_400px] gap-8 max-[1024px]:grid-cols-1">
            {/* Left Column - Invoice Details */}
            <div className="rounded-2xl bg-white p-8 sm:p-10 shadow-sm ring-1 ring-gray-200">
              {/* Top Bar */}
              <div className="mb-10 flex items-center justify-between border-b border-gray-100 pb-8">
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Invoice No.</span>
                  <span className="font-mono text-sm font-medium text-gray-900">{invoice.reference_id}</span>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Status</span>
                  <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider ${
                    displayStatus === 'PAID' ? 'bg-green-100 text-green-700' : 
                    isExpired ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'
                  }`}>
                    {displayStatus === 'PAID' ? <CheckCircle2 className="h-3.5 w-3.5" /> : null}
                    {isExpired ? 'Expired' : displayStatus}
                  </span>
                </div>
              </div>

              {/* To & Dates */}
              <div className="mb-12 grid grid-cols-2 gap-8 max-[640px]:grid-cols-1">
                <div>
                  <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-gray-400">Billed To</h3>
                  <div className="text-[15px] leading-relaxed text-gray-700">
                    <p className="font-bold text-gray-900 text-lg">{companyName}</p>
                    <p className="mt-1">{locationName}</p>
                  </div>
                </div>
                <div className="flex flex-col gap-4 text-[14px]">
                  <div>
                    <h3 className="mb-1 text-xs font-bold uppercase tracking-wider text-gray-400">Date Issued</h3>
                    <p className="font-medium text-gray-900">{invoiceDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                  </div>
                  <div>
                    <h3 className="mb-1 text-xs font-bold uppercase tracking-wider text-gray-400">Valid Until</h3>
                    <p className="font-medium text-gray-900">{dueDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                  </div>
                </div>
              </div>

              {/* Items Table */}
              <div className="mb-10 overflow-hidden rounded-xl border border-gray-200 bg-white">
                <table className="w-full text-left text-[14px]">
                  <thead className="border-b border-gray-200 bg-gray-50/50 uppercase text-gray-500 text-xs">
                    <tr>
                      <th className="px-6 py-4 font-bold tracking-wider">Description</th>
                      <th className="px-6 py-4 font-bold tracking-wider">Period</th>
                      <th className="px-6 py-4 text-right font-bold tracking-wider">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100/80 text-gray-600">
                    <tr>
                      <td className="px-6 py-4 font-medium text-gray-900">{mainPlanItem.name}</td>
                      <td className="px-6 py-4">{billingText}</td>
                      <td className="px-6 py-4 text-right font-medium text-gray-900">{formatRupiah(mainPlanItem.net_unit_amount)}</td>
                    </tr>
                    {addonItems.map((item: any, i: number) => (
                      <tr key={i}>
                        <td className="px-6 py-4 font-medium text-gray-900">{item.name}</td>
                        <td className="px-6 py-4">{billingText}</td>
                        <td className="px-6 py-4 text-right font-medium text-gray-900">{formatRupiah(item.net_unit_amount)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Totals */}
              <div className="flex justify-end">
                <div className="w-72 space-y-4 text-[14px]">
                  <div className="flex justify-between font-medium text-gray-600">
                    <span>Subtotal</span>
                    <span className="text-gray-900">{formatRupiah(invoice.total_amount)}</span>
                  </div>
                  <div className="flex justify-between font-medium text-gray-600">
                    <span>PPN (0%)</span>
                    <span className="text-gray-900">Rp 0</span>
                  </div>
                  <div className="my-4 border-t border-gray-200 border-dashed"></div>
                  <div className="flex justify-between items-center text-xl font-bold tracking-tight text-gray-900">
                    <span>Total</span>
                    <span className="text-[var(--accent)]">{formatRupiah(invoice.total_amount)}</span>
                  </div>
                </div>
              </div>

              <PrintButton invoiceData={{
                referenceId: invoice.reference_id,
                companyName,
                locationName,
                invoiceDate: invoice.created_at,
                dueDate: invoice.expires_at,
                status: displayStatus,
                totalAmount: invoice.total_amount,
                billingText,
                lineItems: [
                  { name: mainPlanItem.name, amount: mainPlanItem.net_unit_amount },
                  ...addonItems.map((a: any) => ({ name: a.name, amount: a.net_unit_amount })),
                ],
              }} />
            </div>

            {/* Right Column - Order Summary Box */}
            <div className="h-fit rounded-2xl bg-white p-8 shadow-sm ring-1 ring-gray-200">
              <h2 className="mb-8 font-[var(--font-syne)] text-xl font-bold tracking-tight text-gray-900">Summary</h2>
              
              <div className="space-y-6">
                <div className="flex justify-between gap-4 border-b border-gray-100 pb-6 text-sm">
                  <span className="font-semibold text-gray-700">{planName}</span>
                  <span className="font-medium text-gray-900">{formatRupiah(mainPlanItem.net_unit_amount)}</span>
                </div>
                
                <div className="flex justify-between gap-4 border-b border-gray-100 pb-6 text-sm">
                  <span className="font-semibold text-gray-700">Total Add-on</span>
                  <span className="font-medium text-gray-900">{formatRupiah(totalAddonAmount)}</span>
                </div>
                
                <div className="flex items-end justify-between pt-2">
                  <span className="font-bold text-gray-500 text-sm uppercase tracking-wider">Total</span>
                  <span className="font-[var(--font-syne)] text-2xl font-bold tracking-tight text-gray-900">{formatRupiah(invoice.total_amount)}</span>
                </div>
              </div>

              <div className="mt-10 flex flex-col gap-4">
                <a 
                  href={invoice.checkout_url}
                  className={`flex h-[52px] w-full items-center justify-center rounded-xl text-[15px] font-bold transition-all active:scale-[0.98] ${
                    isExpired || displayStatus === 'PAID'
                      ? 'bg-gray-200 text-gray-400 pointer-events-none'
                      : 'bg-black text-white hover:bg-gray-800 hover:shadow-lg hover:shadow-black/10'
                  }`}
                >
                  {displayStatus === 'PAID' ? 'Already Paid' : (isExpired ? 'Invoice Expired' : 'Proceed to Payment')}
                </a>
                <Link
                  href="/dashboard"
                  className="flex h-[52px] w-full items-center justify-center rounded-xl text-sm font-bold text-gray-600 transition-colors hover:bg-gray-50 hover:text-gray-900"
                >
                  Return to Dashboard
                </Link>
              </div>
            </div>
          </div>
        </main>
      </div>
  );
}
