import '../App.css';
import { createClient } from '@supabase/supabase-js';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

// Create supabase client outside of component
const supabase = createClient(
  "https://cseigtvsdlwjuejuacwy.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNzZWlndHZzZGx3anVlanVhY3d5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzIzMzI4ODUsImV4cCI6MjA0NzkwODg4NX0.gMU_9dNnuCVQvRxYd9hJVlBcb5LAnz_dyMYLD5gliHk"
);

function SuccessPage() {
  const [user, setUser] = useState({});
  const navigate = useNavigate();

  // Get user data
  useEffect(() => {
    async function getUserData() {
      await supabase.auth.getUser().then((value) => {
        if (value.data?.user) {
          setUser(value.data.user);
        }
      });
    }
    getUserData();
  }, []); 

  // Sign out user
  async function signOutUser() {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error signing out:', error);
    } else {
      navigate('/'); // Redirect to login page if signed out
    }
  }

  // NOTE TO SELF: can use user.email and user.id to save to MongoDB as a user object
  return (
    <div className="App">
      <header className="App-header">
        {Object.keys(user).length !== 0 ?
          <>
            <h1>Success</h1>
            <p>Welcome, {user.email} ({user.id})</p>
            <button onClick={signOutUser}>Sign Out</button>
          </> :
          <>
            <h1>You are not signed in</h1>
            <button onClick={() => navigate('/')}>Sign In</button>
          </>
        }
      </header>
    </div>
  );
}

export default SuccessPage;
