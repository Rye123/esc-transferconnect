import { useContext } from 'react'

/* Styling */
import '../styles/LoyaltyProgramsListing.css';

/* Contexts */
import userContext from '../contexts/userContext';

const LoyaltyProgramsListing = () => {
    const userState = useContext(userContext);
    return (
        <main>
            <div className="wrapper">
                <div className="links">
                    <ul>
                        <li data-view="list-view" className="li-list active">Loyalty Programs</li>
                    </ul>
                </div>
                <div className="view_main">
                    <div className="view_wrap list-view" style={{ display: 'block' }}>
                        <div className="view_item">
                            <div className="vi_left">
                                <a href="asia_miles_info.html">
                                    <img src="images/asia-miles.jpeg" alt="asia-miles" />
                                </a>
                            </div>
                            <div className="vi_right">
                                <p className="title">Asia Miles</p>
                                <div className="content">
                                    <p>400 Membership Reward Points = 250 Asia Miles</p>
                                    <p>Estimated transfer time: Upto 4 weeks</p>
                                    <p>Minimum transfer account: 400 points</p>
                                </div>
                                <div className="btn">Transfer points</div>
                            </div>
                        </div>
                        <div className="view_item">
                            <div className="vi_left">
                                <a href="british_airway_info.html">
                                    <img src="images/british-airways.jpeg" alt="british-airways" />
                                </a>
                            </div>
                            <div className="vi_right">
                                <p className="title">British Airway Executive Club</p>
                                <div className="content">
                                    <li>400 Membership Reward Points = 312.5 Aries</li>
                                    <p>Estimated transfer time: Upto 8 weeks</p>
                                    <p>Minimum transfer account: 400 points</p>
                                </div>
                                <div className="btn">Transfer points</div>
                            </div>
                        </div>
                        <div className="view_item">
                            <div className="vi_left">
                                <a href="dynasty_flyer_info.html">
                                    <img src="images/china-airlines.png" alt="china-airlines" />
                                </a>
                            </div>
                            <div className="vi_right">
                                <p className="title">Dynasty Flyer</p>
                                <div className="content">
                                    <p>Membership Reward Points = 250 Dynasty miles</p>
                                    <p>Estimated transfer time: Upto 4 weeks</p>
                                    <p>Minimum transfer account: 400 points</p>
                                </div>
                                <div className="btn">Transfer points</div>
                            </div>
                        </div>
                        <div className="view_item">
                            <div className="vi_left">
                                <a href="emirates_skywards_info.html">
                                    <img src="images/emirates.png" alt="emirates" />
                                </a>
                            </div>
                            <div className="vi_right">
                                <p className="title">Emirates Skywards</p>
                                <div className="content">
                                    <p>Membership Reward Points = 250 Skywards miles</p>
                                    <p>Estimated transfer time: Upto 4 weeks</p>
                                    <p>Minimum transfer account: 400 points</p>
                                </div>
                                <div className="btn">Transfer points</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}

export default LoyaltyProgramsListing;