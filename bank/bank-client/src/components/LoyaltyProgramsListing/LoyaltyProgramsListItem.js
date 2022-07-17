import { Link } from 'react-router-dom';

/**
 * List Item for the `LoyaltyProgramsListPage`.
 * @param {LoyaltyProgram} loyaltyProgram 
 * @returns 
 */
const LoyaltyProgramsListingElem = ({ loyaltyProgram }) => {
    // TODO: resolve exchange rate into xxx Reward Points = yyy Program Points
    return (
        <Link className="view_item" to={`/loyalty_programs/${loyaltyProgram.loyaltyProgramId}`}>
            <div className="vi_left">
                <a href={loyaltyProgram.href}>
                    <img src={loyaltyProgram.imgSrc} alt="" />
                </a>
            </div>
            <div className="vi_right">
                <p className="title">{loyaltyProgram.loyaltyProgramName}</p>
                <div className="content">
                    <p>Ratio: {loyaltyProgram.exchangeRate}</p>
                    <p>Estimated Transfer Time: {loyaltyProgram.estTransferTime}</p>
                    <p>Minimum Transfer Account: {loyaltyProgram.minTransfer}</p>
                </div>
                <Link to={`/loyalty_programs/${loyaltyProgram.loyaltyProgramId}`} className="btn">Transfer Points</Link>
            </div>
        </Link>
    )
}

export default LoyaltyProgramsListingElem;