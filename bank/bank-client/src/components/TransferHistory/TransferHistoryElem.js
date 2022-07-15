
const TransferHistoryElem = ({transfer}) => {
    // TODO: resolve loyaltyProgramId into name of loyalty program
    return (
        <tr>
            <td>{transfer.transferId}</td>
            <td>{transfer.loyaltyProgramId}</td>
            <td>{transfer.loyaltyProgramMembershipId}</td>
            <td>{transfer.status}</td>
        </tr>
    )
}

export default TransferHistoryElem;