import './App.scss';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import Shop from './pages/Shop/Shop';
import Navbar from './Components/Navbar/Navbar';
import Footer from './Components/Footer/Footer';
import Search from './pages/Search/Search';
import Admin from './pages/Admin/Admin';
import Product from './pages/Product/Product';
import Upload from './pages/Upload/Upload';
import Edit from './pages/Edit/Edit';
import Login from './pages/Login/Login';
import PrivateRoute from './Components/PrivateRoute/PrivateRoute';
import Driver from './pages/Driver/Driver';
import Staff from './pages/Staff/Staff';
import Partner from './pages/Partner/Partner';
import OrderPartner from './pages/OrderPartner/OrderPartner';
import Customer from './pages/Customer/Customer';

function App() {
  return (
    <div className="App">

      <Router>
          <Navbar/>
    
          <Switch>
            
            <Route path="/login" component={Login} />
          
            {/* Admin */}
            <PrivateRoute office={['AD']} path="/admin" component={Admin} />

            {/* Driver */}
            <PrivateRoute office={['TX']} path="/driver" component={Driver} />

            {/* Satff */}
            <PrivateRoute office={['NV']} path="/staff" component={Staff} />

            {/*Partner contain delete */}
            <PrivateRoute office={['DT']} path="/partner" component={Partner} />
            <PrivateRoute office={['DT']} path="/partner-order" component={OrderPartner} />
            <PrivateRoute office={['DT']}  path="/upload" component={Upload} />
            <PrivateRoute office={['DT']}  path="/edit/:id" component={Edit} />

            {/* Customer */}
            <PrivateRoute office={['KH']} path="/customer" component={Customer} />
            <Route path="/search" component={Search} />
            <Route path="/shop/:id" component={Product} />
            <Route path="/" component={Shop} />
            
          </Switch>

      </Router>

      <Footer/>
    </div>
  );
}

export default App;
