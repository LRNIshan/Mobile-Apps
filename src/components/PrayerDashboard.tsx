import React, { useState, useEffect } from 'react';
import { Coordinates, CalculationMethod, PrayerTimes, SunnahTimes } from 'adhan';
import { format } from 'date-fns';
import { bn } from 'date-fns/locale';
import { Moon, Sun, Clock, MapPin } from 'lucide-react';

export default function PrayerDashboard() {
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [prayerTimes, setPrayerTimes] = useState<PrayerTimes | null>(null);
  const [sunnahTimes, setSunnahTimes] = useState<SunnahTimes | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        () => {
          // Default to Dhaka coordinates if blocked
          setLocation({ lat: 23.8103, lng: 90.4125 });
        }
      );
    } else {
      setLocation({ lat: 23.8103, lng: 90.4125 });
    }
  }, []);

  useEffect(() => {
    if (location) {
      const coords = new Coordinates(location.lat, location.lng);
      const params = CalculationMethod.Karachi();
      const date = new Date();
      const pt = new PrayerTimes(coords, date, params);
      const st = new SunnahTimes(pt);
      setPrayerTimes(pt);
      setSunnahTimes(st);
    }
  }, [location]);

  if (!prayerTimes) return <div className="p-4 text-center">লোডিং...</div>;

  const prayers = [
    { name: 'ফজর', start: prayerTimes.fajr, end: prayerTimes.sunrise },
    { name: 'যোহর', start: prayerTimes.dhuhr, end: prayerTimes.asr },
    { name: 'আসর', start: prayerTimes.asr, end: prayerTimes.maghrib },
    { name: 'মাগরিব', start: prayerTimes.maghrib, end: prayerTimes.isha },
    { name: 'এশা', start: prayerTimes.isha, end: sunnahTimes.middleOfTheNight },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-emerald-100 overflow-hidden">
      <div className="bg-emerald-600 p-6 text-white">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Clock className="w-5 h-5" /> নামাজের সময়সূচী
          </h2>
          <div className="text-sm opacity-90 flex items-center gap-1">
            <MapPin className="w-4 h-4" /> {location?.lat.toFixed(2)}, {location?.lng.toFixed(2)}
          </div>
        </div>
        <div className="text-4xl font-bold mb-1">
          {format(currentTime, 'hh:mm:ss a')}
        </div>
        <div className="text-emerald-100 text-sm">
          {format(currentTime, 'EEEE, d MMMM, yyyy', { locale: bn })}
        </div>
      </div>

      <div className="p-6 grid grid-cols-2 gap-4">
        <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100">
          <div className="text-emerald-700 text-xs font-bold uppercase tracking-wider mb-1 flex items-center gap-1">
            <Moon className="w-3 h-3" /> সেহরি শেষ সময়
          </div>
          <div className="text-2xl font-bold text-emerald-900">
            {format(prayerTimes.fajr, 'hh:mm a')}
          </div>
        </div>
        <div className="bg-orange-50 p-4 rounded-xl border border-orange-100">
          <div className="text-orange-700 text-xs font-bold uppercase tracking-wider mb-1 flex items-center gap-1">
            <Sun className="w-3 h-3" /> ইফতারের সময়
          </div>
          <div className="text-2xl font-bold text-orange-900">
            {format(prayerTimes.maghrib, 'hh:mm a')}
          </div>
        </div>
      </div>

      <div className="px-6 pb-6">
        <div className="space-y-3">
          <div className="grid grid-cols-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3 mb-1">
            <span>নামাজ</span>
            <span>শুরু</span>
            <span className="text-right">শেষ</span>
          </div>
          {prayers.map((prayer) => (
            <div key={prayer.name} className="grid grid-cols-3 items-center p-3 rounded-lg hover:bg-slate-50 transition-colors border-b border-slate-100 last:border-0">
              <span className="font-medium text-slate-700">{prayer.name}</span>
              <span className="font-bold text-emerald-700">{format(prayer.start, 'hh:mm a')}</span>
              <span className="font-bold text-slate-400 text-right">{format(prayer.end, 'hh:mm a')}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
