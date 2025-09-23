import React from 'react';

const Spinner: React.FC = () => {
  return (
    <div className="flex justify-center items-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white"></div>
    </div>
  );
};

const FullPageSpinner: React.FC<{ message?: string }> = ({ message = '正在分析您的皮肤...' }) => {
    const messages = [
        "正在分析皮肤特征...",
        "正在咨询 AI 护膚专家...",
        "正在交叉比对数千个数据点...",
        "正在生成个性化建议...",
        "正在最终确定您的专属护理方案..."
    ];
    const [currentMessage, setCurrentMessage] = React.useState(messages[0]);

    React.useEffect(() => {
        let index = 0;
        const interval = setInterval(() => {
            index = (index + 1) % messages.length;
            setCurrentMessage(messages[index]);
        }, 3000); // Change message every 3 seconds

        return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex flex-col justify-center items-center">
      <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-t-4 border-white"></div>
      <p className="text-white text-lg mt-6 font-medium">{currentMessage}</p>
    </div>
  );
};


export { Spinner, FullPageSpinner };