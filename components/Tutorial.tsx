import React, { useLayoutEffect, useState } from 'react';
import { TutorialStep } from '../types';
import XIcon from './icons/XIcon';

interface TutorialProps {
  steps: TutorialStep[];
  isOpen: boolean;
  onClose: () => void;
  currentStepIndex: number;
  setCurrentStepIndex: (index: number) => void;
}

const Tutorial: React.FC<TutorialProps> = ({ steps, isOpen, onClose, currentStepIndex, setCurrentStepIndex }) => {
  const [highlightStyle, setHighlightStyle] = useState<React.CSSProperties>({});
  const [tooltipStyle, setTooltipStyle] = useState<React.CSSProperties>({});
  
  const currentStep = steps[currentStepIndex];

  useLayoutEffect(() => {
    if (!isOpen || !currentStep) return;
    
    // Run any pre-step actions (like opening a modal)
    currentStep.before?.();

    const element = currentStep.target === 'center' ? null : document.querySelector<HTMLElement>(currentStep.target);

    const updatePosition = () => {
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            
            const rect = element.getBoundingClientRect();
            setHighlightStyle({
                width: `${rect.width + 16}px`,
                height: `${rect.height + 16}px`,
                top: `${rect.top - 8}px`,
                left: `${rect.left - 8}px`,
            });

            const tooltipRect = { width: 300, height: 160 };
            let top = rect.bottom + 10;
            let left = rect.left + rect.width / 2 - tooltipRect.width / 2;
            
            if (currentStep.placement === 'top') top = rect.top - tooltipRect.height - 10;
            else if (currentStep.placement === 'left') {
                top = rect.top + rect.height / 2 - tooltipRect.height / 2;
                left = rect.left - tooltipRect.width - 10;
            } else if (currentStep.placement === 'right') {
                top = rect.top + rect.height / 2 - tooltipRect.height / 2;
                left = rect.right + 10;
            }

            if (left < 10) left = 10;
            if (left + tooltipRect.width > window.innerWidth) left = window.innerWidth - tooltipRect.width - 10;
            if (top < 10) top = 10;
            if (top + tooltipRect.height > window.innerHeight) top = rect.top - tooltipRect.height - 10;

            setTooltipStyle({ top: `${top}px`, left: `${left}px` });
        } else {
             setHighlightStyle({ display: 'none' });
             setTooltipStyle({ top: '50%', left: '50%', transform: 'translate(-50%, -50%)' });
        }
    };
    
    const timeoutId = setTimeout(updatePosition, 300);
    window.addEventListener('resize', updatePosition);

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', updatePosition);
    };

  }, [currentStep, isOpen]);

  if (!isOpen || !currentStep) return null;

  const handleNext = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };

  return (
    <div className="fixed inset-0 z-[100]">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm"></div>
      
      {currentStep.target !== 'center' && 
        <div 
          className="absolute bg-transparent rounded-lg shadow-[0_0_0_9999px_rgba(0,0,0,0.7)] transition-all duration-300 ease-in-out" 
          style={highlightStyle}
        ></div>
      }

      <div 
        className="absolute w-[320px] p-5 bg-white dark:bg-gray-800 rounded-lg shadow-2xl transition-all duration-300 ease-in-out animate-fade-in-down" 
        style={tooltipStyle}
      >
        <h3 className="text-lg font-bold mb-2 text-gray-900 dark:text-white">{currentStep.title}</h3>
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">{currentStep.content}</p>
        <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
                 <button onClick={onClose} className="px-3 py-1 text-sm rounded-md text-gray-700 dark:text-gray-300 bg-transparent hover:bg-gray-200 dark:hover:bg-gray-700">跳过</button>
            </div>
            <span className="text-xs text-gray-500">{currentStepIndex + 1} / {steps.length}</span>
            <div className="space-x-2">
                <button onClick={handlePrev} className={`px-3 py-1 text-sm rounded-md text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 ${currentStepIndex === 0 ? 'opacity-50 cursor-not-allowed' : ''}`} disabled={currentStepIndex === 0}>上一步</button>
                <button onClick={handleNext} className="px-3 py-1 text-sm rounded-md text-white bg-brand-600 hover:bg-brand-700">
                    {currentStepIndex === steps.length - 1 ? '完成' : '下一步'}
                </button>
            </div>
        </div>
        <button onClick={onClose} className="absolute top-2 right-2 p-1 rounded-full text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700">
            <XIcon className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default Tutorial;