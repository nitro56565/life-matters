import { Redirect, Route } from 'react-router-dom';
import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import Home from './pages/Home/Home';
import SignIn from './components/SignIn/SignIn';
import AmbulanceMainPage from './pages/Ambulance-Main-Page/AmbulanceMainPage';
import ForgotPassword from './pages/Forgot-Password-Page/ForgotPasswordPage';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/**
 * Ionic Dark Mode
 * -----------------------------------------------------
 * For more info, please see:
 * https://ionicframework.com/docs/theming/dark-mode
 */

/* import '@ionic/react/css/palettes/dark.always.css'; */
/* import '@ionic/react/css/palettes/dark.class.css'; */
import '@ionic/react/css/palettes/dark.system.css';

/* Theme variables */
import './theme/variables.css';
import SetNewPassword from './pages/set-new-password/SetNewPasswordPage';

setupIonicReact();

const App: React.FC = () => (
  <IonApp>
    <IonReactRouter>
      <IonRouterOutlet>
        <Route exact path="/home">
          <Home />
        </Route>
        <Route exact path="/">
          <Redirect to="/home" />
        </Route>
        <Route exact path="/ambulance-signin">
          <SignIn 
            apiEndpoint="/api/ambulance/signin"  
            redirectUrl="/ambulance-home"
            signupLink="/ambulancesignup"/>
        </Route>
        <Route exact path="/trafficpolice-signin">
          <SignIn
            apiEndpoint="/api/trafficpolice/signin"
            redirectUrl="/trafficpolice-home"
            signupLink="/trafficpolicesignup"
          />
        </Route>
        <Route exact path="/ambulance-home">
          <AmbulanceMainPage/>
        </Route>
        <Route exact path="/forgot-password">
          <ForgotPassword/>
        </Route>
        <Route exact path="/set-new-password">
          <SetNewPassword/>
        </Route>
      </IonRouterOutlet>
    </IonReactRouter>
  </IonApp>
);

export default App;
