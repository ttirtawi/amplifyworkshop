import React, {useState, useEffect} from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import NumberFormat from 'react-number-format';
import alertMe from './alertHelper';
import tableHandlerNew from './tableHandlerNew';
import {Button, Form, Spinner} from 'react-bootstrap';
import {API} from 'aws-amplify';

export default function NewGrocery(props) {
	var username = '';
	if (props.user.attributes.email) {
		username = props.user.attributes.email;
	} else {
		username = '';
	}
	const [grocery_date, setGroceryDate] = useState('');
	const [grocery_name, setGroceryName] = useState('');
	const [grocery_qty, setGroceryQty] = useState(1);
	const [grocery_cost, setGroceryCost] = useState('');
	const [grocery_budget, setGroceryBudget] = useState('');
	const [tempBudget, setTempBudget] = useState('');

	//temporarily hold all added items
	const [groceryList, setGroceryList] = useState([]);
	const [groceryTable, setGroceryTable] = useState('');
	const [requestBody, setRequestBody] = useState([]);

	const [alertPlaceholder, setAlert] = useState('');
	const [isWaiting, setWaiting] = useState(false);
	const [styleDiv, setStyleDiv] = useState({marginTop: '20px'});

	function formatDate(date) {
		let year = date.getFullYear().toString();
		let month = (date.getMonth() + 1).toString();
		let day = date.getDate().toString();
		if (month.length === 1) {
			month = '0' + month;
		}
		if (day.length === 1) {
			day = '0' + day;
		}

		const tempDate = year + '-' + month + '-' + day;
		return tempDate;
	}

	useEffect(() => {
		setAlert('');
	}, [grocery_date, grocery_name, grocery_qty, grocery_cost]);

	//every time groceryList updated, useEffect to call setRequestBody
	useEffect(() => {
		if (grocery_date && grocery_budget) {
			const tempDate = new Date(formatDate(grocery_date)).toISOString();
			setRequestBody({
				grocery_date: tempDate,
				username: username,
				grocery_budget: grocery_budget,
				grocery: groceryList,
			});
		}
	}, [username, grocery_budget, grocery_date, groceryList]);

	//everytime requestBody get updated, let call Table Handler to display it
	useEffect(() => {
		//only call tableHandlerNew when requestBody is not empty
		if (requestBody.grocery_budget) {
			const resp = tableHandlerNew(requestBody);
			setGroceryTable(resp);
			setGroceryQty('1');
			setGroceryName('');
			setGroceryCost('');
		}
	}, [requestBody]);

	function setBudget(e) {
		e.preventDefault();
		setGroceryBudget(tempBudget);
		setStyleDiv({marginTop: '20px', display: 'none'});
		return true;
	}
	function addGroceryItem(e) {
		// to handle the  item input, this is only local
		// not to submit to the server
		e.preventDefault();
		if (!grocery_name || !grocery_cost) {
			const alert = alertMe({
				type: 'danger',
				msg: 'Please complete the form',
			});
			setAlert(alert);
		} else {
			const newItemBelanja = {
				grocery_name: grocery_name,
				grocery_cost: grocery_cost,
				grocery_qty: grocery_qty,
			};
			setGroceryList([...groceryList, newItemBelanja]);
		}
	}

	function budgetHandler(e) {
		e.preventDefault();
		const re = /^[0-9\b]+$/;
		if (e.target.value === '' || re.test(e.target.value)) {
			setTempBudget(e.target.value);
		}
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

	function saveData(e) {
		const myInit = {
			headers: {},
			response: true,
			body: requestBody,
		};
		//Submit data
		setWaiting(true);
		API.post(process.env.REACT_APP_API_NAME,  process.env.REACT_APP_API_PATH, myInit)
			.then((response) => {
				setWaiting(false);
				const alert = alertMe({
					type: 'success',
					msg: 'Successfully store the data',
				});
				setAlert(alert);
			})
			.catch(function (error) {
				// handle error
				const alert = alertMe({
					type: 'danger',
					msg: error.response.data.message,
				});
				setAlert(alert);
				setWaiting(false);
			});
		//reset all state
		setGroceryDate('');
		setGroceryBudget('');
		setGroceryTable('');
	}

	function resetAll(e) {
		//reset all state
		setGroceryDate('');
		setGroceryBudget('');
		setGroceryTable('');
	}

	return (
		<div>
			<div style={{marginTop: '10px'}} onClick={() => setAlert('')}>
				{alertPlaceholder}
			</div>

			<div>
				<h3>New Groceries</h3>
				<p>Choose the date</p>
				<DatePicker
					selected={grocery_date}
					onChange={(date) => setGroceryDate(date)}
				/>
			</div>

			{isWaiting ? (
				<div style={{marginTop: '10px'}}>
					<Spinner animation="border" role="status">
						<span className="sr-only">Loading...</span>
					</Spinner>
				</div>
			) : (
				''
			)}

			{grocery_date ? (
				// If grocery_date is set, start with the grocery_budget
				<div style={styleDiv}>
					<Form onSubmit={setBudget}>
						<Form.Group controlId="formItemName">
							<Form.Label>Budget</Form.Label>
							<Form.Control
								value={tempBudget}
								onChange={budgetHandler}
								type="number"
								size="lg"
								placeholder="Enter your budget"
								autoComplete="off"
								onKeyDown={(e) =>
									(e.keyCode === 69 ||
										e.keyCode === 190 ||
										e.keyCode === 189 ||
										e.keyCode === 188 ||
										e.keyCode === 187) &&
									e.preventDefault()
								}
							/>
						</Form.Group>
						<Button variant="outline-info" size="xl" type="submit">
							Set Budget
						</Button>
					</Form>
				</div>
			) : (
				''
			)}

			{grocery_budget ? (
				<div style={{marginTop: '20px'}}>
					<h4>
						Grocery Budget :{' '}
						<NumberFormat
							value={grocery_budget}
							displayType={'text'}
							thousandSeparator={true}
							prefix={'Rp '}
						/>
					</h4>
					<p>Lets add grocery item</p>
					<Form onSubmit={addGroceryItem}>
						<Form.Group controlId="formItemName">
							<Form.Label>Name</Form.Label>
							<Form.Control
								size="lg"
								value={grocery_name}
								onChange={grocery_nameHandler}
								type="text"
								placeholder="Enter item name"
								autoComplete="off"
							/>
						</Form.Group>

						<Form.Group controlId="formItemQty">
							<Form.Label>Quantity</Form.Label>
							<Form.Control
								size="lg"
								value={grocery_qty}
								onChange={grocery_qtyHandler}
								type="number"
								placeholder="Enter the quantity"
								autoComplete="off"
								onKeyDown={(e) =>
									(e.keyCode === 69 ||
										e.keyCode === 190 ||
										e.keyCode === 189 ||
										e.keyCode === 188 ||
										e.keyCode === 187) &&
									e.preventDefault()
								}
							/>
						</Form.Group>

						<Form.Group controlId="formTotalPrice">
							<Form.Label>Total Price</Form.Label>
							<Form.Control
								size="lg"
								value={grocery_cost}
								onChange={grocery_costHandler}
								type="number"
								placeholder="Enter the total price"
								autoComplete="off"
								onKeyDown={(e) =>
									(e.keyCode === 69 ||
										e.keyCode === 190 ||
										e.keyCode === 189 ||
										e.keyCode === 188 ||
										e.keyCode === 187) &&
									e.preventDefault()
								}
							/>
						</Form.Group>

						<Button variant="outline-info" size="xl" type="submit">
							Add Item
						</Button>
					</Form>
				</div>
			) : (
				''
			)}

			<div style={{marginTop: '20px'}}>{groceryTable}</div>

			{groceryTable ? (
				<div>
					<Button
						onClick={saveData}
						variant="primary"
						style={{marginRight: '10px'}}
					>
						Save
					</Button>
					<Button onClick={resetAll} variant="danger">
						Reset
					</Button>
				</div>
			) : (
				''
			)}
		</div>
	);
}
