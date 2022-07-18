import { useEffect, useState } from 'react'
import transfers_service from '../services/transfers_service';

/* Styling */
import '../styles/TransferHistory.css';

/* Classes */
import Transfer from '../classes/Transfer';

/* Components */
import TransferHistoryElem from '../components/TransferHistory/TransfersListItem';
import Utils from '../utils/utils';

/**
 * TransfersListPage - Shows all transfers for the current user.
 */
const TransfersListPage = () => {
    const [transfers, setTransfers] = useState(undefined);
    
    useEffect(() => {
        transfers_service.transfer_getAllTransfers()
        .then(transfers => {
            transfers.sort((a, b) => a.submissionDate < b.submissionDate);
            setTransfers(transfers);
        })
        .catch(err => {
            console.error("TransferHistory Error: ", err);
            setTransfers([]);
        });
    }, [])

    if (typeof transfers === 'undefined')
        return (<h1>Loading...</h1>);
    if (Utils.isEmptyObject(transfers))
        return (<h1>Could not load Transfer History</h1>); // TODO: decide routing for this
    return (
        <main>
            <h1>Transfer History</h1><br />
            <table className="content-table">
                <thead>
                    <tr>
                        <th>Transfer ID</th>
                        <th>Program</th>
                        <th>Membership Number</th>
                        <th>Status</th>
                        <th>Points</th>
                        <th>Submission Date</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {
                        transfers.map(transfer => <TransferHistoryElem key={transfer.transferId} transfer={transfer} />)
                    }
                </tbody>
            </table>
        </main>
    )
}

export default TransfersListPage;