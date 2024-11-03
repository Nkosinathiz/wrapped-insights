import React from 'react';
import { TimeRange } from '../types/spotify';

interface Props {
  selected: TimeRange['value'];
  onChange: (value: TimeRange['value']) => void;
}

export default function TimeRangeSelector({ selected, onChange }: Props) {
  const ranges: TimeRange[] = [
    { value: '4weeks', label: 'Last 4 Weeks' },
    { value: '6months', label: 'Last 6 Months' },
    { value: 'lifetime', label: 'All Time' },
  ];

  return (
    <div className="flex space-x-2">
      {ranges.map((range) => (
        <button
          key={range.value}
          onClick={() => onChange(range.value)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors
            ${selected === range.value
              ? 'bg-purple-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
        >
          {range.label}
        </button>
      ))}
    </div>
  );
}