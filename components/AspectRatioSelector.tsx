
import React from 'react';
import { AspectRatio, ASPECT_RATIOS } from '../types';

interface AspectRatioSelectorProps {
  selectedRatio: AspectRatio;
  onChange: (ratio: AspectRatio) => void;
  disabled: boolean;
}

const AspectRatioIcon: React.FC<{ratio: AspectRatio}> = ({ ratio }) => {
    let width = 20;
    let height = 20;
    
    switch (ratio) {
        case "1:1": break;
        case "3:4": width = 15; break;
        case "4:3": height = 15; break;
        case "9:16": width = 11.25; break;
        case "16:9": height = 11.25; break;
    }

    return (
        <div className="w-8 h-8 flex items-center justify-center">
            <div
                className="bg-gray-500 group-hover:bg-gray-400 group-data-[active=true]:bg-purple-300 transition-colors"
                style={{ width: `${width}px`, height: `${height}px` }}
            ></div>
        </div>
    );
};

export const AspectRatioSelector: React.FC<AspectRatioSelectorProps> = ({ selectedRatio, onChange, disabled }) => {
  return (
    <div className="flex flex-col gap-3">
        <label className="text-lg font-semibold text-purple-300">
            Aspect Ratio
        </label>
        <div className="flex flex-wrap gap-2 md:gap-3 p-2 bg-gray-800/50 rounded-lg border border-gray-700/50">
        {ASPECT_RATIOS.map((ratio) => (
            <button
            key={ratio}
            onClick={() => onChange(ratio)}
            disabled={disabled}
            data-active={selectedRatio === ratio}
            className="group flex-1 flex flex-col items-center justify-center gap-1.5 px-3 py-2.5 rounded-md text-sm font-medium transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed bg-gray-800 data-[active=true]:bg-purple-600 hover:bg-gray-700 data-[active=true]:hover:bg-purple-500"
            >
                <AspectRatioIcon ratio={ratio} />
                <span className="text-gray-300 group-data-[active=true]:text-white transition-colors">{ratio}</span>
            </button>
        ))}
        </div>
    </div>
  );
};
