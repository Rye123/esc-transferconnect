import { useState, useContext } from 'react'
import transfers_service from '../services/transfers_service';

/* Styling */
import '../styles/TransferHistory.css';

/* Contexts */
import userContext from '../contexts/userContext';

/* Classes */
import Transfer from '../classes/Transfer';

/* Components */
import TransferHistoryElem from '../components/TransferHistory/TransferHistoryElem';

const TransferHistory = () => {
    const [transfers, setTransfer] = useState([]);

    const userState = useContext(userContext);
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

export default TransferHistory;