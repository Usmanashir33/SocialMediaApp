// import { BrowserRouter as Router,Route,Switch, Redirect} from "react-router-dom/cjs/react-router-dom.min";
import { HashRouter as Router,Route,Switch, Redirect} from "react-router-dom/cjs/react-router-dom.min";
import Register from "./account/Register";
import Col1 from "./Col1";
import Col2 from "./Col2";
import LiveChatProvider from "./livechart/LiveChatContext";
import AuthContextProvider from "./contexts/AuthContext";
import Sidebar from "./components/Sidebar";
import PreProtectedRoute from "./contexts/PreProtectedRoute";
import ProtectedRoute from "./contexts/ProtectedRoute";
import Loading from "./contexts/LoadingIcon";
import DataRendingContextProvider from "./contexts/DataRending";
import UiContextProvider from "./contexts/UiContext";

import LiveChat from "./livechart/LiveChat";
import Community from "./livechart/Community";
import CallingContextProvider from "./livechart/CallingContext";
import About from "./account/About";
import ForgetPassword from "./account/ForgetPassword";
import Support from "./account/Support";
// import HomeCommunity from "./livechart/Community/HomeCommunity";


function App() {
  return (
  <div className="App main-container">
    <UiContextProvider>
    <AuthContextProvider>
      <DataRendingContextProvider>
      <LiveChatProvider>
      <CallingContextProvider>
        <Router>
          <Loading/>
          <Switch>

            <Route path='/register'> 
              <PreProtectedRoute>
                    <Register/>
              </PreProtectedRoute>
            </Route>
            <Route path='/auth/forget-password'> 
              <PreProtectedRoute>
                  <ForgetPassword/>
              </PreProtectedRoute>
            </Route>
            
            <Route exact path='/about'> 
                  <About/>
              </Route>
            <Route exact path='/support'> 
                <Support/>
            </Route>
              

              <ProtectedRoute>
                <Loading/>
                <Sidebar/>
                <Route exact path='/'>  <Redirect to = "/main/home"/></Route>
                <Route  path="/main">
                  <div className="cols-container ">
                     <Col1/>
                     <Col2/>
                  </div>
                </Route>
                <Route  path='/dm'>
                    <LiveChat/>
                </Route>
                <Route  path='/community'>
                    <Community/>
                </Route>
              </ProtectedRoute>

          </Switch>
        </Router>

      </CallingContextProvider>
      </LiveChatProvider>
      </DataRendingContextProvider>
    </AuthContextProvider>
    </UiContextProvider>
  </div>
  );
}

export default App;
