import React, { useState } from 'react';
import './Navbar.scss'
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    useHistory
} from "react-router-dom";
import { AiOutlineSearch } from "react-icons/ai";
import '../../all.scss'
import { useDispatch, useSelector } from 'react-redux'
import { baseUrl } from './../../constants/url';
import { addProducts, addSearch } from '../../feature/productsSlice';
import axios from 'axios'
import { deleteUser } from '../../feature/userSlice';
import { TextInput, FormManager } from './../CustomForm/CustomForm';

function Navbar(props) {

    const dispatch = useDispatch()
    const [search, setSearch] = useState('')
    const history = useHistory()
    const user = useSelector((state) => state.user.data)

    const handleSearchProduct = () => {
        try {
            axios.get(`${baseUrl}/api/test6-search`, {
                params: {
                    city: watch('THANHPHO'),
                    type: watch('LOAI'),
                }
            }).then((res) => console.log(res.data))
        } catch (error) {
            console.log(error)
        }
    }

    const { isError, isSubmit, submitTrigger, onFormChange, watch, handleSubmit } = FormManager({
        initialValue: {
            THANHPHO: '',
            LOAI: '',
        }
    })

    return (
        <div className='navbar' >
            <div className='navbar-header--container'>

                <div className='wide navbar-header'>
                    <div style={{ color: 'red' }}>
                        {user?.type}
                    </div>


                    <div>
                        {
                            user ? <Link to="/login" >
                                <div className='navbar-header__card'
                                    onClick={() => dispatch(deleteUser())}
                                >
                                    Đăng xuất
                                </div>
                            </Link> : <Link to="/login" >
                                <div className='navbar-header__card'>
                                    Đăng nhập
                                </div>
                            </Link>
                        }
                    </div>

                </div>

            </div>

            <div className='wide navbar-banner'>

                <div className="navbar-banner__search wide">
                    <TextInput
                        label='thành phố'
                        name='THANHPHO'
                        onChange={onFormChange}

                        isSubmit={isSubmit}
                    />

                    <TextInput
                        label='loại sản phẩm'
                        name='LOAI'
                        onChange={onFormChange}

                        isSubmit={isSubmit}
                    />
                    <Link to={'/search'}>
                        <div
                            onClick={() => handleSearchProduct()}
                        >
                            <AiOutlineSearch />
                        </div>
                    </Link>
                </div>

            </div >

            <div className='navbar-menu--container'>
                <div className='navbar-menu wide'>
                    <Link to={'/'}>
                        <div className='navbar-menu__item'>
                            TRANG CHỦ
                        </div>
                    </Link>

                    <div>
                        {
                            user?.type == 'AD'
                                ? <Link to={'/admin'}>
                                    <div className='navbar-menu__item'>
                                        QUẢN LÍ TÀI KHOẢN
                                    </div>
                                </Link>
                                : ''
                        }
                    </div>

                    <div>
                        {
                            user?.type == 'DT'
                                ? <Link to={'/partner'}>
                                    <div className='navbar-menu__item'>
                                        QUẢN LÍ SẢN PHẨM
                                    </div>
                                </Link>
                                : ''
                        }
                    </div>

                    <div>
                        {
                            user?.type == 'DT'
                                ? <Link to={'/partner-order'}>
                                    <div className='navbar-menu__item'>
                                        QUẢN LÍ ĐƠN HÀNG
                                    </div>
                                </Link>
                                : ''
                        }
                    </div>


                    <div>
                        {
                            user?.type == 'TX'
                                ? <Link to={'/driver'}>
                                    <div className='navbar-menu__item'>
                                        QUẢN LÍ ĐƠN HÀNG
                                    </div>
                                </Link>
                                : ''
                        }
                    </div>

                    <div>
                        {
                            user?.type == 'NV'
                                ? <Link to={'/staff'}>
                                    <div className='navbar-menu__item'>
                                        QUẢN LÍ HỢP ĐỒNG
                                    </div>
                                </Link>
                                : ''
                        }
                    </div>

                    <div>
                        {
                            user?.type == 'KH'
                                ? <Link to={'/customer'}>
                                    <div className='navbar-menu__item'>
                                        TEST 2
                                    </div>
                                </Link>
                                : ''
                        }
                    </div>

                </div>
            </div>

        </div >
    );
}

export default Navbar;