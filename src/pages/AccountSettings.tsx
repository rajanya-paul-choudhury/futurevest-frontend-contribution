import React, { useState } from "react";
import styled from "styled-components";

const PageWrapper = styled.div`
  padding: 40px;
  padding-left: 260px;
`;

const Heading = styled.h1`
  font-size: 28px;
  margin-bottom: 30px;
`;

const Section = styled.div`
  margin-bottom: 25px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
`;

const Input = styled.input`
  padding: 10px;
  width: 300px;
  font-size: 15px;
  border-radius: 6px;
  border: 1px solid #ccc;
`;

const Select = styled.select`
  padding: 10px;
  width: 320px;
  font-size: 15px;
  border-radius: 6px;
  border: 1px solid #ccc;
`;

const Toggle = styled.input`
  margin-right: 10px;
`;

const SaveButton = styled.button`
  margin-top: 10px;
  padding: 10px 20px;
  background-color: #1e3a8a;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 15px;
  cursor: pointer;

  &:hover {
    background-color: #274db7;
  }
`;

const AccountSettings: React.FC = () => {
  const [currency, setCurrency] = useState("USD");
  const [darkMode, setDarkMode] = useState(false);

  const handleSave = () => {
    alert(`Preferences saved:\nCurrency: ${currency}\nDark Mode: ${darkMode ? "On" : "Off"}`);
  };

  return (
    <PageWrapper>
      <Heading>Account Settings</Heading>

      <Section>
        <Label>Email</Label>
        <Input type="text" value="user@example.com" readOnly />
      </Section>

      <Section>
        <Label>Preferred Currency</Label>
        <Select value={currency} onChange={(e) => setCurrency(e.target.value)}>
          <option value="USD">USD – US Dollar</option>
          <option value="AUD">AUD – Australian Dollar</option>
          <option value="EUR">EUR – Euro</option>
        </Select>
      </Section>

      <Section>
        <Label>
          <Toggle
            type="checkbox"
            checked={darkMode}
            onChange={(e) => setDarkMode(e.target.checked)}
          />
          Enable Dark Mode
        </Label>
      </Section>

      <SaveButton onClick={handleSave}>Save Preferences</SaveButton>
    </PageWrapper>
  );
};

export default AccountSettings;
