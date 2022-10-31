import React, {useState, useEffect} from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import {Spinner, Table} from 'react-bootstrap';
import {Link} from 'react-router-dom';
import alertMe from './alertHelper';
import {dateFormat} from './dateHelper';
import NumberFormat from 'react-number-format';
import {API} from 'aws-amplify';

export default function ShowByDate(props) {
	var username = '';
	if (props.user.attributes.email) {
		username = props.user.attributes.email;
	} else {
		username = '';
	}
	const [alertPlaceholder, setAlert] = useState('');
	const [listGrocery, setListGrocery] = useState([]);
	const [grocery_date, setGroceryDate] = useState('');
	const [isWaiting, setWaiting] = useState(false);
	const [tableContent, setTableContent] = useState();
	const [isTableContent, setIstTableContent] = useState(false);

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
		setListGrocery([]);
		setTableContent([]);
		if (grocery_date) {
			setWaiting(true);

			const myInit = {
				headers: {},
				response: true,
				queryStringParameters: {
					username: username,
					grocery_date: formatDate(new Date(grocery_date)),
					query: 'DATE',
				},
			};
			API.get(process.env.REACT_APP_API_NAME,  process.env.REACT_APP_API_PATH, myInit)
				.then((resp) => {
					const data = resp.data.message;
					let counter = 0;
					let temp1 = '';
					let temp2 = '';
					if (data.grocerybudget) {
						temp1 = data.grocerybudget.map((item) => {
							counter = counter + 1;
							const target =
								'/showdetail?query=GROCERYBUDGET&grocery_id=' +
								item.grocery_id +
								'&grocery_date=' +
								item.grocery_date;

							return (
								<tr key={item.grocery_id + counter}>
									<td style={{textAlign: 'center'}}>{counter}</td>
									<td>{dateFormat(item.grocery_date)}</td>
									<td>
										<Link to={target}>GROCERY BUDGET </Link>
									</td>
									<td style={{textAlign: 'center'}}>-</td>
									<td style={{textAlign: 'right'}}>
										<NumberFormat
											value={item.grocery_budget}
											displayType={'text'}
											thousandSeparator={true}
											prefix={'Rp '}
										/>
									</td>
								</tr>
							);
						});
					}
					if (data.groceryitem) {
						temp2 = data.groceryitem.map((item) => {
							counter = counter + 1;
							const target =
								'/showdetail?query=GROCERYITEM&grocery_id=' +
								item.grocery_id +
								item.grocery_index +
								'&grocery_date=' +
								item.grocery_date;

							return (
								<tr key={item.grocery_id + item.grocery_index}>
									<td style={{textAlign: 'center'}}>{counter}</td>
									<td>{dateFormat(item.grocery_date)}</td>
									<td>
										<Link to={target}>
											{item.grocery_name
												.toLowerCase()
												.replace(/^[a-zA-z]|\s(.)/gi, (L) => L.toUpperCase())}
										</Link>
									</td>
									<td style={{textAlign: 'center'}}>{item.grocery_qty}</td>
									<td style={{textAlign: 'right'}}>
										<NumberFormat
											value={item.grocery_cost}
											displayType={'text'}
											thousandSeparator={true}
											prefix={'Rp '}
										/>
									</td>
								</tr>
							);
						});
					}
					setTableContent((tableContent) => [...tableContent, temp1]);
					setTableContent((tableContent) => [...tableContent, temp2]);
					setIstTableContent(true);
					setWaiting(false);
				})
				.catch(function (error) {
					// handle error
					console.log(error);
					if (error.response.status === 404) {
						const alert = alertMe({
							type: 'danger',
							msg: 'Data not found',
						});
						setAlert(alert);
						setWaiting(false);
					}
				});
		}
	}, [grocery_date, username]);

	return (
		<div>
			<div style={{marginTop: '10px'}} onClick={() => setAlert('')}>
				{alertPlaceholder}
			</div>
			<div>
				<div>
					<h3>View Groceries</h3>
					<p>Choose the date</p>
					<DatePicker
						selected={grocery_date}
						onChange={(date) => setGroceryDate(date)}
					/>
				</div>
			</div>
			<br />

			{isWaiting ? (
				<div>
					<Spinner animation="border" role="status">
						<span className="sr-only">Loading...</span>
					</Spinner>
				</div>
			) : (
				''
			)}
			<div>{listGrocery}</div>
			{isTableContent ? (
				<div style={{marginTop: '20px'}}>
					<Table striped bordered hover responsive size="xl">
						<thead>
							<tr style={{textAlign: 'center'}}>
								<th style={{width: '10%'}}>#</th>
								<th style={{width: '20%'}}>Date</th>
								<th>Item</th>
								<th>Qty</th>
								<th>Total</th>
							</tr>
						</thead>
						<tbody>{tableContent}</tbody>
					</Table>
				</div>
			) : (
				''
			)}
		</div>
	);
}
