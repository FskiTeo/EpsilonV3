import React from 'react';
import '../css/Module.css';
import Module from '../components/Module.jsx';

const ModuleData = [
    {
      title: 'Module 1',
      description: 'Module 1 description',
      file: '1',
      button: 'upload'
    },
    {
        title: 'Module 1',
        description: 'Module 1 description',
        file: '1',
        button: 'upload'
      },
      {
        title: 'Module 1',
        description: 'Module 1 description',
        file: '1',
        button: 'upload'
      },

  ];

const AddModules = () => {
    return (
        <div>
           {ModuleData.map((module, index) => (
                <Module key={index} module={module} action={module.button.toLowerCase()} />
            ))}
        </div>
    );
};

export default AddModules;
