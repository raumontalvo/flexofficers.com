"use client";

import { useState } from "react";
import ApplicationStatusButtons from "./ApplicationStatusButtons";

type License = {
  id: string;
  licenseType: string;
  licenseNumber: string;
  issuingState: string;
};

type ApplicationDetailsProps = {
  applicationId: string;
  applicationStatus: string;
  bio: string | null;
  licenses: License[];
};

export default function ApplicationDetails({
  applicationId,
  applicationStatus,
  bio,
  licenses,
}: ApplicationDetailsProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="mt-5">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="rounded-xl border border-white/20 px-5 py-3 font-semibold hover:bg-white/10"
      >
        {isOpen ? "Hide Details" : "Show Details"}
      </button>

      {isOpen && (
        <div className="mt-5 grid gap-5">
          {bio && (
            <p className="rounded-2xl border border-white/10 bg-slate-900 p-4 text-slate-300">
              {bio}
            </p>
          )}

          <div className="rounded-2xl border border-white/10 bg-slate-900 p-4">
            <h3 className="font-semibold">Licenses</h3>

            {licenses.length === 0 ? (
              <p className="mt-3 text-sm text-slate-400">
                No licenses provided.
              </p>
            ) : (
              <div className="mt-3 grid gap-3">
                {licenses.map((license) => (
                  <div
                    key={license.id}
                    className="rounded-xl bg-white/5 p-3 text-sm text-slate-300"
                  >
                    <p>
                      <span className="font-semibold text-white">
                        {license.licenseType}
                      </span>
                    </p>
                    <p>Number: {license.licenseNumber}</p>
                    <p>Issuing state: {license.issuingState}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <ApplicationStatusButtons
            applicationId={applicationId}
            status={applicationStatus}
          />
        </div>
      )}
    </div>
  );
}