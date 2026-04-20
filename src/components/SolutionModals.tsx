"use client";

import React, { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { X, CheckCircle2, Send, Rocket, ShieldCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";

interface SolutionModalProps {
  type: "white-label" | "runway";
  isOpen: boolean;
  onClose: () => void;
}

export const SolutionModal: React.FC<SolutionModalProps> = ({ type, isOpen, onClose }) => {
  const { t } = useLanguage();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const isWhiteLabel = type === "white-label";
  const data = t.home.solutionModals;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    
    const payload = {
      firstName: formData.get("firstName"),
      lastName: formData.get("lastName"),
      email: formData.get("email"),
      message: formData.get("message"),
      contactType: type,
    };

    try {
      const res = await fetch("/api/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Submission failed");
      
      setIsSuccess(true);
      setTimeout(() => {
        onClose();
        setIsSuccess(false);
      }, 4000);
    } catch (error) {
      console.error("Submission error:", error);
      alert(t.home.solutionModals.formError || "Error sending request. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <AnimatePresence>
        {isOpen && (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50"
              />
            </Dialog.Overlay>
            <Dialog.Content asChild>
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] w-[95%] max-w-lg z-50 p-1"
              >
                <div className="glass-morphism rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl bg-slate-950 max-h-[90vh] flex flex-col">
                  {/* Fixed Header */}
                  <div className="p-8 pb-0 md:p-10 md:pb-0 flex justify-between items-start mb-6">
                    <div className={`p-3 rounded-2xl ${isWhiteLabel ? 'bg-indigo-500/10 text-indigo-400' : 'bg-emerald-500/10 text-emerald-400'}`}>
                      {isWhiteLabel ? <ShieldCheck className="w-8 h-8" /> : <Rocket className="w-8 h-8" />}
                    </div>
                    <Dialog.Close className="p-2 text-slate-500 hover:text-white transition-colors">
                      <X className="w-6 h-6" />
                    </Dialog.Close>
                  </div>

                  {/* Scrollable Content */}
                  <div className="overflow-y-auto p-8 pt-0 md:p-10 md:pt-0 pb-10 custom-scrollbar">
                    <Dialog.Title className="text-2xl md:text-3xl font-bold text-white mb-4 tracking-tight">
                      {isWhiteLabel ? data.whiteLabelTitle : data.runwayTitle}
                    </Dialog.Title>
                    
                    <Dialog.Description className="text-base text-slate-400 mb-8 leading-relaxed">
                      {isWhiteLabel ? data.whiteLabelBody : data.runwayBody}
                    </Dialog.Description>

                    <div className="space-y-4 mb-10">
                      {[
                        isWhiteLabel ? data.whiteLabelBullet1 : data.runwayBullet1,
                        isWhiteLabel ? data.whiteLabelBullet2 : data.runwayBullet2,
                        isWhiteLabel ? data.whiteLabelBullet3 : data.runwayBullet3,
                        !isWhiteLabel && data.runwayBullet4
                      ].filter(Boolean).map((bullet, idx) => (
                        <div key={idx} className="flex gap-3 text-sm text-slate-300 items-start">
                          <CheckCircle2 className={`w-5 h-5 flex-shrink-0 mt-0.5 ${isWhiteLabel ? 'text-indigo-500' : 'text-emerald-500'}`} />
                          <span className="leading-snug">{bullet}</span>
                        </div>
                      ))}
                    </div>

                    <div className="border-t border-white/5 pt-10 mt-2">
                       {isSuccess ? (
                        <motion.div 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="p-8 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-center"
                        >
                          <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-4" />
                          <p className="text-emerald-400 font-bold text-lg">{data.formSuccess}</p>
                        </motion.div>
                      ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="space-y-2">
                              <label className="text-[10px] uppercase tracking-widest text-slate-500 font-mono pl-1">{data.formFirstName}</label>
                              <input 
                                required
                                name="firstName"
                                type="text" 
                                placeholder="John"
                                className="w-full bg-slate-900/50 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors placeholder:text-slate-700"
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="text-[10px] uppercase tracking-widest text-slate-500 font-mono pl-1">{data.formLastName}</label>
                              <input 
                                required
                                name="lastName"
                                type="text" 
                                placeholder="Doe"
                                className="w-full bg-slate-900/50 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors placeholder:text-slate-700"
                              />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] uppercase tracking-widest text-slate-500 font-mono pl-1">{data.formEmail}</label>
                            <input 
                              required
                              name="email"
                              type="email" 
                              placeholder="john@company.com"
                              className="w-full bg-slate-900/50 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors placeholder:text-slate-700"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] uppercase tracking-widest text-slate-500 font-mono pl-1">{data.formMessage}</label>
                            <textarea 
                              required
                              name="message"
                              rows={3}
                              defaultValue={isWhiteLabel ? data.msgPreloadWhiteLabel : data.msgPreloadRunway}
                              className="w-full bg-slate-900/50 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors resize-none"
                            />
                          </div>
                          <button 
                            type="submit"
                            disabled={isSubmitting}
                            className={`w-full py-5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all active:scale-[0.98] ${
                              isWhiteLabel 
                                ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-xl shadow-indigo-600/20' 
                                : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xl shadow-emerald-600/20'
                            } ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                          >
                            {isSubmitting ? (
                              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                              <>
                                <span className="uppercase tracking-wider text-sm">
                                  {isWhiteLabel ? data.formSubmitWhiteLabel : data.formSubmitRunway}
                                </span>
                                <Send className="w-4 h-4" />
                              </>
                            )}
                          </button>
                        </form>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
};
