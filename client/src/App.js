import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import CreateNewEntry from './components/create/CreateNewEntry';
import GetEntry from './components/get/GetEntry';
import RemEntry from './components/remove/RemoveEntry';
import config from './config.json';
import Accordion from 'react-bootstrap/Accordion';

function RemoveEntry() {
    if (config.enableRemoveFE) {
        return null;
    }
    return (
        <RemEntry />
    );
}

function App() {
    return (
        <div className="App">
            <header className="App-header">
                <Accordion>
                    <CreateNewEntry />
                    <GetEntry />
                    <RemoveEntry />
                </Accordion>
            </header>
        </div>
    );
}

export default App;
