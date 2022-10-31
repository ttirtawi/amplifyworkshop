import React from 'react';
import { Alert } from 'react-bootstrap';


function alertMe(input) {
    return <div><Alert variant={input.type}>{input.msg}</Alert></div>;
    // return input.msg;
}

export default alertMe;