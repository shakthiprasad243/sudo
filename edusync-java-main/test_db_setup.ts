import { supabase } from './src/lib/supabaseClient';

async function testDatabaseSetup() {
  console.log('Testing database setup...');
  
  // Test 1: Check if profiles table exists
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, full_name, email, role')
      .limit(1);
    
    if (error) {
      console.error('Error querying profiles table:', error);
    } else {
      console.log('Profiles table exists and is accessible');
      console.log('Sample data:', data);
    }
  } catch (error) {
    console.error('Error checking profiles table:', error);
  }
  
  // Test 2: Check if student_uploads table exists
  try {
    const { data, error } = await supabase
      .from('student_uploads')
      .select('id, title, faculty_id')
      .limit(1);
    
    if (error) {
      console.error('Error querying student_uploads table:', error);
    } else {
      console.log('student_uploads table exists and is accessible');
      console.log('Sample data:', data);
    }
  } catch (error) {
    console.error('Error checking student_uploads table:', error);
  }
  
  // Test 3: Try to insert a test faculty profile
  try {
    const { data, error } = await supabase
      .from('profiles')
      .insert({
        id: '33333333-3333-3333-3333-333333333333',
        full_name: 'Test Faculty',
        email: 'test@university.edu',
        role: 'faculty'
      })
      .select();
    
    if (error) {
      console.error('Error inserting test faculty profile:', error);
    } else {
      console.log('Successfully inserted test faculty profile');
      console.log('Inserted data:', data);
      
      // Clean up the test data
      await supabase
        .from('profiles')
        .delete()
        .eq('id', '33333333-3333-3333-3333-333333333333');
    }
  } catch (error) {
    console.error('Error inserting test faculty profile:', error);
  }
}

testDatabaseSetup();