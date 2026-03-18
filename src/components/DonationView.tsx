import React, { useState } from 'react';
import { Heart, User, DollarSign, FileText, Download, Printer, X, Edit2 } from 'lucide-react';
import { Donation } from '../types';
import { format } from 'date-fns';
import { bn } from 'date-fns/locale';

interface DonationViewProps {
  donations: Donation[];
  onAddDonation: (donation: Donation) => void;
  canEdit: (createdAt: number, editCount: number) => boolean;
  onEditDonation: (donation: Donation) => void;
}

export default function DonationView({ donations, onAddDonation, canEdit, onEditDonation }: DonationViewProps) {
  const [donorName, setDonorName] = useState('');
  const [amount, setAmount] = useState(0);
  const [purpose, setPurpose] = useState('মসজিদ উন্নয়ন');
  const [selectedDonation, setSelectedDonation] = useState<Donation | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!donorName || amount <= 0) return;

    const newDonation: Donation = {
      id: crypto.randomUUID(),
      donorName,
      amount,
      purpose,
      date: Date.now(),
      editCount: 0
    };

    onAddDonation(newDonation);
    setDonorName('');
    setAmount(0);
    setSelectedDonation(newDonation); // Show receipt immediately
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Donation Form */}
        <div className="lg:col-span-1">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-emerald-100">
            <h3 className="text-xl font-bold text-emerald-900 mb-8 flex items-center gap-3">
              <Heart className="w-6 h-6 text-red-500" /> দান করুন
            </h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-2">দাতার নাম</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    value={donorName}
                    onChange={(e) => setDonorName(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                    placeholder="নাম লিখুন"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-600 mb-2">দানের পরিমাণ (৳)</label>
                <div className="relative">
                  <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-600 mb-2">দানের উদ্দেশ্য</label>
                <select
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                >
                  <option value="মসজিদ উন্নয়ন">মসজিদ উন্নয়ন</option>
                  <option value="এতিমখানা">এতিমখানা</option>
                  <option value="ইফতার মাহফিল">ইফতার মাহফিল</option>
                  <option value="ওয়াজ মাহফিল">ওয়াজ মাহফিল</option>
                  <option value="অন্যান্য">অন্যান্য</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-2xl shadow-lg shadow-emerald-200 transition-all flex items-center justify-center gap-3"
              >
                <Heart className="w-5 h-5" /> দান সম্পন্ন করুন
              </button>
            </form>
          </div>
        </div>

        {/* Donation History */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-3xl shadow-sm border border-emerald-100 overflow-hidden">
            <div className="p-6 border-b border-emerald-50 bg-emerald-50/30 flex justify-between items-center">
              <h3 className="text-lg font-bold text-emerald-900 flex items-center gap-2">
                <FileText className="w-5 h-5" /> দানের ইতিহাস
              </h3>
              <div className="bg-white px-4 py-1 rounded-full border border-slate-200 text-xs font-bold text-slate-500">
                মোট: ৳{(donations || []).reduce((sum, d) => sum + d.amount, 0).toLocaleString()}
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 text-xs font-bold uppercase tracking-wider">
                    <th className="px-6 py-4">দাতার নাম</th>
                    <th className="px-6 py-4">উদ্দেশ্য</th>
                    <th className="px-6 py-4">তারিখ</th>
                    <th className="px-6 py-4">পরিমাণ</th>
                    <th className="px-6 py-4 text-right">রিসিট</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {donations.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-slate-400 italic">কোন দানের তথ্য পাওয়া যায়নি</td>
                    </tr>
                  ) : (
                    donations.map((d) => (
                      <tr key={d.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4 font-bold text-slate-700">{d.donorName}</td>
                        <td className="px-6 py-4 text-sm text-slate-500">{d.purpose}</td>
                        <td className="px-6 py-4 text-sm text-slate-400">
                          {format(d.date, 'd MMM, yyyy', { locale: bn })}
                        </td>
                        <td className="px-6 py-4 font-bold text-emerald-700">৳{d.amount}</td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-2">
                            {canEdit(d.date, d.editCount) && (
                              <button
                                onClick={() => onEditDonation(d)}
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                                title="সংশোধন করুন"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                            )}
                            <button
                              onClick={() => setSelectedDonation(d)}
                              className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all"
                            >
                              <Printer className="w-4 h-4" />
                            </button>
                          </div>
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

      {/* Receipt Modal */}
      {selectedDonation && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in duration-300">
            <div className="p-4 border-b border-slate-100 flex justify-between items-center">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">মানি রিসিট</span>
              <button onClick={() => setSelectedDonation(null)} className="p-2 text-slate-400 hover:text-slate-600 rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-8 space-y-8" id="receipt-content">
              <div className="text-center space-y-2">
                <div className="w-16 h-16 bg-emerald-600 rounded-2xl flex items-center justify-center text-white mx-auto shadow-lg shadow-emerald-100 mb-4">
                  <Heart className="w-8 h-8" />
                </div>
                <h2 className="text-xl font-bold text-emerald-900">মসজিদ উন্নয়ন তহবিল</h2>
                <p className="text-xs text-slate-400 font-medium">রিসিট নং: {selectedDonation.id.slice(0, 8).toUpperCase()}</p>
              </div>

              <div className="space-y-4 py-6 border-y border-dashed border-slate-200">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 text-sm">দাতার নাম:</span>
                  <span className="font-bold text-slate-800">{selectedDonation.donorName}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 text-sm">দানের উদ্দেশ্য:</span>
                  <span className="font-bold text-slate-800">{selectedDonation.purpose}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 text-sm">তারিখ:</span>
                  <span className="font-bold text-slate-800">{format(selectedDonation.date, 'd MMMM, yyyy', { locale: bn })}</span>
                </div>
                <div className="flex justify-between items-center pt-4 border-t border-slate-50">
                  <span className="text-lg font-bold text-emerald-900">মোট পরিমাণ:</span>
                  <span className="text-2xl font-black text-emerald-600">৳{selectedDonation.amount}</span>
                </div>
              </div>

              <div className="text-center space-y-4">
                <p className="text-xs text-slate-400 italic">"দান সম্পদ কমায় না, বরং বরকত বৃদ্ধি করে।"</p>
                <div className="flex gap-3">
                  <button
                    onClick={() => window.print()}
                    className="flex-1 bg-emerald-600 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-emerald-700 transition-all"
                  >
                    <Printer className="w-4 h-4" /> প্রিন্ট করুন
                  </button>
                  <button
                    className="flex-1 bg-slate-100 text-slate-600 font-bold py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-slate-200 transition-all"
                  >
                    <Download className="w-4 h-4" /> ডাউনলোড
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
