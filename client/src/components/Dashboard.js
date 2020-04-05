import React from 'react'
import {Container,ListGroup,ListGroupItem} from 'reactstrap'
import axios from 'axios'
import {Button} from 'reactstrap'
import swal from 'sweetalert2'

class Dashboard extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            users : [],
            currentuser:{}
        }
    }
    // toggleIncognito(){
       
       
    // }
    componentDidMount(){

        axios.get('http://localhost:4005/users/nearby',{
            headers : {
                'x-auth' : localStorage.getItem('authToken')
            }
        })
        .then(response=> {
            this.setState({
                users: response.data
            })
        })
        .catch(err=>console.log(err))
        axios.get('http://localhost:4005/users/account',{
            headers : {
                'x-auth' : localStorage.getItem('authToken')
            }
        })
        .then(response=> {
            this.setState({
                currentuser: response.data
            })
        })
        .catch(err=>console.log(err))
       
    }

    
    render(){
        return (
            <Container fluid>
                <Button onClick={()=> {swal.fire({
                      title:"Are you sure to go incognito out?",
                      icon:'warning',
                      buttons: true,
                      dangerMode: true

                    })
                    .then(confirmLogout =>{
                        if(confirmLogout) {
                            axios.put('http://localhost:4005/users/toggle', Object.keys(this.state.currentuser).length!=0&&this.state.currentuser,{
                                headers : {
                                    'x-auth' : localStorage.getItem('authToken')
                                }
                            })
                            .then(response=> {
                                console.log(response.data)
                            })
                            .catch(err=>console.log(err))
                        }
                    })
                }}>Go Incognito</Button>
              <h1 className="display-3">Nearby Users</h1>
              
              <ListGroup>
              {
                  this.state.users.length>0? this.state.users.map(user=><ListGroupItem key={user._id}>{user.username}</ListGroupItem>):(
                    <ListGroupItem>No nearby users to display</ListGroupItem>
                  )
              }
                
            </ListGroup>
            </Container>
           )
        }
}

export default Dashboard 
