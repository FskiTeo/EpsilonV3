import React from 'react';
import { motion } from 'framer-motion'; 

const Module = ({ module, action }) => {
    const handleButtonClick = (e) => {
        if (action === 'upload') {
            // Handle file upload
            console.log('Uploading file...');
        } else if (action === 'download') {
            // Handle file download
            console.log('Downloading file...');
        }
    };

    return (
        <motion.div className='module-container'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
        >
            <h2 className='module-title'>{module.title}</h2>
            <p className='module-text'>{module.description}</p>
            <button className='module-button' onClick={handleButtonClick}>
                Click to {action}
            </button>
        </motion.div>
    );
};

export default Module;