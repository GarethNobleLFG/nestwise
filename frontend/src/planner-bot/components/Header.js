import * as React from 'react';
import { useState } from 'react';
import { Button } from '../../shadcn/components/ui/button';
import ClearIcon from '@mui/icons-material/Clear';
import SelectPlanModal from './SelectPlanModal';

export default function Header({
    conversationTitle,
    selectedPlan,
    setSelectedPlan,
    clearChat
}) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const getPlanDisplayName = (planId) => {
        return '🎯 Select plan to edit';
    };

    return (
        <>
            <div className="px-8 py-6">
                <div className="max-w-4xl mx-auto flex flex-col items-center space-y-4">
                    <div className="flex items-center space-x-6">
                        <div>
                            <h2 className="text-3xl font-bold bg-gradient-to-r from-yellow-400 to-amber-600 bg-clip-text text-transparent">
                                {conversationTitle || 'NestWise Agent'}
                            </h2>
                        </div>
                        <Button
                            variant="outline"
                            onClick={() => setIsModalOpen(true)}
                            className="bg-white/40 backdrop-blur-sm rounded-2xl shadow-lg border-0 px-4 py-3 text-sm font-medium hover:bg-white/60 transition-all duration-300"
                        >
                            {getPlanDisplayName(selectedPlan)}
                        </Button>

                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={clearChat}
                            className="bg-white/40 backdrop-blur-sm hover:bg-red-50/80 border-0 rounded-2xl shadow-lg transition-all duration-300 px-4 py-3"
                        >
                            <ClearIcon className="h-4 w-4 mr-2" />
                            <span>Clear Chat</span>
                        </Button>
                    </div>
                </div>
            </div>

            <SelectPlanModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                selectedPlan={selectedPlan}
                setSelectedPlan={setSelectedPlan}
            />
        </>
    );
}