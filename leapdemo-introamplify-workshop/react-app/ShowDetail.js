import React, {useState, useEffect} from 'react';
import {Spinner, Form, Button, Row, Col} from 'react-bootstrap';
import {useLocation} from 'react-router-dom';
import alertMe from './alertHelper';
import {API} from 'aws-amplify';
import querystring from 'query-string';
import {dateFormat} from './dateHelper';
import {useHistory} from 'react-router-dom';

function ShowDetail(props) {
	const [alertPlaceholder, setAlert] = useState('');
	const [isWaiting, setWaiting] = useState(false);
	const [isGroceryBudget, setIsGroceryBudget] = useState(false);
	const [isGroceryItem, setIsGroceryItem] = useState(false);
	const history = useHistory();

	const [grocery_budget, setGroceryBudget] = useState('');
	const [grocery_date, setGroceryDate] = useState('');
	const [grocery_id, setGroceryId] = useState('');
	const [grocery_index, setGroceryIndex] = useState('');
	const [grocery_name, setGroceryName] = useState('');
	const [grocery_cost, setGroceryCost] = useState('');
	const [grocery_qty, setGroceryQty] = useState('');

	const [isDisable, setIsDisable] = useState(true);

	var username = '';
	if (props.user.attributes.email) {
		username = props.user.attributes.email;
	} else {
		username = '';
	}
	const data = useLocation();
	const tempQuery = querystring.parse(data.search).query;
	const tempGroceryId = querystring.parse(data.search).grocery_id;
	const tempGroceryDate = querystring.parse(data.search).grocery_date;

	useEffect(() => {
		const myInit = {
			headers: {},
			response: true,
			queryStringParameters: {
				username: username,
				query: tempQuery,
				grocery_id: tempGroceryId,
				grocery_date: tempGroceryDate,
			},
		};

		setWaiting(true);
		API.get(process.env.REACT_APP_API_NAME,  process.env.REACT_APP_API_PATH, myInit)
			.then((resp) => {
				if (tempQuery === 'GROCERYBUDGET') {
					setIsGroceryBudget(true);
					setGroceryBudget(
						parseInt(resp.data.message.grocerybudget[0].grocery_budget),
						10
					);
					setGroceryDate(resp.data.message.grocerybudget[0].grocery_date);
					setGroceryId(resp.data.message.grocerybudget[0].grocery_id);
				} else if (tempQuery === 'GROCERYITEM') {
					setIsGroceryItem(true);
					setGroceryDate(resp.data.message.groceryitem[0].grocery_date);
					setGroceryId(resp.data.message.groceryitem[0].grocery_id);
					setGroceryIndex(resp.data.message.groceryitem[0].grocery_index);
					setGroceryName(resp.data.message.groceryitem[0].grocery_name);
					setGroceryCost(resp.data.message.groceryitem[0].grocery_cost);
					setGroceryQty(resp.data.message.groceryitem[0].grocery_qty);
				}
				setWaiting(false);
			})
			.catch((error) => {
				// handle error
				const alert = alertMe({
					type: 'danger',
					msg: error.response.statusText,
				});
				setAlert(alert);
				setWaiting(false);
			});
	}, [username, tempQuery, tempGroceryDate, tempGroceryId]);

	function submitHandler(e) {
		e.preventDefault();
		let requestBody = '';
		if (tempQuery === 'GROCERYITEM') {
			requestBody = {
				grocery_id: grocery_id,
				grocery_index: grocery_index,
				grocery_date: grocery_date,
				grocery_budget: grocery_budget,
				username: username,
				grocery_name: grocery_name,
				grocery_cost: grocery_cost,
				grocery_qty: grocery_qty,
				query: 'GROCERYITEM',
			};
		} else if (tempQuery === 'GROCERYBUDGET') {
			requestBody = {
				grocery_id: grocery_id,
				grocery_date: grocery_date,
				grocery_budget: grocery_budget,
				username: username,
				query: 'GROCERYBUDGET',
			};
		}

		const myInit = {
			headers: {},
			body: requestBody,
		};

		setWaiting(true);
		API.put(process.env.REACT_APP_API_NAME,  process.env.REACT_APP_API_PATH, myInit)
			.then((resp) => {
				const alert = alertMe({
					type: 'success',
					msg: resp.message,
				});
				setWaiting(false);
				setAlert(alert);
				setIsDisable(true);
			})
			.catch(function (error) {
				const alert = alertMe({
					type: 'danger',
					msg: error.response.statusText,
				});
				setAlert(alert);
				setWaiting(false);
			});
	}

	function grocery_budgetHandler(e) {
		e.preventDefault();
		const re = /^[0-9\b]+$/;
		if (e.target.value === '' || re.test(e.target.value)) {
			setGroceryBudget(e.target.value);
		}
		return true;
	}

	function grocery_nameHandler(e) {
		setGroceryName(
			e.target.value
				.toLowerCase()
				.replace(/^[a-zA-z]|\s(.)/gi, (L) => L.toUpperCase())
		);
	}
	function grocery_qtyHandler(e) {
		const re = /^[0-9\b]+$/;
		if (e.target.value === '' || re.test(e.target.value)) {
			setGroceryQty(e.target.value);
		}
	}
	function grocery_costHandler(e) {
		const re = /^[0-9\b]+$/;
		if (e.target.value === '' || re.test(e.target.value)) {
			setGroceryCost(e.target.value);
		}
	}

	function deleteHandler(e) {
		e.preventDefault();
		setWaiting(true);
		let requestBody = '';
		if (tempQuery === 'GROCERYITEM') {
			requestBody = {
				username: username,
				grocery_id: grocery_id,
				grocery_index: grocery_index,
				grocery_date: grocery_date,
				query: tempQuery,
			};
		} else if (tempQuery === 'GROCERYBUDGET') {
			requestBody = {
				username: username,
				grocery_id: grocery_id,
				grocery_date: grocery_date,
				query: tempQuery,
			};
		}

		const myInit = {
			headers: {},
			response: true,
			body: requestBody,
		};
		setWaiting(true);
		API.del(process.env.REACT_APP_API_NAME,  process.env.REACT_APP_API_PATH, myInit)
			.then((resp) => {
				history.push('/');
			})
			.catch(function (error) {
				const alert = alertMe({
					type: 'danger',
					msg: error.response.statusText,
				});
				setAlert(alert);
				setWaiting(false);
			});
	}

	return (
		<>
			<Row>
				<Col md={12}>
					<div style={{marginTop: '10px'}}>
						<div>
							<h3>Item Detail</h3>
						</div>
					</div>
					<div style={{marginTop: '10px'}} onClick={() => setAlert('')}>
						{alertPlaceholder}
					</div>

					{isWaiting ? (
						<div>
							<Spinner animation="border" role="status">
								<span className="sr-only">Loading...</span>
							</Spinner>
						</div>
					) : (
						''
					)}
				</Col>
			</Row>
			<Row>
				<Col md={12}>
					<Form onSubmit={submitHandler}>
						<Form.Group controlId="formItemName">
							<Form.Label>
								On {dateFormat(grocery_date)},{' '}
								{isGroceryBudget ? ' you have grocery budget:' : ' you bought:'}
							</Form.Label>
							{isGroceryBudget ? (
								<Form.Control
									size="lg"
									value={grocery_budget}
									onChange={grocery_budgetHandler}
									type="number"
									placeholder="Input your grocery budget"
									autoComplete="off"
									disabled={isDisable}
								/>
							) : (
								<Form.Control
									size="lg"
									value={grocery_name}
									onChange={grocery_nameHandler}
									type="text"
									placeholder="Input your grocery item"
									autoComplete="off"
									disabled={isDisable}
								/>
							)}
						</Form.Group>

						{isGroceryItem ? (
							<>
								<Form.Group controlId="formItemName">
									<Form.Label>as many as:</Form.Label>
									<Form.Control
										size="lg"
										value={grocery_qty}
										onChange={grocery_qtyHandler}
										type="number"
										placeholder="Input your grocery quantity"
										autoComplete="off"
										disabled={isDisable}
									/>
								</Form.Group>
								<Form.Group controlId="formItemName">
									<Form.Label>and cost you:</Form.Label>
									<Form.Control
										size="lg"
										value={grocery_cost}
										onChange={grocery_costHandler}
										type="number"
										placeholder="Input your grocery cost"
										autoComplete="off"
										disabled={isDisable}
									/>
								</Form.Group>
							</>
						) : (
							''
						)}

						{isDisable ? (
							<div style={{display: 'flex'}}>
								<div style={{marginRight: '5px'}}>
									<Button
										variant="info"
										size="xl"
										onClick={(e) => {
											e.preventDefault();
											setIsDisable(false);
										}}
									>
										Click here to UPDATE
									</Button>
								</div>
								<div>
									<Button variant="danger" size="xl" onClick={deleteHandler}>
										Click here to DELETE
									</Button>
								</div>
							</div>
						) : (
							<div style={{display: 'flex'}}>
								<div style={{marginRight: '5px'}}>
									<Button variant="primary" size="xl" type="submit">
										Save
									</Button>
								</div>
								<div>
									<Button
										variant="danger"
										size="xl"
										onClick={() => {
											setIsDisable(true);
											setAlert('');
										}}
									>
										Cancel
									</Button>
								</div>
							</div>
						)}
					</Form>
				</Col>
			</Row>
		</>
	);
}

export default ShowDetail;
