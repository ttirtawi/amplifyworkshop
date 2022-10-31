import React, {useState} from 'react';
import {Spinner, Form, Button} from 'react-bootstrap';
import alertMe from './alertHelper';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import {API} from 'aws-amplify';

function Report(props) {
	var username = '';
	if (props.user.attributes.email) {
		username = props.user.attributes.email;
	} else {
		username = '';
	}
	const [alertPlaceholder, setAlert] = useState('');
	const [isWaiting, setWaiting] = useState(false);
	const [startDate, setStartDate] = useState('');
	const [endDate, setEndDate] = useState('');
	const [s3url, setS3url] = useState('');

	function generateReport(e) {
		e.preventDefault();

		const myInit = {
			headers: {},
			response: true,
			body: {
				username: username,
				start_report: startDate,
				end_report: endDate,
			},
		};

		setWaiting(true);
		API.post(process.env.REACT_APP_API_NAME,  process.env.REACT_APP_API_PATH_REPORT, myInit)
			.then((resp) => {
				setS3url(resp.data.url);
				setWaiting(false);
			})
			.catch(function (error) {
				// handle error
				if (error.response.status === 404) {
					const alert = alertMe({
						type: 'danger',
						msg: 'Data not found',
					});
					setAlert(alert);
					setWaiting(false);
				} else {
					const alert = alertMe({
						type: 'danger',
						msg: 'System error',
					});
					setAlert(alert);
					setWaiting(false);
				}
			});
	}
	return (
		<div>
			<div style={{marginTop: '10px'}} onClick={() => setAlert('')}>
				{alertPlaceholder}
			</div>
			<div>
				<div>
					<h3>Groceries Report</h3>
					<p>Pick report period</p>
					<div>
						<Form onSubmit={generateReport}>
							<Form.Group>
								<Form.Label>Start Date</Form.Label>
								<div>
									<DatePicker
										selected={startDate}
										onChange={(date) => setStartDate(date)}
									/>
								</div>
							</Form.Group>
							<Form.Group>
								<Form.Label>End Date</Form.Label>
								<div>
									<DatePicker
										selected={endDate}
										onChange={(date) => setEndDate(date)}
									/>
								</div>
							</Form.Group>
							<Button variant="info" size="xl" type="submit">
								Generate Report
							</Button>
						</Form>
					</div>
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
			<div>{s3url ? <a href={s3url}>Download Report</a> : ''}</div>
		</div>
	);
}

export default Report;
