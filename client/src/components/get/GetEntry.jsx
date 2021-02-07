import React, { useState, useRef } from 'react';
import API from '../../lib/api';

import language from '../../lang';



import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import Accordion from 'react-bootstrap/Accordion';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl'


const getLangStr = language("components/get");

export default function GetEntry() {

    const [copySuccess, setCopySuccess] = useState(false);
    const [password, setPassword] = useState('');
    const [id, setId] = useState('');
    const [token, setToken] = useState('N/A');

    const textAreaRef = useRef(null);

    const copyToClipboard = (e) => {
        textAreaRef.current.select();
        document.execCommand('copy');
        e.target.focus();
        setCopySuccess(true);
    };

    const handleChangePassword = event => {
        setPassword(event.target.value);
    };

    const handleChangeIdentifier = event => {
        setId(event.target.value);
    };

    const handleSubmit = async event => {
        event.preventDefault();

        if (typeof id !== 'string') return;
        if (typeof password !== 'string') return;

        const result = await API.post('get', {
            id,
            password,
        }).catch(function (error) {
            setToken(getLangStr("somethingWentWrong") + error);
        });

        if(!result) return;

        if (!result || result.data.error != null || result.data.result === null) {
            setToken(getLangStr("somethingWentWrong") + result.data.error);
        } else {
            setToken(result.data.result.otp);
        }
    };


    return (
        <Card>
            <Card.Header>
                <Accordion.Toggle as={Button} variant="link" eventKey="1">
                    <h2>
                        {getLangStr("GETHOTP")}
                    </h2>
                </Accordion.Toggle>
            </Card.Header>
            <Accordion.Collapse eventKey="1">
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
                        <Button variant="success" type="submit">
                            {getLangStr("SUBMIT")}
                        </Button>
                    </Form>
                    <br />
                    <Alert variant="success">
                        <h2>{getLangStr("HOTPTOKENIS")}</h2>
                        <InputGroup>
                            <InputGroup.Prepend>
                                <InputGroup.Text>
                                    {
                                        document.queryCommandSupported('copy') &&
                                        <div>
                                            {
                                                copySuccess
                                                &&
                                                <Button variant="default" onClick={copyToClipboard} disabled>{getLangStr("copyied")}</Button>
                                            }
                                            {
                                                !copySuccess
                                                &&
                                                <Button variant="default" onClick={copyToClipboard} >{getLangStr("COPY")}</Button>
                                            }
                                        </div>
                                    }
                                </InputGroup.Text>
                            </InputGroup.Prepend>
                            <FormControl as="textarea" ref={textAreaRef} value={token} style={{ width: "80px" }} readOnly />
                        </InputGroup>
                    </Alert>
                </Card.Body>
            </Accordion.Collapse>
        </Card>
    )
};