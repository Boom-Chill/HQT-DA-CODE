import React from 'react';
import './ProductCard.scss'
import { useDispatch } from 'react-redux';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from "react-router-dom";


function ProductCard(props) {

    const { product } = props
    const dispatch = useDispatch()


    return (
        <div className='prodcut-card--container'>
            <Link to={`shop/${product.SANPHAMID}`}>

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
            </Link>

            <div className='prodcut-card__btn'>
                <div className='prodcut-card__btn--wrapper'
                >
                    CHỌN MUA
                </div>
            </div>
        </div>
    );
}

export default ProductCard;