function LoginPage(){
    const handleLogin = () => {
        window.location.href = "http://localhost:8080/oauth2/authorization/google";
    }

    return(
        <div className="container text-center mt-5">
            <h1>PAF Smart Campus</h1>
            <p>Please login to continue</p>

            <button 
                className="btn btn-primary"
                onClick={handleLogin}
            >
                Login with Google
            </button>

        </div>
    );
}
export default LoginPage;