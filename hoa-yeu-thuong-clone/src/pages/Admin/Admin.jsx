import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios'
import { baseUrl } from './../../constants/url';
import './Admin.scss'
import { FormManager, SelectInput, TextInput } from './../../Components/CustomForm/CustomForm';
import { addContracts } from '../../feature/contractSlice';
import { dateFormat } from '../../utils/dateFormat';

function Admin(props) {
    const dispatch = useDispatch()
    const user = useSelector((state) => state.user.data)

    const [users, setUsers] = useState([])
    console.log("🚀 ~ file: Admin.jsx ~ line 15 ~ Admin ~ users", users)

    const [id, setId] = useState('')
    const [status, setStatus] = useState('')
    const [options, setOptions] = useState([])
    const [reload, setLoad] = useState(true)

    const { isError, isSubmit, submitTrigger, onFormChange, watch, handleSubmit } = FormManager({
        initialValue: {
            USERNAME: '',
            USERPASSWORD: '',
        }
    })

    const onSubmit = (data) => {
        submitTrigger()
        if (!isError) {
            axios.post(`${baseUrl}/api/test4-admin`, {
                ...data,
            }).then(
                (res) => {
                    setUsers(res.data)
                }
            )
        }
    }

    useEffect(() => {
        try {
            axios.get(`${baseUrl}/api/users`).then(
                (res) => {
                    const branchs = [...res.data]
                    let newBranchs = []
                    branchs.forEach((branch) => {
                        const newBranch = {
                            label: branch.USERNAME,
                            value: branch.USERNAME,
                        }
                        newBranchs.push(newBranch)
                    })
                    setOptions(newBranchs)

                    setUsers(res.data)
                }
            )
        } catch (error) {
            console.log(error)
        }
    }, [])

    const handleUpdatePassword = (id, password) => {
        console.log()
    }

    return (
        <div className='driver wide'>
            <h1>
                Admin: {user.name}
            </h1>
            {
                <table style={{ marginTop: '16px' }}>
                    <tr>
                        <th>Mã người dùng</th>
                        <th>Email</th>
                        <th>Hoạt động</th>
                        <th>Loại tài khoản</th>
                        <th>Tài khoản</th>
                        <th>Mật khẩu</th>
                    </tr>
                    {
                        users.map((ele) => (
                            <>

                                <tr>
                                    <td>{ele.USERID}</td>
                                    <td>{ele.EMAIL}</td>
                                    <td>
                                        {
                                            <input type="checkbox" defaultChecked={ele.USERSTATUS} />
                                        }
                                    </td>
                                    <td>{ele.LOAI}</td>
                                    <td>{ele.USERNAME}</td>
                                    <td>{ele.USERPASSWORD}</td>
                                </tr>
                            </>
                        ))
                    }


                </table>

            }


            <div className='driver__btn--container' style={{ alignItems: 'center', flexDirection: 'column' }}>
                <div className='edit-info__text'>
                    <SelectInput
                        name='USERNAME'
                        label='USERNAME'
                        options={options}
                        onChange={onFormChange}

                        required
                        isSubmit={isSubmit}
                    />
                </div>

                <div className='edit-info__text'>
                    <TextInput
                        name='USERPASSWORD'
                        label='MẬt khẩu mới'
                        onChange={onFormChange}


                        required
                        isSubmit={isSubmit}
                    />
                </div>

                <div className='prodcut-card__btn' style={{ width: '100%', maxWidth: '250px' }}>
                    <div className='prodcut-card__btn--wrapper'
                        onClick={() => handleSubmit(onSubmit)}
                    >
                        SỬA
                    </div>
                </div>
            </div>

        </div>


    );
}

export default Admin;