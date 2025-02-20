import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://nzmgatwsdhwsspliaxsk.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im56bWdhdHdzZGh3c3NwbGlheHNrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk5MDMxMjAsImV4cCI6MjA1NTQ3OTEyMH0.52lEnNMwGBZWX9NvIiUJljAajj050UWChcIdt7-bMtg';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database functions
export async function getUser(id: string) {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) throw error;
  return data;
}

export async function createUser(username: string, password: string) {
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email: username, // Using username as email for simplicity
    password: password
  });
  
  if (authError) throw authError;
  
  // Create user profile in users table
  const { data, error } = await supabase
    .from('users')
    .insert([
      { 
        id: authData.user?.id,
        username: username,
      }
    ])
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function signIn(username: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: username,
    password: password
  });
  
  if (error) throw error;
  return data;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function getStartups() {
  const { data, error } = await supabase
    .from('startups')
    .select('*');
  
  if (error) throw error;
  return data;
}

export async function getStartupByKey(key: string) {
  const { data, error } = await supabase
    .from('startups')
    .select('*')
    .eq('submission_key', key)
    .single();
  
  if (error) throw error;
  return data;
}

export async function createStartupSubmission() {
  const { data, error } = await supabase
    .from('startups')
    .insert([{ status: 'pending' }])
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function updateStartup(key: string, data: any) {
  const { data: updatedData, error } = await supabase
    .from('startups')
    .update(data)
    .eq('submission_key', key)
    .select()
    .single();
  
  if (error) throw error;
  return updatedData;
}
