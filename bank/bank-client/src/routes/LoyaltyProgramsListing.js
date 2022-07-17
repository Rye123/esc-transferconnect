import { useState, useContext } from 'react'
import loyaltyPrograms_service from '../services/loyaltyPrograms_service';

/* Styling */
import '../styles/LoyaltyProgramsListing.css';

/* Contexts */
import userContext from '../contexts/userContext';

/* Classes */
import LoyaltyProgram from '../classes/LoyaltyProgram';
import LoyaltyProgramsListingElem from '../components/LoyaltyProgramsListing/LoyaltyProgramsListingElem';

const LoyaltyProgramsListing = () => {
    const [loyaltyPrograms, setLoyaltyPrograms] = useState([]);

    const userState = useContext(userContext);
    loyaltyPrograms_service.programs_getAllPrograms()
    .then(loyaltyPrograms => {
        setLoyaltyPrograms(loyaltyPrograms);
    })
    .catch(err => {
        console.error("LoyaltyProgramsListing Error:", err);
    });
    
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