import React, { useEffect, useState, useRef } from 'react';
import ErrorMessage from './ErrorMessage/ErrorMessage';
import './CustomForm.scss'


const emailRegrex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

const numberRegrex = /^-?([0]{1}\.{1}[0-9]+|[1-9]{1}[0-9]*\.{1}[0-9]+|[0-9]+|0)$/

const notEmptyRegrex = /\S+/

const specialRegex = /[*:<>{}@$#]/

function errorValidate(value, required, disabled, validates) {
    let errorMess = null;

    if (!disabled) {
        if (!value && required) {
            errorMess = 'Không được để trống';
        } else {
            for (let clause in validates) {
                if (typeof validates[clause].error === 'function') {

                    const result = validates[clause].error(value)
                    if (result) {
                        errorMess = validates[clause].message
                    }
                } else {

                    const result = validates[clause].error

                    if (result) {
                        errorMess = validates[clause].message
                    }
                }
            }
        }
    } else {
        errorMess = null
    }

    if (!value && !required) {
        errorMess = null;
    }

    return errorMess;
}

export const TextInput = (props) => {
    const {
        label, labelClassName,

        name, className, defaultValue, onChange,
        type, style,

        validate, minLength, maxLength, email,

        required, disabled,

        isSubmit,
    } = props

    const [val, setVal] = useState(defaultValue || null)
    const [isTouched, setIsTouched] = useState(false)
    const [error, setError] = useState(null)

    //optional validate
    const minLengthCheck = {
        minLengthCheck: {
            error: (val) => val.length < minLength,
            message: 'Số kí tự phải lớn hơn ' + minLength,
        }
    }
    const maxLengthCheck = {
        maxLengthCheck: {
            error: (val) => val.length > maxLength,
            message: 'Số kí tự không được vượt quá ' + maxLength,
        }
    }
    const emailCheck = {
        emailCheck: {
            error: (val) => !emailRegrex.test(val),
            message: 'Không phải định dạng email',
        }
    }

    //text validate
    const validates = {
        ...(minLength && minLengthCheck),
        ...(maxLength && maxLengthCheck),
        ...(email && emailCheck),
        // dafault: {
        //     error: (val) => specialRegex.test(val),
        //     message: 'Không được chứa kí tự đặc biệt: <,>,*,#,$,{,}',
        // },
        ...validate,
    }

    function handleChange(val) {
        const errorVali = errorValidate(val, required, disabled, validates)
        // // debug
        // console.log('val -', name, " ", val)
        // console.log('error -', name, " ", errorVali)

        setVal(val)
        setError(errorVali)

        if (!disabled) {
            onChange({
                name: name,
                value: val,
                error: errorVali,
            })
        } else {
            onChange({
                name: name,
                value: null,
                error: null,
            })
        }
    }

    useEffect(() => {
        handleChange(val)
    }, [disabled])

    return (
        <div className="custom-from__input" style={{ ...style }}>
            <div className={labelClassName ? labelClassName : "custom-from__input-label"}>{label}</div>

            <input
                name={name}
                className={className}
                defaultValue={defaultValue}
                type={type == 'text' || type == 'password' ? type : 'text'}

                onChange={(e) => handleChange(e.target.value)}
                onBlur={() => setIsTouched(true)}

                disabled={disabled}
            />

            {error && (isTouched || isSubmit) && <ErrorMessage errorMessage={error} />}
        </div>
    )
}

export const NumberInput = (props) => {

    const {
        label, labelClassName,

        name, className, defaultValue, onChange,
        type,

        validate, positive, negative, minLength, maxLength,

        required, disabled,

        isSubmit,
    } = props

    const [val, setVal] = useState(defaultValue || null)
    const [isTouched, setIsTouched] = useState(false)
    const [error, setError] = useState(null)

    //optional validate
    const positiveCheck = {
        positive: {
            error: (val) => Number(val) < 0,
            message: 'Chỉ được nhập số dương',
        }
    }
    const negativeCheck = {
        negative: {
            error: (val) => Number(val) > 0,
            message: 'Chỉ được nhập số âm',
        }
    }
    const minLengthCheck = {
        minLengthCheck: {
            error: (val) => val.length < minLength,
            message: 'Số kí tự phải lớn hơn ' + minLength,
        }
    }
    const maxLengthCheck = {
        maxLengthCheck: {
            error: (val) => val.length > maxLength,
            message: 'Số kí tự không được vượt quá ' + maxLength,
        }
    }

    //number validate
    const validates = {
        ...(positive && positiveCheck),
        ...(negative && negativeCheck),
        ...(minLength && minLengthCheck),
        ...(maxLength && maxLengthCheck),
        dafault: {
            error: (val) => !numberRegrex.test(val),
            message: 'Chỉ được nhập số',
        },
        ...validate,
    }

    function handleChange(val) {
        const errorVali = errorValidate(val, required, disabled, validates)
        // // debug
        //console.log('val -', name, " ", val)
        //console.log('error -', name, " ", errorVali)
        setVal(val)
        setError(errorVali)

        if (!disabled) {
            onChange({
                name: name,
                value: val,
                error: errorVali,
            })
        } else {
            onChange({
                name: name,
                value: null,
                error: null,
            })
        }
    }

    useEffect(() => {
        handleChange(val)
    }, [disabled])

    return (
        <div className="custom-from__input">
            <div className={labelClassName ? labelClassName : "custom-from__input-label"}>{label}</div>

            <input
                name={name}
                className={className}
                defaultValue={defaultValue}
                type={type == 'text' || type == 'password' ? type : 'text'}

                onChange={(e) => handleChange(e.target.value)}
                onBlur={() => setIsTouched(true)}

                disabled={disabled}
            />

            {error && (isTouched || isSubmit) && <ErrorMessage errorMessage={error} />}
        </div>
    )
}

export const CheckBoxInput = (props) => {
    const {
        label, labelClassName,

        name, onChange, defaultChecked,

        disabled,
    } = props

    const [val, setVal] = useState(defaultChecked || null)

    function handleChange(val) {
        // debug
        //console.log('val -', name, " ", val)

        setVal(val)
        //send to parent
        if (!disabled) {
            onChange({
                name: name,
                value: val,
            })
        } else {
            onChange({
                name: name,
                value: null,
            })
        }
    }

    useEffect(() => {
        handleChange(val)
    }, [disabled])

    return (
        <div className="custom-from__input">
            <div className={labelClassName ? labelClassName : "custom-from__input-label"}>{label}</div>
            <input
                defaultChecked={defaultChecked}
                name={name}
                disabled={disabled}
                onChange={(e) => handleChange(e.target.checked)}
                type="checkbox"
            />
        </div>
    )
}

export const SelectInput = (props) => {

    const {
        label, labelClassName,

        name, className, onChange, defaultValue,
        defaultOption, options,

        validate,

        required,
        disabled,

        isSubmit,
    } = props

    const [val, setVal] = useState(defaultValue?.value || null)
    const [isTouched, setIsTouched] = useState(false)
    const [error, setError] = useState(null)

    //number validate
    const validates = {
        defaultValueCheck: {
            error: (val) => {
                let checkFlag = false

                options.some(ele => {
                    if (ele.value == (val?.value || val)) {
                        checkFlag = true
                    }
                })

                if (checkFlag) {
                    return false
                } else {
                    return true
                }
            },
            message: 'Không có giá trị mặc định trong miền lựa chọn',
        },
        ...validate,
    }

    function handleChange(val) {
        const errorVali = errorValidate(val, required, disabled, validates)
        // // debug
        // console.log('val -', name, " ", val)
        // console.log('error -', name, " ", errorVali)

        setVal(val)
        setError(errorVali)

        if (!disabled) {
            onChange({
                name: name,
                value: val,
                error: errorVali,
            })
        } else {
            onChange({
                name: name,
                value: null,
                error: null,
            })
        }
    }

    useEffect(() => {
        handleChange(val)
    }, [disabled])

    return (
        <div className="custom-from__input">
            <div
                className={labelClassName ? labelClassName : "custom-from__input-label"}>{label}
            </div>

            <select
                name={name}
                className={className}
                defaultValue={defaultValue?.value}
                onChange={(e) => handleChange(e.target.value)}
                onBlur={() => setIsTouched(true)}
                disabled={disabled}
            >
                {defaultValue
                    ? <option value={defaultValue?.value} selected disabled hidden
                    >
                        {defaultValue?.label}
                    </option>
                    :
                    <option value={null} selected disabled hidden
                    >
                        {defaultOption ?? 'Lựa chọn của bạn ?'}
                    </option>
                }
                {
                    options.map((option, id) => (
                        <option value={option.value} key={id}>{option.label}</option>
                    ))
                }</select>

            {error && (isTouched || isSubmit) && <ErrorMessage errorMessage={error} />}
        </div>
    )
}

export const ControllerInput = (props) => {
    const {
        label, labelClassName,

        name, onChange, defaultValue, value, onBlur,

        validate,
        required,

        disabled,

        isSubmit,
    } = props

    const [isTouched, setIsTouched] = useState(false)
    const [error, setError] = useState(null)


    //number validate
    const validates = {
        ...validate,
    }

    function handleChange(val) {
        const errorVali = errorValidate(val, required, disabled, validates)
        // debug
        // console.log('val -', name, " ", val)
        // console.log('error -', name, " ", errorVali)

        setError(errorVali)

        if (!disabled) {
            onChange({
                name: name,
                value: val,
                error: errorVali,
            })
        } else {
            onChange({
                name: name,
                value: null,
                error: errorVali,
            })
        }

    }

    useEffect(() => {
        handleChange(value || defaultValue)
    }, [disabled, value, defaultValue])


    return (
        <div>
            <div
                className={labelClassName ? labelClassName : "custom-from__input-label"}>{label}
            </div>
            {props.children}
            {error && (isTouched || isSubmit) && <ErrorMessage errorMessage={error} />}
        </div>
    )
}

export const FormManager = (initialValue = {}) => {

    const addError = (initialVal) => {
        let val = initialVal

        for (let ele in initialVal) {
            val[ele] = {
                value: initialVal[ele],
                error: null,
            }
        }

        return val
    }

    const [formData, setFormData] = useState(addError(initialValue))
    const [isError, setIsError] = useState(false)
    const [isSubmit, setIsSubmit] = useState(false)

    let tempData = formData

    //auto set isError
    useEffect(() => {
        for (let ele in formData) {
            if (formData[ele]?.error) {
                setIsError(true)
                return
            }
        }
        setIsError(false)
    }, [formData])

    const setInitial = (value) => {
        setFormData(addError(value))
    }

    // all => return all, don't care about error
    // value => return value, when if not error, otherwise nothing
    //error => return error if formData has
    const handleSubmit = (onSubmit, mode = 'value') => {
        submitTrigger()

        let data = {}

        for (let ele in formData) {
            if (ele != 'initialValue') {
                data = {
                    ...data,
                    [ele]: formData[ele].value,
                }
            }
        }

        if (mode == 'value' && !isError) {
            onSubmit?.(data)
        }

        if (mode == 'all')
            onSubmit?.(data)

    }

    const submitTrigger = () => {
        setIsSubmit(true)
    }

    const onFormChange = ({ name, value, error = null, auth = null }) => {
        // debug
        // console.log('[Custom - onChange ]', name, " ", value, " ", error, auth)
        //console.log(tempData)
        if (name) {
            tempData = {
                ...tempData,
                [name]: {
                    value: value,
                    error: error,
                }
            }
            setFormData({
                ...tempData
            })
        }
    }

    //get value formData
    const watch = (name) => {
        if (formData[name]?.value != undefined)
            return formData[name].value
    }

    //get error formData
    const watchError = (name) => {
        return formData[name]?.error
    }




    return { formData, onFormChange, isError, isSubmit, submitTrigger, handleSubmit, watch, watchError, setInitial }
}