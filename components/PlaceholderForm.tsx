type PlaceholderFormProps = {
  title?: string;
  message?: string;
  fields?: { name: string; type?: string; label: string }[];
};

export default function PlaceholderForm({
  title = "Form coming soon",
  message = "This form is not yet active. Please contact us directly for now.",
  fields = [
    { name: "name", type: "text", label: "Name" },
    { name: "email", type: "email", label: "Email" },
    { name: "message", type: "textarea", label: "Message" },
  ],
}: PlaceholderFormProps) {
  return (
    <div className="bg-htp-cream border border-htp-line rounded-card shadow-sm p-8 max-w-xl mx-auto text-left">
      <h3 className="font-display text-htp-h3 text-htp-navy uppercase tracking-[0.04em] mb-4">
        {title}
      </h3>
      <p className="text-htp-ink leading-[1.55] mb-6">{message}</p>
      <div className="space-y-4 opacity-60 pointer-events-none">
        {fields.map((field) => (
          <div key={field.name}>
            {field.type !== "checkbox" && (
              <label className="block text-sm font-medium text-htp-ink mb-2">
                {field.label}
              </label>
            )}
            {field.type === "textarea" ? (
              <textarea
                name={field.name}
                rows={4}
                className="w-full px-3 py-2 bg-htp-bg border border-htp-line rounded-btn text-htp-ink"
                disabled
              />
            ) : field.type === "checkbox" ? (
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name={field.name}
                  className="w-4 h-4 rounded border-htp-line"
                  disabled
                />
                <span className="text-sm text-htp-ink">{field.label}</span>
              </div>
            ) : (
              <input
                type={field.type || "text"}
                name={field.name}
                className="w-full px-3 py-2 bg-htp-bg border border-htp-line rounded-btn text-htp-ink"
                disabled
              />
            )}
          </div>
        ))}
        <button
          type="button"
          className="px-6 py-2 bg-htp-red text-htp-bg rounded-btn font-medium"
          disabled
        >
          Submit
        </button>
      </div>
    </div>
  );
}
