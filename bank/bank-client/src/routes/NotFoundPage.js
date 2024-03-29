/* Styling */
import '../styles/NotFound.css';

/**
 * NotFoundPage - Route for 404 Error.
 */
const NotFoundPage = () => {
    return (
        <main>
            <img className="wave" src='/images/wave.png' />
            <div className="container">
                <div className="img">
                    <img src='/images/404.svg' alt="404 error" />
                </div>
                <div className="error-container">
                    <h2>404 Error: Page not found</h2>
                </div>
            </div>
        </main>
    )
}

export default NotFoundPage;