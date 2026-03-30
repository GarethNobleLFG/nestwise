import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import WarningIcon from '@mui/icons-material/Warning';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';

export default function DeletePlanModal({
    isOpen,
    onClose,
    onConfirm,
    planName,
    isDeleting = false
}) {
    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
                onClick={onClose}
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    transition={{ duration: 0.2 }}
                    className="bg-white/95 backdrop-blur-sm border border-gray-200 shadow-2xl rounded-2xl p-6 max-w-2xl mx-4 relative"
                    onClick={(e) => e.stopPropagation()}
                >

                    <motion.button
                        onClick={onClose}
                        disabled={isDeleting}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <CloseIcon className="w-5 h-5 text-gray-600" />
                    </motion.button>

                    {/* Warning Icon with Animation */}
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
                        className="flex justify-center mb-4"
                    >
                        <div className="relative">
                            <motion.div
                                animate={{
                                    boxShadow: [
                                        "0 0 0 0px rgba(239, 68, 68, 0.4)",
                                        "0 0 0 20px rgba(239, 68, 68, 0)",
                                        "0 0 0 0px rgba(239, 68, 68, 0)"
                                    ]
                                }}
                                transition={{ duration: 2, repeat: Infinity }}
                                className="p-4 bg-gradient-to-br from-red-500 to-red-600 rounded-full"
                            >
                                <WarningIcon className="w-8 h-8 text-white" />
                            </motion.div>
                        </div>
                    </motion.div>

                    {/* Title */}
                    <motion.h2
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-2xl font-bold text-center mb-2 bg-gradient-to-r from-red-600 to-red-700 bg-clip-text text-transparent"
                    >
                        Delete Plan
                    </motion.h2>

                    {/* Message */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="text-center mb-6"
                    >
                        <p className="text-gray-700 mb-2">
                            Are you sure you want to delete
                        </p>
                        <p className="font-semibold text-lg bg-gradient-to-r from-amber-600 to-yellow-600 bg-clip-text text-transparent">
                            "{planName}"?
                        </p>
                        <p className="text-sm text-red-600 mt-2">
                            This action cannot be undone.
                        </p>
                    </motion.div>

                    {/* Action Buttons */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="flex space-x-3"
                    >

                        {/* Delete Button */}
                        <motion.button
                            onClick={onConfirm}
                            disabled={isDeleting}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="flex-1 inline-flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white font-medium rounded-lg hover:from-red-700 hover:to-red-800 transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isDeleting ? (
                                <>
                                    <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                        className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                                    />
                                    <span>Deleting...</span>
                                </>
                            ) : (
                                <>
                                    <DeleteIcon className="w-4 h-4" />
                                    <span>Delete Plan</span>
                                </>
                            )}
                        </motion.button>
                    </motion.div>

                    {/* Decorative gradient border */}
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600 p-[1px] -z-10">
                        <div className="w-full h-full bg-white rounded-2xl"></div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}