import React, { useState, useEffect } from 'react';
import { Redirect, Route } from 'react-router-dom'

//AUTH
import { useSelector } from 'react-redux';

function PrivateRoute({ office, ...rest}) {
    const user = useSelector((state) => state.user.data)

    if(user) {
        if(!office) {
            return (
                <Route {...rest} /> 
            )
        } else if(office?.includes(user.type)) {  
            return(
                <Route {...rest} /> 
            )
        } else {
            return (
                <div className="not_found">
                    BẠN KHÔNG ĐƯỢC CẤP QUYỀN
                </div>
            )
        }
    }
    else {
        return (
            <Redirect to={{ pathname: '/login',  from: rest.path }}/>
        )
    }

}

export default PrivateRoute;