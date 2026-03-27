export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase-server';
import { generateInvoicePdf } from '@/lib/invoice-pdf';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const { data: invoice, error } = await (supabase as any)
      .from('invoices')
      .select('*, organization:organizations(name), booth:booths(location)')
      .eq('id', id)
      .single();

    if (error || !invoice) {
      return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
    }

    const pdfBuffer = await generateInvoicePdf(invoice);

    return new NextResponse(pdfBuffer as any, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="invoice-${invoice.reference_id}.pdf"`,
        'Content-Length': String(pdfBuffer.length),
      },
    });
  } catch (err: any) {
    console.error('/api/invoice/[id]/pdf GET error', err);
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
  }
}
