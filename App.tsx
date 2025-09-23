import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Chat } from '@google/genai';
import { generateDiagnosisReport, startChatSession, sendMessage } from './services/geminiService';
import useLocalStorage from './hooks/useLocalStorage';
import { DIAGNOSIS_FORMS } from './constants';
import { FormType, FormData, DiagnosisReport, ChatMessage } from './types';

import DiagnosisForm from './components/DiagnosisForm';
import { FullPageSpinner, Spinner } from './components/Spinner';
import PackageDesigner from './components/PackageDesigner';
import SplashScreen from './components/SplashScreen';


import ClipboardIcon from './components/icons/ClipboardIcon';
import CheckIcon from './components/icons/CheckIcon';
import DownloadIcon from './components/icons/DownloadIcon';
import SettingsIcon from './components/icons/SettingsIcon';
import SunIcon from './components/icons/SunIcon';
import MoonIcon from './components/icons/MoonIcon';
import PaletteIcon from './components/icons/PaletteIcon';
import TuneIcon from './components/icons/TuneIcon';
import InfoIcon from './components/icons/InfoIcon';
import XIcon from './components/icons/XIcon';
import CodeIcon from './components/icons/CodeIcon';

import FeatherIcon from './components/icons/FeatherIcon';
import TargetIcon from './components/icons/TargetIcon';
import GridIcon from './components/icons/GridIcon';
import ClockIcon from './components/icons/ClockIcon';
import DropIcon from './components/icons/DropIcon';
import ShieldIcon from './components/icons/ShieldIcon';
import SparklesIcon from './components/icons/SparklesIcon';

type View = 'selection' | 'form' | 'report' | 'packageDesigner';
type ToastMessage = { id: number; message: string; type: 'success' | 'info' } | null;
type Theme = 'light' | 'dark';
type ColorTheme = 'theme-blue' | 'theme-rose' | 'theme-lavender' | 'theme-mint';
type AiStyle = 'professional' | 'empathetic' | 'concise';
type AiLength = 'standard' | 'detailed' | 'summary';

const App: React.FC = () => {
  const [isAppReady, setIsAppReady] = useState(false);
  const [view, setView] = useState<View>('selection');
  const [selectedForm, setSelectedForm] = useState<FormType | null>(null);
  const [diagnosisReport, setDiagnosisReport] = useState<DiagnosisReport | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [history, setHistory] = useLocalStorage<DiagnosisReport[]>('diagnosisHistory', []);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isChatLoading, setIsChatLoading] = useState<boolean>(false);
  const chatRef = useRef<Chat | null>(null);
  const [toast, setToast] = useState<ToastMessage>(null);

  // Settings state
  const [settings, setSettings] = useLocalStorage('userSettings', {
    theme: 'light' as Theme,
    colorTheme: 'theme-blue' as ColorTheme,
    fontSize: 'text-base',
    aiStyle: 'professional' as AiStyle,
    aiLength: 'standard' as AiLength,
  });
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  

  useEffect(() => {
    // Simulate app loading
    const timer = setTimeout(() => setIsAppReady(true), 3500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    document.documentElement.className = `${settings.theme} ${settings.colorTheme} ${settings.fontSize}`;
  }, [settings]);

  
  const handleFormSelect = (formType: FormType) => {
    setSelectedForm(formType);
    setView('form');
  };

  const handleFormSubmit = async (formData: FormData, imageBase64: string | null) => {
    setIsLoading(true);
    try {
      const report = await generateDiagnosisReport(formData, selectedForm!, imageBase64, settings.aiStyle, settings.aiLength);
      const reportWithMeta = { ...report, formType: selectedForm!, date: new Date().toISOString() };
      setDiagnosisReport(reportWithMeta);
      setHistory(prev => [reportWithMeta, ...prev]);
      setView('report');
      chatRef.current = startChatSession([]);
    } catch (error) {
      console.error(error);
      showToast('AI 诊断失败，请稍后重试。', 'info');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleHistorySelect = (report: DiagnosisReport) => {
    setDiagnosisReport(report);
    setView('report');
    chatRef.current = startChatSession([]);
  };

  const handleClearHistory = () => {
    if (window.confirm('您确定要清除所有历史记录吗？此操作无法撤销。')) {
      setHistory([]);
      showToast('历史记录已清除。');
    }
  };

  const handleBackToSelection = () => {
    setView('selection');
    setSelectedForm(null);
    setDiagnosisReport(null);
    setChatMessages([]);
    chatRef.current = null;
  };
  
  const handlePackageDesign = () => setView('packageDesigner');
  const handleBackToForm = () => setView('form');
  
  const showToast = (message: string, type: 'success' | 'info' = 'success') => {
    const newToast = { id: Date.now(), message, type };
    setToast(newToast);
    setTimeout(() => {
        setToast(current => (current?.id === newToast.id ? null : current));
    }, 3000);
  };
  
  const CurrentView = () => {
    switch (view) {
      case 'form':
        return <DiagnosisForm formType={selectedForm!} onSubmit={handleFormSubmit} onBack={handleBackToSelection} onPackageDesign={handlePackageDesign} />;
      case 'report':
        return <ReportView report={diagnosisReport!} onBack={handleBackToSelection} chatMessages={chatMessages} setChatMessages={setChatMessages} chatRef={chatRef} isChatLoading={isChatLoading} setIsChatLoading={setIsChatLoading} showToast={showToast} />;
      case 'packageDesigner':
        return <PackageDesigner onBack={handleBackToForm} />;
      default:
        return <SelectionView onFormSelect={handleFormSelect} history={history} onHistorySelect={handleHistorySelect} onClearHistory={handleClearHistory} />;
    }
  };
  
  if (!isAppReady) {
    return <SplashScreen />;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 transition-colors duration-300 font-sans">
      {isLoading && <FullPageSpinner />}
      <Toast message={toast} />
      
      <Header onSettingsClick={() => setIsSettingsOpen(true)} showToast={showToast} />
      
      <main className="pb-24">
        <CurrentView />
      </main>

      <Footer onAboutClick={() => setIsAboutOpen(true)} />

      {isSettingsOpen && (
        <SettingsPanel
          settings={settings}
          setSettings={setSettings}
          onClose={() => setIsSettingsOpen(false)}
        />
      )}
      {isAboutOpen && <AboutModal onClose={() => setIsAboutOpen(false)} />}
    </div>
  );
};

const Header: React.FC<{onSettingsClick: () => void; showToast: (msg: string, type: 'success' | 'info') => void}> = ({onSettingsClick, showToast}) => (
    <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg sticky top-0 z-40 shadow-sm border-b border-gray-200/50 dark:border-gray-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
                <div className="flex items-center space-x-3">
                    <img src="https://docs.bccsw.cn/logo.png" alt="Logo" className="h-10 w-10"/>
                    <h1 className="text-xl font-bold text-gray-800 dark:text-white">与皮肤对话 - 医美小智</h1>
                </div>
                <div className="flex items-center space-x-2">
                    <button onClick={() => showToast('本应用被动开源，如有需要，可以发邮件索取。', 'info')} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300" aria-label="开源声明">
                        <CodeIcon className="h-6 w-6"/>
                    </button>
                    <button id="settings-button" onClick={onSettingsClick} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300" aria-label="打开设置">
                        <SettingsIcon className="h-6 w-6"/>
                    </button>
                </div>
            </div>
        </div>
    </header>
);

const SelectionView: React.FC<{onFormSelect: (type: FormType) => void; history: DiagnosisReport[]; onHistorySelect: (report: DiagnosisReport) => void; onClearHistory: () => void;}> = ({ onFormSelect, history, onHistorySelect, onClearHistory }) => {
  const iconMap: Record<string, React.FC<React.SVGProps<SVGSVGElement>>> = {
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
    
  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">选择您的皮肤诊断类型</h2>
        <p className="mt-4 text-lg text-gray-500 dark:text-gray-400">请选择最符合您当前皮肤状况的问卷。</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.entries(DIAGNOSIS_FORMS).map(([key, form]) => {
          const Icon = iconMap[key as FormType];
          return (
            <div key={key} onClick={() => onFormSelect(key as FormType)} className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                <div className="p-6 flex flex-col items-center justify-center text-center space-y-3">
                    {Icon && <Icon className="h-10 w-10 text-brand-600 dark:text-brand-400 mb-2 transition-transform duration-300 group-hover:scale-110" />}
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400">{form.title}</h3>
                </div>
            </div>
          )
        })}
      </div>

      {history.length > 0 && (
        <div className="mt-12">
           <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">诊断历史</h2>
                <button onClick={onClearHistory} className="text-sm text-gray-500 hover:text-red-600 dark:hover:text-red-400">清空历史</button>
           </div>
           <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
                <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                    {history.map((item, index) => (
                        <li key={index} onClick={() => onHistorySelect(item)} className="px-6 py-4 flex items-center justify-between cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50">
                            <div>
                                <p className="font-semibold text-brand-700 dark:text-brand-400">{item.formType ? DIAGNOSIS_FORMS[item.formType].title : '诊断报告'}</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">{new Date(item.date!).toLocaleString()}</p>
                            </div>
                            <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                        </li>
                    ))}
                </ul>
           </div>
        </div>
      )}
    </div>
  );
};

const ReportView: React.FC<{ report: DiagnosisReport; onBack: () => void; chatMessages: ChatMessage[]; setChatMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>; chatRef: React.MutableRefObject<Chat | null>; isChatLoading: boolean; setIsChatLoading: React.Dispatch<React.SetStateAction<boolean>>; showToast: (msg: string) => void; }> = ({ report, onBack, chatMessages, setChatMessages, chatRef, isChatLoading, setIsChatLoading, showToast }) => {
  const [copied, setCopied] = useState(false);
  
  const formatReportForAction = (isMarkdown: boolean) => {
    const nl = isMarkdown ? '\n\n' : '\n';
    const h1 = isMarkdown ? '# ' : '';
    const h2 = isMarkdown ? '## ' : '';
    let content = `${h1}AI 智能皮肤诊断报告${nl}`;
    content += `${h2}诊断摘要${nl}${report.diagnosis}${nl}`;
    content += `${h2}第一阶段：修复与准备${nl}${report.plan.phase1}${nl}`;
    content += `${h2}第二阶段：核心治疗与改善${nl}${report.plan.phase2}${nl}`;
    content += `${h2}第三阶段：巩固与维持${nl}${report.plan.phase3}${nl}`;
    return content;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(formatReportForAction(false));
    setCopied(true);
    showToast('报告已复制到剪贴板。');
    setTimeout(() => setCopied(false), 2000);
  };
  
  const handleDownload = () => {
    const markdownContent = formatReportForAction(true);
    const blob = new Blob([markdownContent], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `skin-report-${new Date().toISOString().split('T')[0]}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('下载已开始。');
  };
  
  const handlePrint = () => {
    window.print();
  };
  
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    const input = (e.target as HTMLFormElement).message.value;
    if (!input.trim() || !chatRef.current) return;
    
    const newUserMessage: ChatMessage = { role: 'user', parts: [{ text: input }] };
    setChatMessages(prev => [...prev, newUserMessage]);
    (e.target as HTMLFormElement).reset();
    setIsChatLoading(true);

    try {
        const responseText = await sendMessage(chatRef.current, input);
        const newModelMessage: ChatMessage = { role: 'model', parts: [{ text: responseText }] };
        setChatMessages(prev => [...prev, newModelMessage]);
    } catch (error) {
        console.error("Chat error:", error);
        const errorMessage: ChatMessage = { role: 'model', parts: [{ text: "抱歉，我暂时无法回答。请稍后再试。" }] };
        setChatMessages(prev => [...prev, errorMessage]);
    } finally {
        setIsChatLoading(false);
    }
  };

  const chatContainerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (chatContainerRef.current) {
        chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages]);

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden print:shadow-none" id="report-content">
        <div className="p-6">
          <div className="flex justify-between items-start print:hidden">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">AI 智能皮肤诊断报告</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">生成于 {new Date(report.date!).toLocaleString()}</p>
            </div>
            <button onClick={onBack} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">&larr; 返回</button>
          </div>
          
          <div className="mt-6 space-y-6 prose prose-lg dark:prose-invert max-w-none">
            <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <h3 className="font-bold text-lg text-brand-800 dark:text-brand-300">诊断摘要</h3>
                <p>{report.diagnosis}</p>
            </div>
            <div>
                <h3 className="font-bold text-lg text-brand-800 dark:text-brand-300">第一阶段：修复与准备</h3>
                <p>{report.plan.phase1}</p>
            </div>
            <div>
                <h3 className="font-bold text-lg text-brand-800 dark:text-brand-300">第二阶段：核心治疗与改善</h3>
                <p>{report.plan.phase2}</p>
            </div>
            <div>
                <h3 className="font-bold text-lg text-brand-800 dark:text-brand-300">第三阶段：巩固与维持</h3>
                <p>{report.plan.phase3}</p>
            </div>
          </div>
        </div>
        <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-700 flex flex-wrap gap-2 items-center justify-end print:hidden">
            <button onClick={handleCopy} className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                {copied ? <CheckIcon className="h-5 w-5 mr-2 text-green-500"/> : <ClipboardIcon className="h-5 w-5 mr-2"/>}
                {copied ? '已复制' : '复制'}
            </button>
            <button onClick={handleDownload} className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                <DownloadIcon className="h-5 w-5 mr-2"/>
                导出 MD
            </button>
             <button onClick={handlePrint} className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H7a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm7-8a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2h2" /></svg>
                打印
            </button>
        </div>
      </div>
      
      <div className="mt-8 print:hidden">
        <h3 className="text-xl font-bold mb-4">AI 问答</h3>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg flex flex-col h-[500px]">
            <div ref={chatContainerRef} className="flex-1 p-4 overflow-y-auto space-y-4">
                <div className="flex items-start space-x-3">
                     <div className="p-2 bg-brand-600 rounded-full text-white flex-shrink-0"><SparklesIcon className="w-5 h-5"/></div>
                     <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-3 max-w-md">
                        <p className="text-sm">您好！我是您的 AI 护肤助手。您可以根据这份报告问我一些相关问题。请注意，我无法提供医疗建议。</p>
                     </div>
                </div>
                {chatMessages.map((msg, index) => (
                    <div key={index} className={`flex items-start space-x-3 ${msg.role === 'user' ? 'justify-end' : ''}`}>
                         {msg.role === 'model' && <div className="p-2 bg-brand-600 rounded-full text-white flex-shrink-0"><SparklesIcon className="w-5 h-5"/></div>}
                         <div className={`rounded-lg p-3 max-w-md text-sm ${msg.role === 'user' ? 'bg-brand-500 text-white' : 'bg-gray-100 dark:bg-gray-700'}`}>
                             <p>{msg.parts[0].text}</p>
                         </div>
                    </div>
                ))}
                {isChatLoading && (
                    <div className="flex items-start space-x-3">
                         <div className="p-2 bg-brand-600 rounded-full text-white flex-shrink-0"><SparklesIcon className="w-5 h-5"/></div>
                         <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-3 max-w-md">
                             <Spinner />
                         </div>
                    </div>
                )}
            </div>
            <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200 dark:border-gray-700 flex items-center space-x-2">
                <input type="text" name="message" placeholder="输入您的问题..." className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-full bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-brand-500"/>
                <button type="submit" className="p-2 rounded-full bg-brand-600 text-white hover:bg-brand-700 disabled:bg-gray-400" disabled={isChatLoading}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                </button>
            </form>
        </div>
      </div>
    </div>
  );
};

const Footer: React.FC<{onAboutClick: () => void;}> = ({ onAboutClick }) => (
    <footer className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-t border-gray-200/50 dark:border-gray-700/50 print:hidden sticky bottom-0 z-10">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 text-center text-sm text-gray-500 dark:text-gray-400">
            <div className="flex justify-center items-center space-x-4 mb-2">
                <button onClick={onAboutClick} className="inline-flex items-center space-x-1 hover:text-brand-600 dark:hover:text-brand-400">
                    <InfoIcon className="h-4 w-4" />
                    <span>关于</span>
                </button>
            </div>
            <p>联系信息: yuxiaodong@beaucare.org</p>
            <p className="text-xs opacity-70">
                Copyright © 2025 射频细胞 | 美肤小智 | <a href="https://beian.miit.gov.cn/" target="_blank" rel="noopener noreferrer" className="hover:underline">京 ICP 备 20009050 号-3</a>
            </p>
        </div>
    </footer>
);

const SettingsPanel: React.FC<{settings: any; setSettings: (value: any) => void; onClose: () => void}> = ({ settings, setSettings, onClose }) => {
    const updateSetting = (key: string, value: any) => {
        setSettings((prev: any) => ({ ...prev, [key]: value }));
    };
    
    return (
        <div className="fixed inset-0 bg-black/30 z-50 flex justify-end" onClick={onClose}>
            <div className="w-full max-w-sm bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg shadow-2xl h-full" onClick={e => e.stopPropagation()}>
                <div className="p-4 flex justify-between items-center border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-xl font-bold">设置</h2>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"><XIcon className="h-6 w-6" /></button>
                </div>
                <div className="p-4 space-y-6">
                    {/* Theme */}
                    <div>
                        <label className="text-sm font-medium flex items-center space-x-2 mb-2"><SunIcon className="w-5 h-5" /><span>主题</span></label>
                        <div className="flex space-x-2 p-1 bg-gray-200 dark:bg-gray-700 rounded-lg">
                           <button onClick={() => updateSetting('theme', 'light')} className={`flex-1 py-1 rounded-md text-sm ${settings.theme === 'light' ? 'bg-white dark:bg-gray-800 shadow' : ''}`}>浅色</button>
                           <button onClick={() => updateSetting('theme', 'dark')} className={`flex-1 py-1 rounded-md text-sm ${settings.theme === 'dark' ? 'bg-white dark:bg-gray-800 shadow' : ''}`}>深色</button>
                        </div>
                    </div>
                     {/* Color Theme */}
                    <div>
                        <label className="text-sm font-medium flex items-center space-x-2 mb-2"><PaletteIcon className="w-5 h-5" /><span>色彩主题</span></label>
                        <div className="grid grid-cols-4 gap-2">
                           <button onClick={() => updateSetting('colorTheme', 'theme-blue')} className={`h-10 rounded-md bg-blue-500 ${settings.colorTheme === 'theme-blue' ? 'ring-2 ring-offset-2 ring-blue-500 dark:ring-offset-gray-800' : ''}`}></button>
                           <button onClick={() => updateSetting('colorTheme', 'theme-rose')} className={`h-10 rounded-md bg-rose-500 ${settings.colorTheme === 'theme-rose' ? 'ring-2 ring-offset-2 ring-rose-500 dark:ring-offset-gray-800' : ''}`}></button>
                           <button onClick={() => updateSetting('colorTheme', 'theme-lavender')} className={`h-10 rounded-md bg-violet-500 ${settings.colorTheme === 'theme-lavender' ? 'ring-2 ring-offset-2 ring-violet-500 dark:ring-offset-gray-800' : ''}`}></button>
                           <button onClick={() => updateSetting('colorTheme', 'theme-mint')} className={`h-10 rounded-md bg-emerald-500 ${settings.colorTheme === 'theme-mint' ? 'ring-2 ring-offset-2 ring-emerald-500 dark:ring-offset-gray-800' : ''}`}></button>
                        </div>
                    </div>
                    {/* Font Size */}
                    <div>
                        <label className="text-sm font-medium mb-2 block">字号</label>
                        <div className="flex space-x-2 p-1 bg-gray-200 dark:bg-gray-700 rounded-lg">
                           <button onClick={() => updateSetting('fontSize', 'text-sm')} className={`flex-1 py-1 rounded-md text-sm ${settings.fontSize === 'text-sm' ? 'bg-white dark:bg-gray-800 shadow' : ''}`}>小</button>
                           <button onClick={() => updateSetting('fontSize', 'text-base')} className={`flex-1 py-1 rounded-md text-sm ${settings.fontSize === 'text-base' ? 'bg-white dark:bg-gray-800 shadow' : ''}`}>中</button>
                           <button onClick={() => updateSetting('fontSize', 'text-lg')} className={`flex-1 py-1 rounded-md text-sm ${settings.fontSize === 'text-lg' ? 'bg-white dark:bg-gray-800 shadow' : ''}`}>大</button>
                        </div>
                    </div>
                     {/* AI Settings */}
                    <div>
                         <label className="text-sm font-medium flex items-center space-x-2 mb-2"><TuneIcon className="w-5 h-5" /><span>AI 输出设置</span></label>
                         <div className="space-y-4">
                            <div>
                               <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">风格</p>
                               <select value={settings.aiStyle} onChange={e => updateSetting('aiStyle', e.target.value)} className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700">
                                   <option value="professional">专业</option>
                                   <option value="empathetic">共情</option>
                                   <option value="concise">简洁</option>
                               </select>
                            </div>
                            <div>
                               <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">长度</p>
                               <select value={settings.aiLength} onChange={e => updateSetting('aiLength', e.target.value)} className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700">
                                   <option value="standard">标准</option>
                                   <option value="detailed">详细</option>
                                   <option value="summary">摘要</option>
                               </select>
                            </div>
                         </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const AboutModal: React.FC<{onClose: () => void}> = ({onClose}) => (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center p-4 border-b border-gray-200/50 dark:border-gray-700/50 sticky top-0 bg-inherit">
                 <h2 className="text-xl font-bold">关于本应用</h2>
                 <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"><XIcon className="h-6 w-6" /></button>
            </div>
            <div className="p-6 prose prose-sm dark:prose-invert max-w-none">
                <h4>医疗免责声明</h4>
                <p>本应用（“美肤小智”）提供的所有信息，包括但不限于文本、图形、图像和其他材料，仅供参考。这些信息不旨在替代专业的医疗建议、诊断或治疗。如果您有任何关于医疗状况的问题，请务必咨询您的医生或其他合格的健康服务提供者。</p>
                <h4>AI 信息免责声明</h4>
                <p>本应用使用生成式人工智能（AI）模型来分析您提供的信息并生成报告。AI 的回答可能不完全准确或完整，且不应被视为权威。AI 生成的内容是基于其训练数据中的模式，不能替代人类专家的判断。</p>
                 <h4>隐私政策</h4>
                <p>我们高度重视您的隐私。所有您输入的信息，包括问卷答案和上传的照片，都只在您的设备本地进行处理和存储（使用 Local Storage）。这些数据不会被发送或存储到我们的服务器上。您的诊断历史也同样存储在您的本地浏览器中。</p>
                <h4>套餐内容声明</h4>
                <p>应用内“套餐设计”功能中展示的所有项目、价格和服务均为示例数据，仅用于演示目的，不构成任何真实的医疗美容服务要约或价格承诺。实际服务和价格请咨询线下专业机构。</p>
                <h4>联系信息</h4>
                <p>如果您有任何问题或建议，请联系我们：yuxiaodong@beaucare.org</p>
            </div>
        </div>
    </div>
);


const Toast: React.FC<{message: ToastMessage}> = ({ message }) => {
    const [isVisible, setIsVisible] = useState(false);
    
    useEffect(() => {
        if(message) setIsVisible(true);
        else setIsVisible(false);
    }, [message]);

    if (!message) return null;

    const toastColorClasses = {
        success: 'bg-green-100 border-green-400 text-green-700 dark:bg-green-900/50 dark:border-green-700 dark:text-green-200',
        info: 'bg-blue-100 border-blue-400 text-blue-700 dark:bg-blue-900/50 dark:border-blue-700 dark:text-blue-200',
    };

    return (
        <div className={`fixed top-5 left-1/2 -translate-x-1/2 z-[101] min-w-[250px] p-4 border rounded-md shadow-lg ${toastColorClasses[message.type]} ${isVisible ? 'animate-fade-in-down' : 'animate-fade-out-up'}`}>
            <p className="text-sm font-medium">{message.message}</p>
        </div>
    );
};

export default App;