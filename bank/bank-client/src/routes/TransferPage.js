import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import transfers_service from '../services/transfers_service';
import loyaltyPrograms_service from '../services/loyaltyPrograms_service';
import Utils from '../utils/utils';

/* Styling */
import '../styles/TransferPage.css';

/**
 * TransferPage - Shows transfer information for a single transfer.
 */
const TransferPage = () => {
    const [transfer, setTransfer] = useState(undefined);
    const [loyaltyProgram, setLoyaltyProgram] = useState(undefined);
    const [searchParams, setSearchParams] = useSearchParams();
    const transferId = searchParams.get("transferId") || "";

    useEffect(() => {
        transfers_service.transfer_getTransferById(transferId)
        .then(transfer => {
            setTransfer(transfer);
            return loyaltyPrograms_service.programs_getProgramById(transfer.loyaltyProgramId);
        })
        .then(loyaltyProgram => {
            setLoyaltyProgram(loyaltyProgram);
        })
        .catch(err => {
            console.error("TransferPage Error:", err);
            setTransfer({});
        })
    }, [])
    
    if (typeof transfer === 'undefined' && typeof loyaltyProgram === 'undefined')
        return (<h1>Loading...</h1>);
    if (Utils.isEmptyObject(transfer) || Utils.isEmptyObject(loyaltyProgram))
        return (<h1>No such transfer</h1>); //TODO: decide where to route this
    return (
        <>
            <img className='wave' src='/images/wave.png' />
            <div className='container'>
                <div className='img'>
                    <img src='/images/success.svg' alt='Transfer Success' />
                </div>
                <div className='success-container'>
                    <div>
                        <h2>TRANSFER ID <u>{transfer.transferId}</u></h2>
                        <h1>{transfer.status.toUpperCase()}</h1>
                        <h3>Your <b>{transfer.points}</b> points are on their way to <b>{loyaltyProgram.loyaltyProgramName}</b>!</h3> <br />
                        <p>Date of submission: {transfer.submissionDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    </div>
                </div>
            </div>
        </>
    )
}

export default TransferPage;