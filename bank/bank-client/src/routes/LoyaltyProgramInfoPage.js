import { useState } from 'react';
import { useParams } from 'react-router-dom';
import Utils from '../utils/utils';
import loyaltyPrograms_service from '../services/loyaltyPrograms_service';

/**
 * LoyaltyProgramInfoPage - Displays loyalty program data for a single loyalty program
 */
const LoyaltyProgramInfoPage = () => {
    const [loyaltyProgram, setLoyaltyProgram] = useState(undefined);
    const params = useParams();
    const loyaltyProgramId = params.loyaltyProgramId;

    loyaltyPrograms_service.programs_getProgramById(loyaltyProgramId)
    .then(loyaltyProgram => {
        console.log("loaded");
        setLoyaltyProgram(loyaltyProgram);
    })
    .catch(err => {
        console.error("LoyaltyProgramInfoPage Error: ", err);
        setLoyaltyProgram({});
    })

    
    // Return HTML
    console.log(loyaltyProgram)
    if (typeof loyaltyProgram === 'undefined')
        return (<h1>Loading...</h1>);
    if (Utils.isEmptyObject(loyaltyProgram))
        return (<h1>No such loyalty program</h1>);
    return (
        <>
            <img className="wave" src='images/wave.png' />
            <div className='container'>
                <div className='img'>
                    <img src='images/info.svg' alt="Information" />
                </div>
                <div className='container2'>
                    <div className='container3'>
                        <a href={`${loyaltyProgram.href}`}>
                            <img className='avatar' src={`${loyaltyProgram.imgSrc}`} alt=''/>
                        </a>
                        <h3>{loyaltyProgram.loyaltyProgramName}</h3>
                        <p>{loyaltyProgram.description}</p>

                        <button className='btn' type='submit'>Edit/Save Membership</button>
                        <button className='btn' type='submit'>Transfer Points</button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default LoyaltyProgramInfoPage;