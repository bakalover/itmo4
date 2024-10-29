import React from 'react';

interface ActionMenuProps {
    actions: { [key: string]: string };
    onActionSelect: (action: string) => void;
}

const ActionMenu: React.FC<ActionMenuProps> = ({ actions, onActionSelect }) => (
    <div style={{ textAlign: 'center', marginTop: '50px' }} className="menu">
        {Object.entries(actions).map(([key, label]) => (
            <button key={key} onClick={() => onActionSelect(key)}>
                {label}
            </button>
        ))}
    </div>
);

export default ActionMenu;