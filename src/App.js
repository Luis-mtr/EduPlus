import "./App.css";
import Sidebar from "./components/Sidebar";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Overview from "./pages/Overview";
import Subjects from "./pages/Subjects";
import DefaultSubject from "./pages/DefaultSubject";
import { ReportsOne } from "./pages/ReportsOne";
import { useState } from "react";
import AllQuestions from "./pages/AllQuestions";
import StartLearning from "./pages/StartLearning";
import Statistics from "./pages/Statistics";

function App() {
  const [sidebar, setSidebar] = useState(false);
  return (
    <>
      <Router>
        <Sidebar sidebar={sidebar} setSidebar={setSidebar} />
        <div
          style={
            sidebar
              ? { marginLeft: "270px", transition: "1s" }
              : { marginLeft: "30px", transition: "1s" }
          }
        >
          <Routes>
            <Route path="/overview" exact Component={Overview} />
            <Route path="/subjects" exact Component={Subjects} />
            <Route
              path="/DefaultSubject/:subject?"
              Component={DefaultSubject}
            />
            <Route path="/StartLearning" Component={StartLearning} />
            <Route path="/Statistics" Component={Statistics} />
            <Route path="/AllQuestions" exact Component={AllQuestions} />
            {/* <Route path="/reportsthree" exact Component={ReportsThree} /> */}
          </Routes>
        </div>
      </Router>
    </>
  );
}

export default App;
