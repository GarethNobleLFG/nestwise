import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Assignment from '@mui/icons-material/Assignment';
import AssignmentTurnedIn from '@mui/icons-material/AssignmentTurnedIn';
import Article from '@mui/icons-material/Article';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

export default function MyPlansNav() {
    const navigate = useNavigate();

    const plans = [
        {
            id: 1,
            name: 'Plan 1',
            icon: Assignment,
            bgOpacity: 'bg-white/20',
            hoverOpacity: 'hover:bg-white/30',
            delay: 0.3
        },
        {
            id: 2,
            name: 'Plan 2',
            icon: AssignmentTurnedIn,
            bgOpacity: 'bg-white/15',
            hoverOpacity: 'hover:bg-white/25',
            delay: 0.4
        },
        {
            id: 3,
            name: 'Plan 3',
            icon: Article,
            bgOpacity: 'bg-white/10',
            hoverOpacity: 'hover:bg-white/20',
            delay: 0.5
        }
    ];

    const handlePlanClick = (planId) => {
        // Navigate to specific plan or handle plan selection
        console.log(`Plan ${planId} clicked`);
        // You can add navigation logic here, e.g.:
        // navigate(`/plan/${planId}`);
    };

    return (
        <div className="flex flex-col space-y-1 flex-1 px-2">
            {/* Header */}
            <motion.div
                className="mb-1"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
            >
                <div className="px-3">
                    <h3 className="text-sm font-medium text-white tracking-wide whitespace-nowrap">
                        Select Plan to View
                    </h3>
                    {/* Custom underline */}
                    <div className="w-full h-px bg-gradient-to-r from-transparent via-white/40 to-transparent mt-1"></div>
                </div>
            </motion.div>

            {plans.map((plan) => {
                const IconComponent = plan.icon;
                return (
                    <motion.button
                        key={plan.id}
                        onClick={() => handlePlanClick(plan.id)}
                        className={`flex items-center justify-between w-full px-3 py-2.5 rounded-lg ${plan.bgOpacity} backdrop-blur-sm border-0 cursor-pointer ${plan.hoverOpacity} transition-all duration-300 text-white`}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: plan.delay }}
                        whileHover={{ scale: 1.02, x: 2 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <div className="flex items-center">
                            <IconComponent className="w-4 h-4 mr-2.5" />
                            <span className="text-sm font-medium">{plan.name}</span>
                        </div>
                        <ChevronRightIcon className="w-4 h-4 opacity-70" />
                    </motion.button>
                );
            })}
        </div>
    );
}