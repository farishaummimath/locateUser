import React from 'react'
import {Form, Col,FormGroup,Button, Label, Input } from 'reactstrap';
import axios from 'axios'
class Register extends React.Component {
    
    constructor(props){
        super(props)
        this.state = {
            fileList: null
        }
    }

        
    handleFileChange = (e)=>{
        this.setState({fileList:e.target.files[0]})
    }

    handleSubmit = (e) => {
        e.preventDefault()
        let formData = new FormData();
        console.log(this.state.fileList)
        formData.append("file", this.state.fileList);
        console.log(formData)
        axios.post('http://localhost:4005/users/register', formData,{headers: {
            'content-type': 'multipart/form-data'
        }
        })
        .then(res => {
            console.log("res", res);
            this.props.history.push('/users/login')
        })
        .catch(err => {
            console.log("err", err);
        });
        
        const redirect = () => this.props.history.push('/users/login')
        // this.props.dispatch(startAddUser(registerData,redirect))
        

    }

    render(){
        return (
            <div >
                <Form onSubmit={this.handleSubmit}>
                <FormGroup row>
                    <Col sm={10}>
                        <Label for="file">File</Label>
                        <Input type="file" name="file" accept='.csv'id="file"   
                        onChange = { this.handleFileChange } />
                        <Input type="submit" className="primary" name="import csv"/>   

                    </Col>

                </FormGroup>

            </Form>
            </div>

        )
            
    }
}

export default  Register