import React, { Component } from 'react';

import { Button, Card, CardBody, CardGroup, Col, Container, Form, Input, InputGroup, InputGroupAddon, InputGroupText, Row } from 'reactstrap';
import API from './../../../services/api'
import { login,USER_KEY } from "./../../../services/auth";

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userName: '',
      password:'',
      showError: false,
      userNameError:false,
      passwordError:false,
      loading: false,
      erroSms: '',
      errors: {},  }
    this.handleChange = this.handleChange.bind(this); 
}

handleSignIn = async e => {
    e.preventDefault();
    const { userName, password } = this.state; 
        this.setState({ loading: true });
        try {
            const response = await API.post("/api/auth", { userName, password });
            API.get(`/api/user/${userName}`)
                .then(res => {
                    const userDetails = res.data;
                    localStorage.setItem(USER_KEY, JSON.stringify(userDetails));
                    login(response.data, userDetails);
                    this.setState({
                        loading: false
                    });
                    this.props.history.push("/");
                });

        } catch (err) {
            this.setState({
                erroSms: "Username ou Password incorretos!",
                showError: true,
                loading: false
            });
        }
   
};


handleChange = e => this.setState({
  [e.target.name]: e.target.value
});

  render() {
    return (
      <div className="app flex-row align-items-center">
        <Container>
          <Row className="justify-content-center">
            <Col md="5">
              <CardGroup>
                <Card className="p-4">
                  <CardBody>
                    <Form method="post" onSubmit={this.handleSignIn.bind(this)}>
                      <h1>Fazer Login</h1>
                      <p className="text-muted">Entrar na Aplicação</p>
                      <InputGroup className="mb-3">
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            <i className="icon-user"></i>
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input type="text" placeholder="Nome de Utilizador que pode ser o seu email"  onChange={this.handleChange} name="userName" autoComplete="username" />                     
                      </InputGroup>
                      <InputGroup className="mb-4">
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            <i className="icon-lock"></i>
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input type="password" onChange={this.handleChange} onSubmit={this.handleSignIn.bind(this)} name="password" placeholder="Password" autoComplete="current-password" />
                      </InputGroup>
                      <Row>
                        <Col xs="6">
                          <Button color="primary" onClick={this.handleSignIn.bind(this)} className="px-4">Login</Button>
                        </Col>
                        <Col xs="6" className="text-right">
                          <Button color="link" className="px-0" >Esqueceu a senha?</Button>
                         
                        </Col>
                        <span>{this.state.erroSms? <div className="required">{this.state.erroSms}</div>:null}</span>
                      </Row>
                    </Form>
                  </CardBody>
                </Card>
            
              </CardGroup>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default Login;
