import { useState } from "react";

function LoginPage() {
    const [showModal, setShowModal] = useState(false);

    const handleGoogleLogin = () => {
        window.location.href = "http://localhost:8080/oauth2/authorization/google";
    };

    const handleMicrosoftLogin = () => {
        window.location.href = "http://localhost:8080/oauth2/authorization/microsoft";
    };

    return (
        <div className="container text-center mt-5">
            <h1>PAF Smart Campus</h1>
            <p>Please login to continue</p>

            <button 
                className="btn btn-primary"
                onClick={() => setShowModal(true)}
            >
                Login
            </button>

            {/* Modal */}
            {showModal && (
                <div className="modal d-block" tabIndex="-1">
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content p-4">
                            
                            <h4>Select Login Method</h4>

                            <button 
                                className="btn btn-danger mt-3"
                                onClick={handleGoogleLogin}
                            >
                                Login with Google
                            </button>

                            <button 
                                className="btn btn-dark mt-2"
                                onClick={handleMicrosoftLogin}
                            >
                                Login with Microsoft
                            </button>

                            <button 
                                className="btn btn-secondary mt-3"
                                onClick={() => setShowModal(false)}
                            >
                                Cancel
                            </button>

                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default LoginPage;