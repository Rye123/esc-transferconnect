
const LoyaltyProgramsListingElem = ({loyaltyProgram}) => {
    // TODO: resolve exchange rate into xxx Reward Points = yyy Program Points
    return (
        <div className="view_item">
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
                <div className="btn">Transfer Points</div>
            </div>
        </div>
    )
}

export default LoyaltyProgramsListingElem;