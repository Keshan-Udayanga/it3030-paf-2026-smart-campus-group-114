import { useEffect, useState } from "react";
import "../styles/loginPage.css";

function LoginPage() {
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
                        setShowModal(true);

                        const params = new URLSearchParams(window.location.search);
                        const error = params.get("error");

                        if (error === "invalid_domain") {
                            alert("Only SLIIT emails are allowed.");
                        } else if (error === "access_denied") {
                            alert("Login failed. Please try again.");
                        }
                    }, []);
                    
    const handleGoogleLogin = () => {
        window.location.href = "http://localhost:8080/oauth2/authorization/google";
    };

    const handleMicrosoftLogin = () => {
        window.location.href = "http://localhost:8080/oauth2/authorization/microsoft";
    };

    const handleCancelBtn = () => {
        setShowModal(false);
        window.location.href = "/";
    };

    return (
        <div className="login-page">
        {showModal && (
            <div className="login-modal">
            <h4>Select Login Method</h4>

            <button className="btn btn-danger" onClick={handleGoogleLogin}>
                <img src="/assets/google.png" alt="Google" className="login-icon" />
                Login with Google
            </button>

            <button className="btn btn-dark" onClick={handleMicrosoftLogin}>
                <img src="/assets/microsoft.png" alt="Microsoft" className="login-icon" />
                Login with Microsoft
            </button>

            <button className="btn btn-secondary" onClick={handleCancelBtn}>
                Cancel
            </button>
            </div>
        )}
        </div>
    );
}

export default LoginPage;