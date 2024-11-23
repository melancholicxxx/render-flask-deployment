import '../App.css';
import { createClient } from '@supabase/supabase-js';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

function LoginPage() {
  const navigate = useNavigate();
  const [supabase] = useState(() => createClient(
    "https://cseigtvsdlwjuejuacwy.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNzZWlndHZzZGx3anVlanVhY3d5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzIzMzI4ODUsImV4cCI6MjA0NzkwODg4NX0.gMU_9dNnuCVQvRxYd9hJVlBcb5LAnz_dyMYLD5gliHk"
  ));

  // Check if user is signed in
  useEffect(() => {
    const handleAuthChange = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          navigate('/success');
        }
      } catch (error) {
        console.error('Error checking auth:', error);
      }
    };

    handleAuthChange();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (session) {
          navigate('/success'); // Redirect to success page if signed in
        } else {
          navigate('/'); // Redirect to login page if signed out
        }
      }
    );

    return () => {
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, [navigate, supabase]);

  return (
    <div className="App">
      <header className="App-header">
        <Auth
          supabaseClient={supabase}
          appearance={{ theme: ThemeSupa }}
          theme="dark"
          providers={["discord", "google"]}
        />
      </header>
    </div>
  );
}

export default LoginPage;
