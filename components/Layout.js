import { useRouter } from 'next/router';
import { Container, Button, Row, Col } from 'react-bootstrap';
import Link from 'next/link';

const Layout = ({ children }) => {
  const router = useRouter();

  return (
    <Container fluid>
      {/* Navigation Buttons */}
      <Row className="justify-content-between my-3">
        <Col md={2}>
          <Link href="/">
            <Button variant="secondary">Home</Button>
          </Link>
        </Col>
        <Col md={2} className="text-end">
          <Button variant="secondary" onClick={() => router.back()}>
            Back
          </Button>
        </Col>
      </Row>

      {/* Main Content */}
      <Row>
        <Col>
          {children}
        </Col>
      </Row>
    </Container>
  );
};

export default Layout;
