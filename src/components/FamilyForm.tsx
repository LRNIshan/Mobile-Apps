import React, { useState } from 'react';
import { Plus, User, Users, DollarSign, Wallet, CheckCircle2, Trash2 } from 'lucide-react';
import { Family, OtherFee } from '../types';

interface FamilyFormProps {
  onAddFamily: (family: Family) => void;
  fitraRate: number;
  defaultMonthlySalary: number;
  initialData?: Family | null;
}

const OTHER_FEE_TYPES = [
  'তারাবি ফি',
  'এতেকাব ফি',
  'উন্নয়ন ফি',
  'কারেন্ট বিল',
  'মসজিদ রক্ষণাবেক্ষণ',
  'অন্যান্য'
];

export default function FamilyForm({ onAddFamily, fitraRate, defaultMonthlySalary, initialData }: FamilyFormProps) {
  const [name, setName] = useState(initialData?.name || '');
  const [membersCount, setMembersCount] = useState(initialData?.membersCount || 1);
  const [type, setType] = useState<'rich' | 'poor'>(initialData?.type || 'poor');
  const [monthlySalary, setMonthlySalary] = useState(initialData?.monthlyImamSalary || defaultMonthlySalary);
  
  const [selectedFeeType, setSelectedFeeType] = useState(OTHER_FEE_TYPES[0]);
  const [feeAmount, setFeeAmount] = useState(0);
  const [otherFees, setOtherFees] = useState<OtherFee[]>(initialData?.otherFees || []);

  const handleAddFee = () => {
    if (feeAmount <= 0) return;
    const newFee: OtherFee = {
      id: crypto.randomUUID(),
      type: selectedFeeType,
      amount: feeAmount,
      date: Date.now()
    };
    setOtherFees([...otherFees, newFee]);
    setFeeAmount(0);
  };

  const removeFee = (id: string) => {
    setOtherFees(otherFees.filter(f => f.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    const newFamily: Family = {
      id: initialData?.id || crypto.randomUUID(),
      name,
      membersCount,
      type,
      fitraPaid: membersCount * fitraRate,
      monthlyImamSalary: monthlySalary,
      imamSalaryPaid: monthlySalary * 12, // Automated 12 months calculation
      otherFees,
      donations: initialData?.donations || [],
      createdAt: initialData?.createdAt || Date.now(),
      editCount: initialData?.editCount || 0,
    };

    onAddFamily(newFamily);
    if (!initialData) {
      setName('');
      setMembersCount(1);
      setMonthlySalary(defaultMonthlySalary);
      setOtherFees([]);
    }
  };

  return (
    <div className="bg-white p-8 rounded-3xl shadow-sm border border-emerald-100">
      <h3 className="text-xl font-bold text-emerald-900 mb-8 flex items-center gap-3">
        <Plus className="w-6 h-6" /> নতুন তথ্য যুক্ত করুন
      </h3>
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Info */}
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-2">পরিবারের প্রধানের নাম</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                placeholder="নাম লিখুন"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-2">সদস্য সংখ্যা</label>
              <div className="relative">
                <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="number"
                  min="1"
                  value={membersCount}
                  onChange={(e) => setMembersCount(Number(e.target.value))}
                  className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-2">পরিবারের ধরন</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as 'rich' | 'poor')}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
              >
                <option value="poor">অসহায় (Poor)</option>
                <option value="rich">সচ্ছল (Rich)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Financial Info */}
        <div className="p-6 bg-emerald-50/50 rounded-2xl border border-emerald-100 space-y-6">
          <h4 className="font-bold text-emerald-900 text-sm flex items-center gap-2">
            <DollarSign className="w-4 h-4" /> আর্থিক তথ্য
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-emerald-700 mb-2">ইমামের মাসিক বেতন (৳)</label>
              <input
                type="number"
                value={monthlySalary}
                onChange={(e) => setMonthlySalary(Number(e.target.value))}
                className="w-full px-4 py-3 bg-white border border-emerald-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all font-bold text-emerald-900"
              />
              <p className="mt-2 text-[10px] text-emerald-600 font-medium">বার্ষিক মোট: ৳{monthlySalary * 12}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-emerald-700 mb-2">মোট ফিতরা (৳)</label>
              <div className="relative">
                <Wallet className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-400" />
                <input
                  type="number"
                  value={membersCount * fitraRate}
                  disabled
                  className="w-full pl-12 pr-4 py-3 bg-white border border-emerald-200 rounded-xl text-emerald-700 font-bold"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Other Fees Section */}
        <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 space-y-6">
          <h4 className="font-bold text-slate-700 text-sm flex items-center gap-2">
            <Plus className="w-4 h-4" /> অন্যান্য ফি
          </h4>
          
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
            <div className="sm:col-span-7">
              <select
                value={selectedFeeType}
                onChange={(e) => setSelectedFeeType(e.target.value)}
                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all text-sm"
              >
                {OTHER_FEE_TYPES.map(type => <option key={type} value={type}>{type}</option>)}
              </select>
            </div>
            <div className="sm:col-span-3">
              <input
                type="number"
                value={feeAmount}
                onChange={(e) => setFeeAmount(Number(e.target.value))}
                placeholder="টাকা"
                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all text-sm"
              />
            </div>
            <div className="sm:col-span-2">
              <button
                type="button"
                onClick={handleAddFee}
                className="w-full h-full bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-all flex items-center justify-center p-3"
              >
                <Plus className="w-6 h-6" />
              </button>
            </div>
          </div>

          {otherFees.length > 0 && (
            <div className="space-y-2">
              {otherFees.map(fee => (
                <div key={fee.id} className="flex justify-between items-center p-3 bg-white rounded-xl border border-slate-100 text-sm">
                  <span className="text-slate-600 font-medium">{fee.type}</span>
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-emerald-700">৳{fee.amount}</span>
                    <button type="button" onClick={() => removeFee(fee.id)} className="text-red-400 hover:text-red-600">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-2xl shadow-lg shadow-emerald-200 transition-all flex items-center justify-center gap-3"
        >
          <CheckCircle2 className="w-6 h-6" /> তথ্য সংরক্ষণ করুন
        </button>
      </form>
    </div>
  );
}
