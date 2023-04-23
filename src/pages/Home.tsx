import { Component, For } from 'solid-js';
import { boards } from '../App';

//console.log(boards());

const Home: Component = () => {
  return (
    <div class='text-white'>
      <For each={boards()}>{(board) => <p>{board.title}</p>}</For>
    </div>
  );
};
export default Home;
