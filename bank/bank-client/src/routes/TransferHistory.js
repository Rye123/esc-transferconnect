import { useContext } from 'react'

/* Contexts */
import userContext from '../contexts/userContext';

const TransferHistory = () => {
    const userState = useContext(userContext);
    
    return (
        <main>
            <h1>Transfer History</h1>
        </main>
    )
}

export default TransferHistory;