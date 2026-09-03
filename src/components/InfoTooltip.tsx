import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';

interface InfoTooltipProps {
  id?: string;
  text?: string;
  children?: React.ReactNode;
  placement?: 'top' | 'bottom';
}

const TooltipContainer = styled.div`
  position: relative;
  display: inline-flex;
  align-items: center;
`;

const InfoIcon = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background-color: var(--gray-light);
  color: var(--primary-color);
  font-size: 11px;
  font-weight: bold;
  margin-left: 8px;
  cursor: help;
  transition: background 0.2s, color 0.2s;
  vertical-align: middle;
  &:hover {
    background-color: var(--purple-primary);
    color: var(--white);
  }
`;

const TooltipText = styled.div<{ visible: boolean; placement: 'top' | 'bottom'; leftShift: number }>`
  position: absolute;
  left: 50%;
  transform: translateX(-50%) translateX(${props => props.leftShift}px);
  background-color: var(--text-dark);
  color: var(--white);
  padding: 6px 10px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: normal;
  max-width: 320px;
  min-width: 120px;
  text-align: center;
  z-index: 100;
  opacity: ${props => props.visible ? 1 : 0};
  visibility: ${props => props.visible ? 'visible' : 'hidden'};
  transition: opacity 0.2s, visibility 0.2s, transform 0.2s;
  word-break: break-word;
  white-space: pre-line;
  top: ${props => props.placement === 'top' ? 'auto' : 'calc(100% + 8px)'};
  bottom: ${props => props.placement === 'top' ? 'calc(100% + 8px)' : 'auto'};
  &::before {
    content: '';
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    border-width: 6px;
    border-style: solid;
    ${props => props.placement === 'top'
      ? `top: 100%; border-color: var(--text-dark) transparent transparent transparent;`
      : `bottom: 100%; border-color: transparent transparent var(--text-dark) transparent;`}
  }
`;

const InfoTooltip: React.FC<InfoTooltipProps> = ({ id = 'info-tooltip', text = '', children, placement }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [finalPlacement, setFinalPlacement] = useState<'top' | 'bottom'>(placement || 'top');
  const [leftShift, setLeftShift] = useState(0);
  const iconRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isVisible && iconRef.current && tooltipRef.current) {
      const iconRect = iconRef.current.getBoundingClientRect();
      const tooltipRect = tooltipRef.current.getBoundingClientRect();
      const spaceAbove = iconRect.top;
      const spaceBelow = window.innerHeight - iconRect.bottom;
      if (placement) {
        setFinalPlacement(placement);
      } else {
        if (spaceBelow < tooltipRect.height + 16 && spaceAbove > tooltipRect.height + 16) {
          setFinalPlacement('top');
        } else {
          setFinalPlacement('bottom');
        }
      }
      let shift = 0;
      const leftEdge = iconRect.left + iconRect.width / 2 - tooltipRect.width / 2;
      const rightEdge = iconRect.left + iconRect.width / 2 + tooltipRect.width / 2;
      if (leftEdge < 8) {
        shift = 8 - leftEdge;
      } else if (rightEdge > window.innerWidth - 8) {
        shift = window.innerWidth - 8 - rightEdge;
      }
      setLeftShift(shift);
    }
  }, [isVisible, placement]);

  return (
    <TooltipContainer>
      {children}
      <InfoIcon
        ref={iconRef}
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        aria-describedby={id}
      >
        i
      </InfoIcon>
      <TooltipText
        id={id}
        ref={tooltipRef}
        visible={isVisible}
        placement={finalPlacement}
        leftShift={leftShift}
        role="tooltip"
      >
        {text}
      </TooltipText>
    </TooltipContainer>
  );
};

export default InfoTooltip; 