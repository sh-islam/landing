import React from 'react';
import Project from './components/project';
import Footer from './components/footer';


function App() {
    
    return (
        <div className="App">
            <div className='project-info'>
                <p>Below you can see some of my projects. Other projects and code snippets can be viewed on my <a href="https://github.com/sh-islam">github</a>.</p>
            </div>
            <Project/>
            <Footer/>
        </div>
    );
}

export default App;


//Version with show button:
// import React, { useState } from 'react';
// import Project from './components/project';
// import Footer from './components/footer';
// import showIcon from './components/images/show_icon.png';
// import hideIcon from './components/images/hide_icon.png';

// function App() {
//   const [showProjects, setShowProjects] = useState(false);

//   const handleToggleProjects = () => {
//     setShowProjects(!showProjects);
//   };

//   return (
//     <div className="App">

//       <div className="project-info">
//         <p>
//           Below you can see some of my projects. Other projects and code snippets can be viewed on my{' '}
//           <a href="https://github.com/sh-islam">github</a>.
//         </p>
//         <button className='showTabs' onClick={handleToggleProjects}>
//         {showProjects ? <img src={hideIcon} alt="Hide" /> : <img src={showIcon} alt="Show" />}
//         </button>
//       </div>
//       {showProjects && <Project />}

//       <Footer />
//     </div>
//   );
// }

// export default App;

