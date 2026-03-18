import React, { useState } from 'react';
import { Settings as SettingsIcon, Save, RefreshCw } from 'lucide-react';
import { MosqueSettings } from '../types';

interface SettingsViewProps {
  settings: MosqueSettings;
  onUpdateSettings: (settings: MosqueSettings) => void;
}

export default function SettingsView({ settings, onUpdateSettings }: SettingsViewProps) {
  const [localSettings, setLocalSettings] = useState<MosqueSettings>(settings);

  const handleSave = () => {
    onUpdateSettings(localSettings);
    alert('সেটিংস সফলভাবে সংরক্ষিত হয়েছে!');
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="bg-white p-8 rounded-3xl border border-emerald-100 shadow-sm">
        <h2 className="text-2xl font-bold text-emerald-900 mb-8 flex items-center gap-3">
          <SettingsIcon className="w-6 h-6" /> অ্যাপ সেটিংস
        </h2>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-2">মসজিদের নাম</label>
            <input
              type="text"
              value={localSettings.mosqueName}
              onChange={(e) => setLocalSettings({ ...localSettings, mosqueName: e.target.value })}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-2">ফিতরার হার (জনপ্রতি)</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">৳</span>
                <input
                  type="number"
                  value={localSettings.fitraRatePerPerson}
                  onChange={(e) => setLocalSettings({ ...localSettings, fitraRatePerPerson: Number(e.target.value) })}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                />
              </div>
              <p className="mt-2 text-[10px] text-slate-400 font-medium">প্রতি বছর এই হার পরিবর্তন হতে পারে।</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-600 mb-2">ইমামের মাসিক বেতন (ডিফল্ট)</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">৳</span>
                <input
                  type="number"
                  value={localSettings.monthlyImamSalaryDefault}
                  onChange={(e) => setLocalSettings({ ...localSettings, monthlyImamSalaryDefault: Number(e.target.value) })}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                />
              </div>
              <p className="mt-2 text-[10px] text-slate-400 font-medium">নতুন পরিবার যুক্ত করার সময় এটি স্বয়ংক্রিয়ভাবে বসবে।</p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-600 mb-2">নতুন বছর যোগ করুন</label>
            <div className="flex gap-3">
              <input
                type="number"
                placeholder="যেমন: ২০২৭"
                id="new-year-input"
                className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
              />
              <button
                onClick={() => {
                  const input = document.getElementById('new-year-input') as HTMLInputElement;
                  const year = Number(input.value);
                  const years = localSettings.availableYears || [];
                  if (year && !years.includes(year)) {
                    setLocalSettings({
                      ...localSettings,
                      availableYears: [...years, year].sort((a, b) => b - a),
                      currentYear: year
                    });
                    input.value = '';
                  }
                }}
                className="px-6 py-3 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition-all"
              >
                যোগ করুন
              </button>
            </div>
            <p className="mt-2 text-[10px] text-slate-400 font-medium">নতুন বছর যোগ করলে ওই বছরের জন্য নতুন ডাটাবেস তৈরি হবে।</p>
          </div>

          <button
            onClick={handleSave}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-2xl shadow-lg shadow-emerald-100 transition-all flex items-center justify-center gap-2"
          >
            <Save className="w-5 h-5" /> সেটিংস সংরক্ষণ করুন
          </button>
        </div>
      </div>

      <div className="bg-amber-50 p-6 rounded-2xl border border-amber-100 flex gap-4">
        <div className="p-3 bg-amber-100 rounded-xl text-amber-600 h-fit">
          <RefreshCw className="w-6 h-6" />
        </div>
        <div>
          <h4 className="font-bold text-amber-900 mb-1">সতর্কতা</h4>
          <p className="text-sm text-amber-700 leading-relaxed">
            সেটিংস পরিবর্তন করলে তা শুধুমাত্র নতুন ডেটার ক্ষেত্রে প্রযোজ্য হবে। পূর্বের সংরক্ষিত ডেটা অপরিবর্তিত থাকবে। 
            ফিতরার হার পরিবর্তন করলে তা বর্তমান বছরের বন্টন তালিকায় প্রভাব ফেলবে।
          </p>
        </div>
      </div>
    </div>
  );
}
