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


const getLangStr = language("components/create");


export default function CreateNewEntry() {

    const [copySuccess, setCopySuccess] = useState(false);
    const [password, setPassword] = useState('');
    const [token, setToken] = useState('');
    const [identifier, setIdentifier] = useState('N/A');

    const textAreaRef = useRef(null);

    const copyToClipboard = (e) => {
        textAreaRef.current.select();
        document.execCommand('copy');
        e.target.focus();
        setCopySuccess(true);
    };


    const handleChangeToken = event => {
        setToken(event.target.value);
    };

    const handleChangePassword = event => {
        setPassword(event.target.value);
    };

    const handleSubmit = async event => {
        event.preventDefault();

        if (typeof token !== 'string') return;
        if (typeof password !== 'string') return;

        const result = await API.post('new', {
            token,
            password,
        }).catch(function (error) {
            setIdentifier(getLangStr("somethingWentWrong") + error);
        });

        if(!result) return;

        if(result.data.error != null || result.data.result === null) {
            setIdentifier(getLangStr("somethingWentWrong") + result.data.error);
        } else {
            setIdentifier(result.data.result.identifier);
        }
    };


    return (
        <Card>
            <Card.Header>
                <Accordion.Toggle as={Button} variant="link" eventKey="0">
                    <h2>
                        Create new Entry
                    </h2>
                </Accordion.Toggle>
            </Card.Header>
            <Accordion.Collapse eventKey="0">
                <Card.Body>
                    <Form onSubmit={handleSubmit}>
                            <Form.Group controlId="formToken">
                                <Form.Label className="text-muted">{getLangStr("TOKEN")}</Form.Label>
                                <Form.Control type="text" onChange={handleChangeToken} placeholder={getLangStr("TOKEN")} />
                                <Form.Text className="text-muted">
                                    {getLangStr("TOKENBASE32")}
                                </Form.Text>
                            </Form.Group>
                            <Form.Group controlId="formPassword">
                                <Form.Label className="text-muted">{getLangStr("PASSWORD")}</Form.Label>
                                <Form.Control type="text" onChange={handleChangePassword} placeholder={getLangStr("PASSWORD")} />
                            </Form.Group>
                            <Button variant="primary" type="submit">
                                {getLangStr("SUBMIT")}
                            </Button>
                    </Form>
                    <br />
                    <Alert variant="primary">
                        <h2>{getLangStr("IDENTIFIERIS")}</h2>
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
                            <FormControl as="textarea" ref={textAreaRef} value={identifier} style={{ width: "180px" }} readOnly />
                        </InputGroup>
                    </Alert>
                </Card.Body>
            </Accordion.Collapse>
        </Card>
    )
};