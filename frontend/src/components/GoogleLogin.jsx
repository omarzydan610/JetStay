import React, { useEffect } from 'react';
import authService from '../services/authService';
import { useNavigate } from 'react-router-dom';

function GoogleLoginButton() {
    const navigate = useNavigate();

    useEffect(() => {
        // Dynamically create the script
        const script = document.createElement('script');
        script.src = "https://accounts.google.com/gsi/client";
        script.async = true;
        script.defer = true;
        document.body.appendChild(script);

        script.onload = () => {
            /* global google */
            google.accounts.id.initialize({
                client_id: "659654902890-ic9n5mei57v3ecp1pu26q9nnil0dombb.apps.googleusercontent.com",
                callback: async (response) => {
                    const token = response.credential;

                    try {
                        const res = await authService.googleLogin(token);

                        if (authService.isAuthenticated()) {
                            navigate("/");
                            console.log('User authenticated successfully', res);
                        }
                    } catch (err) {
                        console.error("Google login failed", err);
                    }
                },
            });

            google.accounts.id.renderButton(
                document.getElementById("googleButton"),
                { theme: "outline", size: "large", width: 300 }
            );
        };

        return () => {
            document.body.removeChild(script);
        };
    }, [navigate]);

    return <div id="googleButton" className="w-full flex items-center justify-center gap-3 py-3 bg-white text-base font-semibold text-gray-700 cursor-pointer transition-all duration-200 hover:bg-50 hover:border-300 mb-5"></div>;
}

export default GoogleLoginButton;
