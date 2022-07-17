import { Link } from 'react-router-dom';

/**
 * List Item for the `TransfersListPage`.
 * @param {Transfer} transfer 
 * @returns 
 */
const TransferHistoryElem = ({ transfer }) => {
    // TODO: resolve loyaltyProgramId into name of loyalty program
    return (
        <tr>
            <td>{transfer.transferId}</td>
            <td>{transfer.loyaltyProgramId}</td>
            <td>{transfer.loyaltyProgramMembershipId}</td>
            <td>{transfer.status}</td>
            <td><Link to={`/transfers/${transfer.transferId}`} className='btn'>View</Link></td>
        </tr>
    )
}

export default TransferHistoryElem;