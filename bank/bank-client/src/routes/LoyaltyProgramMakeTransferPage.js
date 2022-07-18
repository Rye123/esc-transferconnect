import { useEffect, useState } from 'react';
import { Navigate, useSearchParams, useNavigate } from 'react-router-dom';
import Utils from '../utils/utils';
import loyaltyPrograms_service from '../services/loyaltyPrograms_service';

/**
 * LoyaltyProgramMakeTransferPage - Form to allow user to make a single accrual transfer, for a particular program.
 */
const LoyaltyProgramMakeTransferPage = () => {
    const [loyaltyProgramMembership, setLoyaltyProgramMembership] = useState(undefined);
    const [loyaltyProgram, setLoyaltyProgram] = useState(undefined);
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
                    </form>
                </div>
            </div>
        </>
    )
}

export default LoyaltyProgramMakeTransferPage;