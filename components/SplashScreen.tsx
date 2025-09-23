import React, { useRef, useEffect, useState, useMemo } from 'react';
import { AESTHETIC_QUOTES } from '../data/quotes';
import { ANIMATIONS } from './splashAnimations';

const SplashScreen: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [quote, setQuote] = useState('');
    const [loadingMessage, setLoadingMessage] = useState('加载美学引擎...');
    
    // Select a random animation and quote once on mount
    const { randomAnimation } = useMemo(() => {
        const randomIndex = Math.floor(Math.random() * AESTHETIC_QUOTES.length);
        const randomAnimIndex = Math.floor(Math.random() * ANIMATIONS.length);
        setQuote(AESTHETIC_QUOTES[randomIndex]);
        return { randomAnimation: ANIMATIONS[randomAnimIndex] };
    }, []);
    
    useEffect(() => {
        const loadingMessages = [
            "正在初始化...",
            "加载美学引擎...",
            "编译像素着色器...",
            "唤醒数字缪斯...",
            "构建美的拓扑结构...",
        ];
        let messageIndex = 0;
        const interval = setInterval(() => {
            messageIndex = (messageIndex + 1) % loadingMessages.length;
            setLoadingMessage(loadingMessages[messageIndex]);
        }, 800);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let frame = 0;
        let animationFrameId: number;

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        const render = () => {
            frame++;
            randomAnimation(ctx, canvas.width, canvas.height, frame);
            animationFrameId = window.requestAnimationFrame(render);
        };

        resizeCanvas();
        render();

        window.addEventListener('resize', resizeCanvas);

        return () => {
            window.cancelAnimationFrame(animationFrameId);
            window.removeEventListener('resize', resizeCanvas);
        };
    }, [randomAnimation]);

    return (
        <div className="fixed inset-0 bg-gray-900 flex flex-col items-center justify-center z-[200]">
            <canvas ref={canvasRef} className="absolute inset-0 w-full h-full opacity-50"></canvas>
            <div className="relative text-center p-8 z-10">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-t-2 border-white/80 mx-auto mb-6"></div>
                <h1 className="text-white text-2xl font-bold mb-4 animate-fade-in-down" style={{animationDelay: '0.2s'}}>与皮肤对话 - 医美小智</h1>
                <p className="text-gray-300 max-w-md mx-auto mb-4 animate-fade-in-down" style={{animationDelay: '0.4s'}}>"{quote}"</p>
                <p className="text-gray-400 text-sm animate-fade-in-down" style={{animationDelay: '0.6s'}}>{loadingMessage}</p>
            </div>
        </div>
    );
};

export default SplashScreen;
