import { useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import Utils from '../utils/utils';
import loyaltyPrograms_service from '../services/loyaltyPrograms_service';

/* Hooks */
import { useUserAuth } from '../hooks/UserAuthContext';

/**
 * LoyaltyProgramMembershipPage - Form to create or modify an existing membership
 */
const LoyaltyProgramMembershipPage = () => {
    const [loyaltyProgram, setLoyaltyProgram] = useState({});

    // Load User
    const params = useParams();
    const loyaltyProgramId = params.loyaltyProgramId;

    
    // Return HTML
    if (Utils.isEmptyObject(loyaltyProgram))
        return (<h1>Loading...</h1>);
    return (
        <>
            <h1>Set/Modify Existing Membership</h1>
        </>
    )
}

export default LoyaltyProgramMembershipPage;