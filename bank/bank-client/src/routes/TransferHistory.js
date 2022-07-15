import { useContext } from 'react'

/* Styling */
import '../styles/TransferHistory.css';

/* Contexts */
import userContext from '../contexts/userContext';

const TransferHistory = () => {
    const userState = useContext(userContext);

    return (
        <main>
            <h1>Transfer History</h1><br />
            <table class="content-table">
                <thead>
                    <tr>
                        <th>S.No</th>
                        <th>Transfer ID</th>
                        <th>Program</th>
                        <th>Membership Number</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>1</td>
                        <td>100005</td>
                        <td>Dynasty Flyer</td>
                        <td>H1234567</td>
                        <td>COMPLETED</td>
                    </tr>
                    <tr class="active-row">
                        <td>2</td>
                        <td>100006</td>
                        <td>Emirates Skywards</td>
                        <td>P1234567</td>
                        <td>PENDING</td>
                    </tr>
                    <tr>
                        <td>3</td>
                        <td>100007</td>
                        <td>Asia Miles</td>
                        <td>G1234567</td>
                        <td>PENDING</td>
                    </tr>
                </tbody>
            </table>
        </main>
    )
}

export default TransferHistory;