import React, { useState, useMemo } from 'react';
import { TREATMENT_MENU } from '../data/treatments';
import { TreatmentItem } from '../types';
import ShoppingCartIcon from './icons/ShoppingCartIcon';

const InfoIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <circle cx="12" cy="12" r="10"></circle>
    <line x1="12" y1="16" x2="12" y2="12"></line>
    <line x1="12" y1="8" x2="12.01" y2="8"></line>
  </svg>
);

interface PackageDesignerProps {
  onBack: () => void;
}

const TreatmentItemCard: React.FC<{ item: TreatmentItem; quantity: number; onQuantityChange: (name: string, quantity: number) => void }> = ({ item, quantity, onQuantityChange }) => {
    return (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col h-full">
            <div className="flex-grow">
                <div className="flex justify-between items-start">
                    <h3 className="font-bold text-gray-800 dark:text-gray-100 pr-2">{item.name}</h3>
                    <span className="text-lg font-semibold text-brand-600 dark:text-brand-400 flex-shrink-0">¥{item.price}</span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">{item.spec}</p>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-2"><span className="font-semibold">效果:</span> {item.effect}</p>
                {item.ingredients && <p className="text-xs text-gray-500 dark:text-gray-400 mb-2"><span className="font-semibold">成分:</span> {item.ingredients}</p>}
            </div>
            <div className="mt-auto flex justify-end items-center space-x-2">
                <button onClick={() => onQuantityChange(item.name, Math.max(0, quantity - 1))} className="px-2 py-1 h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600">-</button>
                <span className="w-8 text-center font-medium">{quantity}</span>
                <button onClick={() => onQuantityChange(item.name, quantity + 1)} className="px-2 py-1 h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600">+</button>
            </div>
        </div>
    );
};


const PackageDesigner: React.FC<PackageDesignerProps> = ({ onBack }) => {
  const [quantities, setQuantities] = useState<Record<string, number>>({});

  const handleQuantityChange = (name: string, quantity: number) => {
    setQuantities(prev => ({ ...prev, [name]: quantity }));
  };

  const { selectedItems, subtotal, discount, total } = useMemo(() => {
    const selectedItems = TREATMENT_MENU.flatMap(cat => cat.items)
      .filter(item => quantities[item.name] > 0)
      .map(item => ({ ...item, quantity: quantities[item.name] }));

    const subtotal = selectedItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const discount = subtotal >= 2000 ? subtotal * 0.1 : 0;
    const total = subtotal - discount;
    
    return { selectedItems, subtotal, discount, total };
  }, [quantities]);

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">套餐设计器</h1>
        <button onClick={onBack} className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700">返回问卷</button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
            {TREATMENT_MENU.map(category => (
                <div key={category.name}>
                    <h2 className="text-2xl font-semibold mb-4 pb-2 border-b-2 border-brand-500">{category.name}</h2>
                    {category.notes && (
                        <div className="mb-4 p-3 rounded-lg bg-yellow-50 dark:bg-yellow-900/40 border border-yellow-200 dark:border-yellow-800 text-yellow-800 dark:text-yellow-200 flex items-start space-x-2 text-sm">
                            <InfoIcon className="h-5 w-5 flex-shrink-0 mt-0.5" />
                            <div>{category.notes.join('; ')}</div>
                        </div>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                        {category.items.map(item => (
                            <TreatmentItemCard key={item.name} item={item} quantity={quantities[item.name] || 0} onQuantityChange={handleQuantityChange} />
                        ))}
                    </div>
                </div>
            ))}
        </div>
        
        <div className="lg:col-span-1">
          <div className="sticky top-20">
            <div className="rounded-xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 overflow-hidden bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg">
                <div className="p-4 bg-brand-600 text-white flex items-center space-x-3">
                    <ShoppingCartIcon className="h-6 w-6"/>
                    <h2 className="text-xl font-bold">费用总结</h2>
                </div>
                <div className="p-4 space-y-3">
                    {selectedItems.length > 0 ? (
                        <>
                            <div className="max-h-60 overflow-y-auto pr-2 space-y-2">
                                {selectedItems.map(item => (
                                    <div key={item.name} className="flex justify-between text-sm">
                                        <p className="text-gray-700 dark:text-gray-300">{item.name} <span className="text-gray-500">x{item.quantity}</span></p>
                                        <p className="font-medium text-gray-900 dark:text-gray-100">¥{item.price * item.quantity}</p>
                                    </div>
                                ))}
                            </div>
                            <div className="border-t border-gray-200 dark:border-gray-700 pt-3 space-y-1">
                                <div className="flex justify-between text-sm">
                                    <span>小计</span>
                                    <span>¥{subtotal.toFixed(2)}</span>
                                </div>
                                {discount > 0 && (
                                    <div className="flex justify-between text-sm text-green-600 dark:text-green-400">
                                        <span>暑期活动九折优惠</span>
                                        <span>-¥{discount.toFixed(2)}</span>
                                    </div>
                                )}
                                <div className="flex justify-between text-xl font-bold pt-2">
                                    <span>总计</span>
                                    <span>¥{total.toFixed(2)}</span>
                                </div>
                            </div>
                        </>
                    ) : (
                        <p className="text-center text-gray-500 dark:text-gray-400 py-8">请选择项目...</p>
                    )}
                </div>
            </div>
             <div className="mt-4 p-3 rounded-lg bg-blue-50 dark:bg-blue-900/40 text-blue-800 dark:text-blue-200 flex items-start space-x-2 text-sm">
                <InfoIcon className="h-5 w-5 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">暑期活动: 储值2000享全场九折</p>
                  <p>当消费总额满2000元时，系统将自动应用九折优惠。</p>
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PackageDesigner;