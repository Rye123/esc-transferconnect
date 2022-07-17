import { useParams } from 'react-router-dom';

/**
 * TransferPage - Shows transfer information for a single transfer.
 */
const TransferPage = () => {
    // TODO: resolve loyaltyProgramId into loyaltyProgram
    const params = useParams();
    const transferId = params.transferId;
    return (
        <h1>Transfer ID: {transferId}</h1>
    )
}

export default TransferPage;