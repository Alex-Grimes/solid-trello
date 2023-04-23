import {
  createEffect,
  createSignal,
  Component,
  createResource,
  Switch,
  Match,
} from 'solid-js';
import { supabase } from '../services/auth';

const getBoards = supabase.from('user_boards').select(`
boards:board_id ( title, id )
`);

const Home: Component = () => {
  const [boards] = createResource(getBoards);

  console.log(boards());

  return (
    <div>
      <Switch fallback={<div>Not Found</div>}>
        <Match
          when={boards.state === 'pending' || boards.state === 'unresolved'}
        >
          Loading...
        </Match>
        <Match when={boards.state === 'ready'}>
          {JSON.stringify(boards())}
        </Match>
        <Match when={boards.state === 'errored'}>
          {JSON.stringify(boards.error)}
        </Match>
      </Switch>
    </div>
  );
};
export default Home;
