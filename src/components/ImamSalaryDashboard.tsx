import React from 'react';
import { TrendingUp, Calendar, DollarSign, PieChart, Wallet } from 'lucide-react';
import { Family } from '../types';

interface ImamSalaryDashboardProps {
  families: Family[];
}

export default function ImamSalaryDashboard({ families }: ImamSalaryDashboardProps) {
  const totalSalary = families.reduce((sum, f) => sum + f.imamSalaryPaid, 0);
  const monthlySalary = totalSalary / 12;

  const totalOtherFees = families.reduce((sum, f) => 
    sum + (f.otherFees || []).reduce((fSum, fee) => fSum + fee.amount, 0), 0
  );

  const months = [
    'জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন',
    'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'
  ];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Imam Salary Card */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-emerald-100">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-lg font-bold text-emerald-900 flex items-center gap-2">
              <TrendingUp className="w-5 h-5" /> ইমামের বেতন ড্যাশবোর্ড
            </h3>
            <div className="bg-emerald-50 px-4 py-2 rounded-full text-emerald-700 font-bold text-sm flex items-center gap-2">
              <DollarSign className="w-4 h-4" /> মোট: ৳{totalSalary.toLocaleString()}
            </div>
          </div>

          <div className="bg-emerald-600 p-6 rounded-2xl text-white shadow-lg shadow-emerald-100 mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-white/20 rounded-lg">
                <Calendar className="w-6 h-6" />
              </div>
              <span className="text-emerald-100 font-medium">মাসিক গড় বেতন</span>
            </div>
            <div className="text-4xl font-bold">৳{monthlySalary.toFixed(2)}</div>
            <div className="mt-2 text-emerald-100 text-sm">বার্ষিক মোট সংগ্রহ থেকে হিসাবকৃত</div>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
            {months.map((month) => (
              <div key={month} className="p-3 rounded-xl border border-slate-100 bg-slate-50/50 text-center">
                <div className="text-[10px] text-slate-400 uppercase font-bold mb-1">{month}</div>
                <div className="text-sm font-bold text-emerald-700">৳{monthlySalary.toFixed(0)}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Other Fees Card */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-lg font-bold text-slate-700 flex items-center gap-2">
              <Wallet className="w-5 h-5" /> অন্যান্য ফি ড্যাশবোর্ড
            </h3>
            <div className="bg-slate-50 px-4 py-2 rounded-full text-slate-600 font-bold text-sm flex items-center gap-2">
              <DollarSign className="w-4 h-4" /> মোট: ৳{totalOtherFees.toLocaleString()}
            </div>
          </div>

          <div className="bg-slate-800 p-6 rounded-2xl text-white shadow-lg shadow-slate-200 mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-white/20 rounded-lg">
                <PieChart className="w-6 h-6" />
              </div>
              <span className="text-slate-300 font-medium">অন্যান্য ফি সংগ্রহ</span>
            </div>
            <div className="text-4xl font-bold">৳{totalOtherFees.toLocaleString()}</div>
            <div className="mt-2 text-slate-400 text-sm">ইমামের বেতন ব্যতীত অন্যান্য সকল ফি</div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-slate-600 font-medium">মোট পরিবার সংখ্যা:</span>
              <span className="font-bold text-slate-900">{families.length} টি</span>
            </div>
            <div className="flex justify-between items-center p-4 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-slate-600 font-medium">গড় সংগ্রহ (পরিবার প্রতি):</span>
              <span className="font-bold text-slate-900">৳{(totalOtherFees / (families.length || 1)).toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
