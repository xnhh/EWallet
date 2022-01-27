import logo from './logo.svg';
import './App.css';
import Button from '@material-ui/core/Button';
import { useSimpleSnackbar } from './Components/SimpleSnackbar';

function App () {
  const showSnackbar = useSimpleSnackbar();
  const handleClick = event => {
    event.preventDefault();
    showSnackbar("Success");
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        <Button style={{fontSize:"25px",color:"white",margin:"10px"}} onClick={handleClick}>
          Click Me
        </Button>
      </header>
    </div>
  );
}

export default App;
