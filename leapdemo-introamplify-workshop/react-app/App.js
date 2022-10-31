import React, {useState, useEffect} from 'react';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import {Container, Row, Col} from 'react-bootstrap';
import './App.css';
import Header from './Header';
import Home from './Home';
import NewGrocery from './NewGrocery';
import ShowByDate from './ShowByDate';
import ShowDetail from './ShowDetail';
import ShowAll from './ShowAll';
import Report from './Report';

import Amplify from 'aws-amplify';
import {
	AmplifyAuthenticator,
	AmplifySignOut,
	AmplifySignIn,
} from '@aws-amplify/ui-react';
import {AuthState, onAuthUIStateChange} from '@aws-amplify/ui-components';
import awsconfig from './aws-exports';

Amplify.configure(awsconfig);

function App() {
	const [authState, setAuthState] = useState();
	const [user, setUser] = useState();

	useEffect(() => {
		return onAuthUIStateChange((nextAuthState, authData) => {
			setAuthState(nextAuthState);
			setUser(authData);
		});
	}, []);

	if (authState === AuthState.SignedIn && user) {
		return (
			<div className="app">
				<Container>
					<Header />
					<div style={{padding: '20px'}}>
						<Router>
							<Switch>
								<Route path="/" exact>
									<>
										<Home user={user} />
									</>
								</Route>
								<Route path="/new" exact>
									<Row>
										<Col md={12}>
											<NewGrocery user={user} />
										</Col>
									</Row>
								</Route>
								<Route path="/show" exact>
									<Row>
										<Col md={12}>
											<ShowByDate user={user} />
										</Col>
									</Row>
								</Route>
								<Route path="/showall" exact>
									<Row>
										<Col md={12}>
											<ShowAll user={user} />
										</Col>
									</Row>
								</Route>
								<Route path="/showdetail" exact>
									<Row>
										<Col md={12}>
											<ShowDetail user={user} />
										</Col>
									</Row>
								</Route>
								<Route path="/report" exact>
									<Row>
										<Col md={12}>
											<Report user={user} />
										</Col>
									</Row>
								</Route>
							</Switch>
						</Router>
					</div>
					<Row>
						<Col md={12}>
							<div style={{marginTop: '80px'}}>
								<AmplifySignOut />
							</div>
						</Col>
					</Row>
				</Container>
			</div>
		);
	} else {
		return (
			<div
				style={{
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center',
					height: '100vh',
					marginTop: '20px',
				}}
			>
				<AmplifyAuthenticator className="justify-content-center align-self-center my-auto">
					<AmplifySignIn />
				</AmplifyAuthenticator>
			</div>
		);
	}
}
export default App;
