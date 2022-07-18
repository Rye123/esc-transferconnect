import { Link, useSearchParams } from 'react-router-dom';

/**
 * List Item for the `LoyaltyProgramsListPage`.
 * @param {LoyaltyProgram} loyaltyProgram 
 * @returns 
 */
const LoyaltyProgramsListingElem = ({ loyaltyProgram }) => {
    // TODO: resolve exchange rate into xxx Reward Points = yyy Program Points
    return (
        <div className="view_item">
            <Link className="overlay" to={{pathname: `/loyalty_programs/loyalty_program`, search: `?loyaltyProgramId=${loyaltyProgram.loyaltyProgramId}`}} />
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
                <Link to={{pathname: `/transfers/make_transfer`, search: `?loyaltyProgramId=${loyaltyProgram.loyaltyProgramId}`}} className="btn">Transfer Points</Link>
            </div>
        </div>
    )
}

export default LoyaltyProgramsListingElem;