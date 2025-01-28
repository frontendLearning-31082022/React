import { BrowserRouter } from 'react-router-dom';
import logo from './logo.svg';
import Menu from './modules/Menu';

function App() {
  return (
    <div className="App">
      <header className="App-header"></header>
      <BrowserRouter>
      <Menu></Menu>
      </BrowserRouter>
    </div>
  );
}

export default App;
