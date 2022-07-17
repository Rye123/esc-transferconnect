import { useState, useContext } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import Utils from '../utils/utils';
import loyaltyPrograms_service from '../services/loyaltyPrograms_service';

/* Contexts */
import userContext from '../contexts/userContext';

/**
 * LoyaltyProgramMakeTransferPage - Form to allow user to make a single accrual transfer, for a particular program.
 */
const LoyaltyProgramMakeTransferPage = () => {
    const [loyaltyProgramMembership, setLoyaltyProgramMembership] = useState({});

    // Load User
    const userState = useContext(userContext);
    const user = userState.user;
    const params = useParams();
    const loyaltyProgramId = params.loyaltyProgramId;

    // Check for membership
    loyaltyPrograms_service.programs_getMembershipForProgram(loyaltyProgramId)
    .then(membership => {
        setLoyaltyProgramMembership(membership);
    })
    .catch(err => {
        console.error("LoyaltyProgramMakeTransferPage Error: ", err);
    });

    
    // Return HTML
    if (Utils.isEmptyObject(loyaltyProgramMembership))
        return (<h1>Loading...</h1>);
    return (
        <>
            <h1>Make transfer with membership ID: {loyaltyProgramMembership.loyaltyProgramMembershipId}</h1>
        </>
    )
}

export default LoyaltyProgramMakeTransferPage;