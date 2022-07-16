import { useParams } from 'react-router-dom';

const LoyaltyProgramInfo = () => {
    // TODO: resolve loyaltyProgramId into loyaltyProgram
    const params = useParams();
    const loyaltyProgramId = params.loyaltyProgramId;
    return (
        <h1>Loyalty Program ID: {loyaltyProgramId}</h1>
    )
}

export default LoyaltyProgramInfo;