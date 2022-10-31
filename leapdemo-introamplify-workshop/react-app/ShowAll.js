import React, {useState, useEffect} from 'react';
import {API} from 'aws-amplify';
import {Spinner, Table} from 'react-bootstrap';
import {Link} from 'react-router-dom';
import alertMe from './alertHelper';
import {dateFormat} from './dateHelper';
import NumberFormat from 'react-number-format';

export default function ShowAll(props) {
	var username = '';
	if (props.user.attributes.email) {
		username = props.user.attributes.email;
	} else {
		username = '';
	}
	const [alertPlaceholder, setAlert] = useState('');
	const [isWaiting, setWaiting] = useState(false);
	const [tableContent, setTableContent] = useState();
	const [isTableContent, setIstTableContent] = useState(false);

	useEffect(() => {
		setAlert('');
		setTableContent([]);

		const myInit = {
			headers: {},
			response: true,
			queryStringParameters: {
				username: username,
				query: 'ALL',
			},
		};
		setWaiting(true);

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
									<Link to={target}>GROCERY BUDGET</Link>
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
				let message = "System error";
				if(error.response.status === 404){
					message = "Data not found";
				}
				const alert = alertMe({
					type: 'danger',
					msg: message,
				});
				setAlert(alert);
				setWaiting(false);
			});
	}, [username]);

	return (
		<div>
			<div style={{marginTop: '10px'}} onClick={() => setAlert('')}>
				{alertPlaceholder}
			</div>
			<div>
				<h3>All Groceries</h3>
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
