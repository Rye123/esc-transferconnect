import { useContext } from 'react'

/* Contexts */
import userContext from '../contexts/userContext';

const LoyaltyProgramsListing = () => {
    const userState = useContext(userContext);
    return (
        <main>
            <h1>Programs</h1>
        </main>
    )
}

export default LoyaltyProgramsListing;