import React from 'react';
import './ErrorMessage.scss'
import { AiOutlineExclamationCircle } from "react-icons/ai"

const ErrorMessage = props => {
    const { errorMessage } = props
    return (
        <div
            name="input__error"
            className="error-message__wrapper"
        >
            <AiOutlineExclamationCircle />
            <div className="error-message">
                {errorMessage}
            </div>
        </div>
    );
};


export default ErrorMessage;