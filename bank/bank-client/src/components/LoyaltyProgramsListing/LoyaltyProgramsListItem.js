import { Link } from 'react-router-dom';

/**
 * List Item for the `LoyaltyProgramsListPage`.
 * @param {LoyaltyProgram} loyaltyProgram 
 */
const LoyaltyProgramsListingElem = ({ loyaltyProgram }) => {
    return (
        <div className="view_item">
            <Link className="overlay" to={{ pathname: `/loyalty_programs/loyalty_program`, search: `?loyaltyProgramId=${loyaltyProgram.loyaltyProgramId}` }} />
            <div className="vi_left">
                <a href={loyaltyProgram.href}>
                    <img src={loyaltyProgram.imgSrc} alt="" />
                </a>
            </div>
            <div className="vi_right">
                <p className="title">{loyaltyProgram.loyaltyProgramName}</p>
                <div className="content">
                    <p><b>1</b> point = <b>{1 / loyaltyProgram.exchangeRate}</b> {loyaltyProgram.loyaltyProgramName} points</p>
                    <p>Estimated Transfer Time: {loyaltyProgram.estTransferTime}</p>
                    <p>Minimum Transfer Amount: {loyaltyProgram.minTransfer} points</p> {/* check if using points or miles*/}
                </div>
                <Link to={{ pathname: `/transfers/make_transfer`, search: `?loyaltyProgramId=${loyaltyProgram.loyaltyProgramId}` }} className="btn">Transfer Points</Link>
            </div>
        </div>
    )
}

export default LoyaltyProgramsListingElem;