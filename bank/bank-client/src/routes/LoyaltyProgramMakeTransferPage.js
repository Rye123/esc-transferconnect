import { useEffect, useState } from 'react';
import { Navigate, useSearchParams, useNavigate } from 'react-router-dom';
import Utils from '../utils/utils';
import loyaltyPrograms_service from '../services/loyaltyPrograms_service';

/* Hooks */
import { useUserAuth } from '../hooks/UserAuthContext';

/**
 * LoyaltyProgramMakeTransferPage - Form to allow user to make a single accrual transfer, for a particular program.
 */
const LoyaltyProgramMakeTransferPage = () => {
    const [loyaltyProgramMembership, setLoyaltyProgramMembership] = useState(undefined);
    const [loyaltyProgram, setLoyaltyProgram] = useState(undefined);
    const [searchParams, setSearchParams] = useSearchParams();
    const userAuth = useUserAuth();
    const user = userAuth.user;

    // Load Loyalty Program ID
    const loyaltyProgramId = searchParams.get("loyaltyProgramId") || "";

    // Check for membership for this user
    useEffect(() => {
        loyaltyPrograms_service.programs_getMembershipForProgram(loyaltyProgramId)
        .then(membership => {
            setLoyaltyProgramMembership(membership);
        })
        .catch(err => {
            console.error("LoyaltyProgramMakeTransferPage Error: ", err);
            setLoyaltyProgramMembership({});
        });
        loyaltyPrograms_service.programs_getProgramById(loyaltyProgramId)
        .then(loyaltyProgram => {
            setLoyaltyProgram(loyaltyProgram);
        })
        .catch(err => {
            console.error("LoyaltyProgramMakeTransferPage Error: ", err);
            setLoyaltyProgram({});
        });
    }, []);

    // Handle Transfer Form Submission
    const handleFormSubmission = (event) => {
        event.preventDefault();
    }
    let currentPoints = 50;
    // Return HTML
    if (typeof loyaltyProgramMembership === 'undefined' || typeof loyaltyProgram === 'undefined')
        return (<h1>Loading...</h1>);
    if (Utils.isEmptyObject(loyaltyProgram))
        return (<h1>Invalid loyalty program</h1>); //TODO: decide where to route
    if (Utils.isEmptyObject(loyaltyProgramMembership))
        return (<Navigate to={{pathname: '/loyalty_programs/membership', search: `?loyaltyProgramId=${loyaltyProgramId}`}} />);
    return (
        <>
            <img className='wave' src='/images/wave.png' />
            <div className='container'>
                <div className='img'>
                    <img src='/images/points.svg' alt="" />
                </div>
                <div className='form-container'>
                    <form onSubmit={handleFormSubmission}>
                        <h3>Transfer Points to {loyaltyProgram.loyaltyProgramName}</h3>
                        <h2>{loyaltyProgramMembership.loyaltyProgramMembershipId}</h2>
                        <div className='box'>
                            <b>AVAILABLE: {user.points}</b><br /><br />
                            <b>USING: {currentPoints}</b><br /><br />
                            <b>REMAINING: {user.points - currentPoints}</b><br /><br />
                        </div>
                        <br />
                        <br />
                        <h3>Total Points to Transfer</h3>
                        <div className='input-div two'>
                            <div className='i'>
                                <i className='material-icons'>card_membership</i>
                            </div>
                            <div>
                                <input className='input' type='password' placeholder='Enter the number of points...' /><br />
                            </div>
                        </div>
                        <br />
                        <h3>Equates to {currentPoints * loyaltyProgram.exchangeRate} points</h3>
                        <button className='btn' type='submit'>Complete Transfer</button>
                        <h5>All transfers are final</h5><br />
                        <h6>Once rewards have been transfered, they are subject to the terms of the Loyalty Program to which they are transferred</h6>
                    </form>
                </div>
            </div>
        </>
    )
}

export default LoyaltyProgramMakeTransferPage;