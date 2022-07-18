import { useState, useContext, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Utils from '../utils/utils';
import loyaltyPrograms_service from '../services/loyaltyPrograms_service';

/* Hooks */
import { useUserAuth } from '../hooks/UserAuthContext';

/**
 * LoyaltyProgramMembershipPage - Form to create or modify an existing membership
 */
const LoyaltyProgramMembershipPage = () => {
    const [loyaltyProgram, setLoyaltyProgram] = useState(undefined);
    const [searchParams, setSearchParams] = useSearchParams();

    // Load User
    const loyaltyProgramId = searchParams.get("loyaltyProgramId") || "";
    
    useEffect(() => {
        loyaltyPrograms_service.programs_getProgramById(loyaltyProgramId)
        .then(loyaltyProgram => {
            setLoyaltyProgram(loyaltyProgram);
        })
        .catch(err => {
            console.error("LoyaltyProgramMembershipPage Error:", err);
            setLoyaltyProgram({});
        });
    }, [])

    
    // Return HTML
    if (typeof loyaltyProgram === 'undefined')
        return (<h1>Loading membership page...</h1>);
    if (Utils.isEmptyObject(loyaltyProgram))
        return (<h1>No such Loyalty Program</h1>); //TODO: decide where to redirect
    
    return (
        <>
            <h1>Membership for {loyaltyProgram.loyaltyProgramName}</h1>
        </>
    )
}

export default LoyaltyProgramMembershipPage;