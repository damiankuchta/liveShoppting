import React, { useEffect } from "react"
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import store  from './store/store'

import { Route, Routes} from 'react-router-dom';

import TopBar from "./components/TopBar"
import LoginForm from "./features/auth/components/LoginForm";
import RegisterForm from "./features/auth/components/RegisterForm";

import getCrsf from "./utils/getCsrf";

export default function App() {

  useEffect(() => {
    getCrsf()
  }, []) 

  return (
    <Provider store={store}>
      <BrowserRouter>
        <TopBar/>
        <Routes>
              <Route path="/login" Component={LoginForm}/>
              <Route path="/register" Component={RegisterForm}/>
              {/* <Route exact path="/">
                <Navigate to="/login" />
              </Route> */}

          </Routes>
        </BrowserRouter>
    </Provider>
  );
}
