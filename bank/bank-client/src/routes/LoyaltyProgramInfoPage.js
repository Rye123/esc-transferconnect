import { useParams } from 'react-router-dom';

/**
 * LoyaltyProgramInfoPage - Displays loyalty program data for a single loyalty program
 */
const LoyaltyProgramInfoPage = () => {
    // TODO: resolve loyaltyProgramId into loyaltyProgram
    const params = useParams();
    const loyaltyProgramId = params.loyaltyProgramId;
    return (
        <h1>Loyalty Program ID: {loyaltyProgramId}</h1>
    )
}

export default LoyaltyProgramInfoPage;