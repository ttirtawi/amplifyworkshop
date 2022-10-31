import React from 'react';
import './Header.css';
import {Row, Col, Navbar, Nav} from 'react-bootstrap';

function Header() {
	return (
		<Row>
			<Col md={12}>
				<Navbar bg="dark" variant="dark" expand="md">
					<Navbar.Brand href="/">Grocery Tracking</Navbar.Brand>
					<Navbar>
						<Nav className="mr-auto">
							<Nav.Link href="/new">New</Nav.Link>
							<Nav.Link href="/show">View</Nav.Link>
							<Nav.Link href="/report">Report</Nav.Link>
						</Nav>
					</Navbar>
				</Navbar>
			</Col>
		</Row>
	);
}

export default Header;
