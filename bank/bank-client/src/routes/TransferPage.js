import { useSearchParams } from 'react-router-dom';

/**
 * TransferPage - Shows transfer information for a single transfer.
 */
const TransferPage = () => {
    // TODO: resolve loyaltyProgramId into loyaltyProgram
    const [searchParams, setSearchParams] = useSearchParams();
    const transferId = searchParams.get("transferId") || "";
    
    return (
        <h1>Transfer ID: {transferId}</h1>
    )
}

export default TransferPage;