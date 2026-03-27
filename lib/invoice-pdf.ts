/**
 * Server-side invoice PDF generator using jsPDF.
 * This version is Edge-compatible (universal).
 * Returns an ArrayBuffer containing the PDF bytes.
 */

import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { PLAN_ITEMS, ADDON_ITEMS } from '@/lib/pricing';

function formatRupiah(value: number) {
  return `Rp ${new Intl.NumberFormat('id-ID').format(value)}`;
}

export interface InvoiceRecord {
  id: string;
  reference_id: string;
  plan_key: string;
  addons: string[];
  billing_cycle: string; 
  total_amount: number;
  status: string;
  created_at: string;
  expires_at: string;
  organization?: { name: string } | null;
  booth?: { location: string } | null;
}

export async function generateInvoicePdf(invoice: InvoiceRecord): Promise<ArrayBuffer> {
  const doc = new jsPDF();
  
  const companyName = invoice.organization?.name ?? 'Personal';
  const locationName = invoice.booth?.location ?? '';
  const invoiceDate = new Date(invoice.created_at);
  const dueDate = new Date(invoice.expires_at);
  const billingText = invoice.billing_cycle === 'annual' ? '1 Year (Annual)' : '4 Months';

  const fmt = (d: Date) =>
    d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

  // Build line items
  const planItem = PLAN_ITEMS[invoice.plan_key];
  const addonItemsMeta = (invoice.addons || [])
    .map((key) => ADDON_ITEMS[key])
    .filter(Boolean);

  const totalAddonAmount = addonItemsMeta.reduce(
    (sum, a) => sum + a.amount * (invoice.billing_cycle === 'annual' ? 12 * 0.8 : 4),
    0
  );
  const planAmount = invoice.total_amount - totalAddonAmount;

  const tableData = [
    [
      planItem?.name ?? 'Subscription Plan',
      billingText,
      '1',
      formatRupiah(planAmount),
      formatRupiah(planAmount),
    ],
    ...addonItemsMeta.map((a) => {
      const amt = a.amount * (invoice.billing_cycle === 'annual' ? 12 * 0.8 : 4);
      return [a.name, billingText, '1', formatRupiah(amt), formatRupiah(amt)];
    }),
  ];

  const orange = '#FF6600';
  const black = '#111827';
  const gray = '#6B7280';

  // ── Header ──────────────────────────────────────────────
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.setTextColor(black);
  doc.text('Invoice', 20, 25);

  doc.setTextColor(orange);
  doc.setFontSize(14);
  doc.text('FRAMR STUDIO', 190, 25, { align: 'right' });
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(gray);
  doc.text('photobooth platform', 190, 30, { align: 'right' });

  // Status Badge
  const isPaid = invoice.status === 'PAID';
  doc.setFillColor(isPaid ? '#D1FAE5' : '#FEF3C7');
  doc.roundedRect(165, 35, 25, 6, 1, 1, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(isPaid ? '#10B981' : '#D97706');
  doc.text(isPaid ? 'PAID' : 'PENDING', 177.5, 39.5, { align: 'center' });

  // ── Invoice Meta ────────────────────────────────────────
  doc.setFontSize(8.5);
  doc.setTextColor(gray);
  doc.text('Invoice number', 20, 45);
  doc.text('Date of issue', 20, 52);
  doc.text('Date due', 20, 59);

  doc.setTextColor(black);
  doc.setFont('helvetica', 'normal');
  doc.text(invoice.reference_id, 55, 45);
  doc.text(fmt(invoiceDate), 55, 52);
  doc.text(fmt(dueDate), 55, 59);

  // Divider
  doc.setDrawColor('#E5E7EB');
  doc.setLineWidth(0.1);
  doc.line(20, 65, 190, 65);

  // ── Two-column addresses ────────────────────────────────
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(gray);
  doc.text('FROM', 20, 75);
  doc.text('BILL TO', 110, 75);

  doc.setFontSize(10);
  doc.setTextColor(black);
  doc.text('Framr Studio, Inc.', 20, 82);
  doc.text(companyName.toUpperCase(), 110, 82);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(gray);
  doc.text(['Jakarta Selatan, Indonesia', 'billing@framr.studio'], 20, 89);
  doc.text(locationName, 110, 89);

  // ── Amount Due Heading ──────────────────────────────────
  doc.line(20, 110, 190, 110);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(black);
  doc.text(`${formatRupiah(invoice.total_amount)} due ${fmt(dueDate)}`, 20, 120);

  // ── Table ───────────────────────────────────────────────
  autoTable(doc, {
    startY: 130,
    head: [['DESCRIPTION', 'PERIOD', 'QTY', 'UNIT PRICE', 'AMOUNT']],
    body: tableData,
    theme: 'plain',
    headStyles: {
      fillColor: '#F9FAFB',
      textColor: gray,
      fontSize: 8,
      fontStyle: 'bold',
      cellPadding: 4,
    },
    bodyStyles: {
      textColor: black,
      fontSize: 9,
      cellPadding: 4,
    },
    columnStyles: {
      0: { cellWidth: 80 },
      1: { cellWidth: 35 },
      2: { cellWidth: 15, halign: 'center' },
      3: { cellWidth: 30, halign: 'right' },
      4: { cellWidth: 30, halign: 'right' },
    },
  });

  // ── Totals ──────────────────────────────────────────────
  const finalY = (doc as any).lastAutoTable.finalY + 10;
  doc.setFontSize(9);
  doc.setTextColor(gray);
  doc.text('Subtotal', 140, finalY);
  doc.text(formatRupiah(invoice.total_amount), 190, finalY, { align: 'right' });

  doc.text('PPN (0%)', 140, finalY + 7);
  doc.text('Rp 0', 190, finalY + 7, { align: 'right' });

  doc.setDrawColor(black);
  doc.setLineWidth(0.5);
  doc.line(140, finalY + 10, 190, finalY + 10);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(black);
  doc.text('Amount due', 140, finalY + 16);
  doc.text(formatRupiah(invoice.total_amount), 190, finalY + 16, { align: 'right' });

  // ── Footer ──────────────────────────────────────────────
  doc.setDrawColor('#E5E7EB');
  doc.setLineWidth(0.2);
  doc.line(20, 275, 190, 275);
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(gray);
  doc.text('For billing questions visit https://dash.framr.studio/support', 20, 282);

  return doc.output('arraybuffer');
}
