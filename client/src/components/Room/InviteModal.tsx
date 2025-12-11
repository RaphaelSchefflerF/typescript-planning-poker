import React, { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Button } from "../UI/Button";

interface InviteModalProps {
  isOpen: boolean;
  onClose: () => void;
  roomId: string;
}

export const InviteModal: React.FC<InviteModalProps> = ({
  isOpen,
  onClose,
  roomId,
}) => {
  const [copyText, setCopyText] = useState("Copy");
  if (!isOpen) return null;

  const inviteLink = `${window.location.origin}/join/${roomId}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(inviteLink).then(() => {
      setCopyText("Copied!");
      setTimeout(() => setCopyText("Copy"), 2000);
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-xl p-6 max-w-sm w-full border border-slate-700 shadow-2xl">
        <h3 className="text-xl font-bold text-white mb-4">Invite Team</h3>

        <div className="flex justify-center mb-6 bg-white p-4 rounded-lg">
          <QRCodeSVG value={inviteLink} size={150} />
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm text-slate-400 mb-1">
              Share this link to invite others
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                readOnly
                value={inviteLink}
                className="w-full flex-1 bg-slate-900 p-2 rounded text-blue-400 font-mono text-center"
              />
              <Button onClick={copyToClipboard} variant="secondary">
                {copyText}
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <Button onClick={onClose} className="w-full" variant="ghost">
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};
