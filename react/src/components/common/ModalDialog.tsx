import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

interface ModalDialogProps {
    show: boolean;
    title: string;
    width?: string;
    onClose: () => void;
    onConfirm: () => void;
    children: React.ReactNode;
    footer?: React.ReactNode;
}

export default function ModalDialog({
    show,
    title,
    width = '480px',
    onClose,
    onConfirm,
    children,
    footer,
}: ModalDialogProps) {
    useEffect(() => {
        // 处理按下 ESC 关闭
        function handleKeyDown(e: KeyboardEvent) {
            if (e.key === 'Escape' && show) {
                onClose();
            }
        }
        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [show, onClose]);

    if (!show) return null;

    return createPortal(
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200"
            onClick={onClose}
        >
            {/* backdrop */}
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>

            {/* content */}
            <div
                className="relative bg-card border border-themed rounded-xl shadow-2xl w-full animate-in zoom-in-95 duration-200"
                style={{ maxWidth: width }}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between px-5 py-4 border-b border-themed">
                    <h3 className="text-sm font-semibold text-default">{title}</h3>
                    <button
                        onClick={onClose}
                        className="p-1 rounded-md text-dim hover:text-default hover:bg-hover-themed transition-colors cursor-pointer"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                <div className="px-5 py-4 min-h-[100px] max-h-[70vh] overflow-y-auto">
                    {children}
                </div>

                <div className="flex items-center justify-end gap-2 px-5 py-3 border-t border-themed">
                    {footer !== undefined ? (
                        footer
                    ) : (
                        <>
                            <button
                                onClick={onClose}
                                className="px-4 py-2 text-xs font-medium text-dim bg-surface border border-themed rounded-lg hover:bg-hover-themed transition-colors cursor-pointer"
                            >
                                取消
                            </button>
                            <button
                                onClick={onConfirm}
                                className="px-4 py-2 text-xs font-medium text-white bg-primary rounded-lg hover:bg-primary-light transition-colors cursor-pointer"
                            >
                                确定
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>,
        document.body
    );
}
