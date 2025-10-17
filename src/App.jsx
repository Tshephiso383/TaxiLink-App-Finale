import React, { useState, useEffect } from 'react';
import { Phone, MessageSquare, Wifi, WifiOff, Send, Clock, MapPin, User, Star, ArrowLeft, Navigation, CreditCard, Calendar, Users, Zap, Shield } from 'lucide-react';

interface Driver {
  id: number;
  name: string;
  rating: number;
  phone: string;
  distance: string;
  eta: string;
  price: string;
}

interface Booking {
  id: number;
  from: string;
  to: string;
  status: string;
  method: string;
  price: string;
  driver: string;
}

const TaxiLinkApp = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [currentView, setCurrentView] = useState('home');
  const [bookingMode, setBookingMode] = useState('online');
  
  const [onlineBooking, setOnlineBooking] = useState({
    pickup: '',
    destination: '',
    time: 'now',
    passengers: 1,
    selectedDriver: null as Driver | null
  });

  const [offlineBooking, setOfflineBooking] = useState({
    pickup: '',
    destination: '',
    time: 'now',
    passengers: '1'
  });

  const [ussdStep, setUssdStep] = useState(0);
  
  const [drivers] = useState<Driver[]>([
    { id: 1, name: 'Thabo Mthembu', rating: 4.8, phone: '082 123 4567', distance: '2.1 km', eta: '3 min', price: 'R15' },
    { id: 2, name: 'Sarah Ndlovu', rating: 4.9, phone: '072 987 6543', distance: '3.2 km', eta: '5 min', price: 'R18' },
    { id: 3, name: 'John Sithole', rating: 4.7, phone: '083 456 7890', distance: '1.8 km', eta: '2 min', price: 'R12' }
  ]);

  const [bookingHistory] = useState<Booking[]>([
    { id: 1, from: 'Pretoria CBD', to: 'Hatfield', status: 'completed', method: 'Online', price: 'R15', driver: 'Thabo M.' },
    { id: 2, from: 'Sandton', to: 'Rosebank', status: 'active', method: 'SMS', price: 'R25', driver: 'Sarah N.' },
    { id: 3, from: 'Tuks', to: 'Menlyn', status: 'completed', method: 'USSD', price: 'R20', driver: 'John S.' }
  ]);

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
      {/* Header */}
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
        {/* Hero Section */}
        <div className="text-center text-white mb-12">
          <h2 className="text-4xl md:text-6xl font-bold mb-4">Your Ride, Your Way</h2>
          <p className="text-xl mb-2">Book online, via SMS, or USSD - even without data!</p>
          <p className="text-lg opacity-90">Connecting South Africa, one ride at a time</p>
        </div>

        {/* Booking Options */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {/* Online Booking */}
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
            <ul className="text-sm space-y-1">
              <li className="flex items-center gap-2"><Zap className="h-3 w-3 text-green-500" /> Instant booking</li>
              <li className="flex items-center gap-2"><MapPin className="h-3 w-3 text-blue-500" /> Live tracking</li>
              <li className="flex items-center gap-2"><CreditCard className="h-3 w-3 text-purple-500" /> Multiple payment options</li>
            </ul>
          </div>

          {/* SMS Booking */}
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
            <ul className="text-sm space-y-1">
              <li className="flex items-center gap-2"><Shield className="h-3 w-3 text-green-500" /> No data required</li>
              <li className="flex items-center gap-2"><Phone className="h-3 w-3 text-blue-500" /> Works on any phone</li>
              <li className="flex items-center gap-2"><Clock className="h-3 w-3 text-purple-500" /> Quick confirmation</li>
            </ul>
          </div>

          {/* USSD Booking */}
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
            <ul className="text-sm space-y-1">
              <li className="flex items-center gap-2"><Shield className="h-3 w-3 text-green-500" /> 100% free</li>
              <li className="flex items-center gap-2"><Users className="h-3 w-3 text-blue-500" /> Universal access</li>
              <li className="flex items-center gap-2"><Navigation className="h-3 w-3 text-purple-500" /> Step-by-step guide</li>
            </ul>
          </div>
        </div>

        {/* Recent Bookings */}
        <div className="bg-white rounded-xl shadow-xl p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold">Recent Bookings</h3>
            <button 
              onClick={() => setCurrentView('history')}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              View All
            </button>
          </div>
          <div className="space-y-4">
            {bookingHistory.slice(0, 2).map(booking => (
              <div key={booking.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-4">
                  <div className={`w-3 h-3 rounded-full ${booking.status === 'completed' ? 'bg-green-500' : 'bg-blue-500'}`}></div>
                  <div>
                    <p className="font-medium">{booking.from} → {booking.to}</p>
                    <p className="text-sm text-gray-600">{booking.driver} • via {booking.method}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold">{booking.price}</p>
                  <p className="text-sm text-gray-600 capitalize">{booking.status}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Active Drivers', value: '1,250+', icon: Users },
            { label: 'Cities Covered', value: '15', icon: MapPin },
            { label: 'Rides Completed', value: '50K+', icon: Navigation },
            { label: 'User Rating', value: '4.9★', icon: Star }
          ].map((stat, idx) => (
            <div key={idx} className="bg-white rounded-lg shadow-lg p-4 text-center">
              <stat.icon className="h-6 w-6 mx-auto mb-2 text-purple-600" />
              <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
              <p className="text-sm text-gray-600">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const BookingPage = () => (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-600 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button 
            onClick={() => setCurrentView('home')}
            className="bg-white rounded-lg p-3 shadow-lg hover:shadow-xl transition-all"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="text-2xl font-bold text-white">
            {bookingMode === 'online' && 'Online Booking'}
            {bookingMode === 'sms' && 'SMS Booking'}
            {bookingMode === 'ussd' && 'USSD Booking'}
          </h1>
          <div></div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Booking Interface */}
          <div className="lg:col-span-2">
            {bookingMode === 'online' && <OnlineBookingInterface />}
            {bookingMode === 'sms' && <SMSBookingInterface />}
            {bookingMode === 'ussd' && <USSDInterface />}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <BookingSidebar />
          </div>
        </div>
      </div>
    </div>
  );

  const OnlineBookingInterface = () => (
    <div className="bg-white rounded-lg shadow-xl p-6">
      {onlineBooking.selectedDriver ? (
        // Driver Selection View
        <div>
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-lg mb-6">
            <h3 className="text-xl font-bold mb-2">Pretoria CBD → Hatfield</h3>
            <div className="flex gap-6 text-sm">
              <span className="bg-white bg-opacity-20 px-3 py-1 rounded">R15</span>
              <span className="bg-white bg-opacity-20 px-3 py-1 rounded">25 min</span>
              <span className="bg-white bg-opacity-20 px-3 py-1 rounded">8 km</span>
            </div>
          </div>

          <h4 className="text-lg font-bold mb-4">Available Drivers</h4>
          <div className="space-y-3 mb-6">
            {drivers.map(driver => (
              <div 
                key={driver.id}
                onClick={() => setOnlineBooking({...onlineBooking, selectedDriver: driver})}
                className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  onlineBooking.selectedDriver?.id === driver.id 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold">{driver.name}</p>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span>{driver.rating}</span>
                      <span>•</span>
                      <span>{driver.distance}</span>
                      <span>•</span>
                      <span>ETA: {driver.eta}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-blue-600">{driver.price}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-3">
            <button 
              onClick={() => setOnlineBooking({...onlineBooking, selectedDriver: null})}
              className="flex-1 bg-gray-100 text-gray-800 py-3 px-4 rounded-lg hover:bg-gray-200 transition duration-200"
            >
              Back
            </button>
            <button className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition duration-200">
              Confirm Booking
            </button>
          </div>
        </div>
      ) : (
        // Booking Form
        <div>
          <h3 className="text-xl font-bold mb-6">Book Your Ride</h3>
          
          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-medium mb-2">Pickup Location</label>
              <input
                type="text"
                value={onlineBooking.pickup}
                onChange={(e) => setOnlineBooking({...onlineBooking, pickup: e.target.value})}
                placeholder="Enter pickup location"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Destination</label>
              <input
                type="text"
                value={onlineBooking.destination}
                onChange={(e) => setOnlineBooking({...onlineBooking, destination: e.target.value})}
                placeholder="Where are you going?"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">When</label>
                <select
                  value={onlineBooking.time}
                  onChange={(e) => setOnlineBooking({...onlineBooking, time: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="now">Now</option>
                  <option value="30min">In 30 min</option>
                  <option value="1hour">In 1 hour</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Passengers</label>
                <select
                  value={onlineBooking.passengers}
                  onChange={(e) => setOnlineBooking({...onlineBooking, passengers: parseInt(e.target.value)})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value={1}>1 person</option>
                  <option value={2}>2 people</option>
                  <option value={3}>3 people</option>
                  <option value={4}>4+ people</option>
                </select>
              </div>
            </div>
          </div>

          <button 
            onClick={() => {
              if (onlineBooking.pickup && onlineBooking.destination) {
                setOnlineBooking({...onlineBooking, selectedDriver: drivers[0]});
              }
            }}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition duration-200 flex items-center justify-center gap-2"
            disabled={!onlineBooking.pickup || !onlineBooking.destination}
          >
            <Navigation className="h-4 w-4" />
            Find Drivers
          </button>
        </div>
      )}
    </div>
  );

  const SMSBookingInterface = () => (
    <div className="bg-white rounded-lg shadow-xl p-6">
      <div className="flex items-center gap-3 mb-6">
        <MessageSquare className="h-6 w-6 text-blue-600" />
        <h3 className="text-xl font-bold">SMS Booking</h3>
        <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded">Free SMS</span>
      </div>

      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-sm font-medium mb-2">Pickup Location</label>
          <input
            type="text"
            value={offlineBooking.pickup}
            onChange={(e) => setOfflineBooking({...offlineBooking, pickup: e.target.value})}
            placeholder="e.g., Pretoria CBD, Taxi Rank"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">Destination</label>
          <input
            type="text"
            value={offlineBooking.destination}
            onChange={(e) => setOfflineBooking({...offlineBooking, destination: e.target.value})}
            placeholder="e.g., Hatfield, University"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Time</label>
            <select
              value={offlineBooking.time}
              onChange={(e) => setOfflineBooking({...offlineBooking, time: e.target.value})}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="now">Now</option>
              <option value="30min">In 30 min</option>
              <option value="1hour">In 1 hour</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Passengers</label>
            <select
              value={offlineBooking.passengers}
              onChange={(e) => setOfflineBooking({...offlineBooking, passengers: e.target.value})}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="1">1 person</option>
              <option value="2">2-3 people</option>
              <option value="4">4+ people</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg mb-4">
        <h4 className="font-medium mb-2">SMS Command:</h4>
        <div className="bg-white p-3 border border-gray-200 rounded font-mono text-sm">
          {generateSMSCommand()}
        </div>
        <p className="text-xs text-gray-600 mt-2">
          Send to: <strong>40404</strong> or dial <strong>*120*8294#</strong>
        </p>
      </div>

      <button className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition duration-200 flex items-center justify-center gap-2">
        <Send className="h-4 w-4" />
        Send SMS Booking
      </button>
    </div>
  );

  const USSDInterface = () => (
    <div className="bg-white rounded-lg shadow-xl p-6">
      <div className="flex items-center gap-3 mb-6">
        <Phone className="h-6 w-6 text-green-600" />
        <h3 className="text-xl font-bold">USSD Menu</h3>
        <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">100% Free</span>
      </div>

      <div className="bg-black text-green-400 p-4 rounded-lg font-mono text-sm mb-6 min-h-64">
        <div className="mb-4">
          <div className="flex justify-between text-xs">
            <span>TaxiLink USSD</span>
            <span>Step {ussdStep + 1}/6</span>
          </div>
          <hr className="border-green-600 my-2" />
        </div>
        
        <div className="whitespace-pre-line mb-4">
          {ussdSteps[ussdStep]?.text}
        </div>
        
        {!ussdSteps[ussdStep]?.final && (
          <div className="mt-4">
            <span className="text-yellow-400">Reply: </span>
            <span className="bg-green-900 px-1">_</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-3 gap-2 mb-4">
        {['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#'].map((key) => (
          <button
            key={key}
            onClick={() => {
              if (ussdStep < ussdSteps.length - 1) {
                setUssdStep(ussdStep + 1);
              }
            }}
            className="bg-gray-200 hover:bg-gray-300 p-3 rounded-lg font-semibold transition duration-150"
          >
            {key}
          </button>
        ))}
      </div>

      <div className="space-y-2 text-sm text-gray-600">
        <p><strong>Dial:</strong> *120*8294# (Free from all networks)</p>
        <p><strong>Alternative:</strong> *134*8294# (MTN) | *140*8294# (Vodacom)</p>
      </div>
    </div>
  );

  const BookingSidebar = () => (
    <>
      <div className="bg-white rounded-lg shadow-xl p-6">
        <h3 className="font-bold text-lg mb-4">Quick Tips</h3>
        <div className="space-y-3 text-sm">
          <div className="flex items-start gap-3">
            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-bold">1</span>
            <p>Use landmarks for better pickup accuracy</p>
          </div>
          <div className="flex items-start gap-3">
            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-bold">2</span>
            <p>SMS works even with low network signal</p>
          </div>
          <div className="flex items-start gap-3">
            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-bold">3</span>
            <p>USSD is completely free on all networks</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-xl p-6">
        <h3 className="font-bold text-lg mb-4">Favorite Locations</h3>
        <div className="space-y-2">
          {['Home - Hatfield', 'Work - Pretoria CBD', 'University - Tuks'].map((location, idx) => (
            <button
              key={idx}
              className="w-full text-left p-2 hover:bg-gray-100 rounded transition duration-150 text-sm"
              onClick={() => {
                const [name, place] = location.split(' - ');
                if (bookingMode === 'online') {
                  setOnlineBooking({...onlineBooking, pickup: place});
                } else {
                  setOfflineBooking({...offlineBooking, pickup: place});
                }
              }}
            >
              <MapPin className="h-3 w-3 inline mr-2" />
              {location}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-xl p-6">
        <h3 className="font-bold text-lg mb-4">Emergency Contact</h3>
        <div className="space-y-2 text-sm">
          <p><strong>Call:</strong> 0860 TAXILINK</p>
          <p><strong>WhatsApp:</strong> 072 123 4567</p>
          <p><strong>SMS:</strong> "URGENT [location]" to 40404</p>
        </div>
      </div>
    </>
  );

  const HistoryPage = () => (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-600 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <button 
            onClick={() => setCurrentView('home')}
            className="bg-white rounded-lg p-3 shadow-lg hover:shadow-xl transition-all"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="text-2xl font-bold text-white">Booking History</h1>
          <div></div>
        </div>

        <div className="bg-white rounded-lg shadow-xl p-6">
          <div className="space-y-4">
            {bookingHistory.map(booking => (
              <div key={booking.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex items-center gap-4">
                  <div className={`w-4 h-4 rounded-full ${
                    booking.status === 'completed' ? 'bg-green-500' : 
                    booking.status === 'active' ? 'bg-blue-500' : 'bg-gray-400'
                  }`}></div>
                  <div>
                    <p className="font-medium text-lg">{booking.from} → {booking.to}</p>
                    <p className="text-sm text-gray-600">{booking.driver} • via {booking.method}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-lg">{booking.price}</p>
                  <p className={`text-sm font-medium capitalize ${
                    booking.status === 'completed' ? 'text-green-600' : 
                    booking.status === 'active' ? 'text-blue-600' : 'text-gray-600'
                  }`}>
                    {booking.status}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  // Main render logic
  if (currentView === 'booking') return <BookingPage />;
  if (currentView === 'history') return <HistoryPage />;
  return <HomePage />;
};

export default TaxiLinkApp;
