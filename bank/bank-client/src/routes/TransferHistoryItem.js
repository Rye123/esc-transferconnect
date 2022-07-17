import { useParams } from 'react-router-dom';

const TransferHistoryItem = () => {
    // TODO: resolve loyaltyProgramId into loyaltyProgram
    const params = useParams();
    const transferId = params.transferId;
    return (
        <h1>Transfer ID: {transferId}</h1>
    )
}

export default TransferHistoryItem;