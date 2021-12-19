import React, { useEffect, useState } from 'react';
import './Product.scss'
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

function Product(props) {

    const { id } = useParams();
    const [product, setProduct] = useState(null)
    const dispatch = useDispatch()
    const history = useHistory()

    useEffect(() => {
        try {
            axios.get(`${baseUrl}/api/products/${id}`, {
                params: {
                    id: id
                }
            }).then(
                (res) => setProduct(res.data[0])
            )
        } catch (error) {
            console.log(error)
        }
    }, [])

    const handleBuy = () => {
        history.push('/cart')
    }

    if (!product) {
        return (
            <div></div>
        )
    }

    return (
        <div className='product wide'>
            <Grid container spacing={2}>
                <Grid item xs={12} sm={12} md={4}>
                    <img src="https://dummyimage.com/400x560/000/ffffff.jpg&text=h%C3%ACnh+%E1%BA%A3nh" alt="" />

                    <div className='prodcut-card__btn'>
                        <div className='prodcut-card__btn--wrapper'
                            onClick={() => handleBuy()}
                        >
                            CHỌN MUA
                        </div>
                    </div>
                </Grid>
                <Grid item xs={12} sm={12} md={8}>
                    <div>
                        <div className='product-info'>
                            <div className='product-info__text id'>
                                Mã SP: {
                                    product.MASP
                                }
                            </div>

                            <div className='product-info__text'>
                                Tên SP: {
                                    product.TENSP
                                }
                            </div>

                            <div className='product-info__text old-price'>
                                Giá cũ: {
                                    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.GIAGOC)
                                }
                            </div>
                            <div className='product-info__text price'>
                                Giá mới: {
                                    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.GIAGIAM)
                                }
                            </div>

                            <div>
                                {product.MOTA ? 'Mô tả: ' + product.MOTA : ''}
                            </div>
                        </div>

                    </div>
                </Grid>
            </Grid>
        </div>
    );
}

export default Product;