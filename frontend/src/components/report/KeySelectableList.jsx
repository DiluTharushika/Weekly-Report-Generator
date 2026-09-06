import { useState } from "react";

export default function KeySelectableList({
  title,
  items,
  setItems,
  keyField = "isKey",
  placeholder = "Type and add...",
}) {
  const [text, setText] = useState("");

  const addItem = () => {
    const value = text.trim();
    if (!value) return;

    setItems([...items, { description: value, [keyField]: items.length === 0 }]);
    setText("");
  };

  const removeItem = (idx) => {
    const next = items.filter((_, i) => i !== idx);

    // if removed key item, set first one as key
    if (!next.some((x) => x[keyField]) && next.length > 0) {
      next[0][keyField] = true;
    }

    setItems(next);
  };

  const setKey = (idx) => {
    const next = items.map((x, i) => ({ ...x, [keyField]: i === idx }));
    setItems(next);
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold text-slate-900">{title}</h3>
        <span className="text-xs text-slate-500">Select one as key</span>
      </div>

      <div className="mt-4 flex gap-2">
        <input
          className="flex-1 rounded-xl border border-slate-300 px-3 py-2 outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={placeholder}
        />
        <button
          type="button"
          onClick={addItem}
          className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
        >
          Add
        </button>
      </div>

      <div className="mt-4 space-y-2">
        {items.length === 0 ? (
          <div className="text-sm text-slate-500">No items yet.</div>
        ) : (
          items.map((item, idx) => (
            <div
              key={idx}
              className="flex items-start justify-between gap-3 rounded-xl border border-slate-200 p-3"
            >
              <div className="flex gap-3">
                <input
                  type="radio"
                  checked={Boolean(item[keyField])}
                  onChange={() => setKey(idx)}
                  className="mt-1"
                />
                <div>
                  <div className="text-sm text-slate-900 whitespace-pre-wrap">
                    {item.description}
                  </div>
                  {item[keyField] && (
                    <div className="mt-1 text-xs text-blue-600">Key</div>
                  )}
                </div>
              </div>

              <button
                type="button"
                onClick={() => removeItem(idx)}
                className="text-sm text-red-600 hover:underline"
              >
                Remove
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}