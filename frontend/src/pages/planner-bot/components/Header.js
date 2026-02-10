import * as React from 'react';
import { useState } from 'react';
import { Button } from '../../../components/shared/shadcn/components/ui/button';
import EditIcon from '@mui/icons-material/Edit';
import ClearIcon from '@mui/icons-material/Clear';
import SelectPlanModal from './SelectPlanModal';

export default function Header({
    conversationTitle,
    selectedPlan,
    setSelectedPlan,
    clearChat
}) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    let headerTitle;
    if (conversationTitle === 'None') {
        headerTitle = 'NestWise Agent';
    }
    else {
        headerTitle = conversationTitle || 'NestWise Agent';
    }

    return (
        <>
            <div className="px-8 py-6">
                <div className="max-w-4xl mx-auto flex flex-col items-start space-y-4">
                    <div className="flex items-center space-x-8">
                        <div className="flex items-center space-x-2">
                            <div className="text-base font-semibold text-gray-800 flex items-center">
                                Current Plan:
                            </div>
                            <Button
                                variant="outline"
                                onClick={() => setIsModalOpen(true)}
                                className="bg-white/40 backdrop-blur-sm rounded-2xl shadow-lg border-0 px-4 py-3 text-base font-semibold text-gray-800 hover:bg-white/60 transition-all duration-300"
                            >
                                {headerTitle} <EditIcon className="h-4 w-4 ml-2" />
                            </Button>
                        </div>

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