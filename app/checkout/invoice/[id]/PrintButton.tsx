'use client';

import { useState } from 'react';
import { Download, Loader2 } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export interface InvoiceData {
  referenceId: string;
  companyName: string;
  locationName: string;
  invoiceDate: string;
  dueDate: string;
  status: string;
  totalAmount: number;
  billingText: string;
  lineItems: { name: string; amount: number }[];
}

function formatRupiah(value: number) {
  return `Rp ${new Intl.NumberFormat('id-ID').format(value)}`;
}

function generateInvoice(data: InvoiceData) {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'pt', format: 'a4' });

  const invoiceDate = new Date(data.invoiceDate);
  const dueDate = new Date(data.dueDate);
  const fmt = (d: Date) =>
    d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

  const pageW = doc.internal.pageSize.getWidth();
  const marginL = 40;
  const marginR = 40;
  const contentW = pageW - marginL - marginR;

  // ─── Colors ────────────────────────────────────────────────
  const orange = '#FF6600';
  const black = '#111827';
  const darkGray = '#374151';
  const gray = '#6B7280';

  // ─── Header ────────────────────────────────────────────────
  // "Invoice" title — left
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.setTextColor(black);
  doc.text('Invoice', marginL, 54);

  // "FRAMR STUDIO" — right, orange
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(orange);
  doc.text('FRAMR STUDIO', pageW - marginR, 54, { align: 'right' });

  // ─── Invoice meta grid ─────────────────────────────────────
  let y = 78;
  const labelX = marginL;
  const valueX = marginL + 100;

  const metaRows = [
    { label: 'Invoice number', value: data.referenceId },
    { label: 'Date of issue', value: fmt(invoiceDate) },
    { label: 'Date due', value: fmt(dueDate) },
  ];

  metaRows.forEach(({ label, value }) => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(darkGray);
    doc.text(label, labelX, y);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(gray);
    doc.text(value, valueX, y);

    y += 14;
  });

  // ─── Two-column addresses ──────────────────────────────────
  y += 14;
  const col2X = marginL + contentW / 2;

  // Left col — "Framr Studio, Inc."
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(black);
  doc.text('Framr Studio, Inc.', labelX, y);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(gray);
  doc.text('Jakarta Selatan, Indonesia', labelX, y + 13);
  doc.text('billing@framr.studio', labelX, y + 26);

  // Right col — "Bill to"
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(black);
  doc.text(data.companyName.toUpperCase(), col2X, y);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(gray);
  doc.text(data.locationName || '', col2X, y + 13);

  y += 52;

  // ─── Amount due line ───────────────────────────────────────
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(black);
  doc.text(`${formatRupiah(data.totalAmount)} due ${fmt(dueDate)}`, labelX, y);

  // Status inline badge
  const isPaid = data.status === 'PAID';
  const badgeLabel = isPaid ? 'PAID' : 'PENDING';
  const badgeColor = isPaid ? '#10B981' : '#D97706';
  const headingW = doc.getTextWidth(`${formatRupiah(data.totalAmount)} due ${fmt(dueDate)}`);
  const badgeX = labelX + headingW + 8;
  doc.setFillColor(isPaid ? '#D1FAE5' : '#FEF3C7');
  doc.roundedRect(badgeX, y - 10, 36, 13, 2, 2, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(badgeColor);
  doc.text(badgeLabel, badgeX + 18, y - 0.5, { align: 'center' });

  y += 24;

  // ─── Line items table (autotable) ─────────────────────────
  const rows = data.lineItems.map((item) => [
    item.name + `\n${data.billingText}`,
    '1',
    formatRupiah(item.amount),
    formatRupiah(item.amount),
  ]);

  autoTable(doc, {
    startY: y,
    margin: { left: marginL, right: marginR },
    head: [['Description', 'Qty', 'Unit Price', 'Amount']],
    body: rows,
    theme: 'plain',
    styles: {
      font: 'helvetica',
      fontSize: 9,
      textColor: darkGray,
      cellPadding: { top: 7, bottom: 7, left: 2, right: 2 },
    },
    headStyles: {
      fontStyle: 'bold',
      fontSize: 9,
      textColor: gray,
      fillColor: false,
      lineWidth: { bottom: 0.5 },
      lineColor: black,
    },
    columnStyles: {
      0: { cellWidth: 'auto', halign: 'left' },
      1: { cellWidth: 36, halign: 'right' },
      2: { cellWidth: 80, halign: 'right' },
      3: { cellWidth: 80, halign: 'right' },
    },
    // Bottom border only on last row
    didDrawCell: (hookData) => {
      const isLastRow = hookData.row.index === rows.length - 1;
      if (hookData.section === 'body' && isLastRow) {
        const { x, y: cellY, width, height } = hookData.cell;
        doc.setDrawColor(black);
        doc.setLineWidth(0.5);
        doc.line(x, cellY + height, x + width, cellY + height);
      }
    },
  });

  const tableEndY = (doc as any).lastAutoTable.finalY;

  // ─── Totals block ──────────────────────────────────────────
  let totY = tableEndY + 16;
  const totLabelX = pageW - marginR - 180;
  const totValX = pageW - marginR;

  const drawTotalRow = (label: string, value: string, bold = false) => {
    doc.setFont('helvetica', bold ? 'bold' : 'normal');
    doc.setFontSize(bold ? 10 : 9);
    doc.setTextColor(bold ? black : gray);
    doc.text(label, totLabelX, totY);
    doc.text(value, totValX, totY, { align: 'right' });
    totY += 15;
  };

  drawTotalRow('Subtotal', formatRupiah(data.totalAmount));
  drawTotalRow('PPN (0%)', 'Rp 0');

  doc.setDrawColor(black);
  doc.setLineWidth(0.75);
  doc.line(totLabelX, totY, totValX, totY);
  totY += 10;
  drawTotalRow('Amount due', formatRupiah(data.totalAmount), true);

  // ─── Footer ──────────────────────────────────────────────
  const footerY = doc.internal.pageSize.getHeight() - 40;
  doc.setDrawColor('#E5E7EB');
  doc.setLineWidth(0.5);
  doc.line(marginL, footerY, pageW - marginR, footerY);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(gray);
  doc.text(
    'For billing questions or disputes, visit ',
    marginL,
    footerY + 14
  );
  const prefixW = doc.getTextWidth('For billing questions or disputes, visit ');
  doc.setTextColor(orange);
  doc.textWithLink('https://dash.framr.studio/support', marginL + prefixW, footerY + 14, {
    url: 'https://dash.framr.studio/support',
  });

  doc.save(`invoice-${data.referenceId}.pdf`);
}

export function PrintButton({ invoiceData }: { invoiceData: InvoiceData }) {
  const [loading, setLoading] = useState(false);

  const handleDownload = () => {
    setLoading(true);
    try {
      generateInvoice(invoiceData);
    } catch (err) {
      console.error('PDF generation failed', err);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleDownload}
      disabled={loading}
      className="mt-10 flex h-12 w-48 items-center justify-center gap-2 rounded-xl bg-gray-900 font-semibold text-white transition-all hover:bg-gray-700 hover:shadow-lg hover:shadow-black/15 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
    >
      {loading ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          Generating...
        </>
      ) : (
        <>
          <Download className="h-4 w-4" />
          Download PDF
        </>
      )}
    </button>
  );
}
