import { useEffect, useState } from 'react';
import { Navigate, useSearchParams, useNavigate } from 'react-router-dom';
import Utils from '../utils/utils';
import loyaltyPrograms_service from '../services/loyaltyPrograms_service';
import transfers_service from '../services/transfers_service';

/* Hooks */
import { useUserAuth } from '../hooks/UserAuthContext';

/**
 * LoyaltyProgramMakeTransferPage - Form to allow user to make a single accrual transfer, for a particular program.
 */
const LoyaltyProgramMakeTransferPage = () => {
    const [loyaltyProgramMembership, setLoyaltyProgramMembership] = useState(undefined);
    const [loyaltyProgram, setLoyaltyProgram] = useState(undefined);
    const [searchParams, setSearchParams] = useSearchParams();
    const [pointsInputValue, setPointsInputValue] = useState({inputStr: "", points: 0});

    const navigate = useNavigate();

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

    // Handle Points Input
    const handlePointsInputChange = (event) => {
        if (event.target.value === "") {
            setPointsInputValue({
                inputStr: "",
                points: 0
            });
            return;
        }

        let inputVal = parseInt(event.target.value);
        let newPointsInputValue = {
            inputStr: pointsInputValue.inputStr,
            points: pointsInputValue.points
        };
        if (inputVal < 0)
            inputVal = -inputVal;
        if (!isNaN(inputVal)) 
            newPointsInputValue.points = inputVal;
        
        newPointsInputValue.inputStr = (newPointsInputValue.points === 0) ? "" : newPointsInputValue.points;
        setPointsInputValue(newPointsInputValue);
    }

    // Handle Transfer Form Submission
    const handleFormSubmission = (event) => {
        event.preventDefault();
        const pointsToTransfer = pointsInputValue.points;

        //Clear input elements
        setPointsInputValue({
            inputStr: "",
            points: 0
        });

        // Send Request
        transfers_service.transfer_postTransfer(loyaltyProgramId, loyaltyProgramMembership.loyaltyProgramMembershipId, pointsToTransfer)
        .then(transfer => {
            navigate({pathname: `/transfers/transfer`, search: `transferId=${transfer.transferId}`});
        })
        .catch(err => {
            console.error("LoyaltyProgramMakeTransferPage Error:", err);
            alert("Error in form submission");
        });
    }
    
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
                            AVAILABLE: {isNaN(user.points) ? 0 : user.points}<br /><br />
                            USING: {isNaN(pointsInputValue.points) ? 0 : pointsInputValue.points}<br /><br />
                            REMAINING: {(isNaN(user.points) || isNaN(pointsInputValue.points)) ? 0 : user.points - pointsInputValue.points}<br /><br />
                            MINIMUM TRANSFER: {loyaltyProgram.minTransfer} points<br /><br />
                        </div>
                        <br />
                        <br />
                        <h3>Total Points to Transfer</h3>
                        <div className='input-div two'>
                            <div className='i'>
                                <i className='material-icons'>card_membership</i>
                            </div>
                            <div>
                                <input className='input' type='number' value={pointsInputValue.inputStr} onChange={handlePointsInputChange} placeholder='Enter the number of points...' /><br />
                            </div>
                        </div>
                        <br />
                        <h3>Equates to <b>{(isNaN(pointsInputValue.points) || isNaN(loyaltyProgram.exchangeRate)) ? 0 : Math.round(pointsInputValue.points / loyaltyProgram.exchangeRate)}</b> {loyaltyProgram.loyaltyProgramName} points.</h3>
                        <button className='btn' type='submit' disabled={((user.points - pointsInputValue.points) <= 0) || pointsInputValue.points <= 0 || pointsInputValue.points < loyaltyProgram.minTransfer}>Complete Transfer</button>
                        <h5>All transfers are final</h5><br />
                        <h6>Once rewards have been transferred, they are subject to the terms of the Loyalty Program to which they are transferred</h6>
                    </form>
                </div>
            </div>
        </>
    )
}

export default LoyaltyProgramMakeTransferPage;