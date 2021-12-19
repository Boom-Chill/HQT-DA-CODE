import React, { useEffect, useState } from 'react';
import './Edit.scss'
import axios from 'axios'
import { baseUrl } from './../../constants/url';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    useParams,
    useHistory
} from "react-router-dom";
import Grid from '@mui/material/Grid'
import { useDispatch } from 'react-redux';
import { FormManager, NumberInput, SelectInput, TextInput, CheckBoxInput } from './../../Components/CustomForm/CustomForm';
import { addProducts } from '../../feature/productsSlice';

function Edit(props) {

    const { id } = useParams();
    const dispatch = useDispatch()
    const history = useHistory()

    const [product, setProduct] = useState(null)
    const [branchs, setBranchs] = useState([])
    const [fixed, setFixed] = useState(false)
    const [reload, setReload] = useState(false)

    const { isError, isSubmit, submitTrigger, onFormChange, watch, handleSubmit, setInitial } = FormManager({
        initialValue: {
        }
    })

    useEffect(() => {
        try {
            axios.get(`${baseUrl}/api/products/${id}`, {
                params: {
                    id: id
                }
            }).then(
                (res) => {
                    setProduct(res.data[0])
                    setInitial({
                        TENSP: res.data[0].TENSP,
                        GIA: res.data[0].GIA,
                    })
                }

            )
        } catch (error) {
            console.log(error)
        }
    }, [])

    const onSubmit = (data) => {
        console.log("🚀 ~ file: Edit.jsx ~ line 58 ~ onSubmit ~ data", data)
        if (!isError) {
            setReload(true)
            axios.patch(`${baseUrl}/api/test3-partner/${id}`, {
                ...data,
            }).then(
                (res) => {
                    console.log(res.data[0])
                    setReload(false)
                }
            )
        }
    }

    if (!product) {
        return (
            <div></div>
        )
    }

    return (
        <div className='edit wide'>
            <div className='edit-info'>

                <div className='edit-info__text'>
                    <TextInput
                        name='TENSP'
                        label='Tên sản phẩm'
                        onChange={onFormChange}
                        defaultValue={product.TENSP}

                        required
                        isSubmit={isSubmit}
                    />
                </div>

                <div className='edit-info__text price'>
                    <NumberInput
                        name='GIA'
                        label='Giá'
                        onChange={onFormChange}
                        defaultValue={product.GIA}
                        positive


                        required
                        isSubmit={isSubmit}
                    />
                </div>


                <div className='prodcut-card__btn' style={{ width: '100%', maxWidth: '250px' }}>
                    <div className='prodcut-card__btn--wrapper'
                        onClick={() => handleSubmit(onSubmit)}
                    >
                        {reload ? 'Đang sửa' : 'Sửa'}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Edit;