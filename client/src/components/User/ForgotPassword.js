import React, { useState, useEffect } from 'react';
import Loading from '../Layout/Loading/Loading';
import { useDispatch, useSelector } from 'react-redux';
import MetaData from '../MetaData.js';
import { clearErrors, forgotPassword } from "../../actions/userActions";
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import { useAlert } from "react-alert";
import './ForgotPassword.css';

function ForgotPassword() {

    const dispatch = useDispatch();
    const alert = useAlert();
    const { loading, error, message } = useSelector(state => state.forgotPassword);
    const [email, setEmail] = useState('');

    useEffect(() => {
        if (error) {
            alert.error(error);
            dispatch(clearErrors());
        }

        if (message) {
            alert.success(message);
        }

    }, [error, alert, dispatch, message]);

    const forgotPasswordSubmit = (e) => {
        e.preventDefault();
        const myForm = new FormData();
        myForm.set("email", email);
        dispatch(forgotPassword(myForm));
    }
    return (
        <>
            {loading ? (
                <Loading />
            ) : (
                <>
                    <MetaData title="Forgot Password" />
                    <div className="forgotPasswordContainer">
                        <div className="forgotPasswordBox">
                            <h2 className="forgotPasswordHeading">Forgot Password</h2>

                            <form
                                className="forgotPasswordForm"
                                onSubmit={forgotPasswordSubmit}
                            >
                                <div className="forgotPasswordEmail">
                                    <MailOutlineIcon />
                                    <input
                                        type="email"
                                        placeholder="Email"
                                        required
                                        name="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>

                                <input
                                    type="submit"
                                    value="Send"
                                    className="forgotPasswordBtn"
                                />
                            </form>
                        </div>
                    </div>
                </>
            )}
        </>
    )
}

export default ForgotPassword
