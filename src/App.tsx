import { Component, createEffect, createSignal } from 'solid-js';
import { supabase } from '../src/services/auth';
import { AuthSession } from '@supabase/supabase-js';
import Account from '../src/components/account';
import Auth from '../src/components/login';
import Home from './pages/Home';

const App: Component = () => {
  const [boards, setBoards] = createSignal<[]>([]);
  const [session, setSession] = createSignal<AuthSession | null>(null);
  const [loading, setLoading] = createSignal(true);

  const getBoards = async () => {
    try {
      setLoading(true);

      let { data, error, status } = await supabase
        .from('user_boards')
        .select(`boards:board_id ( title, id )`);
      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        setBoards(data);
      }
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  createEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      getBoards();
    });
  });

  return (
    <div class='container' style={{ padding: '50px 0 100px 0' }}>
      {!session() ? <Auth /> : <Home />}
    </div>
  );
};

export { boards };

export default App;
