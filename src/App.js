import React, {Component} from 'react';
import styled from 'styled-components';
import {
  Button, Form, FormGroup, Label,
  Container, Row, Col,
  Navbar, NavbarBrand, NavbarText, Nav, NavLink
} from 'reactstrap';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import Parse from 'parse';
import {LoginForm, SignUpForm, LogOut, MyInput, GoogleCallBack} from './SignUpForm';


class UserForm extends Component {
  constructor(props) {
    wtf;
    super(props);
    this.state = {
      email: '',
      fullName: '',
      errors: {}
    }
  }

  onChange = (event) => {
    this.setState({[event.target.name]: event.target.value});
  }

  onSubmit = () => {
    const user = new Parse.User();
    user.linkWith('oauth2', { authData: {id: '00u2bv1o2wp1F3XFE357', access_token: 'eyJraWQiOiJSZU1ZbEFucDFIV0syRDFuUFZ0LWFGdW9mT3Y5TWltLXo1ZmhMT3RtR2w4IiwiYWxnIjoiUlMyNTYifQ.eyJ2ZXIiOjEsImp0aSI6IkFULkJzUXcxaWxLLXBfdVhkRFozdGIyeVZoZEVhVUlmaEkzQkhNaEh1U0NuZkUiLCJpc3MiOiJodHRwczovL2Rldi01MDM0MTYub2t0YS5jb20vb2F1dGgyL2RlZmF1bHQiLCJhdWQiOiJhcGk6Ly9kZWZhdWx0IiwiaWF0IjoxNTc4MTg1NDU4LCJleHAiOjE1NzgxODkwNTgsImNpZCI6IjBvYTJlMHEwb2ZUbE43RTFDMzU3IiwidWlkIjoiMDB1MmJ2MW8yd3AxRjNYRkUzNTciLCJzY3AiOlsib3BlbmlkIl0sInN1YiI6InRvc3RlcnNAZ21haWwuY29tIn0.NcXDQpub7XMNF2ieTWxuIqQXy1dh5Fe6ZyYjbqCSmioC75wyYJ9RhBINetrWb3M1zr9NJBuOVKvcNnHA0WyBynyh7sgu-uu8y6Z_gKTX2KpJ0Q8JBXyvIp2xF_OYpu_wvXdSp4ZK3Sv5uv6P-UBpjsmOG5aFec7B4iFqXSaczFgqH0DhOqZa1ewwH1Y46HyBt7SV04DAUAXQaT3bQmcKo6ba2PM8S11MmAVDfUpBkCBqYfB3CA0ktjWCW_5loqncBTxpdLbkIlLb79-Nvvlx7K94T2vzgZdfmo7VMu_iZTvBDWcYMZcR7D5gedrZF5OFZxf8UDuWZs4PFb9m8ZhYXQ'} });
    // process.env.REACT_APP_PARSE_URL;
    // const env = {...process.env};
    // env.REACT_APP_PARSE_URL = 'wtf';
    // console.log(env);
    // process.env = env;
    console.log(process.env);
    const errors = {};
    if (!this.state.email) {
      errors.email = "This field is required";
    }
    if (!this.state.fullName) {
      errors.fullName = "This field is required";
    }
    this.setState({errors});
    if (!Object.keys(errors).length) {
      console.log({
        fullName: this.state.fullName,
        email: this.state.email
      })
    }
  }

  componentDidMount() {
    window.Parse = Parse;
  }

  render = () =>
  <Form className={this.props.className}>
    <FormGroup>
      <Label for="email">Email</Label>
      <MyInput name="email" type="email" placeholder="john@wick.com" state={this.state} onChange={this.onChange} />
    </FormGroup>
    <FormGroup>
      <Label for="fullName">Full&nbsp;Name</Label>
      <MyInput name="fullName" type="text" placeholder="John Wick" state={this.state} onChange={this.onChange} />
    </FormGroup>
    <Row>
      <Col className="text-center">
        <Button color="primary" onClick={this.onSubmit}>Submit</Button>
      </Col>
    </Row>
  </Form>
}

UserForm = styled(UserForm)`
  button {
    width: 100%;
  }
`;

const AuthLink = () => {
  const user = Parse.User.current();
  if (user)
    return (
      <React.Fragment>
        <NavbarText>Welcome, {user.get('username')}!</NavbarText>
        <NavLink href="/auth/logout">Logout</NavLink>
      </React.Fragment>
    )
  else
    return <NavLink href="/auth/login">Login</NavLink>
}

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      authenticated: Boolean(Parse.User.current())
    }
  }

  afterAuthAction = () =>
  this.forceUpdate()

  render() {
    return (
      <Router>
        <div>
          <Navbar color="light" light expand="md">
            <NavbarBrand href="/">KUBER</NavbarBrand>
            <Nav className="mr-auto" navbar>
            </Nav>
            <AuthLink />
          </Navbar>
          <Container className={`App ${this.props.className}`}>
            <Row>
              <Col sm="12" md={{ size: 8, offset: 2 }}>
                <Switch>
                  <Route path="/auth/login">
                    <LoginForm afterAuthAction={this.afterAuthAction} />
                  </Route>
                  <Route path="/auth/signup">
                    <SignUpForm afterAuthAction={this.afterAuthAction} />
                  </Route>
                  <Route path="/auth/logout">
                    <LogOut afterAuthAction={this.afterAuthAction} />
                  </Route>
                  <Route path="/auth/google">
                    <GoogleCallBack afterAuthAction={this.afterAuthAction} />
                  </Route>
                  <Route exact path="/">
                    <UserForm />
                  </Route>
                </Switch>
              </Col>
            </Row>
          </Container>
        </div>
      </Router>
    )
  }
}

App = styled(App)`
  margin-top: 20px;
`;

export default App;
