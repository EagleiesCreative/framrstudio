import { supabase } from './supabase-server';

/**
 * Syncs a Clerk user to the Supabase 'public.users' table.
 * Extracts "extra details" from Clerk's unsafeMetadata.
 */
export async function syncClerkUser(user: any) {
  const { id, email_addresses, first_name, last_name, image_url, unsafe_metadata } = user;
  const email = email_addresses?.[0]?.email_address;

  if (!id || !email) return;

  const userData = {
    id,
    email,
    first_name: first_name || null,
    last_name: last_name || null,
    image_url: image_url || null,
    phone_number: user.phone_numbers?.[0]?.phone_number || unsafe_metadata?.phoneNumber || null,
    role: unsafe_metadata?.businessRole || null,
    province: unsafe_metadata?.province || null,
    city: unsafe_metadata?.city || null,
    address: unsafe_metadata?.businessAddress || null,
    referrer: unsafe_metadata?.referrer || null,
    updated_at: new Date().toISOString(),
  };

  const { error } = await (supabase as any)
    .from('users')
    .upsert(userData, { onConflict: 'id' });

  if (error) {
    console.error('Error syncing Clerk user to Supabase:', error);
    throw error;
  }

  // If there's a businessName in metadata, we might want to sync it to organizations
  // Note: Standard project flow usually creates an org separately, but we'll check if we need to sync it here.
  if (unsafe_metadata?.businessName) {
    // This is a simplified sync. In a real multi-tenant app, orgs are managed via Clerk Org events.
    console.log(`User ${id} has business metadata: ${unsafe_metadata.businessName}`);
  }
}

/**
 * Syncs a Clerk organization to the Supabase 'public.organizations' table.
 */
export async function syncClerkOrganization(org: any) {
  const { id, name, slug, image_url, public_metadata } = org;

  if (!id || !name) return;

  const orgData = {
    id,
    name,
    slug: slug || null,
    image_url: image_url || null,
    category: public_metadata?.category || null,
    updated_at: new Date().toISOString(),
  };

  const { error } = await (supabase as any)
    .from('organizations')
    .upsert(orgData, { onConflict: 'id' });

  if (error) {
    console.error('Error syncing Clerk organization to Supabase:', error);
    throw error;
  }
}
