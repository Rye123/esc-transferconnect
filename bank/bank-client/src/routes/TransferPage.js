import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import transfers_service from '../services/transfers_service';
import Utils from '../utils/utils';

/**
 * TransferPage - Shows transfer information for a single transfer.
 */
const TransferPage = () => {
    // TODO: resolve loyaltyProgramId into loyaltyProgram
    const [transfer, setTransfer] = useState(undefined);
    const [searchParams, setSearchParams] = useSearchParams();
    const transferId = searchParams.get("transferId") || "";

    useEffect(() => {
        transfers_service.transfer_getTransferById(transferId)
        .then(transfer => {
            setTransfer(transfer);
        })
        .catch(err => {
            console.error("TransferPage Error:", err);
            setTransfer({});
        })
    }, [])
    
    if (typeof transfer === 'undefined')
        return (<h1>Loading...</h1>);
    if (Utils.isEmptyObject(transfer))
        return (<h1>No such transfer</h1>); //TODO: decide where to route this
    return (
        <>
            <h1>{transfer.transferId}</h1>
        </>
    )
}

export default TransferPage;