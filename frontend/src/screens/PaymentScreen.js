import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Form, Button, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import FormContainer from "../components/FormContainer";
import CheckoutSteps from "../components/CheckoutSteps";
import { savePaymentMethod } from "../actions/cartActions";

function PaymentScreen() {
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState("PayPal");

  const cart = useSelector((state) => state.cart);
  //const { shippingAddress } = cart;

  const dispatch = useDispatch();

  if (!cart.address) {
    navigate("/login/shipping");

    const submitHandler = (e) => {
      e.preventDefault();
      dispatch(savePaymentMethod(paymentMethod));
      navigate("/placeorder");
    };
    return (
      <FormContainer>
        <CheckoutSteps step1 step2 step3 />

        <Form onSubmit={submitHandler}>
          <Form.Group>
            <Form.Label as="legend">Select Method</Form.Label>
            <Col>
              <Form.Check
                type="radio"
                label="PayPal"
                id="paypal"
                name="paymentMethod"
                checked
                onChange={(e) => setPaymentMethod(e.target.value)}
              ></Form.Check>

              {/* If I try to add this, it doesn't register as a payment method, it keeps saying PayPal 
              <Form.Check
                type="radio"
                label="Credit Card"
                id="creditCard"
                name="paymentMethod"
                checked
                onChange={(e) => setPaymentMethod(e.target.value)}
              ></Form.Check> */}
            </Col>
          </Form.Group>

          <Button type="submit" variant="primary">
            Continue
          </Button>
        </Form>
      </FormContainer>
    );
  }
}

export default PaymentScreen;
