import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Form, Button, Row, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../components/Loader";
import Message from "../components/Message";
import { getUserDetails } from "../actions/userActions";

function ProfileScreen() {
  const [first_name, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const userDetails = useSelector((state) => state.userDetails);
  const { error, loading, user } = userDetails; //we need the user object, not userInfo

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin; //because we need to make sure user is logged in before we let them access profile

  useEffect(() => {
    if (!userInfo) {
      navigate("/login");
    } else {
      if (!user || !user.name) {
        dispatch(getUserDetails("profile"));
      } else {
        setFirstName(user.first_name);
        setEmail(user.email);
      }
    }
  }, [dispatch, navigate, userInfo, user]);

  const submitHandler = (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setMessage("Passwords do not match");
    } else {
      console.log("Updating...");
    }
  };

  return (
    <Row>
      <Col md={3}>
        <h2>User Profile</h2>
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
              type="password"
              placeholder="Enter Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            ></Form.Control>
          </Form.Group>

          <Form.Group controlId="passwordConfirm">
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            ></Form.Control>
          </Form.Group>

          <Button type="submit" variant="primary">
            Update
          </Button>
        </Form>
      </Col>
      <Col md={9}>
        <h2>My orders</h2>
      </Col>
    </Row>
  );
}

export default ProfileScreen;
