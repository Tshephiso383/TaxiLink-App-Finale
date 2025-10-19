import React, { useState, useEffect } from 'react';
import { Phone, MessageSquare, Wifi, WifiOff, Send, Clock, MapPin, User, Star, ArrowLeft, Navigation, CreditCard, Calendar, Users, Zap, Shield } from 'lucide-react';

const TaxiLinkApp = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [currentView, setCurrentView] = useState('home');
  const [bookingMode, setBookingMode] = useState('online');
  
  const [onlineBooking, setOnlineBooking] = useState({
    pickup: '',
    destination: '',
    time: 'now',
    passengers: 1,
    selectedDriver: null
  });

  const [offlineBooking, setOfflineBooking] = useState({
    pickup: '',
    destination: '',
    time: 'now',
    passengers: '1'
  });

  const [ussdStep, setUssdStep] = useState(0);
  
  const drivers = [
    { id: 1, name: 'Thabo Mthembu', rating: 4.8, phone: '082 123 4567', distance: '2.1 km', eta: '3 min', price: 'R15' },
    { id: 2, name: 'Sarah Ndlovu', rating: 4.9, phone: '072 987 6543', distance: '3.2 km', eta: '5 min', price: 'R18' },
    { id: 3, name: 'John Sithole', rating: 4.7, phone: '083 456 7890', distance: '1.8 km', eta: '2 min', price: 'R12' }
  ];

  const bookingHistory = [
    { id: 1, from: 'Pretoria CBD', to: 'Hatfield', status: 'completed', method: 'Online', price: 'R15', driver: 'Thabo M.' },
    { id: 2, from: 'Sandton', to: 'Rosebank', status: 'active', method: 'SMS', price: 'R25', driver: 'Sarah N.' },
    { id: 3, from: 'Tuks', to: 'Menlyn', status: 'completed', method: 'USSD', price: 'R20', driver: 'John S.' }
  ];

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const generateSMSCommand = () => {
    const { pickup, destination, time, passengers } = offlineBooking;
    if (!pickup || !destination) return 'Please fill in pickup and destination';
    return `BOOK ${pickup} TO ${destination} ${time.toUpperCase()} ${passengers}P`;
  };

  const ussdSteps = [
    { text: "Welcome to TaxiLink\n1. Book a ride\n2. Check booking\n3. Cancel ride\n4. Help", options: ['1', '2', '3', '4'] },
    { text: "Enter pickup location:", input: true },
    { text: "Enter destination:", input: true },
    { text: "When do you need the ride?\n1. Now\n2. In 30 min\n3. In 1 hour", options: ['1', '2', '3'] },
    { text: "How many passengers?\n1. 1 person\n2. 2-3 people\n3. 4+ people", options: ['1', '2', '3'] },
    { text: "Booking confirmed!\nDriver: Thabo M.\nETA: 5 minutes\nPrice: R15\n\nThank you for using TaxiLink!", final: true }
  ];

  const HomePage = () => (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-600">
      <div className="bg-white shadow-lg">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-800">TaxiLink</h1>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                {isOnline ? (
                  <><Wifi className="h-4 w-4 text-green-600" /><span className="text-sm text-green-600">Online</span></>
                ) : (
                  <><WifiOff className="h-4 w-4 text-red-600" /><span className="text-sm text-red-600">Offline</span></>
                )}
              </div>
              <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
                <User className="h-4 w-4 text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="text-center text-white mb-12">
          <h2 className="text-4xl md:text-6xl font-bold mb-4">Your Ride, Your Way</h2>
          <p className="text-xl mb-2">Book online, via SMS, or USSD - even without data!</p>
          <p className="text-lg opacity-90">Connecting South Africa, one ride at a time</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div 
            onClick={() => { setBookingMode('online'); setCurrentView('booking'); }}
            className="bg-white rounded-xl shadow-xl p-6 cursor-pointer hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
          >
            <div className="flex items-center justify-between mb-4">
              <Wifi className="h-8 w-8 text-blue-600" />
              {isOnline && <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">Available</span>}
            </div>
            <h3 className="text-xl font-bold mb-2">Online Booking</h3>
            <p className="text-gray-600 mb-4">Full-featured booking with real-time tracking, driver selection, and instant confirmations.</p>
          </div>

          <div 
            onClick={() => { setBookingMode('sms'); setCurrentView('booking'); }}
            className="bg-white rounded-xl shadow-xl p-6 cursor-pointer hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
          >
            <div className="flex items-center justify-between mb-4">
              <MessageSquare className="h-8 w-8 text-green-600" />
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">Free SMS</span>
            </div>
            <h3 className="text-xl font-bold mb-2">SMS Booking</h3>
            <p className="text-gray-600 mb-4">Book via text message - perfect when data is expensive or unavailable.</p>
          </div>

          <div 
            onClick={() => { setBookingMode('ussd'); setCurrentView('booking'); }}
            className="bg-white rounded-xl shadow-xl p-6 cursor-pointer hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
          >
            <div className="flex items-center justify-between mb-4">
              <Phone className="h-8 w-8 text-orange-600" />
              <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-xs">Completely Free</span>
            </div>
            <h3 className="text-xl font-bold mb-2">USSD Menu</h3>
            <p className="text-gray-600 mb-4">Interactive menu system - dial *120*8294# from any phone, even basic phones.</p>
          </div>
        </div>
      </div>
    </div>
  );

  if (currentView === 'booking') return <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-600 p-4"><div className="max-w-4xl mx-auto"><button onClick={() => setCurrentView('home')} className="bg-white rounded-lg p-3 shadow-lg mb-4"><ArrowLeft className="h-5 w-5" /></button><div className="bg-white rounded-lg shadow-xl p-6"><h2 className="text-2xl font-bold mb-4">{bookingMode === 'online' && 'Online Booking'}{bookingMode === 'sms' && 'SMS Booking'}{bookingMode === 'ussd' && 'USSD Booking'}</h2><p className="text-gray-600">Booking interface coming soon...</p></div></div></div>;
  
  return <HomePage />;
};

export default TaxiLinkApp;
