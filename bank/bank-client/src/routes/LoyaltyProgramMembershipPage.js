import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

/* Services */
import loyaltyPrograms_service from '../services/loyaltyPrograms_service';

/* Hooks */
import { useUserAuth } from '../hooks/UserAuthContext';

/* Utils */
import Utils from '../utils/utils';

/**
 * LoyaltyProgramMembershipPage - Form to create or modify an existing membership
 */
const LoyaltyProgramMembershipPage = () => {
    const [loyaltyProgram, setLoyaltyProgram] = useState(undefined);
    const [loyaltyProgramMembership, setLoyaltyProgramMembership] = useState(undefined);
    const [searchParams, setSearchParams] = useSearchParams();
    const [membershipIdInput, setMembershipIdInput] = useState("");
    const navigate = useNavigate();

    // Load User
    const userAuth = useUserAuth();
    const user = userAuth.user;
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
        loyaltyPrograms_service.programs_getMembershipForProgram(loyaltyProgramId)
            .then(membership => {
                setLoyaltyProgramMembership(membership);
                setMembershipIdInput(membership.loyaltyProgramMembershipId);
            })
            .catch(err => {
                setLoyaltyProgramMembership({});
            })
    }, [])


    // Form Submission
    const handleFormSubmission_new = (event) => {
        event.preventDefault();
        const membershipId = membershipIdInput;
        setMembershipIdInput("");
        loyaltyPrograms_service.programs_postMembershipForProgram(loyaltyProgramId, membershipId)
            .then(membership => {
                navigate({ pathname: `/transfers/make_transfer`, search: `?loyaltyProgramId=${loyaltyProgram.loyaltyProgramId}` });
            })
            .catch(err => {
                console.error("LoyaltyProgramMembershipPage Error:", err);
            })
    }
    const handleFormSubmission_modify = (event) => {
        event.preventDefault();
        const membershipId = membershipIdInput;
        setMembershipIdInput("");
        loyaltyPrograms_service.programs_updateMembershipForProgram(loyaltyProgramId, membershipId)
            .then(membership => {
                navigate({ pathname: `/transfers/make_transfer`, search: `?loyaltyProgramId=${loyaltyProgram.loyaltyProgramId}` });
            })
            .catch(err => {
                console.error("LoyaltyProgramMembershipPage Error:", err);
            })
    }

    // Return HTML
    if (typeof loyaltyProgram === 'undefined' || typeof loyaltyProgramMembership === 'undefined')
        return (<h1>Loading membership page...</h1>);
    if (Utils.isEmptyObject(loyaltyProgram))
        return (<h1>No such Loyalty Program</h1>); //TODO: decide where to redirect
    return (
        <main>
            <img className='wave' src='/images/wave.png' />
            <div className='container'>
                <div className='img'>
                    <img src='/images/reward.svg' alt='' />
                </div>
                <div className='form-container'>
                    <form onSubmit={(Utils.isEmptyObject(loyaltyProgramMembership)) ? handleFormSubmission_new : handleFormSubmission_modify}>
                        {(Utils.isEmptyObject(loyaltyProgramMembership)) &&
                            <>
                                <h3>Link your {loyaltyProgram.loyaltyProgramName} account to start</h3>
                                <h4>Once linked, we'll use this membership for your future points transfers.</h4>
                            </>
                        }

                        {(!Utils.isEmptyObject(loyaltyProgramMembership)) &&
                            <>
                                <h3>Modify your {loyaltyProgram.loyaltyProgramName} account</h3>
                                <h4>We'll use this membership for your future points transfers.</h4>
                            </>
                        }


                        <div className='input-div one'>
                            <div className='i'>
                                <i className='material-icons'>person</i>
                            </div>
                            <div>
                                <input className='input' type='text' value={user.firstName + " " + user.lastName} placeholder='Primary Cardholder' disabled /><br />
                            </div>
                        </div>
                        <div className='input-div two'>
                            <div className='i'>
                                <i className='material-icons'>card_membership</i>
                            </div>
                            <div>
                                <input className='input' type='text' value={membershipIdInput} onChange={(event) => setMembershipIdInput(event.target.value)} placeholder='Membership ID' /><br />
                            </div>
                        </div>
                        <button className='btn' type='submit'>Save Membership</button>
                        <h6>Please ensure that your Loyalty Membership name matches your cardholder name or transfer may be rejected. Rewards can also be transfered to a Loyalty Program registered to the exact cardholder name on the DigiBank account.</h6>
                    </form>
                </div>
            </div>
        </main>
    )
}

export default LoyaltyProgramMembershipPage;