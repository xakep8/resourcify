import { XMarkIcon } from '@heroicons/react/16/solid';
import React from 'react';
import '../index.css';

export default function Container({ children }: { children: React.ReactNode }) {
    return (
        <main className="flex flex-col w-full h-max rounded-3xl overflow-y-hidden bg-black">
            <main className="flex flex-row w-full justify-end top-0 sticky z-10 drag-handle">
                <button className='rounded-full no-drag' onClick={() => window.close()}>
                    <XMarkIcon className="h-5 w-5 text-white" />
                </button>
            </main>
            <div className="flex overflow-y-hidden no-drag">
                {children}
            </div>
        </main>
    );
}