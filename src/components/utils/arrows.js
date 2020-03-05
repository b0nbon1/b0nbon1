import React from 'react';
import '../../styles/arrows.css';

function arrows({ handleClick }) {
  return (
    <div>
      <button onClick={handleClick} className="arrow">
        <svg>
          <g>
            <line x1="47.62" x2="" y1="31.28" y2="31.28"></line>
            <polyline points="222.62 25.78 228.12 31.28 222.62 36.78" transform="translate(-179, 0)"></polyline>
            <circle cx="224.67" cy="30.94" r="15.5" transform="rotate(180 134.67 30.94) scale(1, -1) translate(0, -61)">
            </circle>
          </g>
        </svg>
      </button>
    </div>
  )
}

export default arrows;
