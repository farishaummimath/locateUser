import React from 'react';
import { Button, Form, FormGroup, Label, Input ,ListGroup,ListGroupItem} from 'reactstrap';
import axios from 'axios'
class Search extends React.Component {
    
  constructor(props){
      super(props)
      this.state = {
          longitude: '',
          latitude: '',
          users:[],
          invalidInput:''
      }
  }
  handleSearch = e =>{
    this.setState({
      [e.target.name]:e.target.value
    })
  }

  handleSearch = e =>{
    e.preventDefault()
    if(this.state.latitude!=''||this.state.longitude!=''){
            
      const search = {
          latitude: this.state.latitude,
          longitude: this.state.longitude,
      }
      this.setState({
          invalidInput : ''
      })
  
  
  // this.props.dispatch(startSetUser(loginData,redirect))
  axios.post('http://localhost:4005/users/search',search,{
    headers : {
        'x-auth' : localStorage.getItem('authToken')
    } 
  })
  .then((response)=>{
      console.log(response.data)
      if(response.data.hasOwnProperty('error')){
          console.log(response)
          alert(response.data.error)
      } else {
          this.setState({
            users:response.data
      })
  

      }
  })
  .catch((err)=>alert(err))
  } else {
      this.setState({
          invalidInput : 'Fields cant be empty'
      })
  }
  
    
  }


  render() {
    return (
      <>
      <h2 style={{textAlign:'left'}}>Search for user</h2>
      <Form onSubmit ={this.handleSearch} inline>
        <FormGroup>
          <Label for="longitude" hidden>Longitude</Label>
          <Input type="text" name="longitude" id="longitude" placeholder="longitude" onChange={this.handleChange}/>
        </FormGroup>
        {' '}
        <FormGroup>
          <Label for="latitude" hidden>Latitude</Label>
          <Input type="text" name="latitude" id="latitude" placeholder="latitude" onChange={this.handleChange}/>
        </FormGroup>
        {' '}
        <Button>Search</Button>
      </Form>
      
        <ListGroup>
        {
            this.state.users.length>0? this.state.users.map(user=><ListGroupItem>{user.username}</ListGroupItem>):(
              <ListGroupItem>No users found</ListGroupItem>
            )
        }
          
      </ListGroup>
      
    </>
    );
  }
}
export default Search;