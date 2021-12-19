import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios'
import { baseUrl } from './../../constants/url';
import { addInvoices } from '../../feature/invoiceSlice';
import { TextInput, CheckBoxInput } from './../../Components/CustomForm/CustomForm';

function OrderPartner(props) {
    const dispatch = useDispatch()
    const user = useSelector((state) => state.user.data)

    const [orders, setOrders] = useState([])

    const [id, setId] = useState('')
    const [status, setStatus] = useState('')

    const [reload, setLoad] = useState(true)

    const [fixed, setFixed] = useState(false)

    useEffect(() => {
        try {
            axios.get(`${baseUrl}/api/partner/orders`, {
                params: {
                    id: user.info.DOITACID,
                }
            }).then(
                (res) => setOrders(res.data)
            )
        } catch (error) {
            console.log(error)
        }
    }, [reload])

    const handleUpdateInvoice = async () => {
        if (!fixed) {

            try {
                await axios.get(`${baseUrl}/api/test1-partner`, {
                    params: {
                        id: id,
                        status: status,
                    }
                })

                await axios.get(`${baseUrl}/api/partner/orders`, {
                    params: {
                        id: user.info.DOITACID,
                    }
                }).then(
                    (res) => setOrders(res.data)
                )
            } catch (error) {
                console.log(error)
            }
        } else {
            try {
                await axios.get(`${baseUrl}/api/test1-partner-fix`, {
                    params: {
                        id: id,
                        status: status,
                    }
                })

                await axios.get(`${baseUrl}/api/partner/orders`, {
                    params: {
                        id: user.info.DOITACID,
                    }
                }).then(
                    (res) => setOrders(res.data)
                )
            } catch (error) {
                console.log(error)
            }
        }
    }

    return (
        <div className='driver wide'>
            <h1>
                ĐỐI TÁC: {user.name}
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
                        orders.map((ele) => (
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
                        sửa
                    </div>
                </div>
            </div>
        </div>


    );
}

export default OrderPartner;