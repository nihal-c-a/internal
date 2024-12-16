import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import Link from 'next/link';
import { FaMoneyBillAlt, FaUsers, FaHistory, FaWallet } from 'react-icons/fa'; // You can import other icons as needed

export default function Home() {
  return (
    <Container fluid>
      <Row className="justify-content-center my-4">
        <Col md={8}>
          <h2 className="text-center mb-4">Asnar Alepa Bro's and Sons'</h2>

          <Row>
            {/* Record New Payment */}
            <Col md={4} className="mb-4">
              <Card className="text-center">
                <Card.Body>
                  <div className="mb-4">
                    <FaMoneyBillAlt size={50} className="rounded-circle bg-primary p-3 text-white" />
                  </div>
                  <Card.Title>Record New Payment</Card.Title>
                  <Link href="/payments">
                    <Button variant="primary" className="w-100">Record Payment</Button>
                  </Link>
                </Card.Body>
              </Card>
            </Col>
           

            <Col md={4} className="mb-4">
              <Card className="text-center">
                <Card.Body>
                  <div className="mb-4">
                    <FaWallet size={50} className="rounded-circle bg-primary p-3 text-white" />
                  </div>
                  <Card.Title>Overall payment</Card.Title>
                  <Link href="/payments-by-user">
                    <Button variant="primary" className="w-100">View</Button>
                  </Link>
                </Card.Body>
              </Card>
            </Col>

{/* Total Payment by User */}
<Col md={4} className="mb-4">
              <Card className="text-center">
                <Card.Body>
                  <div className="mb-4">
                    <FaWallet size={50} className="rounded-circle bg-primary p-3 text-white" />
                  </div>
                  <Card.Title>Payments by a Member</Card.Title>
                  <Link href="/total-payment">
                    <Button variant="primary" className="w-100">View</Button>
                  </Link>
                </Card.Body>
              </Card>
            </Col>


            
          </Row>

          <Row>
            
            {/* Payment History */}
            <Col md={4} className="mb-4">
              <Card className="text-center">
                <Card.Body>
                  <div className="mb-4">
                    <FaHistory size={50} className="rounded-circle bg-primary p-3 text-white" />
                  </div>
                  <Card.Title>Payment History</Card.Title>
                  <Link href="/payment-history">
                    <Button variant="primary" className="w-100">View History</Button>
                  </Link>
                </Card.Body>
              </Card>
            </Col>




            {/* User Management */}
            <Col md={4} className="mb-4">
              <Card className="text-center">
                <Card.Body>
                  <div className="mb-4">
                    <FaUsers size={50} className="rounded-circle bg-primary p-3 text-white" />
                  </div>
                  <Card.Title>Members</Card.Title>
                  <Link href="/users">
                    <Button variant="primary" className="w-100">Manage Members</Button>
                  </Link>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
}
