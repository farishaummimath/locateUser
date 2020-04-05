import React from 'react'
import axios from 'axios'
import { Alert } from 'reactstrap';

class Login extends React.Component {
    
    constructor(props){
        super(props)
        this.state = {
            username: '',
            password: '',
            currentlocation:[],
            invalidInput:''
        }
    }
    componentDidMount() {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition((position)=> {
            // console.log("Latitude is :", position.coords.latitude);
            // console.log("Longitude is :", position.coords.longitude);
            this.setState({
                currentlocation : [position.coords.longitude,position.coords.latitude]
            })
        });
        }
      }


    handleClick = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    handleSubmit = (e) => {
        e.preventDefault()
        if(this.state.username!=''||this.state.username!=''){
            
            const loginData = {
                username: this.state.username,
                password: this.state.password,
                location:this.state.currentlocation
            }
            this.setState({
                invalidInput : ''
            })
        
        
        // this.props.dispatch(startSetUser(loginData,redirect))
        axios.post('http://localhost:4005/users/login',loginData)
        .then((response)=>{
            console.log(response.data)
            if(response.data.hasOwnProperty('error')){
                console.log(response)
                alert(response.data.error)
            } else {
                // Redirect to home page
                // server sends token if no error in response
                const token = response.data.token
                localStorage.setItem('authToken',token)
                this.props.history.push('/')
                window.location.reload()

            }
        })
        .catch((err)=>alert(err))
        } else {
            this.setState({
                invalidInput : 'Fields cant be empty'
            })
        }
        
    }

    render(){
        return (
            <div className="justify-content-md-center ">
                  {
                   this.state.invalidInput!=''&&<Alert color="danger">
                       {this.state.invalidInput}
                      </Alert>
                  }  
                <form className="form-signin" onSubmit={this.handleSubmit}>
                    
                    <h1 className="h1 mb-3 font-weight-normal text-center">Login</h1>

                    <label htmlFor="username" className="sr-only">Username</label>
                    <input type="text" id="username" className="form-control mb-3" placeholder="Username"  name="username" onChange={this.handleClick}/>

                    <label htmlFor="password" className="sr-only">Password</label>
                    <input type="password" id="password" className="form-control mb-3" placeholder="Password"  name="password" onChange={this.handleClick}/>

                    <button className="btn btn-lg btn-primary btn-block" type="submit">Login</button>
                </form>
            </div>
        )
    }
}

export default Login