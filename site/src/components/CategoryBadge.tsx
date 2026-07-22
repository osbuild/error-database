import React from 'react';

const CATEGORY_COLORS: Record<string, {bg: string; text: string}> = {
  FLAKE: {bg: '#fff3cd', text: '#856404'},
  EXTERNAL: {bg: '#cce5ff', text: '#004085'},
  BUG: {bg: '#f8d7da', text: '#721c24'},
  INFRASTRUCTURE: {bg: '#e2e3e5', text: '#383d41'},
};

export default function CategoryBadge({category}: {category: string}) {
  const colors = CATEGORY_COLORS[category] || {bg: '#e2e3e5', text: '#383d41'};
  return (
    <span
      style={{
        backgroundColor: colors.bg,
        color: colors.text,
        padding: '2px 8px',
        borderRadius: '4px',
        fontSize: '0.85em',
        fontWeight: 600,
      }}>
      {category || 'No category found'}
    </span>
  );
}
