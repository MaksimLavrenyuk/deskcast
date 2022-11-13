function App(nodes: string | Node[] | Node) {
  window.addEventListener('DOMContentLoaded', () => {
    const $app = document.getElementById('app');

    if (Array.isArray(nodes)) {
      $app.append(...nodes);
    } else {
      $app.append(nodes);
    }
  });
}

export default App;
