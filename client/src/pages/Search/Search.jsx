import React, { useEffect, useState } from 'react';
import axios from 'axios'
import Grid from '@mui/material/Grid'
import { useDispatch, useSelector } from 'react-redux'
import ProductCard from '../../Components/ProductCard/ProductCard';
import { baseUrl } from './../../constants/url';
import { addProducts } from '../../feature/productsSlice';
import './Search.scss'

function Search(props) {
    const partners = useSelector((state) => state?.partners?.data || [])
    return (
        <div className='search wide'>
            <Grid container spacing={2}>

                <table style={{ marginTop: '16px' }}>
                    <tr>
                        <th>Mã đối tác</th>
                        <th>Thành phố</th>
                        <th>Quận</th>
                        <th>Loại hàng</th>
                    </tr>
                    {
                        partners.map((ele) => (
                            <>
                                <tr>
                                    <td>{ele.DOITACID}</td>
                                    <td>{ele.THANHPHO}</td>
                                    <td>{ele.QUAN}</td>
                                    <td>{ele.LOAIHANG}</td>
                                </tr>
                            </>
                        ))
                    }

                </table>



            </Grid>

        </div>
    );
}

export default Search;