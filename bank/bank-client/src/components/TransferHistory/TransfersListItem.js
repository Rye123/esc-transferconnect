import { Link } from 'react-router-dom';

/**
 * List Item for the `TransfersListPage`.
 * @param {Transfer} transfer 
 * @param {string} loyaltyProgramName
 * @returns 
 */
const TransfersListItem = ({ transfer, loyaltyProgramName }) => {
    const transferStatusClassName = `transfer-${transfer.status}`;
    return (
        <tr>
            <td>{transfer.transferId}</td>
            <td>{loyaltyProgramName}</td>
            <td>{transfer.loyaltyProgramMembershipId}</td>
            <td className={transferStatusClassName}>{transfer.status}</td>
            <td>{transfer.points}</td>
            <td>{transfer.submissionDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</td>
            <td><Link to={{pathname: `/transfers/transfer`, search: `transferId=${transfer.transferId}`}} className='btn'>View</Link></td>
        </tr>
    )
}

export default TransfersListItem;