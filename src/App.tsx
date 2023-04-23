import { Component, createEffect, createSignal } from 'solid-js';
import { supabase } from '../src/services/auth';
import { AuthSession } from '@supabase/supabase-js';
import Account from '../src/components/account';
import Auth from '../src/components/login';

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
// import logo from './logo.svg';
// import styles from './App.module.css';

// const App: Component = () => {
//   return (
//     <div class={styles.App}>
//       <header class={styles.header}>
//         <img src={logo} class={styles.logo} alt='logo' />
//         <p class='text-blue-400'>
//           Edit <code>src/App.tsx</code> and save to reload.
//         </p>
//         <a
//           class={styles.link}
//           href='https://github.com/solidjs/solid'
//           target='_blank'
//           rel='noopener noreferrer'
//         >
//           Learn Solid
//         </a>
//       </header>
//     </div>
//   );
// };

// export default App;
