import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { AlertType, NotificationMethod, AlertDuration } from '../pages/Alerts';
import InfoTooltip from './InfoTooltip';

interface Props {
  isOpen?: boolean;
  onClose: () => void;
  onSave: (alertData: AlertFormData) => void;
  stock?: { symbol: string; name: string };
  initialData?: AlertFormData;
  isEdit?: boolean;
}

export interface AlertFormData {
  stockSymbol: string;
  stockName: string;
  type: AlertType;
  condition: string;
  value: string;
  notificationMethod: NotificationMethod[];
  duration: AlertDuration;
}

const initialFormData: AlertFormData = {
  stockSymbol: '',
  stockName: '',
  type: 'price',
  condition: 'above',
  value: '',
  notificationMethod: ['email'],
  duration: '1month'
};

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background-color: var(--white);
  border-radius: 16px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
  width: 100%;
  max-width: 550px;
  overflow: hidden;
  position: relative;
`;

const ModalHeader = styled.div`
  padding: 24px 28px;
  border-bottom: 1px solid var(--gray-light);
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ModalTitle = styled.h2`
  margin: 0;
  font-size: 20px;
  color: var(--text-dark);
  font-weight: 600;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  padding: 8px;
  cursor: pointer;
  color: var(--text-light);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  
  &:hover {
    background-color: var(--gray-light);
    color: var(--text-dark);
  }
  
  svg {
    width: 20px;
    height: 20px;
  }
`;

const ModalBody = styled.div`
  padding: 24px 28px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  font-size: 14px;
  color: var(--text-medium);
  font-weight: 500;
`;

const Input = styled.input`
  padding: 12px;
  border: 1px solid var(--gray-light);
  border-radius: 8px;
  font-size: 14px;
  color: var(--text-dark);
  transition: all 0.2s;
  
  &:focus {
    outline: none;
    border-color: var(--purple-light);
    box-shadow: 0 0 0 3px rgba(81, 36, 122, 0.1);
  }
  
  &::placeholder {
    color: var(--text-light);
  }
`;

const Select = styled.select`
  padding: 12px;
  border: 1px solid var(--gray-light);
  border-radius: 8px;
  font-size: 14px;
  color: var(--text-dark);
  background-color: var(--white);
  cursor: pointer;
  transition: all 0.2s;
  
  &:focus {
    outline: none;
    border-color: var(--purple-light);
    box-shadow: 0 0 0 3px rgba(81, 36, 122, 0.1);
  }
`;

const FieldRow = styled.div`
  display: flex;
  gap: 16px;
  
  & > * {
    flex: 1;
  }
`;

const RadioGroup = styled.div`
  display: flex;
  gap: 16px;
`;

const RadioOption = styled.label<{ checked: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  border-radius: 8px;
  background-color: ${props => props.checked ? 'var(--purple-ultralight)' : 'var(--white)'};
  border: 1px solid ${props => props.checked ? 'var(--purple-light)' : 'var(--gray-light)'};
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    border-color: ${props => props.checked ? 'var(--purple-light)' : 'var(--gray-medium)'};
  }
  
  input {
    width: 16px;
    height: 16px;
    accent-color: var(--purple-primary);
  }
`;

const CheckboxGroup = styled.div`
  display: flex;
  gap: 16px;
`;

const CheckboxOption = styled.label<{ checked: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  border-radius: 8px;
  background-color: ${props => props.checked ? 'var(--purple-ultralight)' : 'var(--white)'};
  border: 1px solid ${props => props.checked ? 'var(--purple-light)' : 'var(--gray-light)'};
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    border-color: ${props => props.checked ? 'var(--purple-light)' : 'var(--gray-medium)'};
  }
  
  input {
    width: 16px;
    height: 16px;
    accent-color: var(--purple-primary);
  }
`;

const ModalFooter = styled.div`
  padding: 20px 28px;
  border-top: 1px solid var(--gray-light);
  display: flex;
  justify-content: flex-end;
  gap: 12px;
`;

const CancelButton = styled.button`
  background-color: var(--white);
  color: var(--text-medium);
  border: 1px solid var(--gray-light);
  border-radius: 8px;
  padding: 12px 20px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background-color: var(--gray-light);
  }
`;

const SaveButton = styled.button`
  background-color: var(--purple-primary);
  color: var(--white);
  border: none;
  border-radius: 8px;
  padding: 12px 24px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background-color: var(--purple-dark);
  }
  
  &:disabled {
    background-color: var(--gray-light);
    color: var(--text-light);
    cursor: not-allowed;
  }
`;

const AlertTypeSelector = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 8px;
`;

const TypeButton = styled.button<{ active: boolean }>`
  flex: 1;
  background-color: ${props => props.active ? 'var(--purple-ultralight)' : 'var(--white)'};
  color: ${props => props.active ? 'var(--purple-primary)' : 'var(--text-medium)'};
  border: 1px solid ${props => props.active ? 'var(--purple-light)' : 'var(--gray-light)'};
  border-radius: 8px;
  padding: 12px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  
  svg {
    width: 20px;
    height: 20px;
    color: ${props => props.active ? 'var(--purple-primary)' : 'var(--text-light)'};
  }
  
  &:hover {
    border-color: ${props => props.active ? 'var(--purple-light)' : 'var(--purple-ultralight)'};
    color: ${props => props.active ? 'var(--purple-primary)' : 'var(--purple-primary)'};
  }
`;

const StockSearchResult = styled.div`
  padding: 12px;
  border: 1px solid var(--gray-light);
  border-radius: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 8px;
  
  h4 {
    margin: 0;
    font-size: 16px;
    color: var(--purple-primary);
  }
  
  p {
    margin: 4px 0 0;
    font-size: 14px;
    color: var(--text-light);
  }
`;

const AlertModal: React.FC<Props> = ({ 
  isOpen = false, 
  onClose, 
  onSave, 
  stock,
  initialData,
  isEdit = false
}) => {
  const [formData, setFormData] = useState<AlertFormData>(initialFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Initialize form data when props change
  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else if (stock) {
      setFormData({ 
        ...initialFormData, 
        stockSymbol: stock.symbol, 
        stockName: stock.name 
      });
    }
  }, [initialData, stock]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleTypeChange = (type: AlertType) => {
    setFormData(prev => ({ ...prev, type }));
    
    // Reset condition based on type
    if (type === 'price' || type === 'futureVestScore') {
      setFormData(prev => ({ ...prev, condition: 'above' }));
    } else if (type === 'earnings') {
      setFormData(prev => ({ ...prev, condition: 'beats' }));
    }
  };

  const handleNotificationChange = (method: NotificationMethod) => {
    setFormData(prev => {
      const methods = prev.notificationMethod.includes(method) 
        ? prev.notificationMethod.filter(m => m !== method)
        : [...prev.notificationMethod, method];
      
      // Ensure at least one method is selected
      return { ...prev, notificationMethod: methods.length > 0 ? methods : prev.notificationMethod };
    });
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.stockSymbol) {
      newErrors.stockSymbol = 'Stock symbol is required';
    }
    
    if (!formData.value) {
      newErrors.value = 'Value is required';
    } else {
      const numValue = Number(formData.value);
      if (isNaN(numValue)) {
        newErrors.value = 'Must be a valid number';
      } else if (formData.type === 'futureVestScore' && (numValue < 0 || numValue > 100)) {
        newErrors.value = 'Score must be between 0 and 100';
      } else if (numValue <= 0) {
        newErrors.value = 'Must be greater than zero';
      }
    }
    
    if (formData.notificationMethod.length === 0) {
      newErrors.notificationMethod = 'Select at least one notification method';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validate()) {
      onSave(formData);
      onClose();
    }
  };

  const getConditionOptions = () => {
    switch (formData.type) {
      case 'price':
        return (
          <>
            <option value="above">Above</option>
            <option value="below">Below</option>
          </>
        );
      case 'earnings':
        return (
          <>
            <option value="beats">Beats Estimates</option>
            <option value="misses">Misses Estimates</option>
          </>
        );
      case 'futureVestScore':
        return (
          <>
            <option value="above">Above</option>
            <option value="below">Below</option>
          </>
        );
      default:
        return null;
    }
  };

  const getValueLabel = () => {
    switch (formData.type) {
      case 'price':
        return 'Target Price ($)';
      case 'earnings':
        return 'By Percentage (%)';
      case 'futureVestScore':
        return 'Score Value (0-100)';
      default:
        return 'Value';
    }
  };

  // Icons
  const CloseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18"></line>
      <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
  );

  const PriceIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="1" x2="12" y2="23"></line>
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
    </svg>
  );

  const EarningsIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
    </svg>
  );

  const ScoreIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
    </svg>
  );

  return (
    <ModalOverlay>
      <ModalContent>
        <ModalHeader>
          <ModalTitle>
            {isEdit ? 'Edit Alert' : 'Create New Alert'}
          </ModalTitle>
          <CloseButton onClick={onClose}>
            <CloseIcon />
          </CloseButton>
        </ModalHeader>
        
        <ModalBody>
          <Form onSubmit={handleSubmit}>
            {!stock && (
              <FormGroup>
                <Label htmlFor="stockSymbol">Stock Symbol</Label>
                <Input
                  id="stockSymbol"
                  name="stockSymbol"
                  placeholder="Enter stock symbol (e.g. AAPL)"
                  value={formData.stockSymbol}
                  onChange={handleChange}
                />
                {errors.stockSymbol && (
                  <span style={{ color: 'var(--danger)', fontSize: '12px', marginTop: '4px' }}>
                    {errors.stockSymbol}
                  </span>
                )}
                
                {formData.stockSymbol && formData.stockName && (
                  <StockSearchResult>
                    <div>
                      <h4>{formData.stockSymbol}</h4>
                      <p>{formData.stockName}</p>
                    </div>
                  </StockSearchResult>
                )}
              </FormGroup>
            )}
            
            <FormGroup>
              <Label>Alert Type</Label>
              <AlertTypeSelector>
                <TypeButton
                  type="button"
                  active={formData.type === 'price'}
                  onClick={() => handleTypeChange('price')}
                >
                  <PriceIcon />
                  Price Alert
                  {formData.type === 'price' && <InfoTooltip text="Alert when the stock price crosses a specified threshold." />}
                </TypeButton>
                <TypeButton
                  type="button"
                  active={formData.type === 'earnings'}
                  onClick={() => handleTypeChange('earnings')}
                >
                  <EarningsIcon />
                  Earnings Alert
                  {formData.type === 'earnings' && <InfoTooltip text="Alert when earnings beat or miss by a specified percentage." />}
                </TypeButton>
                <TypeButton
                  type="button"
                  active={formData.type === 'futureVestScore'}
                  onClick={() => handleTypeChange('futureVestScore')}
                >
                  <ScoreIcon />
                  FutureVest Score
                  {formData.type === 'futureVestScore' && <InfoTooltip text="Alert when the proprietary FutureVest Score crosses a threshold." />}
                </TypeButton>
              </AlertTypeSelector>
            </FormGroup>
            
            <FieldRow>
              <FormGroup>
                <Label htmlFor="condition">Condition</Label>
                <Select
                  id="condition"
                  name="condition"
                  value={formData.condition}
                  onChange={handleChange}
                >
                  {getConditionOptions()}
                </Select>
              </FormGroup>
              
              <FormGroup>
                <Label htmlFor="value">{getValueLabel()}</Label>
                <Input
                  id="value"
                  name="value"
                  type="number"
                  step={formData.type === 'price' ? '0.01' : '1'}
                  placeholder={formData.type === 'price' ? '0.00' : '0'}
                  value={formData.value}
                  onChange={handleChange}
                />
                {errors.value && (
                  <span style={{ color: 'var(--danger)', fontSize: '12px', marginTop: '4px' }}>
                    {errors.value}
                  </span>
                )}
              </FormGroup>
            </FieldRow>
            
            <FormGroup>
              <Label>Notification Method</Label>
              <CheckboxGroup>
                <CheckboxOption checked={formData.notificationMethod.includes('email')}>
                  <input
                    type="checkbox"
                    checked={formData.notificationMethod.includes('email')}
                    onChange={() => handleNotificationChange('email')}
                  />
                  Email
                </CheckboxOption>
                <CheckboxOption checked={formData.notificationMethod.includes('push')}>
                  <input
                    type="checkbox"
                    checked={formData.notificationMethod.includes('push')}
                    onChange={() => handleNotificationChange('push')}
                  />
                  Push
                </CheckboxOption>
                <CheckboxOption checked={formData.notificationMethod.includes('sms')}>
                  <input
                    type="checkbox"
                    checked={formData.notificationMethod.includes('sms')}
                    onChange={() => handleNotificationChange('sms')}
                  />
                  SMS
                </CheckboxOption>
              </CheckboxGroup>
              {errors.notificationMethod && (
                <span style={{ color: 'var(--danger)', fontSize: '12px', marginTop: '4px' }}>
                  {errors.notificationMethod}
                </span>
              )}
            </FormGroup>
            
            <FormGroup>
              <Label htmlFor="duration">Alert Duration</Label>
              <Select
                id="duration"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
              >
                <option value="1day">1 Day</option>
                <option value="1week">1 Week</option>
                <option value="1month">1 Month</option>
                <option value="indefinite">Indefinite (Until Manually Disabled)</option>
              </Select>
            </FormGroup>
          </Form>
        </ModalBody>
        
        <ModalFooter>
          <CancelButton type="button" onClick={onClose}>Cancel</CancelButton>
          <SaveButton type="button" onClick={handleSubmit}>
            {isEdit ? 'Update Alert' : 'Create Alert'}
          </SaveButton>
        </ModalFooter>
      </ModalContent>
    </ModalOverlay>
  );
};

export default AlertModal; 