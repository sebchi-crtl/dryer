import { supabase } from './supabase';

// Note: This requires the service_role key (not the anon key)
// You should only use this in server-side code or secure environments

export async function createAdminUser(email: string, password: string) {
  try {
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Auto-confirm email (no email confirmation needed)
      user_metadata: {
        role: 'admin'
      }
    });

    if (error) {
      console.error('Error creating admin user:', error);
      return { data: null, error };
    }

    // Create admin profile
    if (data.user) {
      const { error: profileError } = await supabase
        .from('admins')
        .insert({
          id: data.user.id,
          email: data.user.email
        });

      if (profileError) {
        console.error('Error creating admin profile:', profileError);
        return { data: data.user, error: profileError };
      }
    }

    return { data: data.user, error: null };
  } catch (error) {
    console.error('Error creating admin user:', error);
    return { data: null, error };
  }
}

export async function listAllUsers() {
  try {
    const { data, error } = await supabase.auth.admin.listUsers();
    
    if (error) {
      console.error('Error listing users:', error);
      return { data: null, error };
    }

    return { data: data.users, error: null };
  } catch (error) {
    console.error('Error listing users:', error);
    return { data: null, error };
  }
}

export async function deleteUser(userId: string) {
  try {
    const { data, error } = await supabase.auth.admin.deleteUser(userId);
    
    if (error) {
      console.error('Error deleting user:', error);
      return { data: null, error };
    }

    return { data, error: null };
  } catch (error) {
    console.error('Error deleting user:', error);
    return { data: null, error };
  }
}
