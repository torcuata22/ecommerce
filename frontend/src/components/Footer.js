import React from "react";
import { Container, Row, Column, Col } from "react-bootstrap";

function Footer() {
  return (
    <footer>
      <Container>
        <Row>
          <Col className="text-center py-3">
            {" "}
            Copyright &copy; From Grandma's Kitchen
          </Col>
        </Row>
      </Container>
    </footer>
  );
}

export default Footer;
