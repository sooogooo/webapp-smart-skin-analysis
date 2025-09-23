import React, { useState, useCallback, useEffect, useRef } from 'react';
import { FormType, FormData, FormQuestion, FormSection } from '../types';
import { DIAGNOSIS_FORMS } from '../constants';
import ImageUploader from './ImageUploader';
import FeatherIcon from './icons/FeatherIcon';
import DropIcon from './icons/DropIcon';
import ShieldIcon from './icons/ShieldIcon';
import TargetIcon from './icons/TargetIcon';
import SparklesIcon from './icons/SparklesIcon';
import GridIcon from './icons/GridIcon';
import ClockIcon from './icons/ClockIcon';
import MicrophoneIcon from './icons/MicrophoneIcon';

const iconMap: Record<FormType, React.FC<React.SVGProps<SVGSVGElement>>> = {
    sensitive: FeatherIcon,
    acne: TargetIcon,
    pigmentation: GridIcon,
    'anti-aging': ClockIcon,
    dry: DropIcon,
    rosacea: ShieldIcon,
    pigmentation_disorders: SparklesIcon,
    dehydrated_skin: DropIcon,
    combination_skin: GridIcon,
};

const ChevronDownIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <polyline points="6 9 12 15 18 9"></polyline>
  </svg>
);


const renderQuestion = (
    question: FormQuestion,
    formData: FormData,
    handleChange: (id: string, value: string | string[], isGroup: boolean, groupId?: string) => void,
    errors: Record<string, string>,
    handleVoiceInput: (fieldId: string, isGroup: boolean, groupId?: string) => void,
    listeningField: string | null,
    groupId?: string
) => {
    if (question.condition) {
        const dependencyValue = formData[question.condition.id];
        if (dependencyValue !== question.condition.value) {
            return null;
        }
    }

    const simpleId = question.id;
    const fullId = groupId ? `${groupId}.${simpleId}` : simpleId;
    const error = errors[simpleId];
    const value = groupId ? (formData[groupId] as any)?.[simpleId] : formData[simpleId];
    const errorBorderClass = error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 dark:border-gray-600 focus:ring-brand-500 focus:border-brand-500';
    const isListening = listeningField === fullId;

    switch (question.type) {
        case 'text':
            return (
                <div key={fullId} className="mb-4">
                    <label htmlFor={fullId} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{question.label}</label>
                    <div className="relative">
                        <input type="text" id={fullId} aria-label={question.label} value={value as string || ''} onChange={(e) => handleChange(simpleId, e.target.value, !!groupId, groupId)} className={`w-full px-3 py-2 border rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 ${errorBorderClass}`} />
                        <button type="button" onClick={() => handleVoiceInput(simpleId, !!groupId, groupId)} className={`absolute inset-y-0 right-0 px-3 flex items-center text-gray-500 dark:text-gray-400 hover:text-brand-600 ${isListening ? 'text-red-500 animate-pulse' : ''}`} aria-label={`为 ${question.label} 启动语音输入`}>
                            <MicrophoneIcon className="h-5 w-5" />
                        </button>
                    </div>
                    {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
                </div>
            );
        case 'textarea':
            return (
                <div key={fullId} className="mb-4">
                    <label htmlFor={fullId} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{question.label}</label>
                     <div className="relative">
                        <textarea id={fullId} aria-label={question.label} value={value as string || ''} onChange={(e) => handleChange(simpleId, e.target.value, !!groupId, groupId)} rows={3} className={`w-full px-3 py-2 border rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 ${errorBorderClass}`} />
                        <button type="button" onClick={() => handleVoiceInput(simpleId, !!groupId, groupId)} className={`absolute top-2 right-2 px-2 flex items-center text-gray-500 dark:text-gray-400 hover:text-brand-600 ${isListening ? 'text-red-500 animate-pulse' : ''}`} aria-label={`为 ${question.label} 启动语音输入`}>
                            <MicrophoneIcon className="h-5 w-5" />
                        </button>
                    </div>
                    {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
                </div>
            );
        case 'checkbox':
            return (
                <div key={fullId} className="mb-4">
                    <p className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{question.label}</p>
                    <div className="space-y-2">
                        {question.options?.map(opt => (
                            <div key={opt.value} className="flex items-center">
                                <input id={`${fullId}-${opt.value}`} type="checkbox" value={opt.value} checked={(value as string[] || []).includes(opt.value)}
                                    onChange={(e) => {
                                        const currentValues = (value as string[] || []);
                                        const newValues = e.target.checked ? [...currentValues, opt.value] : currentValues.filter(v => v !== opt.value);
                                        handleChange(simpleId, newValues, !!groupId, groupId);
                                    }}
                                    className="h-4 w-4 text-brand-600 border-gray-300 dark:border-gray-600 rounded focus:ring-brand-500 bg-gray-100 dark:bg-gray-700" />
                                <label htmlFor={`${fullId}-${opt.value}`} className="ml-2 text-sm text-gray-600 dark:text-gray-300">{opt.label}</label>
                            </div>
                        ))}
                    </div>
                    {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
                </div>
            );
        case 'radio':
            return (
                <div key={fullId} className="mb-4">
                    <p className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{question.label}</p>
                     <div className="flex flex-wrap gap-2">
                        {question.options?.map(opt => (
                            <div key={opt.value} className="flex items-center">
                                <input id={`${fullId}-${opt.value}`} type="radio" name={fullId} value={opt.value} checked={value === opt.value} onChange={(e) => handleChange(simpleId, e.target.value, !!groupId, groupId)} className="h-4 w-4 text-brand-600 border-gray-300 dark:border-gray-600 focus:ring-brand-500 bg-gray-100 dark:bg-gray-700" />
                                <label htmlFor={`${fullId}-${opt.value}`} className="ml-2 text-sm text-gray-600 dark:text-gray-300">{opt.label}</label>
                            </div>
                        ))}
                    </div>
                    {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
                </div>
            );
        case 'group':
            return (
                <div key={fullId} className="mb-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800">
                     <p className="block text-sm font-semibold text-gray-800 dark:text-gray-200 mb-3">{question.label}</p>
                     {question.subQuestions?.map(subQ => renderQuestion(subQ, formData, handleChange, errors, handleVoiceInput, listeningField, question.id))}
                </div>
            )
        default:
            return null;
    }
};

const getInitialFormData = (sections: FormSection[]): FormData => {
    const initialData: FormData = {};
    const beautifulNames = ['Aurora', 'Celeste', 'Elara', 'Felicity', 'Serenity', 'Iris', 'Chloe', 'Zoe', 'Stella', 'Luna'];
    
    sections.forEach(section => {
        section.questions.forEach(question => {
            if (question.type === 'group' && question.subQuestions) {
                const groupData: Record<string, any> = {};
                let hasGroupDefaults = false;
                question.subQuestions.forEach(subQ => {
                    if (subQ.defaultValue) {
                        groupData[subQ.id] = subQ.defaultValue;
                        hasGroupDefaults = true;
                    }
                });
                if (hasGroupDefaults) {
                    initialData[question.id] = groupData;
                }
            } else if (question.defaultValue) {
                initialData[question.id] = question.defaultValue;
            }
        });
    });

    initialData['name'] = beautifulNames[Math.floor(Math.random() * beautifulNames.length)];
    return initialData;
};

interface DiagnosisFormProps {
  formType: FormType;
  onSubmit: (formData: FormData, imageBase64: string | null) => void;
  onBack: () => void;
  onPackageDesign: () => void;
}

const DiagnosisForm: React.FC<DiagnosisFormProps> = ({ formType, onSubmit, onBack, onPackageDesign }) => {
  const formStructure = DIAGNOSIS_FORMS[formType];
  const [formData, setFormData] = useState<FormData>(() => getInitialFormData(formStructure.sections));
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [isAdvancedOpen, setAdvancedOpen] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const [listeningField, setListeningField] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.warn("Speech recognition not supported in this browser.");
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.lang = 'zh-CN';
    recognition.interimResults = false;

    recognition.onend = () => {
      setListeningField(null);
    };
    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      setListeningField(null);
    };

    recognitionRef.current = recognition;
  }, []);

  const handleChange = useCallback((id: string, value: string | string[], isGroup: boolean, groupId?: string) => {
      setFormData(prev => {
          if (isGroup && groupId) {
              const groupState = (prev[groupId] as Record<string, any>) || {};
              return {
                  ...prev,
                  [groupId]: {
                      ...groupState,
                      [id]: value
                  }
              }
          }
          return { ...prev, [id]: value };
      });
      
      if (errors[id]) {
        setErrors(prev => {
            const newErrors = { ...prev };
            delete newErrors[id];
            return newErrors;
        });
      }
  }, [errors]);
  
  const handleVoiceInput = (fieldId: string, isGroup: boolean, groupId?: string) => {
    const recognition = recognitionRef.current;
    if (!recognition) return;

    const fullId = groupId ? `${groupId}.${fieldId}` : fieldId;

    if (listeningField === fullId) {
      recognition.stop();
      return;
    }

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      handleChange(fieldId, transcript, isGroup, groupId);
    };
    
    recognition.start();
    setListeningField(fullId);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    const data = formData;

    if (!data.name || (data.name as string).trim() === '') {
      newErrors.name = '姓名不能为空。';
    }

    const ageCustom = data.age_custom as string;
    if (ageCustom && (isNaN(Number(ageCustom)) || Number(ageCustom) <= 0 || !Number.isInteger(Number(ageCustom)) || Number(ageCustom) > 120)) {
      newErrors.age_custom = '请输入有效的年龄 (1-120 之间的整数)。';
    }
    
    if (data.allergens === 'yes' && (!data.allergens_details || (data.allergens_details as string).trim() === '')) {
      newErrors.allergens_details = '请填写具体的过敏原。';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!validateForm()) {
        return;
    }
    onSubmit(formData, imageBase64);
  };

  const Icon = iconMap[formType] || SparklesIcon;

  return (
    <div className="p-4 md:p-6">
        <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
            <div className="relative px-6 py-5 bg-brand-700 text-white flex items-center space-x-4">
                <div className="bg-white/20 p-3 rounded-xl flex-shrink-0">
                    <Icon className="h-8 w-8 text-white" />
                </div>
                <div>
                    <h2 className="text-2xl font-bold">{formStructure.title}</h2>
                    <p className="text-brand-200">请填写以下详细信息。</p>
                </div>
                 <button onClick={onBack} className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors" aria-label="返回">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 19l-7-7 7-7" /></svg>
                </button>
            </div>
            <form className="p-6 space-y-6">
                {formStructure.sections.map((section: FormSection) => {
                    if(section.title === '深度分析 (可选)') {
                         return (
                            <div key={section.title} className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-1">
                                <button
                                    type="button"
                                    onClick={() => setAdvancedOpen(!isAdvancedOpen)}
                                    className="w-full flex justify-between items-center text-left p-4 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
                                    aria-expanded={isAdvancedOpen}
                                >
                                    <div className="flex items-center space-x-3">
                                        <SparklesIcon className="h-6 w-6 text-brand-700 dark:text-brand-400"/>
                                        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">{section.title}</h3>
                                    </div>
                                    <ChevronDownIcon className={`h-6 w-6 text-gray-500 dark:text-gray-400 transform transition-transform duration-300 ${isAdvancedOpen ? 'rotate-180' : ''}`} />
                                </button>
                                {isAdvancedOpen && (
                                    <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                                        {section.questions.map(q => renderQuestion(q, formData, handleChange, errors, handleVoiceInput, listeningField))}
                                    </div>
                                )}
                            </div>
                        )
                    }
                    return (
                         <div key={section.title}>
                            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 border-b border-gray-200 dark:border-gray-700 pb-2 mb-4">{section.title}</h3>
                            {section.questions.map(q => renderQuestion(q, formData, handleChange, errors, handleVoiceInput, listeningField))}
                        </div>
                    )
                })}

                <ImageUploader onImageUpload={setImageBase64} />

                <div className="flex justify-between items-center pt-4">
                    <button type="button" onClick={onBack} className="px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">返回</button>
                    <div className="flex items-center space-x-2">
                        <button
                            type="button"
                            onClick={onPackageDesign}
                            className="px-8 py-2 border border-brand-700 text-brand-700 dark:border-brand-500 dark:text-brand-400 rounded-md text-sm font-medium hover:bg-brand-50 dark:hover:bg-brand-900/50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 transition-colors"
                        >
                            套餐设计
                        </button>
                        <button
                            type="button"
                            onClick={handleSubmit}
                            className="px-8 py-2 bg-brand-600 text-white rounded-md text-sm font-medium hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500"
                        >
                            智能诊断
                        </button>
                    </div>
                </div>
            </form>
        </div>
    </div>
  );
};

export default DiagnosisForm;