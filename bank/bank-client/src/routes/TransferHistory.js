import { useContext } from 'react'

/* Styling */
import '../styles/TransferHistory.css';

/* Contexts */
import userContext from '../contexts/userContext';

/* Classes */
import Transfer from '../classes/Transfer';

/* Components */
import TransferHistoryElem from '../components/TransferHistory/TransferHistoryElem';

const transfers = [];
for (let i = 1; i < 11; i++) {
    transfers.push(new Transfer((i*123).toString(), (i*432).toString(), (i*54).toString(), 'pending'))
}

const TransferHistory = () => {
    const userState = useContext(userContext);

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