import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Users, TrendingUp, ShieldCheck, Settings as SettingsIcon, Menu, X, Heart, Edit2, Clock, Calendar as CalendarIcon } from 'lucide-react';
import PrayerDashboard from './components/PrayerDashboard';
import FamilyForm from './components/FamilyForm';
import ImamSalaryDashboard from './components/ImamSalaryDashboard';
import FitraDistributionView from './components/FitraDistributionView';
import SettingsView from './components/SettingsView';
import DonationView from './components/DonationView';
import { Family, MosqueSettings, Donation, YearlyData } from './types';
import { format } from 'date-fns';
import { bn } from 'date-fns/locale';

export default function App() {
  const [settings, setSettings] = useState<MosqueSettings>(() => {
    const saved = localStorage.getItem('mosque_settings');
    const defaultSettings = {
      fitraRatePerPerson: 80,
      currentYear: 2026,
      mosqueName: 'মসজিদ ব্যবস্থাপনা ও ফিতরা বন্টন',
      monthlyImamSalaryDefault: 500,
      availableYears: [2026]
    };
    if (!saved) return defaultSettings;
    const parsed = JSON.parse(saved);
    return {
      ...defaultSettings,
      ...parsed,
      availableYears: parsed.availableYears || [2026]
    };
  });

  const [families, setFamilies] = useState<Family[]>([]);
  const [donations, setDonations] = useState<Donation[]>([]);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'families' | 'salary' | 'fitra' | 'donations' | 'settings'>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [editingFamily, setEditingFamily] = useState<Family | null>(null);
  const [editingDonation, setEditingDonation] = useState<Donation | null>(null);

  // Load data when year changes
  useEffect(() => {
    const savedData = localStorage.getItem(`mosque_data_${settings.currentYear}`);
    if (savedData) {
      const parsed: YearlyData = JSON.parse(savedData);
      setFamilies((parsed.families || []).map(f => ({
        ...f,
        otherFees: f.otherFees || [],
        donations: f.donations || [],
        editCount: f.editCount || 0
      })));
      setDonations((parsed.donations || []).map(d => ({
        ...d,
        editCount: d.editCount || 0
      })));
    } else {
      setFamilies([]);
      setDonations([]);
    }
  }, [settings.currentYear]);

  // Save data when families or donations change
  useEffect(() => {
    const data: YearlyData = { families, donations };
    localStorage.setItem(`mosque_data_${settings.currentYear}`, JSON.stringify(data));
  }, [families, donations, settings.currentYear]);

  useEffect(() => {
    localStorage.setItem('mosque_settings', JSON.stringify(settings));
  }, [settings]);

  const handleAddFamily = (family: Family) => {
    setFamilies([...families, family]);
  };

  const handleAddDonation = (donation: Donation) => {
    setDonations([...donations, donation]);
  };

  const canEdit = (createdAt: number, editCount: number) => {
    const fiveMinutes = 5 * 60 * 1000;
    const timePassed = Date.now() - createdAt;
    return timePassed < fiveMinutes && (editCount || 0) < 1;
  };

  const handleUpdateFamily = (updatedFamily: Family) => {
    setFamilies(families.map(f => f.id === updatedFamily.id ? { ...updatedFamily, editCount: (f.editCount || 0) + 1 } : f));
    setEditingFamily(null);
  };

  const handleUpdateDonation = (updatedDonation: Donation) => {
    setDonations(donations.map(d => d.id === updatedDonation.id ? { ...updatedDonation, editCount: (d.editCount || 0) + 1 } : d));
    setEditingDonation(null);
  };

  const navItems = [
    { id: 'dashboard', label: 'ড্যাশবোর্ড', icon: LayoutDashboard },
    { id: 'families', label: 'পরিবার তালিকা', icon: Users },
    { id: 'salary', label: 'ইমামের বেতন', icon: TrendingUp },
    { id: 'fitra', label: 'ফিতরা বন্টন', icon: ShieldCheck },
    { id: 'donations', label: 'দান ও রিসিট', icon: Heart },
    { id: 'settings', label: 'সেটিংস', icon: SettingsIcon },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 transition-transform duration-300 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:relative lg:translate-x-0`}>
        <div className="p-6 border-b border-slate-100 flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-100">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-emerald-900 leading-tight">মসজিদ</h1>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">ব্যবস্থাপনা সিস্টেম</p>
          </div>
        </div>

        <nav className="p-4 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id as any);
                setIsSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
                activeTab === item.id
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-100'
                  : 'text-slate-500 hover:bg-slate-50 hover:text-emerald-600'
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-slate-100 space-y-4">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2">বছর নির্বাচন করুন</label>
            <div className="relative">
              <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <select 
                value={settings.currentYear}
                onChange={(e) => setSettings({ ...settings, currentYear: Number(e.target.value) })}
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-emerald-500 appearance-none"
              >
                {(settings.availableYears || [2026]).map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-slate-400 shadow-sm">
              <SettingsIcon className="w-4 h-4" />
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-xs font-bold text-slate-700 truncate">{settings.mosqueName}</p>
              <p className="text-[10px] text-slate-400">ফিতরা হার: ৳{settings.fitraRatePerPerson}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-w-0 overflow-x-hidden">
        <header className="bg-white/80 backdrop-blur-md sticky top-0 z-40 px-4 sm:px-8 py-4 border-b border-slate-200 flex justify-between items-center lg:hidden">
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg">
            {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
          <h2 className="text-lg font-bold text-emerald-900">মসজিদ ব্যবস্থাপনা</h2>
          <div className="w-10" />
        </header>

        <div className="p-4 sm:p-8 max-w-7xl mx-auto space-y-8">
          {activeTab === 'dashboard' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-1">
                <PrayerDashboard />
              </div>
              <div className="lg:col-span-2 space-y-8">
                <div className="bg-white p-8 rounded-3xl border border-emerald-100 shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-8 opacity-5">
                    <ShieldCheck className="w-32 h-32" />
                  </div>
                  <h2 className="text-3xl font-bold text-emerald-900 mb-2">আসসালামু আলাইকুম</h2>
                  <p className="text-slate-500 max-w-md">মসজিদ ব্যবস্থাপনা ও ফিতরা বন্টন সিস্টেমে আপনাকে স্বাগতম। এখান থেকে আপনি ইমামের বেতন এবং ফিতরা সংগ্রহের তথ্য পরিচালনা করতে পারবেন।</p>
                  <div className="mt-8 flex gap-4">
                    <button onClick={() => setActiveTab('families')} className="px-6 py-3 bg-emerald-600 text-white font-bold rounded-xl shadow-lg shadow-emerald-100 hover:bg-emerald-700 transition-all">নতুন তথ্য যোগ করুন</button>
                    <button onClick={() => setActiveTab('donations')} className="px-6 py-3 bg-white text-emerald-600 border border-emerald-100 font-bold rounded-xl hover:bg-emerald-50 transition-all">দান করুন</button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">মোট সংগৃহীত ফিতরা</h3>
                    <div className="text-3xl font-bold text-emerald-700">৳{families.reduce((sum, f) => sum + f.fitraPaid, 0).toLocaleString()}</div>
                  </div>
                  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">মোট ইমামের বেতন</h3>
                    <div className="text-3xl font-bold text-emerald-700">৳{families.reduce((sum, f) => sum + f.imamSalaryPaid, 0).toLocaleString()}</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'families' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-1">
                <FamilyForm 
                  onAddFamily={handleAddFamily} 
                  fitraRate={settings.fitraRatePerPerson} 
                  defaultMonthlySalary={settings.monthlyImamSalaryDefault}
                />
              </div>
              <div className="lg:col-span-2">
                <div className="bg-white rounded-2xl shadow-sm border border-emerald-100 overflow-hidden">
                  <div className="p-6 border-b border-emerald-50 bg-emerald-50/30">
                    <h3 className="text-lg font-bold text-emerald-900 flex items-center gap-2">
                      <Users className="w-5 h-5" /> পরিবার তালিকা
                    </h3>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="bg-slate-50 text-slate-500 text-xs font-bold uppercase tracking-wider">
                          <th className="px-6 py-4">নাম</th>
                          <th className="px-6 py-4">সদস্য</th>
                          <th className="px-6 py-4">ধরন</th>
                          <th className="px-6 py-4">ফিতরা</th>
                          <th className="px-6 py-4">ইমামের বেতন</th>
                          <th className="px-6 py-4">অন্যান্য ফি</th>
                          <th className="px-6 py-4 text-right">অ্যাকশন</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {families.length === 0 ? (
                          <tr>
                            <td colSpan={7} className="px-6 py-12 text-center text-slate-400 italic">কোন তথ্য পাওয়া যায়নি</td>
                          </tr>
                        ) : (
                          families.map((f) => (
                            <tr key={f.id} className="hover:bg-slate-50/50 transition-colors">
                              <td className="px-6 py-4 font-bold text-slate-700">{f.name}</td>
                              <td className="px-6 py-4 text-slate-500">{f.membersCount} জন</td>
                              <td className="px-6 py-4">
                                <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                  f.type === 'poor' ? 'bg-emerald-100 text-emerald-700' : 'bg-orange-100 text-orange-700'
                                }`}>
                                  {f.type === 'poor' ? 'অসহায়' : 'সচ্ছল'}
                                </span>
                              </td>
                              <td className="px-6 py-4 font-bold text-emerald-700">৳{f.fitraPaid}</td>
                              <td className="px-6 py-4 font-bold text-emerald-700">৳{f.imamSalaryPaid}</td>
                              <td className="px-6 py-4 font-bold text-emerald-700">৳{(f.otherFees || []).reduce((sum, fee) => sum + fee.amount, 0)}</td>
                              <td className="px-6 py-4 text-right">
                                {canEdit(f.createdAt, f.editCount) && (
                                  <button 
                                    onClick={() => setEditingFamily(f)}
                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                                    title="সংশোধন করুন (৫ মিনিট সময়)"
                                  >
                                    <Edit2 className="w-4 h-4" />
                                  </button>
                                )}
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'salary' && (
            <ImamSalaryDashboard families={families} />
          )}

          {activeTab === 'fitra' && (
            <FitraDistributionView families={families} />
          )}

          {activeTab === 'donations' && (
            <DonationView 
              donations={donations} 
              onAddDonation={handleAddDonation} 
              canEdit={canEdit}
              onEditDonation={setEditingDonation}
            />
          )}

          {activeTab === 'settings' && (
            <SettingsView settings={settings} onUpdateSettings={setSettings} />
          )}
        </div>

        {/* Edit Family Modal */}
        {editingFamily && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                  <Edit2 className="w-5 h-5 text-blue-600" /> তথ্য সংশোধন
                </h3>
                <button onClick={() => setEditingFamily(null)} className="p-2 text-slate-400 hover:text-slate-600 rounded-full">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6 max-h-[80vh] overflow-y-auto">
                <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 mb-6 flex items-start gap-3">
                  <Clock className="w-5 h-5 text-blue-600 mt-0.5" />
                  <p className="text-xs text-blue-700 leading-relaxed">
                    সংশোধন করার জন্য আপনার হাতে ৫ মিনিট সময় আছে। আপনি শুধুমাত্র একবারই তথ্য সংশোধন করতে পারবেন।
                  </p>
                </div>
                <FamilyForm 
                  onAddFamily={handleUpdateFamily}
                  fitraRate={settings.fitraRatePerPerson}
                  defaultMonthlySalary={settings.monthlyImamSalaryDefault}
                  initialData={editingFamily}
                />
              </div>
            </div>
          </div>
        )}

        {/* Edit Donation Modal (Simplified for this example) */}
        {editingDonation && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                  <Edit2 className="w-5 h-5 text-blue-600" /> দান সংশোধন
                </h3>
                <button onClick={() => setEditingDonation(null)} className="p-2 text-slate-400 hover:text-slate-600 rounded-full">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6">
                <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 mb-6 flex items-start gap-3">
                  <Clock className="w-5 h-5 text-blue-600 mt-0.5" />
                  <p className="text-xs text-blue-700 leading-relaxed">
                    সংশোধন করার জন্য আপনার হাতে ৫ মিনিট সময় আছে।
                  </p>
                </div>
                <form onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);
                  handleUpdateDonation({
                    ...editingDonation,
                    donorName: formData.get('donorName') as string,
                    amount: Number(formData.get('amount')),
                    purpose: formData.get('purpose') as string
                  });
                }} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-2">দাতার নাম</label>
                    <input name="donorName" defaultValue={editingDonation.donorName} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500" required />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-2">পরিমাণ</label>
                    <input name="amount" type="number" defaultValue={editingDonation.amount} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500" required />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-2">উদ্দেশ্য</label>
                    <input name="purpose" defaultValue={editingDonation.purpose} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500" required />
                  </div>
                  <button type="submit" className="w-full bg-emerald-600 text-white font-bold py-3 rounded-xl">সংরক্ষণ করুন</button>
                </form>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

