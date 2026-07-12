import { useMemo, useState } from "react";
import {
  ShieldCheck,
  ShieldAlert,
  ExternalLink,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Landmark,
  FileSearch,
} from "lucide-react";

const formatINR = (n) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

// Official Indian government portals used to cross-check a charity's legitimacy.
// Each one is opened by the admin, who manually enters the org's ID on the portal
// (these portals don't support public prefilled search links).
const VERIFICATION_SOURCES = [
  {
    id: "darpan",
    label: "NGO Darpan (NITI Aayog)",
    url: "https://ngodarpan.gov.in",
    field: "darpanId",
    what: "Confirms the org is a government-recognised voluntary organisation and pulls up its registered profile.",
  },
  {
    id: "incometax",
    label: "Income Tax e-filing portal",
    url: "https://www.incometax.gov.in",
    field: "urn12a80g",
    what: "Confirms the 12A (tax-exempt status) and 80G (donor tax deduction) registration is active, not expired or withdrawn.",
  },
  {
    id: "mca",
    label: "MCA21 company/LLP search",
    url: "https://www.mca.gov.in/mcafoportal/companyLLPMasterData.do",
    field: "cin",
    what: "For Section 8 companies — confirms the CIN is active and the registered name matches exactly.",
  },
  {
    id: "fcra",
    label: "FCRA Online (Ministry of Home Affairs)",
    url: "https://fcraonline.nic.in",
    field: "fcraNumber",
    what: "Required only if the charity accepts foreign donations — confirms FCRA registration is valid.",
  },
];

const RED_FLAGS = [
  { id: "name_mismatch", label: "Bank account name doesn't exactly match registered org name" },
  { id: "not_on_darpan", label: "Organisation not found on NGO Darpan despite claiming registration" },
  { id: "no_12a80g", label: "No valid 12A/80G, or certificate shows as expired/withdrawn" },
  { id: "new_org_large_ask", label: "Registered under 2 years ago but requesting an unusually large amount" },
  { id: "no_financials", label: "No audited financials or annual report provided" },
  { id: "address_mismatch", label: "Registered address doesn't match address proof document" },
  { id: "no_online_presence", label: "No verifiable website, social presence, or past campaign history" },
  { id: "urgency_pressure", label: "Campaign copy uses high-pressure urgency with vague fund usage" },
  { id: "duplicate_bank", label: "Bank account already linked to a different organisation on the platform" },
];

const initialOrg = {
  orgName: "Bright Future Foundation",
  panNumber: "",
  darpanId: "",
  urn12a80g: "",
  cin: "",
  fcraNumber: "",
  bankAccountName: "",
  requestedAmount: 500000,
};

export default function CharityFraudReview() {
  const [org, setOrg] = useState(initialOrg);
  const [sourceChecked, setSourceChecked] = useState({});
  const [flags, setFlags] = useState({});

  const flaggedCount = Object.values(flags).filter(Boolean).length;
  const sourcesConfirmed = Object.values(sourceChecked).filter(Boolean).length;

  const riskLevel = useMemo(() => {
    if (flaggedCount >= 3) return "high";
    if (flaggedCount >= 1) return "medium";
    return "low";
  }, [flaggedCount]);

  const eligible = sourcesConfirmed === VERIFICATION_SOURCES.length && flaggedCount === 0;

  const updateOrg = (field, value) => setOrg((prev) => ({ ...prev, [field]: value }));
  const toggleSource = (id) => setSourceChecked((prev) => ({ ...prev, [id]: !prev[id] }));
  const toggleFlag = (id) => setFlags((prev) => ({ ...prev, [id]: !prev[id] }));

  return (
    <div className="min-h-screen bg-slate-50 p-6 font-sans text-slate-800">
      <div className="mx-auto max-w-3xl">
        <header className="mb-6 flex items-center gap-2">
          <ShieldCheck className="h-6 w-6 text-emerald-600" />
          <h1 className="text-xl font-semibold text-slate-900">Admin fraud &amp; legitimacy review</h1>
        </header>

        {/* Org identity fields */}
        <section className="mb-6 rounded-lg border border-slate-200 bg-white p-4">
          <h2 className="mb-3 text-sm font-medium text-slate-900">Organisation details</h2>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Organisation name" value={org.orgName} onChange={(v) => updateOrg("orgName", v)} span />
            <Field label="PAN number" value={org.panNumber} onChange={(v) => updateOrg("panNumber", v)} placeholder="AAAAA0000A" />
            <Field label="NGO Darpan ID" value={org.darpanId} onChange={(v) => updateOrg("darpanId", v)} placeholder="MH/2024/0000000" />
            <Field label="12A / 80G URN" value={org.urn12a80g} onChange={(v) => updateOrg("urn12a80g", v)} placeholder="16-digit URN" />
            <Field label="MCA CIN (if Sec. 8 co.)" value={org.cin} onChange={(v) => updateOrg("cin", v)} placeholder="U85300MH2020NPL000000" />
            <Field label="FCRA number (if applicable)" value={org.fcraNumber} onChange={(v) => updateOrg("fcraNumber", v)} placeholder="Optional" />
            <Field label="Bank account holder name" value={org.bankAccountName} onChange={(v) => updateOrg("bankAccountName", v)} span />
            <div className="col-span-2">
              <label className="mb-1 block text-xs text-slate-500">Requested campaign amount</label>
              <input
                type="number"
                value={org.requestedAmount}
                onChange={(e) => updateOrg("requestedAmount", Number(e.target.value))}
                className="w-full rounded-md border border-slate-200 px-2 py-1.5 text-sm"
              />
              <p className="mt-1 text-xs text-slate-400">{formatINR(org.requestedAmount)}</p>
            </div>
          </div>
        </section>

        {/* Online verification sources */}
        <section className="mb-6 rounded-lg border border-slate-200 bg-white p-4">
          <div className="mb-3 flex items-center gap-2">
            <FileSearch className="h-4 w-4 text-slate-400" />
            <h2 className="text-sm font-medium text-slate-900">Cross-check on official Indian portals</h2>
          </div>
          <div className="space-y-2">
            {VERIFICATION_SOURCES.map((src) => (
              <div
                key={src.id}
                className="flex items-center justify-between gap-3 rounded-md border border-slate-100 p-3"
              >
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-900">{src.label}</p>
                  <p className="text-xs text-slate-500">{src.what}</p>
                  {org[src.field] && (
                    <p className="mt-1 text-xs text-slate-400">
                      Check ID: <span className="font-mono">{org[src.field]}</span>
                    </p>
                  )}
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <a
                    href={src.url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 rounded-md border border-slate-200 px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
                  >
                    Open portal <ExternalLink className="h-3 w-3" />
                  </a>
                  <button
                    onClick={() => toggleSource(src.id)}
                    className={`flex items-center gap-1 rounded-md px-2.5 py-1.5 text-xs font-medium transition ${
                      sourceChecked[src.id]
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-slate-900 text-white hover:bg-slate-700"
                    }`}
                  >
                    {sourceChecked[src.id] ? (
                      <>
                        <CheckCircle2 className="h-3.5 w-3.5" /> Confirmed
                      </>
                    ) : (
                      "Mark confirmed"
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
          <p className="mt-3 text-xs text-slate-400">
            {sourcesConfirmed}/{VERIFICATION_SOURCES.length} sources confirmed
          </p>
        </section>

        {/* Fraud red flags */}
        <section className="mb-6 rounded-lg border border-slate-200 bg-white p-4">
          <div className="mb-3 flex items-center gap-2">
            <ShieldAlert className="h-4 w-4 text-slate-400" />
            <h2 className="text-sm font-medium text-slate-900">Fraud red flags</h2>
          </div>
          <div className="space-y-2">
            {RED_FLAGS.map((flag) => (
              <label
                key={flag.id}
                className="flex cursor-pointer items-start gap-2 rounded-md border border-slate-100 p-2.5 text-sm hover:bg-slate-50"
              >
                <input
                  type="checkbox"
                  checked={!!flags[flag.id]}
                  onChange={() => toggleFlag(flag.id)}
                  className="mt-0.5"
                />
                <span className="text-slate-700">{flag.label}</span>
              </label>
            ))}
          </div>
        </section>

        {/* Risk summary */}
        <section
          className={`rounded-lg border p-4 ${
            riskLevel === "high"
              ? "border-red-200 bg-red-50"
              : riskLevel === "medium"
              ? "border-amber-200 bg-amber-50"
              : "border-emerald-200 bg-emerald-50"
          }`}
        >
          <div className="flex items-center gap-2">
            {riskLevel === "low" ? (
              <CheckCircle2 className="h-5 w-5 text-emerald-600" />
            ) : riskLevel === "medium" ? (
              <AlertTriangle className="h-5 w-5 text-amber-600" />
            ) : (
              <XCircle className="h-5 w-5 text-red-600" />
            )}
            <p className="text-sm font-medium capitalize text-slate-900">{riskLevel} risk</p>
          </div>
          <p className="mt-1 text-sm text-slate-600">
            {flaggedCount} red flag{flaggedCount !== 1 ? "s" : ""} raised · {sourcesConfirmed}/
            {VERIFICATION_SOURCES.length} portals confirmed · Requesting {formatINR(org.requestedAmount)}
          </p>
          <div className="mt-3 flex items-center gap-2 border-t border-black/5 pt-3 text-sm">
            <Landmark className="h-4 w-4 text-slate-400" />
            {eligible ? (
              <span className="text-emerald-700">
                All portals confirmed, zero red flags — eligible to be approved for fundraising.
              </span>
            ) : (
              <span className="text-slate-600">
                Not eligible yet — confirm all portals and clear every red flag before approving.
              </span>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, placeholder, span }) {
  return (
    <div className={span ? "col-span-2" : ""}>
      <label className="mb-1 block text-xs text-slate-500">{label}</label>
      <input
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-md border border-slate-200 px-2 py-1.5 text-sm"
      />
    </div>
  );
}