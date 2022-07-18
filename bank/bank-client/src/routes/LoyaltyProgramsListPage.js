import { useEffect, useState } from 'react'
import loyaltyPrograms_service from '../services/loyaltyPrograms_service';

/* Styling */
import '../styles/LoyaltyProgramsListing.css';

/* Classes */
import LoyaltyProgram from '../classes/LoyaltyProgram';
import LoyaltyProgramsListItem from '../components/LoyaltyProgramsListing/LoyaltyProgramsListItem';

/**
 * LoyaltyProgramsListPage - Displays all available loyalty programs
 */
const LoyaltyProgramsListPage = () => {
    const [loyaltyPrograms, setLoyaltyPrograms] = useState([]);
    
    useEffect(() => {
        loyaltyPrograms_service.programs_getAllPrograms()
        .then(loyaltyPrograms => {
            setLoyaltyPrograms(loyaltyPrograms);
        })
        .catch(err => {
            console.error("LoyaltyProgramsListing Error:", err);
            setLoyaltyPrograms([]);
        });
    }, []);
    
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
                            loyaltyPrograms.map(loyaltyProgram => <LoyaltyProgramsListItem key={loyaltyProgram.loyaltyProgramId} loyaltyProgram={loyaltyProgram} />)
                        }
                    </div>
                </div>
            </div>
        </main>
    )
    
}

export default LoyaltyProgramsListPage;