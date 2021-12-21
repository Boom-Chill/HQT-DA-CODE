import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios'
import { baseUrl } from './../../constants/url';
import { addInvoices } from '../../feature/invoiceSlice';
import './Driver.scss'
import { TextInput, CheckBoxInput } from './../../Components/CustomForm/CustomForm';

function Driver(props) {
    const dispatch = useDispatch()
    const invoices = useSelector((state) => state.invoices.data)
    const user = useSelector((state) => state.user.data)

    const [status, setStatus] = useState('')
    const [id, setId] = useState('')

    const [reload, setLoad] = useState(true)

    const [fixed, setFixed] = useState(false)

    const [delay, setDelay] = useState(false)

    useEffect(() => {
        try {
            axios.get(`${baseUrl}/api/driver`, {
                params: {
                    id: user.info.TAIXEID,
                }
            }).then(
                (res) => dispatch(addInvoices(res.data))
            )
        } catch (error) {
            console.log(error)
        }
    }, [reload])

    const handleUpdateInvoice = async () => {
        if (!fixed) {
            try {
                setDelay(true)
                await axios.get(`${baseUrl}/api/test1-driver`, {
                    params: {
                        id: id,
                        status: status,
                    }
                })

                await axios.get(`${baseUrl}/api/driver`, {
                    params: {
                        id: user.info.TAIXEID,
                    }
                }).then(
                    (res) => {

                        dispatch(addInvoices(res.data))
                        setDelay(false)
                    }

                )
            } catch (error) {
                console.log(error)
            }
        } else {
            try {
                setDelay(true)
                await axios.get(`${baseUrl}/api/test1-driver-fix`, {
                    params: {
                        id: id,
                        status: status,
                    }
                })

                await axios.get(`${baseUrl}/api/driver`, {
                    params: {
                        id: user.info.TAIXEID,
                    }
                }).then(
                    (res) => {

                        dispatch(addInvoices(res.data))
                        setDelay(false)
                    }
                )
            } catch (error) {
                console.log(error)
            }
        }
    }

    return (
        <div className='driver wide'>
            <h1>
                TÀI XẾ: {user.name}
            </h1>

            <div className='driver__btn--wrapper'>
                <div
                    className='driver__btn__item'
                    onClick={() => setLoad(!reload)}

                >
                    reload
                </div>
            </div>

            {
                <table style={{ marginTop: '16px' }}>
                    <tr>
                        <th>Mã đơn</th>
                        <th>Tên khách hàng</th>
                        <th>Địa chỉ giao hàng</th>
                        <th>Hình thức thanh toán</th>
                        <th>Phí vận chuyển</th>
                        <th>Tình trạng</th>
                    </tr>
                    {
                        invoices.map((ele) => (
                            <>

                                <tr>
                                    <td>{ele.DONHANGID}</td>
                                    <td>{ele.HOTEN}</td>
                                    <td>{ele.DIACHIGH}</td>
                                    <td>{ele.HINHTHUCTT}</td>
                                    <td>{ele.PHIVC}</td>
                                    <td>{ele.TINHTRANGDH}</td>
                                </tr>
                            </>
                        ))
                    }
                </table>
            }

            <CheckBoxInput
                label='Fixed Lost Update'
                defaultChecked={fixed}
                onChange={(e) => setFixed(e.value)}
            />
            <div className='driver__btn--container' style={{ alignItems: 'end' }}>

                <TextInput
                    style={{ marginRight: '16px' }}
                    label='Mã đơn hàng'
                    onChange={(e) => setId(e.value)}
                />
                <TextInput
                    label='Trạng thái đơn hàng'
                    onChange={(e) => setStatus(e.value)}
                />
                <div className='driver__btn--wrapper'>
                    <div
                        className='driver__btn__item'
                        onClick={(e) => handleUpdateInvoice()}

                    >
                        {!delay ? 'sửa' : 'Đang sửa'}
                    </div>
                </div>
            </div>
        </div>


    );
}

export default Driver;