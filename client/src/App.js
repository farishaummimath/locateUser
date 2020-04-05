import React from 'react';
import {BrowserRouter,Route,Link,Switch} from 'react-router-dom'

import './App.css';

import 'bootstrap/dist/css/bootstrap.min.css'
import {Navbar,NavbarBrand,Nav,NavItem} from 'reactstrap'
import Home from './components/Home'
import Dashboard from './components/Dashboard'
import Search from './components/Search'
import Login from './components/Login'
import Register from './components/Register'
import swal from 'sweetalert2'
import axios from 'axios'
function App() {
    
  return (
    <div className="App">
      <BrowserRouter>
      <>
      <Navbar color="pink" dark expand="md" className="mb-5 bg-primary">
        <NavbarBrand>Locate User </NavbarBrand>
          <Nav className="ml-auto" navbar>
            {/* <NavItem>
              <Link className="nav-link text-white" to="/">Home</Link>
            </NavItem> */}
            {localStorage.getItem('authToken')?( 
              <>
                <NavItem>
                  <Link className="nav-link text-white" to="/dashboard">Dashboard</Link>
                </NavItem>
                <NavItem>
                  <Link className="nav-link text-white" to="/search">Search</Link>
                </NavItem>
                <NavItem>
                  <Link className="nav-link text-white" to="/users/logout" onClick={()=>{
                    swal.fire({
                      title:"Are you sure to log out?",
                      icon:'warning',
                      buttons: true,
                      dangerMode: true

                    })
                    .then(confirmLogout =>{
                      if(confirmLogout) {
                        axios.delete('http://localhost:4005/users/logout',{
                          headers: {
                              'x-auth': localStorage.getItem('authToken')
                          }
                         })
                        .then(response=>{
                            if(response.data.errors){
                                alert(response.data.message)
                            } else {
                                localStorage.removeItem('authToken')
                                window.location.href = '/users/login'
                            }
                        })
                        swal.fire("Successfully Logged out",{icon:"success"})

                      }
                    })
                  }}>Logout</Link>
                </NavItem>
              </>
            ):(<>
              <NavItem>
                <Link className="nav-link text-white" to="/users/login">Login</Link>
              </NavItem>
              <NavItem>
                <Link className="nav-link text-white" to="/users/register">Register</Link>
              </NavItem>
              
            </>)
            }
          </Nav>
      </Navbar>
      <div className="container">
      <Switch>
        <Route path="/" component = {Home} exact ={true}/>
          
        <Route path="/dashboard" component={Dashboard} exact={true} /> 
        <Route path="/search" component={Search} exact={true} /> 

        <Route path="/users/login" component={Login} exact={true} />
        <Route path="/users/register" component={Register} exact={true}/>
  


      </Switch>
      </div>
      
      </>
    </BrowserRouter>
    </div>
  );
}

export default App;
