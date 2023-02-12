import {Component} from "react";
import authService from "./service/auth.service";
import {Navigate, Route, Routes} from "react-router-dom";
import SignIn from "./pages/sign-in";
import SignUp from "./pages/sign-up";
import TaskList from "./pages/taks-list";

class App extends Component {

  render() {
    if (authService.isLoggedIn()) {
      return <TaskList/>;
    }
    return <div>
      <Routes>
        <Route
          key='login'
          path='login'
          element={<SignIn/>}
        />
        <Route
          key='register'
          path='register'
          element={<SignUp/>}
        />
        <Route
          path='*'
          element={
            <Navigate to='login'/>
          }
        />
      </Routes>
    </div>;
  }
}

export default App;
