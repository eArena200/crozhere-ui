'use client';

import React, {  
    ReactNode, 
    ReactElement, 
    Children, 
    isValidElement
} from 'react';

interface TabProps {
  label: string;
  value: string;
  children: ReactNode;
}

interface TabsProps {
  selected: string;
  onChange: (value: string) => void;
  children: ReactElement<TabProps>[];
}

function Tabs({ selected, onChange, children }: TabsProps) {
  const tabs = Children.toArray(children).filter(isValidElement) as ReactElement<TabProps>[];

  return (
    <div className="w-full">
      <div className="flex">
        {tabs.map((tab) => (
          <button
            key={tab.props.value}
            onClick={() => onChange(tab.props.value)}
            className={`flex-1 text-center px-4 py-2 rounded-t-sm
            ${selected === tab.props.value
              ? 'bg-blue-500 text-white shadow font-bold'
              : 'hover:bg-blue-100 text-gray-700 bg-white'}`}
          >
            {tab.props.label}
          </button>
        ))}
      </div>
      <div className="p-2 border-t-2 border-blue-500">
        {tabs.find((tab) => tab.props.value === selected)?.props.children}
      </div>
    </div>
  );
}

function Tab({ children }: TabProps) {
  return <>{children}</>;
}

export { Tab };
export default Tabs;
