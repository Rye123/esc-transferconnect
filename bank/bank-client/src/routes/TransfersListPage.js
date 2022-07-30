import { useEffect, useState } from 'react'
import transfers_service from '../services/transfers_service';
import loyaltyPrograms_service from '../services/loyaltyPrograms_service';

/* Styling */
import '../styles/TransferHistory.css';

/* Components */
import TransferHistoryElem from '../components/TransferHistory/TransfersListItem';
import Utils from '../utils/utils';

/**
 * TransfersListPage - Shows all transfers for the current user.
 */
const TransfersListPage = () => {
    const [transfers, setTransfers] = useState(undefined);
    const [loyaltyProgramMapping, setLoyaltyProgramMapping] = useState(undefined); // maps ids to the program name

    // Load Transfers
    useEffect(() => {
        transfers_service.transfer_getAllTransfers()
            .then(transfers => {
                transfers.sort((a, b) => a.submissionDate < b.submissionDate);
                setTransfers(transfers);
                return loyaltyPrograms_service.programs_getAllPrograms();
            })
            .then(loyaltyPrograms => {
                const newLoyaltyProgramMapping = {};
                loyaltyPrograms.forEach(loyaltyProgram => {
                    newLoyaltyProgramMapping[loyaltyProgram.loyaltyProgramId] = loyaltyProgram.loyaltyProgramName;
                });
                setLoyaltyProgramMapping(newLoyaltyProgramMapping);
            })
            .catch(err => {
                console.error("TransferHistory Error: ", err);
                setTransfers([]);
                setLoyaltyProgramMapping({})
            });
    }, [])

    if (typeof loyaltyProgramMapping === 'undefined')
        return (<h1>Loading...</h1>);
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
                        transfers.map(transfer => <TransferHistoryElem
                            key={transfer.transferId}
                            transfer={transfer}
                            loyaltyProgramName={loyaltyProgramMapping[transfer.loyaltyProgramId]}
                        />)
                    }
                </tbody>
            </table>
        </main>
    )
}

export default TransfersListPage;