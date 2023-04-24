import { Component, For } from 'solid-js';
import { supabase } from '../services/auth';
import { createSignal } from 'solid-js';

const [avatarUrl, setAvatarUrl] = createSignal<any | null>(null);

const downloadImage = async (path: string) => {
  try {
    const { data, error } = await supabase.storage
      .from('avatars')
      .download(path);
    if (error) {
      throw error;
    }
    const url = URL.createObjectURL(data);
    setAvatarUrl(url);
  } catch (error) {
    if (error instanceof Error) {
      console.log('Error downloading image: ', error.message);
    }
  }
};

const {
  data: { user },
} = await supabase.auth.getUser();

let { data } = await supabase
  .from('users')
  .select(`avatar_url`)
  .eq('id', user.id)
  .single();

if (data) {
  downloadImage(data.avatar_url);
}

let getBoards = async () => {
  let boards = await supabase.from('user_boards').select(`
  boards:board_id ( title, id )
`);
  return boards.data || [];
};

let startBoard = async () => {
  const data = await supabase
    .from('boards')
    .insert({}, { returning: 'minimal' });

  // Load all boards because we only get back minimal data
  // Trigger needs to run first
  // Otherwise RLS would fail
  let boards = await getBoards();

  if (boards.length > 0) {
    const newBoard = boards.pop();

    if (newBoard.boards) {
      //router.navigateByUrl(`/workspace/${newBoard.boards.id}`)
    }
  }
};

let signOut = () => {
  supabase.auth.logout();
};

const Home: Component = () => {
  return (
    <div class='container'>
      <header class='bg-emerald-600'>
        <nav class='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
          <div class='flex w-full items-center justify-between border-b border-emerald-500 py-6 lg:border-none'>
            <div class='flex items-center'>
              <link href='/workspace'>
                <img
                  class='h-6 w-auto'
                  src='https://supabase.com/docs/supabase-dark.svg'
                  alt=''
                />
              </link>
            </div>
            <div class='ml-10 flex items-center space-x-4'>
              <span class='text-white'>{user?.email}</span>
              {avatarUrl() && (
                <img
                  class='rounded-full h-8 w-8 object-cover'
                  style={{ height: `50px`, width: `50px` }}
                  src={`${avatarUrl()}`}
                />
              )}
              <button
                //(click)="signOut()"
                class='inline-block rounded-md border border-transparent bg-white py-1 px-4 text-base font-medium text-emerald-600 hover:bg-emerald-50'
              >
                Logout
              </button>
            </div>
          </div>
        </nav>
      </header>

      <main class='mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8'>
        <ul
          role='list'
          class='grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-4 xl:gap-x-8'
        >
          <li
            //*ngFor="let board of boards"
            //[routerLink]="board.boards.id"
            class='relative h-52 rounded bg-emerald-200 py-4 px-4 text-lg font-semibold hover:cursor-pointer hover:bg-emerald-300'
          ></li>

          <li
            //(click)="startBoard()"
            class='relative h-52 rounded bg-emerald-500 py-4 px-4 text-lg font-semibold hover:cursor-pointer'
          >
            + New board
          </li>
        </ul>
      </main>
    </div>
  );
};
export default Home;
