import React, { Component } from "react";
import styled from "styled-components";
import {
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  FormFeedback,
  Row,
  Col,
} from "reactstrap";
import { Link, Redirect, withRouter } from "react-router-dom";
import Parse from "parse";
import credentials from "./credentials.json";
import { OAuth2Client } from "google-auth-library";
import queryString from "query-string";
import jwtDecode from "jwt-decode";
import config from "./config";

const oAuth2Client = new OAuth2Client(
  credentials.web.client_id,
  credentials.web.client_secret,
  `${config.REACT_APP_URL}/auth/google`
);

const MyInput = (props) => (
  <div>
    <Input
      invalid={props.name in props.state.errors}
      type={props.type}
      autoComplete={props.autoComplete}
      name={props.name}
      id={props.name}
      value={props.state[props.name]}
      onChange={props.onChange}
      placeholder={props.placeholder}
    />
    <FormFeedback>{props.state.errors[props.name]}</FormFeedback>
  </div>
);

class SignUpForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
      errors: {},
    };
  }

  onChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  onSubmit = (event) => {
    event.preventDefault();
    const errors = {};
    if (!this.state.username) {
      errors.username = "This field is required";
    }
    if (!this.state.password) {
      errors.password = "This field is required";
    }
    this.setState({ errors });
    if (!Object.keys(errors).length) {
      const user = new Parse.User({
        password: this.state.password,
        username: this.state.username,
      });
      user
        .signUp()
        .then((val) => this.forceUpdate())
        .catch((error) => alert(error));
    }
  };

  componentWillUnmount() {
    this.props.afterAuthAction();
  }

  render() {
    if (Parse.User.current()) {
      return <Redirect to="/" />;
    }
    return (
      <Form className={this.props.className} onSubmit={this.onSubmit}>
        <FormGroup>
          <Label for="username">Email</Label>
          <MyInput
            name="username"
            type="username"
            placeholder="john@wick.com"
            state={this.state}
            onChange={this.onChange}
          />
        </FormGroup>
        <FormGroup>
          <Label for="password">Password</Label>
          <MyInput
            name="password"
            type="password"
            state={this.state}
            onChange={this.onChange}
          />
        </FormGroup>
        <Row>
          <Col className="text-center">
            <Button type="submit" color="primary">
              Sign Up
            </Button>
          </Col>
        </Row>
      </Form>
    );
  }
}
SignUpForm = styled(SignUpForm)`
  button {
    width: 100%;
  }
`;

class LoginForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
      errors: {},
    };
  }

  onChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  onSubmit = (event) => {
    event.preventDefault();
    const errors = {};
    if (!this.state.username) {
      errors.username = "This field is required";
    }
    if (!this.state.password) {
      errors.password = "This field is required";
    }
    this.setState({ errors });
    if (!Object.keys(errors).length) {
      const user = new Parse.User({
        username: this.state.username,
        password: this.state.password,
      });
      user
        .logIn()
        .then((val) => {
          this.forceUpdate();
        })
        .catch((error) => alert(error));
    }
  };

  googleLogin = () => {
    const authorizeUrl = oAuth2Client.generateAuthUrl({
      scope: ["profile", "email"],
      // response_type: "token",
    });
    window.location = authorizeUrl;
  };

  componentWillUnmount() {
    this.props.afterAuthAction();
  }

  render() {
    if (Parse.User.current()) {
      return <Redirect to="/" />;
    }
    return (
      <Form className={this.props.className} onSubmit={this.onSubmit}>
        <FormGroup>
          <Label for="username">Email</Label>
          <MyInput
            name="username"
            type="text"
            autoComplete="username email"
            placeholder="john@wick.com"
            state={this.state}
            onChange={this.onChange}
          />
        </FormGroup>
        <FormGroup>
          <Label for="password">Password</Label>
          <MyInput
            name="password"
            type="password"
            autoComplete="new-password"
            state={this.state}
            onChange={this.onChange}
          />
        </FormGroup>
        <FormGroup>
          <Button type="submit" color="primary">
            Login
          </Button>
        </FormGroup>
        <FormGroup row>
          <Col className="text-center">
            <Button onClick={this.googleLogin} color="primary">
              Login wtih Google
            </Button>
          </Col>
        </FormGroup>
        <FormGroup>
          <Col className="text-center signup-link">
            Or <Link to="/auth/signup">Sign Up</Link>
          </Col>
        </FormGroup>
      </Form>
    );
  }
}
LoginForm = styled(LoginForm)`
  button {
    width: 100%;
  }
`;

class GoogleCallBack extends Component {
  constructor(props) {
    super(props);
    this.state = {
      authenticated: false,
    };
  }

  async componentDidMount() {
    const code = queryString.parse(this.props.location.search)["code"];
    const response = await oAuth2Client.getToken(code);
    const userData = jwtDecode(response.tokens.id_token);
    const user = new Parse.User();
    await user.linkWith("google", {
      authData: {
        id: userData.sub,
        id_token: response.tokens.id_token,
      },
    });
    if (!user.get("email")) {
      user.set("email", userData.email);
      user.set("username", userData.email);
      user.set("first_name", userData.given_name);
      user.set("last_name", userData.family_name);
      await user.save();
    }
    this.setState({ authenticated: true });
  }

  componentWillUnmount() {
    this.props.afterAuthAction();
  }

  render() {
    if (this.state.authenticated) return <Redirect to="/" />;
    return null;
  }
}
GoogleCallBack = withRouter(GoogleCallBack);

class LogOut extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loggedOut: false,
    };
  }

  componentDidMount() {
    Parse.User.logOut().then(() => {
      this.props.afterAuthAction();
      this.setState({ loggedOut: true });
    });
  }

  render = () => {
    if (this.state.loggedOut) return <Redirect to="/" />;
    return null;
  };
}

export { LoginForm, SignUpForm, LogOut, MyInput, GoogleCallBack };
