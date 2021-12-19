import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios'
import { baseUrl } from './../../constants/url';
import { addInvoices } from '../../feature/invoiceSlice';
import './Staff.scss'
import { FormManager, SelectInput, TextInput, CheckBoxInput } from './../../Components/CustomForm/CustomForm';
import { addContracts } from '../../feature/contractSlice';
import { dateFormat } from '../../utils/dateFormat';

function Staff(props) {
    const dispatch = useDispatch()
    const contracts = useSelector((state) => state.contracts.data)
    const user = useSelector((state) => state.user.data)

    const [fixed, setFixed] = useState(false)
    const [reload, setLoad] = useState(false)


    const { isError, isSubmit, submitTrigger, onFormChange, watch, handleSubmit } = FormManager({
        initialValue: {
            MSTHUE: '',
            DOITACID: '',
        }
    })

    const [partners, setPartners] = useState([])
    const [partnerInfo, setPartnerInfo] = useState({})
    console.log("🚀 ~ file: Staff.jsx ~ line 29 ~ Staff ~ partnerInfo", partnerInfo)


    useEffect(() => {
        try {
            axios.get(`${baseUrl}/api/contracts`, {
                params: {
                    id: user.info.TAIXEID,
                }
            }).then(
                (res) => dispatch(addContracts(res.data))
            )
        } catch (error) {
            console.log(error)
        }

        try {
            axios.get(`${baseUrl}/api/partners`).then(
                (res) => {
                    const branchs = [...res.data]
                    let newBranchs = []
                    branchs.forEach((branch) => {
                        const newBranch = {
                            label: branch.DOITACID,
                            value: branch.DOITACID,
                        }
                        newBranchs.push(newBranch)
                    })
                    setPartners(newBranchs)
                }
            )
        } catch (error) {
            console.log(error)
        }
    }, [reload])

    useEffect(() => {
        try {
            axios.get(`${baseUrl}/api/partners/${watch('DOITACID')}`, {
                params: {
                    id: user.info.TAIXEID,
                }
            }).then(
                (res) => setPartnerInfo(res.data)
            )
        } catch (error) {
            console.log(error)
        }
    }, [watch('DOITACID')])

    const onSubmit = (data) => {
        submitTrigger()
        if (!isError) {
            if (!fixed) {
                axios.post(`${baseUrl}/api/test6-staff-add`, {
                    ...data,
                    DAIDIEN: partnerInfo.DAIDIEN
                }).then(
                    (res) => {
                        dispatch(addContracts(res.data))
                    }
                )
            }
        }
    }

    const handleReload = () => {
        setLoad(true)
        if (!fixed) {
            axios.get(`${baseUrl}/api/test6-staff-view`).then(
                (res) => {
                    dispatch(addContracts(res.data))
                    setLoad(false)
                }
            )
        } else {
            axios.get(`${baseUrl}/api/test6-staff-view-fix`).then(
                (res) => {
                    dispatch(addContracts(res.data))
                    setLoad(false)
                }
            )
        }

    }

    return (
        <div className='driver wide'>
            <h1>
                Nhân viên: {user.name}
            </h1>

            <CheckBoxInput
                label='Fixed phantom read 1'
                defaultChecked={fixed}
                onChange={(e) => setFixed(e.value)}
            />

            <div className='driver__btn--wrapper'>
                <div
                    className='driver__btn__item'
                    onClick={() => handleReload()}

                >
                    {reload ? 'Realoading...' : 'Reload'}
                </div>
            </div>
            {
                <table style={{ marginTop: '16px' }}>
                    <tr>
                        <th>Mã hợp đồng</th>
                        <th>Mã đối tác</th>
                        <th>Mã số thuế</th>
                        <th>Đại diện</th>
                        <th>Số chi nhánh</th>
                        <th>Ngày đăng kí</th>
                        <th>Ngày kết thúc</th>
                    </tr>
                    {
                        contracts.map((ele) => (
                            <>

                                <tr>
                                    <td>{ele.HOPDONGID}</td>
                                    <td>{ele.DOITACID}</td>
                                    <td>{ele.MSTHUE}</td>
                                    <td>{ele.DAIDIEN}</td>
                                    <td>{ele.SOCHINHANHDK}</td>
                                    <td>{
                                        dateFormat(ele.NGAYDK)
                                    }</td>
                                    <td>{dateFormat(ele.NGAYKT)}</td>
                                </tr>
                            </>
                        ))
                    }

                    <tr>
                        <td>

                        </td>

                        <td>
                            <SelectInput
                                name='DOITACID'
                                options={partners}
                                onChange={onFormChange}

                                required
                                isSubmit={isSubmit}
                            />
                        </td>

                        <td>
                            <TextInput
                                name='MSTHUE'
                                onChange={onFormChange}
                                required
                                isSubmit={isSubmit}
                            />
                        </td>
                        <td>
                            {partnerInfo ? partnerInfo.DAIDIEN : ''}
                        </td>
                        <td>
                            <TextInput
                                name='SOCHINHANH'
                                onChange={onFormChange}
                                validate={
                                    {
                                        checkNumber: {
                                            error: (val) => val > partnerInfo.SOCHINHANH,
                                            message: 'Số chi nhánh quá nhiều'

                                        }
                                    }
                                }
                                required
                                isSubmit={isSubmit}
                            />
                        </td>
                        <td></td>
                        <td></td>
                    </tr>
                </table>

            }
            <div className='prodcut-card__btn' style={{ width: '100%' }}>
                <div className='prodcut-card__btn--wrapper'
                    onClick={() => handleSubmit(onSubmit)}
                >
                    Thêm
                </div>
            </div>

        </div>


    );
}

export default Staff;