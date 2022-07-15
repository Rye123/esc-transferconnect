/* Styling */
import './NotFound.css';


const NotFound = () => {
    return (
        <main>
            <img class ="wave" src='images/wave.png' />
            <div class = "container">
                <div class = "img">
                    <img src='images/404.svg' alt="404 error" />
                </div>
                <div class = "error-container">
                    <h2>404 Error: Page not found</h2>
                </div>
            </div>
        </main>
    )
}

export default NotFound;