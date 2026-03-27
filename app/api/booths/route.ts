import { NextResponse, NextRequest } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { supabase } from "@/lib/supabase-server";
import { getOrCreateOrganization } from "@/lib/org-helper";

export async function POST(req: NextRequest) {
  try {
    const { userId, orgId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const body = await req.json();
    const { name, booth_code, location, company } = body;

    if (!name || !booth_code || !location) {
      return NextResponse.json({ error: "Missing required booth details" }, { status: 400 });
    }

    const finalOrgId = await getOrCreateOrganization(userId, orgId, company);

    const { data: newBooth, error: insertError } = await supabase
      .from('booths')
      .insert({
        name,
        booth_code,
        location,
        organization_id: finalOrgId,
        created_by: userId,
        price: 0,
      } as any)
      .select('id, name, booth_code')
      .single();

    if (insertError) {
      console.error("/api/booths POST insert error", insertError);
      return NextResponse.json({ error: `Failed to create new booth: ${insertError.message}` }, { status: 500 });
    }

    return NextResponse.json({ booth: newBooth });

  } catch (err: any) {
    console.error("/api/booths POST error", err);
    return NextResponse.json({
      error: err.message || "Internal server error"
    }, { status: 500 });
  }
}
