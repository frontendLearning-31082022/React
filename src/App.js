import logo from './logo.svg';
import './App.scss';

import SkillsViewer from './modules/SkillsViewer/SkillsViewer';
import Resume from './modules/Resume/Resume';
import ResumeGit from './modules/ResumeGit/ResumeGit';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Resume /> <ResumeGit />
      </header>
      <SkillsViewer></SkillsViewer>
    </div>
  );
}

export default App;
