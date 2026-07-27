import React, { useState } from 'react';
import { OpenAISettings } from '../types';
import { Key, ShieldCheck, Check, X, Sparkles, ExternalLink, RefreshCw } from 'lucide-react';

interface OpenAISettingsModalProps {
  settings: OpenAISettings;
  onClose: () => void;
  onSaveKey: (apiKey: string) => Promise<boolean>;
}

export const OpenAISettingsModal: React.FC<OpenAISettingsModalProps> = ({
  settings,
  onClose,
  onSaveKey,
}) => {
  const [keyInput, setKeyInput] = useState(settings.apiKey || '');
  const [isSaving, setIsSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setFeedback(null);

    try {
      const success = await onSaveKey(keyInput);
      if (success) {
        setFeedback({
          type: 'success',
          message: keyInput.trim() ? 'OpenAI API key saved securely on server!' : 'OpenAI API key cleared.'
        });
        setTimeout(() => {
          onClose();
        }, 1000);
      } else {
        setFeedback({
          type: 'error',
          message: 'Failed to update key on server. Please try again.'
        });
      }
    } catch (err) {
      setFeedback({
        type: 'error',
        message: 'An error occurred while saving the key.'
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg p-6 text-white shadow-2xl relative">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-white">OpenAI Integration</h2>
              <p className="text-xs text-slate-400">Configure key for AI Travel Assistant</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status Indicator */}
        <div className="mb-5 p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
          <span className="text-slate-400">Current Key Status:</span>
          {settings.hasKey ? (
            <span className="inline-flex items-center gap-1.5 font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/30">
              <Check className="w-3.5 h-3.5" />
              Active ({settings.maskedKey})
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 font-bold text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/30">
              Not Set (Fallback Engine)
            </span>
          )}
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
              OpenAI API Key (`sk-...`)
            </label>
            <input
              type="password"
              value={keyInput}
              onChange={(e) => setKeyInput(e.target.value)}
              placeholder="sk-proj-..."
              className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3 text-white text-sm font-mono focus:ring-2 focus:ring-amber-500 outline-none"
            />
            <span className="block text-[11px] text-slate-500 mt-1.5">
              Your key is proxied securely through AI Studio's Node server environment and never exposed client-side.
            </span>
          </div>

          {feedback && (
            <div className={`p-3 rounded-xl text-xs font-bold flex items-center gap-2 ${
              feedback.type === 'success' ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/30' : 'bg-red-500/10 text-red-300 border border-red-500/30'
            }`}>
              {feedback.message}
            </div>
          )}

          <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-400 space-y-1">
            <div className="font-bold text-white flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-teal-400" />
              Need an OpenAI API key?
            </div>
            <p className="text-[11px] text-slate-400">
              Generate or retrieve your key at platform.openai.com. If no key is entered, the app seamlessly falls back to travelinginfo's smart built-in travel engine.
            </p>
          </div>

          <div className="pt-3 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-colors"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSaving}
              className="py-2.5 px-5 rounded-xl bg-gradient-to-r from-amber-500 to-teal-500 text-slate-950 font-extrabold text-xs shadow-lg shadow-amber-500/20 hover:opacity-95 transition-opacity flex items-center gap-2 disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                  Save Key
                </>
              )}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
