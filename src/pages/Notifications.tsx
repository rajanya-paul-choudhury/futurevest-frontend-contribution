// pages/Notifications.tsx
import React from 'react';
import styled from 'styled-components';
import { BellOff } from 'lucide-react'; // ✅ You can use any icon library you already have

const Wrapper = styled.div`
  padding: 70px 20px;
  text-align: center;
  color: #6B7280;
`;

const IconWrapper = styled.div`
  margin-bottom: 20px;
  color: #9CA3AF;
  display: flex;
  justify-content: center;

  svg {
    width: 48px;
    height: 48px;
  }
`;

const Notifications: React.FC = () => {
  return (
    <Wrapper>
      <IconWrapper>
        <BellOff />
      </IconWrapper>
      <h1>No Notifications</h1>
      <p>You're all caught up. Check back later for updates.</p>
    </Wrapper>
  );
};

export default Notifications;
