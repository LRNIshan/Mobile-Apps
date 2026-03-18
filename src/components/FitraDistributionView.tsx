import React from 'react';
import { ShieldCheck, UserCheck, UserMinus, ArrowRightLeft, Info } from 'lucide-react';
import { calculateDistribution } from '../utils/distribution';
import { Family } from '../types';

interface FitraDistributionViewProps {
  families: Family[];
}

export default function FitraDistributionView({ families }: FitraDistributionViewProps) {
  const distribution = calculateDistribution(families);
  
  const totalFitra = families.reduce((sum, f) => sum + f.fitraPaid, 0);
  const richFitra = families.filter(f => f.type === 'rich').reduce((sum, f) => sum + f.fitraPaid, 0);
  const poorFitra = families.filter(f => f.type === 'poor').reduce((sum, f) => sum + f.fitraPaid, 0);

  const tenAnnaTotal = richFitra * 0.625;
  const sixAnnaTotal = richFitra * 0.375;

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-emerald-600 p-6 rounded-2xl text-white shadow-lg shadow-emerald-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-white/20 rounded-lg">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <span className="text-emerald-100 font-medium">মোট ফিতরা সংগ্রহ</span>
          </div>
          <div className="text-4xl font-bold">৳{totalFitra.toLocaleString()}</div>
          <div className="mt-2 text-emerald-100 text-sm">সকল পরিবার থেকে সংগৃহীত</div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-emerald-100 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600">
              <UserCheck className="w-6 h-6" />
            </div>
            <span className="text-slate-600 font-medium">১০ আনা (৬২.৫%) বন্টন</span>
          </div>
          <div className="text-3xl font-bold text-emerald-700">৳{tenAnnaTotal.toLocaleString()}</div>
          <div className="mt-2 text-slate-400 text-xs font-medium uppercase tracking-wider">অসহায় পরিবারদের জন্য</div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-orange-100 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-orange-50 rounded-lg text-orange-600">
              <UserMinus className="w-6 h-6" />
            </div>
            <span className="text-slate-600 font-medium">৬ আনা (৩৭.৫%) ফেরত</span>
          </div>
          <div className="text-3xl font-bold text-orange-700">৳{sixAnnaTotal.toLocaleString()}</div>
          <div className="mt-2 text-slate-400 text-xs font-medium uppercase tracking-wider">সচ্ছল পরিবারদের জন্য</div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-emerald-100 overflow-hidden">
        <div className="p-6 border-b border-emerald-50 bg-emerald-50/30 flex justify-between items-center">
          <h3 className="text-lg font-bold text-emerald-900 flex items-center gap-2">
            <ArrowRightLeft className="w-5 h-5" /> বন্টন তালিকা (Distribution List)
          </h3>
          <div className="flex items-center gap-2 text-xs text-slate-500 bg-white px-3 py-1 rounded-full border border-slate-200">
            <Info className="w-3 h-3" /> মোট {families.length} পরিবার
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs font-bold uppercase tracking-wider">
                <th className="px-6 py-4">পরিবারের নাম</th>
                <th className="px-6 py-4">ধরন</th>
                <th className="px-6 py-4">বন্টনের উৎস</th>
                <th className="px-6 py-4 text-right">বন্টনকৃত টাকা</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {distribution.map((item, idx) => (
                <tr key={`${item.familyId}-${item.source}`} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 font-bold text-slate-700">{item.familyName}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      item.type === 'poor' ? 'bg-emerald-100 text-emerald-700' : 'bg-orange-100 text-orange-700'
                    }`}>
                      {item.type === 'poor' ? 'অসহায়' : 'সচ্ছল'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500 italic">
                    {item.source === 'own_fitra' && 'নিজস্ব ফিতরা (১০০%)'}
                    {item.source === 'surplus_10_anna' && '১০ আনা অংশ (৬২.৫%)'}
                    {item.source === 'surplus_6_anna' && '৬ আনা অংশ (৩৭.৫%)'}
                  </td>
                  <td className="px-6 py-4 text-right font-bold text-emerald-700">৳{item.amountToReceive.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
