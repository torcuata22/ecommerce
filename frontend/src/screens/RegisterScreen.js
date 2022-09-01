import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Form, Button, Row, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../components/Loader";
import Message from "../components/Message";
import { register } from "../actions/userActions";
import FormContainer from "../components/FormContainer";

function RegisterScreen() {
  const [first_name, setFirstName] = useState(""); //used to be [name, setName]
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();
  const location = useLocation();

  const dispatch = useDispatch();

  const redirect = location.search ? location.search.split("=")[1] : "/";

  const userRegister = useSelector((state) => state.userRegister);
  const { error, loading, userInfo } = userRegister;

  useEffect(() => {
    if (userInfo) {
      navigate(redirect); //could this be the problem?
    }
  }, [navigate, userInfo, redirect]);

  const submitHandler = (e) => {
    e.preventDefault();

    //shouldn't I check for email also?
    if (password !== confirmPassword) {
      setMessage("Passwords do not match");
    } else {
      dispatch(register(first_name, email, password));
    }
  };

  return (
    <FormContainer>
      <h1>Register</h1>
      {message && <Message variant="danger">{message}</Message>}

      {error && <Message variant="danger">{error}</Message>}
      {loading && <Loader />}

      <Form onSubmit={submitHandler}>
        <Form.Group controlId="first_name">
          <Form.Label>Your First Name</Form.Label>
          <Form.Control
            required
            type="name"
            placeholder="Enter your first name"
            value={first_name} //used to be name (but in Django it's first_name)
            onChange={(e) => setFirstName(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Form.Group controlId="email">
          <Form.Label>Email Address</Form.Label>
          <Form.Control
            required
            type="email"
            placeholder="Enter Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Form.Group controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control
            required
            type="password"
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Form.Group controlId="passwordConfirm">
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control
            required
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Button type="submit" variant="primary">
          Register
        </Button>
      </Form>
      <Row className="py-3">
        <Col>
          Already have an account?{" "}
          <Link to={redirect ? `/register?redirect=${redirect}` : "/login"}>
            Sign In
          </Link>
        </Col>
      </Row>
    </FormContainer>
  );
}

export default RegisterScreen;
