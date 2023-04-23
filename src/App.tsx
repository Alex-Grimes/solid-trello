import { Component, createEffect, createSignal } from 'solid-js';
import { supabase } from '../src/services/auth';
import { AuthSession } from '@supabase/supabase-js';
import Account from '../src/components/account';
import Auth from '../src/components/login';
import Home from './pages/Home';

const App: Component = () => {
  const [session, setSession] = createSignal<AuthSession | null>(null);

  createEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  });

  return (
    <div class='container' style={{ padding: '50px 0 100px 0' }}>
      {!session() ? <Auth /> : <Account session={session()!} />}
    </div>
  );
};

export default App;
