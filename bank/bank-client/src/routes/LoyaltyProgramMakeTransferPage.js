import { useEffect, useState } from 'react';
import { Navigate, useSearchParams, useNavigate } from 'react-router-dom';
import Utils from '../utils/utils';
import loyaltyPrograms_service from '../services/loyaltyPrograms_service';

/**
 * LoyaltyProgramMakeTransferPage - Form to allow user to make a single accrual transfer, for a particular program.
 */
const LoyaltyProgramMakeTransferPage = () => {
    const [loyaltyProgramMembership, setLoyaltyProgramMembership] = useState(undefined);
    const [searchParams, setSearchParams] = useSearchParams();

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
            setLoyaltyProgramMembership({})
        });
    }, []);
    
    // Return HTML
    if (typeof loyaltyProgramMembership === 'undefined')
        return (<h1>Loading...</h1>);
    if (Utils.isEmptyObject(loyaltyProgramMembership))
        return (<Navigate to={{pathname: '/loyalty_programs/membership', search: `?loyaltyProgramId=${loyaltyProgramId}`}} />);
    return (
        <>
            <h1>Make transfer with membership ID: {loyaltyProgramMembership.loyaltyProgramMembershipId}</h1>
        </>
    )
}

export default LoyaltyProgramMakeTransferPage;