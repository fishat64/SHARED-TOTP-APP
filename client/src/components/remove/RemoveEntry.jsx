import React, { useState, useRef } from 'react';
import API from '../../lib/api';

import language from '../../lang';


import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import Accordion from 'react-bootstrap/Accordion';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';


const getLangStr = language("components/remove");
const r1 = Math.floor(Math.random() * 10);
const r2 = Math.floor(Math.random() * 10);


export default function RemoveEntry() {

    const [password, setPassword] = useState('');
    const [id, setId] = useState('');
    const [success, setSuccess] = useState('N/A');
    const [testval, setTestval] = useState(-1);

    const handleChangePassword = event => {
        setPassword(event.target.value);
    };

    const handleTestChange = event => {
        setTestval(parseInt(event.target.value));
    };

    const handleChangeIdentifier = event => {
        setId(event.target.value);
    };

    const handleSubmit = async event => {
        event.preventDefault();

        if (typeof id !== 'string') return;
        if (typeof password !== 'string') return;
        if ((r1 + r2) !== testval) return;

        const result = await API.post('remove', {
            id,
            password,
        }).catch(function (error) {
            setSuccess(getLangStr("somethingWentWrong") + error);
        });

        if(!result) return;

        if (!result || result.data.error != null || result.data.result === null) {
            setSuccess(getLangStr("somethingWentWrong") + result.data.error);
        } else {
            setSuccess(getLangStr("SuccessRemoved") + " " + id);
        }
    };


    return (
        <Card>
            <Card.Header>
                <Accordion.Toggle as={Button} variant="link" eventKey="2">
                    <h2>
                        {getLangStr("REMOVETOTP")}
                    </h2>
                </Accordion.Toggle>
            </Card.Header>
            <Accordion.Collapse eventKey="2">
                <Card.Body>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group controlId="fromId">
                            <Form.Label className="text-muted">{getLangStr("IDENTIFIER")}</Form.Label>
                            <Form.Control type="text" onChange={handleChangeIdentifier} placeholder={getLangStr("IDENTIFIER")} />
                        </Form.Group>
                        <Form.Group controlId="formPassword">
                            <Form.Label className="text-muted">{getLangStr("PASSWORD")}</Form.Label>
                            <Form.Control type="password" onChange={handleChangePassword} placeholder={getLangStr("PASSWORD")} />
                        </Form.Group>
                        <Form.Group controlId="formTest">
                            <Form.Label className="text-muted">{getLangStr("AREYOUSURE")}</Form.Label><br />
                            <Form.Text className="text-muted">{r1} + {r2} = </Form.Text><Form.Control type="number" onChange={handleTestChange} placeholder={getLangStr("TEST")} />
                        </Form.Group>
                        <Button variant="danger" type="submit">
                            {getLangStr("SUBMIT")}
                        </Button>
                    </Form>
                    <br />
                    <Alert variant="danger">
                        {success}
                    </Alert>
                </Card.Body>
            </Accordion.Collapse>
        </Card>
    )
};