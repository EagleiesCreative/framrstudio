import { clerkClient } from "@clerk/nextjs/server";
import { syncClerkOrganization, syncClerkUser } from "@/lib/clerk-sync";

/**
 * Returns the final organization ID to use.
 * Auto-resolves from Clerk memberships or creates a new one if none exists.
 * Synchronizes defensively to Supabase.
 */
export async function getOrCreateOrganization(userId: string, sessionOrgId: string | null | undefined, companyName?: string): Promise<string> {
  const client = await clerkClient();

  // Defensive Sync: Ensure User exists in Supabase
  try {
    const backendUser = await client.users.getUser(userId);
    await syncClerkUser(backendUser);
  } catch (syncErr) {
    console.error("Defensive user sync failed", syncErr);
  }

  let finalOrgId = sessionOrgId;

  if (!finalOrgId) {
    const memberships = await client.users.getOrganizationMembershipList({ userId });
    if (memberships.data && memberships.data.length > 0) {
      finalOrgId = memberships.data[0].organization.id;
      // Defensive Sync: existing org
      try {
        const backendOrg = await client.organizations.getOrganization({ organizationId: finalOrgId });
        await syncClerkOrganization(backendOrg);
      } catch (e) {}
    } else {
      // Create a new organization
      const newOrgName = companyName ? companyName.trim() : 'My Studio';
      const newOrg = await client.organizations.createOrganization({
        name: newOrgName,
        createdBy: userId,
      });
      // Sync immediately to Supabase
      await syncClerkOrganization(newOrg);
      finalOrgId = newOrg.id;
    }
  } else {
    // Defensive Sync: existing active session org
    try {
      const backendOrg = await client.organizations.getOrganization({ organizationId: finalOrgId });
      await syncClerkOrganization(backendOrg);
    } catch (e) {}
  }

  return finalOrgId!;
}
