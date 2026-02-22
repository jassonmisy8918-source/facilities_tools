import { createPortal } from 'react-dom';
import { useToastStore } from './ToastNotify.store';
import { CheckCircle, AlertCircle, X, Info } from 'lucide-react';

const iconMap = {
    success: CheckCircle,
    error: AlertCircle,
    info: Info,
    warning: AlertCircle,
};

const colorMap = {
    success: 'border-green-500 bg-green-500/10 text-green-400',
    error: 'border-red-500 bg-red-500/10 text-red-400',
    info: 'border-blue-500 bg-blue-500/10 text-blue-400',
    warning: 'border-yellow-500 bg-yellow-500/10 text-yellow-400',
};

export default function ToastContainer() {
    const { toasts, remove } = useToastStore();

    return createPortal(
        <div className="fixed top-16 right-4 z-60 space-y-2 min-w-[280px]">
            {toasts.map((t) => {
                const Icon = iconMap[t.type];
                return (
                    // 注: 此处由于 react-transition-group 配置稍繁琐，暂时用普通带少量 css-transition 的 div 实现。如需高级动画后期可补齐
                    <div
                        key={t.id}
                        className={`flex items-center gap-2 px-4 py-3 rounded-lg border shadow-lg backdrop-blur-sm transition-all duration-300 animate-in fade-in slide-in-from-right-8 ${colorMap[t.type]}`}
                    >
                        <Icon className="w-4 h-4 shrink-0" />
                        <span className="text-xs font-medium flex-1">{t.message}</span>
                        <button
                            onClick={() => remove(t.id)}
                            className="p-0.5 hover:opacity-70 cursor-pointer"
                        >
                            <X className="w-3 h-3" />
                        </button>
                    </div>
                );
            })}
        </div>,
        document.body
    );
}
