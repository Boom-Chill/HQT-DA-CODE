import axios from 'axios';
import React, { useEffect, useState } from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    useHistory
} from "react-router-dom";
import { FormManager, TextInput, ControllerInput, NumberInput } from '../../Components/CustomForm/CustomForm';
import { baseUrl } from './../../constants/url';
import ErrorMessage from './../../Components/CustomForm/ErrorMessage/ErrorMessage';
import { useDispatch } from 'react-redux';
import { addUser } from '../../feature/userSlice';
import { CheckBoxInput } from './../../Components/CustomForm/CustomForm';

function Login(props) {

    const [mess, setMess] = useState('')
    const dispatch = useDispatch()
    const history = useHistory()

    const { isError, isSubmit, submitTrigger, onFormChange, watch, handleSubmit } = FormManager({
        initialValue: {
            USERNAME: '',
            USERPASSWORD: '',
        }
    })
    const [delay, setDelay] = useState(false)
    const [loading, setLoading] = useState(false)
    const [fixed, setFixed] = useState(false)

    const onSubmit = (data) => {
        if (!isError) {
            if (!delay) {

                axios.post(`${baseUrl}/api/auth/login`, {
                    USERNAME: data.USERNAME,
                    USERPASSWORD: data.USERPASSWORD,

                }).then(
                    (res) => {
                        if (res.data.error) {
                            setMess(res.data.message)
                        } else {
                            setMess(null)
                            console.log(res.data.data)
                            dispatch(addUser(res.data.data))
                            history.push('/')
                        }
                    }
                )
            } else {
                if (!fixed) {
                    setLoading(true)
                    axios.post(`${baseUrl}/api/test4-login`, {
                        USERNAME: data.USERNAME,
                        USERPASSWORD: data.USERPASSWORD,

                    }).then(
                        (res) => {
                            if (res.data.error) {
                                setMess(res.data.message)
                            } else {
                                setMess(null)
                                console.log(res.data.data)
                                dispatch(addUser(res.data.data))
                                setLoading(false)
                                history.push('/')
                            }
                        }
                    )
                } else {
                    setLoading(true)
                    axios.post(`${baseUrl}/api/test4-login-fix`, {
                        USERNAME: data.USERNAME,
                        USERPASSWORD: data.USERPASSWORD,

                    }).then(
                        (res) => {
                            if (res.data.error) {
                                setMess(res.data.message)
                            } else {
                                setMess(null)
                                console.log(res.data.data)
                                dispatch(addUser(res.data.data))
                                setLoading(false)
                                history.push('/')
                            }
                        }
                    )
                }
            }

        }
    }




    return (
        <div>
            <h1>
                LOGIN
            </h1>

            <img src="https://i.ibb.co/mGctynB/accounts.png" alt="" />

            <div>
                {mess ? <ErrorMessage errorMessage={mess} /> : ''}

            </div>


            <CheckBoxInput
                label='delay 5s (test 4 unrepeatableread1_t1)'
                defaultChecked={delay}
                onChange={(e) => setDelay(e.value)}
            />

            <CheckBoxInput
                label='Fixed'
                defaultChecked={fixed}
                onChange={(e) => setFixed(e.value)}
            />

            <div className='order__info__item'>

                <TextInput
                    label='Username'
                    className='customer__item'
                    name='USERNAME'
                    onChange={onFormChange}

                    required
                    isSubmit={isSubmit}
                />
            </div>

            <div className='order__info__item'>
                <TextInput
                    label='Password'
                    className='customer__item'
                    name='USERPASSWORD'
                    //type='password'
                    onChange={onFormChange}

                    required
                    isSubmit={isSubmit}
                />
            </div>

            <div className='product-list__page'
                onClick={() => handleSubmit(onSubmit)}
            >
                {!loading ? 'Đăng nhập' : 'Đang đăng nhập'}
            </div>

        </div>
    );
}

export default Login;