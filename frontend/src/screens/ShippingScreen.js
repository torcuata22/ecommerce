import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Form, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import FormContainer from "../components/FormContainer";
import CheckoutSteps from "../components/CheckoutSteps";
import { saveShippingAddress } from "../actions/cartActions";

function ShippingScreen() {
  const cart = useSelector((state) => state.cart);
  //const { shippingAddress } = cart; something is wrong with this (not sure what)

  const dispatch = useDispatch();

  const [address, setAddress] = useState(cart.address); //preload address, so you don't have to refill if you leave and come back
  const [city, setCity] = useState(cart.city); //error message: can't read shippingAddress.address
  const [zipCode, setZipCode] = useState(cart.zipCode);
  const [country, setCountry] = useState(cart.country);

  const navigate = useNavigate();
  const location = useLocation();

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(saveShippingAddress({ address, city, zipCode, country }));
    navigate("/payment");
  };

  return (
    <FormContainer>
      <CheckoutSteps step1 step2 />
      <h1>Shipping</h1>
      <Form onSubmit={submitHandler}>
        <Form.Group controlId="address">
          <Form.Label>Address</Form.Label>
          <Form.Control
            required
            type="text"
            placeholder="Enter your address"
            value={address ? address : ""} //in case address doesn't exist, allows for empty field
            onChange={(e) => setAddress(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Form.Group controlId="city">
          <Form.Label>City</Form.Label>
          <Form.Control
            required
            type="text"
            placeholder="Enter city"
            value={city ? city : ""} //in case address doesn't exist, allows for empty field
            onChange={(e) => setCity(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Form.Group controlId="zipCode">
          <Form.Label>Zip Code</Form.Label>
          <Form.Control
            required
            type="text"
            placeholder="Enter your zip code"
            value={zipCode ? zipCode : ""} //in case address doesn't exist, allows for empty field
            onChange={(e) => setZipCode(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Form.Group controlId="country">
          <Form.Label>Country</Form.Label>
          <Form.Control
            required
            type="text"
            placeholder="Enter country"
            value={country ? country : ""} //in case address doesn't exist, allows for empty field
            onChange={(e) => setCountry(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Button type="submit" variant="primary">
          Next
        </Button>
      </Form>
    </FormContainer>
  );
}

export default ShippingScreen;
