/* @refresh reload */
import { render } from 'solid-js/web';
import { Router, Route, Routes } from '@solidjs/router';

import './index.css';
import App from './App';
import Account from './components/account';
import { AuthSession } from '@supabase/supabase-js';
import { createSignal, createEffect } from 'solid-js';
import { supabase } from './services/auth';
import Auth from './components/login';

const root = document.getElementById('root');

if (import.meta.env.DEV && !(root instanceof HTMLElement)) {
  throw new Error(
    'Root element not found. Did you forget to add it to your index.html? Or maybe the id attribute got mispelled?'
  );
}
const [session, setSession] = createSignal<AuthSession | null>(null);

createEffect(() => {
  supabase.auth.getSession().then(({ data: { session } }) => {
    setSession(session);
  });

  supabase.auth.onAuthStateChange((_event: any, session: any) => {
    setSession(session);
  });
});

render(
  () => (
    <Router>
      <Routes>
        <Route path='/' element={<App />} />
        <Route
          path='Account'
          element={!session() ? <Auth /> : <Account session={session()!} />}
        />
      </Routes>
    </Router>
  ),
  root!
);
