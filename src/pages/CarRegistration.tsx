import React, { useState } from 'react';
import { Car, Gift, CheckCircle, AlertCircle } from 'lucide-react';
import { User, CarWashCode } from '../types';
import { storageUtils } from '../utils/storage';
import { Layout } from '../components/Layout';

interface CarRegistrationProps {
  user: User;
  onLogout: () => void;
}

export const CarRegistration: React.FC<CarRegistrationProps> = ({ user, onLogout }) => {
  const [carRegistration, setCarRegistration] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [generatedCode, setGeneratedCode] = useState<CarWashCode | null>(null);

  const validateCarRegistration = (registration: string): boolean => {
    // Basic validation - alphanumeric, 4-10 characters
    const regex = /^[A-Za-z0-9]{4,10}$/;
    return regex.test(registration.replace(/\s/g, ''));
  };

  const generateCarWashCode = (): string => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const cleanRegistration = carRegistration.trim().toUpperCase().replace(/\s/g, '');
    
    if (!cleanRegistration) {
      setError('Car registration number is required');
      return;
    }

    if (!validateCarRegistration(cleanRegistration)) {
      setError('Please enter a valid car registration number (4-10 alphanumeric characters)');
      return;
    }

    // Check if code already exists for this user and car
    const existingCode = storageUtils.getCodeByUserAndCar(user.id, cleanRegistration);
    
    if (existingCode) {
      if (existingCode.isUsed) {
        setError('Free car wash already claimed for this vehicle.');
        return;
      } else {
        // Show existing unused code
        setGeneratedCode(existingCode);
        setError('');
        return;
      }
    }

    setIsLoading(true);
    setError('');
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const newCode: CarWashCode = {
      code: generateCarWashCode(),
      carRegistration: cleanRegistration,
      userId: user.id,
      isUsed: false,
      createdAt: new Date().toISOString()
    };

    storageUtils.saveCarWashCode(newCode);
    setGeneratedCode(newCode);
    setIsLoading(false);
  };

  const handleUseCode = () => {
    if (generatedCode) {
      storageUtils.markCodeAsUsed(generatedCode.code);
      setGeneratedCode({ ...generatedCode, isUsed: true });
    }
  };

  const handleNewRegistration = () => {
    setGeneratedCode(null);
    setCarRegistration('');
    setError('');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCarRegistration(e.target.value);
    if (error) {
      setError('');
    }
  };

  if (generatedCode) {
    return (
      <Layout showHeader onLogout={onLogout}>
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] p-4">
          <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md text-center">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
              generatedCode.isUsed ? 'bg-gray-100' : 'bg-green-100'
            }`}>
              {generatedCode.isUsed ? (
                <CheckCircle className="w-8 h-8 text-gray-600" />
              ) : (
                <Gift className="w-8 h-8 text-green-600" />
              )}
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {generatedCode.isUsed ? 'Code Used!' : 'Free Car Wash Code'}
            </h2>
            
            <p className="text-gray-600 mb-6">
              {generatedCode.isUsed 
                ? 'This code has been used for your free car wash.'
                : `Your free car wash code for vehicle ${generatedCode.carRegistration}:`
              }
            </p>

            <div className={`p-6 rounded-lg mb-6 ${
              generatedCode.isUsed ? 'bg-gray-50' : 'bg-green-50 border-2 border-green-200'
            }`}>
              <div className="text-3xl font-bold text-gray-900 mb-2 font-mono">
                {generatedCode.code}
              </div>
              <p className="text-sm text-gray-600">
                Vehicle: {generatedCode.carRegistration}
              </p>
            </div>

            {!generatedCode.isUsed ? (
              <div className="space-y-3">
                <p className="text-sm text-gray-500 mb-4">
                  Present this code at any participating car wash location.
                </p>
                <button
                  onClick={handleUseCode}
                  className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors font-medium mb-3"
                >
                  Mark as Used
                </button>
                <button
                  onClick={handleNewRegistration}
                  className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                >
                  Register Another Vehicle
                </button>
              </div>
            ) : (
              <button
                onClick={handleNewRegistration}
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Register Another Vehicle
              </button>
            )}
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout showHeader onLogout={onLogout}>
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Car className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Register Your Car</h1>
            <p className="text-gray-600">Get your free car wash code</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start">
              <AlertCircle className="w-5 h-5 text-red-600 mr-2 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="carRegistration" className="block text-sm font-medium text-gray-700 mb-2">
                Car Registration Number
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="carRegistration"
                  name="carRegistration"
                  value={carRegistration}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors uppercase ${
                    error ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="ABC123 or AB12CDE"
                  maxLength={10}
                />
                <Car className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              </div>
              <p className="mt-1 text-xs text-gray-500">
                Enter your vehicle registration number (license plate)
              </p>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Generating Code...
                </div>
              ) : (
                'Generate Free Wash Code'
              )}
            </button>
          </form>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h3 className="text-sm font-medium text-blue-900 mb-2">How it works:</h3>
            <ul className="text-xs text-blue-700 space-y-1">
              <li>• Enter your car registration number</li>
              <li>• Get a unique 6-digit code</li>
              <li>• Present the code at any participating location</li>
              <li>• One free wash per vehicle</li>
            </ul>
          </div>
        </div>
      </div>
    </Layout>
  );
};