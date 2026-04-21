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
            <div className="px-4 md:px-8 pt-3 md:pt-6">
                <div className="max-w-sm md:max-w-4xl mx-auto flex flex-col items-start space-y-2 md:space-y-4">
                    <div className="flex items-center">
                        <div className="flex items-center space-x-2">
                            <div className="font-semibold text-gray-800 flex items-center text-sm md:text-base lg:text-lg">
                                Selected Plan:
                            </div>
                            {/* Button + hint side by side */}
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="outline"
                                    onClick={() => setIsModalOpen(true)}
                                    className="bg-white/40 backdrop-blur-sm rounded-xl md:rounded-2xl shadow-lg border-0 px-3 md:px-4 py-2 md:py-3 font-semibold text-gray-800 hover:bg-white/60 transition-all duration-300 w-32 md:w-40 text-xs md:text-base lg:text-lg"
                                >
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <span className="truncate min-w-0 flex-1">
                                                    <span className="hidden md:inline">{headerTitle}</span>
                                                    <span className="md:hidden">
                                                        {headerTitle.length > 6 ? headerTitle.substring(0, 6) + '...' : headerTitle}
                                                    </span>
                                                </span>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>{headerTitle}</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                    <EditIcon className="h-4 w-4 ml-2 flex-shrink-0" />
                                </Button>
                            </div>

                            <div className="flex items-center space-x-3">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={clearChat}
                                    className="bg-white/40 backdrop-blur-sm hover:bg-red-50/80 border-0 rounded-xl md:rounded-2xl shadow-lg transition-all duration-300 px-3 md:px-4 py-2 md:py-3 text-xs md:text-sm lg:text-base"
                                >
                                    <ClearIcon className="h-4 w-4 mr-2" />
                                    <span>Clear Chat</span>
                                </Button>
                            </div>
                        </div>
                    </div>
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