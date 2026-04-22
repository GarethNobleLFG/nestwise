import * as React from 'react';
import { useState } from 'react';
import { Button } from '../../../components/shared/shadcn/components/ui/button';
import EditIcon from '@mui/icons-material/Edit';
import ClearIcon from '@mui/icons-material/Clear';
import SelectPlanModal from './SelectPlanModal';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '../../../components/shared/shadcn/components/ui/tooltip';

export default function Header({
    conversationTitle,
    selectedPlan,
    setSelectedPlan,
    clearChat,
    onPlanSelect,
}) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    let headerTitle;
    if (conversationTitle === 'None') {
        headerTitle = 'NestWise Agent';
    }
    else {
        headerTitle = conversationTitle || 'NestWise Agent';
    }

    const handlePlanSelected = (planId) => {
        setSelectedPlan(planId);
        setIsModalOpen(false);
        if (onPlanSelect) onPlanSelect(planId);
    };

    return (
        <>
            <div className="pl-16 pr-4 md:px-8 pt-3 md:pt-6">
                <div className="max-w-4xl mx-auto flex flex-row items-center justify-between w-full">

                    {/* Left Side: Plan Label & Button */}
                    <div className="flex items-center gap-2 md:gap-3">
                        <div className="font-semibold text-gray-800 hidden xs:block text-lg md:text-sm shrink-0">
                            <span className="md:hidden">Plan:</span>
                            <span className="hidden md:inline">Selected Plan:</span>
                        </div>

                        <Button
                            variant="outline"
                            onClick={() => setIsModalOpen(true)}
                            className="bg-white/40 backdrop-blur-sm rounded-xl shadow-sm border-0 px-3 md:px-4 py-2 font-semibold text-gray-800 hover:bg-white/60 transition-all duration-300 w-auto max-w-[200px] sm:max-w-[260px] md:max-w-xs text-lg md:text-sm"
                        >
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <span className="truncate min-w-0 flex-1">
                                            {headerTitle}
                                        </span>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>{headerTitle}</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                            <EditIcon className="h-5 w-5 md:h-4 md:w-4 ml-1.5 md:ml-2 flex-shrink-0" />
                        </Button>
                    </div>

                    {/* Right Side: Clear Chat */}
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={clearChat}
                        className="bg-white/40 backdrop-blur-sm hover:bg-red-50/80 border-0 rounded-xl shadow-sm transition-all duration-300 px-3 py-2 text-gray-700"
                    >
                        <ClearIcon className="h-5 w-5 md:h-4 md:w-4 md:mr-2" />
                        <span className="hidden sm:inline text-lg md:text-sm font-medium">Clear Chat</span>
                    </Button>
                </div>
            </div>

            <SelectPlanModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                selectedPlan={selectedPlan}
                setSelectedPlan={handlePlanSelected}
            />
        </>
    );
}