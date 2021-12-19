import React, { useEffect, useState } from 'react';
import axios from 'axios'
import Grid from '@mui/material/Grid'
import { useDispatch, useSelector } from 'react-redux'
import ProductCard from '../../Components/ProductCard/ProductCard';
import { baseUrl } from './../../constants/url';
import { addProducts } from '../../feature/productsSlice';
import './Search.scss'

function Search(props) {
    const dispatch = useDispatch()
    const [page, setPage] = useState(1)
    const [partners, setPartners] = useState([])
    const products = useSelector((state) => state.products.data)
    const search = useSelector((state) => state.products.search)

    useEffect(() => {
        try {
            axios.get(`${baseUrl}/api/search`, {
                params: {
                    page: page,
                    search: search,
                }
            }).then(
                (res) => dispatch(addProducts(res.data))
            )
        } catch (error) {
            console.log(error)
        }
    }, [search])

    const handleAddProduct = () => {
        setPage(page + 1)
        try {
            axios.get(`${baseUrl}/api/search`, {
                params: {
                    page: page + 1,
                    search: search,
                }
            }).then(
                (res) => dispatch(addProducts([...products, ...res.data]))
            )
        } catch (error) {
            console.log(error)
        }
    }

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