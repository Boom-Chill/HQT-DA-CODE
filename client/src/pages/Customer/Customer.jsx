import React, { useEffect, useState } from 'react';
import axios from 'axios'
import { baseUrl } from './../../constants/url';
import { useDispatch, useSelector } from 'react-redux';
import { SelectInput } from '../../Components/CustomForm/CustomForm';
import Grid from '@mui/material/Grid'
import ProductCard from '../../Components/ProductCard/ProductCard';
import { CheckBoxInput, FormManager } from './../../Components/CustomForm/CustomForm';

function Customer(props) {
    const dispatch = useDispatch()
    const [branchs, setBranchs] = useState([])
    const [choose, setChoose] = useState('')
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(false)

    const [delay, setDelay] = useState(false)

    const [fixed2, setFixed2] = useState(false)
    const [fixed, setFixed] = useState(false)

    const { isError, isSubmit, submitTrigger } = FormManager({
        inittialValue: {

        }
    })

    useEffect(() => {
        try {
            axios.get(`${baseUrl}/api/branchs`).then(
                (res) => {
                    const branchs = [...res.data]
                    let newBranchs = []
                    branchs.forEach((branch) => {
                        const newBranch = {
                            label: branch.CHINHANHID,
                            value: branch.CHINHANHID,
                        }
                        newBranchs.push(newBranch)
                    })
                    setBranchs(newBranchs)
                }
            )
        } catch (error) {
            console.log(error)
        }
    }, [])

    const getProducts = () => {
        submitTrigger()
        if (!delay) {
            if (!fixed) {
                try {
                    axios.get(`${baseUrl}/api/test2-customer`, {
                        params: {
                            id: choose,
                        }
                    }).then(
                        (res) => {
                            setProducts(res.data || [])
                        }
                    )
                } catch (error) {
                    console.log(error)
                }
            } else {
                try {
                    axios.get(`${baseUrl}/api/test2-customer-fix`, {
                        params: {
                            id: choose,
                        }
                    }).then(
                        (res) => {
                            setProducts(res.data || [])
                        }
                    )
                } catch (error) {
                    console.log(error)
                }
            }
        } else {
            if (!fixed2) {
                try {
                    setLoading(true)
                    axios.get(`${baseUrl}/api/test7-customer-view`, {
                        params: {
                            id: choose,
                        }
                    }).then(
                        (res) => {
                            setProducts(res.data || [])
                            setLoading(false)
                        }
                    )
                } catch (error) {
                    console.log(error)
                }
            } else {
                try {
                    setLoading(true)
                    axios.get(`${baseUrl}/api/test7-customer-view-fix`, {
                        params: {
                            id: choose,
                        }
                    }).then(
                        (res) => {
                            setProducts(res.data || [])
                            setLoading(false)
                        }
                    )
                } catch (error) {
                    console.log(error)
                }
            }

        }
    }

    return (
        <div className='product-list wide'>
            <div className='edit-info__text'>
                <CheckBoxInput
                    label='Fixed phantom read 2'
                    defaultChecked={fixed2}
                    onChange={(e) => setFixed2(e.value)}
                />

                <CheckBoxInput
                    label='Delay 5s Phantom read 2'
                    defaultChecked={delay}
                    onChange={(e) => setDelay(e.value)}
                />

                <CheckBoxInput
                    label='Fixed dirty read 1, 2'
                    defaultChecked={fixed}
                    onChange={(e) => setFixed(e.value)}
                />

                <SelectInput
                    label='Chi nhánh'
                    options={branchs}
                    onChange={(e) => setChoose(e.value)}

                    required
                    isError={isError}
                    isSubmit={isSubmit}
                />
            </div>

            <div className='prodcut-card__btn' style={{ width: '100%', maxWidth: '250px' }}>
                <div className='prodcut-card__btn--wrapper'
                    onClick={() => getProducts()}
                >
                    {loading ? 'Đang chọn....' : 'Chọn'}
                </div>
            </div>

            <Grid container spacing={2}>
                {
                    products.map((product, idx) => (
                        <Grid item xs={6} sm={4} md={2.4} key={idx}>
                            <ProductCard product={product} />
                        </Grid>
                    ))
                }
            </Grid>

        </div>
    );
}

export default Customer;