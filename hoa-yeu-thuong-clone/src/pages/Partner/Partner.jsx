import React, { useEffect, useState } from 'react';
import axios from 'axios'
import Grid from '@mui/material/Grid'
import { useDispatch, useSelector } from 'react-redux'
import ProductCard from '../../Components/ProductCard/ProductCard';
import { baseUrl } from '../../constants/url';
import { addPartnerProducts } from '../../feature/productsSlice';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    useParams,
    useHistory
} from "react-router-dom";
import './Partner.scss'
import { TextInput } from './../../Components/CustomForm/CustomForm';

function Partner(props) {
    const dispatch = useDispatch()
    const products = useSelector((state) => state.products.partnerData)
    const user = useSelector((state) => state.user.data)

    const [type, setType] = useState('')

    useEffect(() => {
        try {
            axios.get(`${baseUrl}/api/admin`, {
                params: {
                    id: user.info.DOITACID,
                }
            }).then(
                //(res) => console.log(res.data)
                (res) => dispatch(addPartnerProducts(res.data))
            )
        } catch (error) {
            console.log(error)
        }
    }, [])

    const deleteProduct = (product) => {
        try {
            axios.delete(`${baseUrl}/api/test7-partner-delete/${product.SANPHAMID}`, {
                params: {
                    id: user.info.DOITACID,
                }
            }).then(
                (res) => dispatch(addPartnerProducts(res.data))
            )
        } catch (error) {
            console.log(error)
        }
    }

    const change = () => {
        try {
            axios.patch(`${baseUrl}/api/test6-partner`, {
                id: user.info.DOITACID,
                city: user.info.THANHPHO,
                type: type,

            })
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className='admin wide'>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>

                <TextInput
                    label='Cập nhật loại hàng'
                    onChange={(e) => setType(e.value)}
                />

                <div className='admin-card__btn--wrapper'
                    onClick={() => change()}
                >
                    <div
                        className='admin-card__btn__item'>
                        Sửa
                    </div>
                </div>

            </div>

            <Grid container spacing={2}>
                {
                    products.map((product, idx) => (
                        <Grid item xs={6} sm={4} md={2.4} key={idx}>
                            <div className='admin-card--container'>

                                <div className='prodcut-card__info' >
                                    <div className='prodcut-card__name'>{product.TENSP}</div>
                                    <div className='prodcut-card__price'>
                                        <div className='prodcut-card__price__new'>{
                                            new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.GIA)
                                        }</div>
                                    </div>
                                    <div className='prodcut-card__info'>Loại hàng: {product.LOAIHANG}</div>
                                    <div className='prodcut-card__info'>địa chỉ: {product.QUAN}, {product.THANHPHO}</div>

                                </div>

                                <div className='admin-card__btn'>
                                    <div className='admin-card__btn--wrapper'
                                    >
                                        <Link to={'/upload'} className='admin-card__btn__item'>
                                            <div>
                                                thêm
                                            </div>
                                        </Link>
                                        <Link to={`/edit/${product.SANPHAMID}`} className='admin-card__btn__item'>
                                            <div>
                                                sửa
                                            </div>
                                        </Link>
                                        <div className='admin-card__btn__item'
                                            onClick={() => deleteProduct(product)}
                                        >
                                            xoá
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Grid>
                    ))
                }

            </Grid>

        </div>
    );
}

export default Partner;