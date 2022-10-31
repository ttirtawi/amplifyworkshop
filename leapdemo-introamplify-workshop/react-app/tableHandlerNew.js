import React from 'react';
import {Table} from 'react-bootstrap';
import NumberFormat from 'react-number-format';

function tableHandler(input) {
	console.log('here here ', input);
	var counter = 0;
	var tempBody1 = '';
	var tempBody2 = '';
	var tempBody = [];
	var sourceGrocery = '';
	var sourceGroceryBudget = '';

	if (input.grocery) {
		sourceGrocery = input.grocery;
	}

	if (input.grocery_budget) {
		sourceGroceryBudget = input.grocery_budget;
	}

	const header = ['No', 'Product', 'Quantity', 'Total Price'];
	const tempHeader = header.map((item, index) => {
		return (
			<th style={{textAlign: 'center'}} key={index + 1}>
				{item}
			</th>
		);
	});

	if (sourceGroceryBudget) {
		//create table body for grocery budget
		tempBody1 = (
			<tr key={counter}>
				<td style={{textAlign: 'center', width: '5%'}}>
					{(counter = counter + 1)}
				</td>
				<td colSpan="2">Uang Belanja</td>
				<td style={{textAlign: 'right'}}>
					<NumberFormat
						value={sourceGroceryBudget}
						displayType={'text'}
						thousandSeparator={true}
						prefix={'Rp '}
					/>
				</td>
			</tr>
		);
	}

	if (sourceGrocery) {
		//create table body for grocery
		console.log('does it go here');
		tempBody2 = sourceGrocery.map((item, index) => {
			console.log(item);
			return (
				<tr key={counter}>
					<td style={{textAlign: 'center', width: '5%'}}>
						{(counter = counter + 1)}
					</td>
					<td>{item.grocery_name}</td>
					<td style={{textAlign: 'right', width: '5%'}}>{item.grocery_qty}</td>
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

	if (tempBody1) {
		tempBody = [...tempBody, tempBody1];
	}
	if (tempBody2) {
		tempBody = [...tempBody, tempBody2];
	}

	const table = (
		<Table responsive="sm" bordered hover size="sm">
			<thead>
				<tr>{tempHeader}</tr>
			</thead>
			<tbody>{tempBody}</tbody>
		</Table>
	);
	return table;
}

export default tableHandler;
