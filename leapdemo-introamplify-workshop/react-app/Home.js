import React from 'react';
import {Row, Col, Button} from 'react-bootstrap';
import styled from 'styled-components';
import {useHistory} from 'react-router-dom';
const Banner = styled.div`
	width: 100%;
	margin: 0px auto;
	object-fit: contain;
	white-space: normal;
	overflow: hidden;
	text-overflow: ellipsis;
	color: black;
`;
const BannerTitle = styled.h1`
	font-size: 1.4em;
	font-weight: 600;
	color: Crimson;
`;

const BannerContent = styled.p`
	font-size: 18px;
	font-weight: 400;
`;

function Home(props) {
	const history = useHistory();

	function showAllHandler(e) {
		e.preventDefault();
		history.push('/showall');
	}

	return (
		<div style={{marginTop: '20px'}}>
			<Row>
				<Col md={12}>
					<Banner>
						<BannerTitle>Hi, {props.user.attributes.email} ! </BannerTitle>
						<BannerContent>
							This is a simple app to tracking your daily grocery. To add new
							grocery list, click on <b>New</b> button on the top navbar. To
							check previous grocery click on the <b>View</b> button - or click{' '}
							<b>Show All</b> button below to display all history.
						</BannerContent>
					</Banner>
					<div>
						<Button
							size="lg"
							onClick={showAllHandler}
							block
							variant="outline-info"
						>
							Show All
						</Button>
					</div>
				</Col>
			</Row>
		</div>
	);
}

export default Home;
