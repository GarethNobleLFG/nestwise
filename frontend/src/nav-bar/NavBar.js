import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import DescriptionIcon from '@mui/icons-material/Description';
import PersonIcon from '@mui/icons-material/Person';


export default function NavBar() {
    const navigate = useNavigate();

    // Check if user is logged in
    const checkTokenValidity = (token) => {
        if (!token) return false;
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            return payload.exp * 1000 > Date.now();
        } catch (error) {
            return false;
        }
    };

    const token = localStorage.getItem('token');
    const isLoggedIn = checkTokenValidity(token);

    const getUserName = (token) => {
        if (!token) return null;
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            return payload.name;
        } catch (error) {
            return null;
        }
    };

    const userName = getUserName(token);

    return (
        <nav className="!fixed !top-0 !left-0 !right-0 !w-full !bg-transparent !z-50 !backdrop-blur-sm">
            <div className="!w-full !px-8">
                <div className="!flex !justify-between !items-center !h-20">
                    {/* Logo - matching Hero.js colors */}
                    <button
                        onClick={() => navigate('/')}
                        className="!flex !items-center !space-x-3 group !no-underline !bg-transparent !border-none !cursor-pointer"
                    >
                        <span className="!text-3xl !font-bold !text-gray-900 !tracking-wide">
                            <span style={{ color: '#FFD700' }}>Nest</span>
                            <span style={{ color: '#c47c1eff' }}>Wise</span>
                        </span>
                    </button>

                    {/* Action Buttons */}
                    <div className="!flex !items-center !space-x-5">



                        {/* Planner Bot Button */}
                        <button
                            onClick={() => navigate('/myplans')}
                            className="!flex !items-center !space-x-2 !px-5 !py-3 !text-base !font-medium !text-gray-700 hover:!text-gray-900 !transition-colors !rounded-full hover:!bg-yellow-50 !border-none !cursor-pointer"
                        >
                            <SmartToyIcon className="!w-5 !h-5" />
                            <span>Planner Bot</span>
                        </button>



                        {/* Plans Button */}
                        <button
                            onClick={() => navigate('/myplans')}
                            className="!flex !items-center !space-x-2 !px-5 !py-3 !text-base !font-medium !text-gray-700 hover:!text-gray-900 !transition-colors !rounded-full hover:!bg-yellow-50 !border-none !cursor-pointer"
                        >
                            <DescriptionIcon className="!w-5 !h-5" />
                            <span>My Plans</span>
                        </button>



                        {/* User Authentication */}
                        {isLoggedIn ? (
                            <>
                                <button
                                    onClick={() => navigate('/profile')}
                                    className="!flex !items-center !space-x-2 !px-5 !py-3 !text-base !font-medium !transition-colors !rounded-full !border-2 !cursor-pointer hover:!scale-105 hover:!shadow-lg"
                                    style={{
                                        color: 'white',
                                        backgroundColor: '#c47c1eff',
                                        borderColor: 'hsl(var(--brand-400))'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.target.style.backgroundColor = 'hsl(var(--brand-500))';
                                        e.target.style.borderColor = 'hsl(var(--brand-500))';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.target.style.backgroundColor = '#c47c1eff';
                                        e.target.style.borderColor = 'hsl(var(--brand-400))';
                                    }}
                                >
                                    <PersonIcon className="!w-5 !h-5" style={{ color: 'white' }} />
                                    <span>{userName || 'Profile'}</span>
                                </button>
                            </>
                        ) : (
                            <button
                                onClick={() => navigate('/signin')}
                                className="!flex !items-center !space-x-2 !px-5 !py-3 !text-base !font-medium !transition-colors !rounded-full !border-2 !cursor-pointer hover:!scale-105 hover:!shadow-lg"
                                style={{
                                    color: 'white',
                                    backgroundColor: '#c47c1eff',
                                    borderColor: 'hsl(var(--brand-400))'
                                }}
                                onMouseEnter={(e) => {
                                    e.target.style.backgroundColor = 'hsl(var(--brand-500))';
                                    e.target.style.borderColor = 'hsl(var(--brand-500))';
                                }}
                                onMouseLeave={(e) => {
                                    e.target.style.backgroundColor = '#c47c1eff';
                                    e.target.style.borderColor = 'hsl(var(--brand-400))';
                                }}
                            >
                                <PersonIcon className="!w-5 !h-5" style={{ color: 'white' }} />
                                <span>Sign in</span>
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}