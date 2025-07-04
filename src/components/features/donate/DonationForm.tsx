'use client'

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { gsap } from 'gsap';
import DonationCard from '@/components/ui/DonationCard';
import PaymentOptions from '@/components/ui/PaymentOptions';

// Define the PaymentMethod type to match what PaymentOptions expects
type PaymentMethod = 'card' | 'upi' | 'netbanking' | 'wallet';

interface DonationFormProps {
  onDonationSuccess: (name: string, amount: number) => void;
}

export default function DonationForm({ onDonationSuccess }: DonationFormProps) {
  // Donation options
  const donationOptions = [
    { 
      amount: 500, 
      impact: "Provides meals for 10 children", 
      icon: "🍲" 
    },
    { 
      amount: 1000, 
      impact: "Supports a child's education", 
      icon: "📚" 
    },
    { 
      amount: 5000, 
      impact: "Builds clean water facilities", 
      icon: "🚰" 
    },
    { 
      amount: 10000, 
      impact: "Funds medical treatment for 20 children", 
      icon: "🏥" 
    },
  ];

  // Form state
  const [donationAmount, setDonationAmount] = useState<number>(0);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [isMonthly, setIsMonthly] = useState<boolean>(false);
  const [formStep, setFormStep] = useState<number>(1);
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [isAnonymous, setIsAnonymous] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [selectedCardId, setSelectedCardId] = useState<string>(''); // Track selected card

  // Handle donation option selection
  const handleSelectAmount = (amount: number) => {
    console.log('Selecting amount:', amount); // Debug log
    
    setDonationAmount(amount);
    setCustomAmount(''); // Clear custom amount when preset is selected
    setSelectedCardId(`donation-card-${amount}`); // Set selected card ID
    
    // Enhanced GSAP animation with better targeting
    const allCards = document.querySelectorAll('.donation-card');
    const selectedCard = document.querySelector(`[data-amount="${amount}"]`);
    
    if (allCards.length > 0) {
      // First, reset all cards
      gsap.set(allCards, { scale: 1, opacity: 1 });
      
      // Then animate all cards to faded state
      gsap.to(allCards, {
        scale: 0.95,
        opacity: 0.7,
        duration: 0.3,
        ease: "power2.out"
      });
      
      // Animate selected card to prominent state
      if (selectedCard) {
        gsap.to(selectedCard, {
          scale: 1.05,
          opacity: 1,
          duration: 0.3,
          ease: "power2.out",
          delay: 0.1
        });
      }
    }
  };

  // Handle custom amount input
  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    console.log('Custom amount changed:', value); // Debug log
    
    if (/^\d*$/.test(value)) {
      setCustomAmount(value);
      const numericValue = value ? parseInt(value) : 0;
      setDonationAmount(numericValue);
      setSelectedCardId(''); // Clear selected card when custom amount is entered
      
      // Reset all cards to normal state when custom amount is being used
      const allCards = document.querySelectorAll('.donation-card');
      if (allCards.length > 0) {
        gsap.to(allCards, {
          scale: 1,
          opacity: numericValue > 0 ? 0.7 : 1, // Fade cards if custom amount exists
          duration: 0.3,
          ease: "power2.out"
        });
      }
    }
  };

  // Toggle monthly donation
  const handleToggleMonthly = () => {
    setIsMonthly(!isMonthly);
  };

  // Handle payment method selection
  const handleSelectMethod = (method: PaymentMethod) => {
    setPaymentMethod(method);
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (formStep === 1) {
      if (donationAmount <= 0) {
        alert('Please select or enter a donation amount');
        return;
      }
      setFormStep(2);
      return;
    }
    
    if (formStep === 2) {
      if (!isAnonymous && (!name || !email)) {
        alert('Please provide your name and email');
        return;
      }
      setFormStep(3);
      return;
    }
    
    if (formStep === 3) {
      if (!paymentMethod) {
        alert('Please select a payment method');
        return;
      }
      
      // Simulate payment processing
      setIsProcessing(true);
      
      // Simulate API call with timeout
      setTimeout(() => {
        setIsProcessing(false);
        onDonationSuccess(isAnonymous ? 'Anonymous' : name, donationAmount);
      }, 2000);
    }
  };

  // Handle back button
  const handleBack = () => {
    setFormStep(formStep - 1);
  };

  // Reset animations when step changes
  useEffect(() => {
    if (formStep === 1) {
      // Reset all card animations when returning to step 1
      setTimeout(() => {
        const allCards = document.querySelectorAll('.donation-card');
        if (allCards.length > 0) {
          gsap.set(allCards, { scale: 1, opacity: 1 });
          
          // Re-apply selection if there's a selected amount
          if (donationAmount > 0 && !customAmount) {
            handleSelectAmount(donationAmount);
          }
        }
      }, 100);
    }
  }, [formStep]);

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
      <div className="p-8 md:p-12">
        {/* Progress Steps */}
        <div className="flex items-center justify-between mb-10 px-4">
          {[1, 2, 3].map((step) => (
            <div key={step} className="flex flex-col items-center">
              <div 
                className={`flex items-center justify-center w-12 h-12 rounded-full text-lg font-bold transition-all duration-300 ${
                  step === formStep 
                    ? 'bg-purple-600 text-white scale-110'
                    : step < formStep
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-200 text-gray-500'
                }`}
              >
                {step < formStep ? (
                  <svg className="w-6 h-6" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M5 13l4 4L19 7"></path>
                  </svg>
                ) : (
                  step
                )}
              </div>
              <span className={`mt-2 text-sm ${step === formStep ? 'text-purple-600 font-bold' : 'text-gray-500'}`}>
                {step === 1 ? 'Amount' : step === 2 ? 'Details' : 'Payment'}
              </span>
            </div>
          ))}
          <div className="absolute left-0 right-0 h-1 top-6">
            <div className="mx-auto w-2/3 bg-gray-200 h-1 rounded-full">
              <motion.div 
                className="h-full bg-purple-600 rounded-full"
                initial={{ width: '0%' }}
                animate={{ width: `${(formStep - 1) * 50}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {formStep === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="text-2xl font-bold text-gray-800 mb-6">Select Your Donation Amount</h3>
              
              
              
              {/* Donation Amount Options */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {donationOptions.map((option) => (
                  <div 
                    key={option.amount}
                    className="donation-card cursor-pointer" 
                    data-amount={option.amount}
                    onClick={() => handleSelectAmount(option.amount)}
                  >
                    <DonationCard
                      amount={option.amount}
                      impact={option.impact}
                      icon={option.icon}
                      isSelected={donationAmount === option.amount && !customAmount}
                      onSelect={handleSelectAmount}
                    />
                  </div>
                ))}
              </div>
              
              {/* Custom Amount */}
              <div className="mb-8">
                <label className="block text-gray-700 font-medium mb-2">Custom Amount (₹)</label>
                <input
                  type="text"
                  value={customAmount}
                  onChange={handleCustomAmountChange}
                  className={`w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 text-xl ${
                    customAmount ? 'ring-2 ring-purple-500 border-purple-500' : ''
                  }`}
                  placeholder="Enter custom amount"
                />
                {customAmount && (
                  <p className="mt-2 text-sm text-purple-600">
                    Custom amount: ₹{parseInt(customAmount).toLocaleString()}
                  </p>
                )}
              </div>
              
              {/* Recurring Option */}
              <div className="flex items-center mb-10">
                <div className="relative inline-block w-14 h-8 mr-3">
                  <input 
                    type="checkbox" 
                    id="toggle" 
                    className="opacity-0 w-0 h-0"
                    checked={isMonthly}
                    onChange={handleToggleMonthly}
                  />
                  <label 
                    htmlFor="toggle" 
                    className={`
                      absolute cursor-pointer top-0 left-0 right-0 bottom-0 rounded-full transition-all duration-300
                      ${isMonthly ? 'bg-purple-600' : 'bg-gray-300'} 
                    `}
                  >
                    <span 
                      className={`
                        absolute left-1 bottom-1 bg-white w-6 h-6 rounded-full transition-all duration-300
                        ${isMonthly ? 'transform translate-x-6' : ''}
                      `}
                    />
                  </label>
                </div>
                <label htmlFor="toggle" className="text-gray-700 cursor-pointer">
                  Make this a monthly donation
                </label>
              </div>
            </motion.div>
          )}
          
          {formStep === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="text-2xl font-bold text-gray-800 mb-6">Your Information</h3>
              
              {/* Anonymous Option */}
              <div className="flex items-center mb-6">
                <input 
                  type="checkbox" 
                  id="anonymous" 
                  className="w-5 h-5 text-purple-600"
                  checked={isAnonymous}
                  onChange={() => setIsAnonymous(!isAnonymous)}
                />
                <label htmlFor="anonymous" className="ml-2 text-gray-700 cursor-pointer">
                  Donate anonymously
                </label>
              </div>
              
              {/* Donor Information */}
              {!isAnonymous && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Full Name *</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                      placeholder="Enter your full name"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Email Address *</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                      placeholder="Enter your email address"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Phone Number (Optional)</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                      placeholder="Enter your phone number"
                    />
                  </div>
                </div>
              )}
              
              {/* Message Option */}
              <div className="mt-6">
                <label className="block text-gray-700 font-medium mb-2">Message (Optional)</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 h-32"
                  placeholder="Share why you're donating or leave a message for the community"
                />
              </div>
            </motion.div>
          )}
          
          {formStep === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="text-2xl font-bold text-gray-800 mb-6">Payment Method</h3>
              
              {/* Donation Summary */}
              <div className="bg-purple-50 p-6 rounded-lg mb-8">
                <h4 className="text-lg font-bold text-gray-800 mb-3">Donation Summary</h4>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Amount:</span>
                  <span className="font-bold">₹{donationAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Frequency:</span>
                  <span>{isMonthly ? 'Monthly' : 'One-time'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Donor:</span>
                  <span>{isAnonymous ? 'Anonymous' : name}</span>
                </div>
              </div>
              
              {/* Payment Options */}
              <PaymentOptions 
                onSelectMethod={handleSelectMethod} 
                selectedMethod={paymentMethod}
              />
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Form Actions */}
        <div className="mt-10 flex justify-between">
          {formStep > 1 ? (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 transition-all duration-300"
              onClick={handleBack}
              disabled={isProcessing}
            >
              Back
            </motion.button>
          ) : (
            <div></div>
          )}
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`
              px-8 py-4 font-bold rounded-lg text-white transition-all duration-300
              ${isProcessing ? 'bg-gray-400 cursor-not-allowed' : 'bg-purple-600 hover:bg-purple-700'} 
            `}
            onClick={handleSubmit}
            disabled={isProcessing}
          >
            {isProcessing ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </span>
            ) : formStep === 3 ? (
              'Complete Donation'
            ) : (
              'Continue'
            )}
          </motion.button>
        </div>
      </div>
    </div>
  );
}