import { useState } from 'react'
import transfers_service from '../services/transfers_service';

/* Styling */
import '../styles/TransferHistory.css';

/* Classes */
import Transfer from '../classes/Transfer';

/* Components */
import TransferHistoryElem from '../components/TransferHistory/TransfersListItem';

/**
 * TransfersListPage - Shows all transfers for the current user.
 */
const TransfersListPage = () => {
    const [transfers, setTransfer] = useState([]);

    transfers_service.transfer_getAllTransfers()
    .then(transfers => {
        setTransfer(transfers);
    })
    .catch(err => {
        console.error("TransferHistory Error: ", err);
    });

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