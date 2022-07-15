import { useContext } from 'react'

/* Styling */
import '../styles/LoyaltyProgramsListing.css';

/* Contexts */
import userContext from '../contexts/userContext';

/* Classes */
import LoyaltyProgram from '../classes/LoyaltyProgram';
import LoyaltyProgramsListingElem from '../components/LoyaltyProgramsListing/LoyaltyProgramsListingElem';

const loyaltyPrograms = [];
loyaltyPrograms.push(new LoyaltyProgram("2341", "Asia Miles", 400/250, "asia_miles_info.html", "images/asia-miles.jpeg", 4*7, 400));
loyaltyPrograms.push(new LoyaltyProgram("1234", "British Airways", 400/312.5, "british_airway_info.html", "images/british-airways.jpeg", 4*8, 400));
loyaltyPrograms.push(new LoyaltyProgram("2468", "Dynasty Flyer", 400/250, "dynasty_flyer_info.html", "images/china-airlines.jpeg", 4*4, 400))
loyaltyPrograms.push(new LoyaltyProgram("6432", "Emirates Skywards", 400/250, "emirates_skywards_info.html", "images/emirates.png", 4*4, 400))

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
                        {
                            loyaltyPrograms.map(loyaltyProgram => <LoyaltyProgramsListingElem key={loyaltyProgram.loyaltyProgramId} loyaltyProgram={loyaltyProgram} />)
                        }
                    </div>
                </div>
            </div>
        </main>
    )
}

export default LoyaltyProgramsListing;