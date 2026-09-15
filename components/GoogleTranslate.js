import { useEffect, useState, useRef } from "react";

const languages = [
  { code: "nl", label: "Nederlands" },
  { code: "en", label: "English" },
  { code: "de", label: "Deutsch" },
  { code: "fr", label: "Français" },
  { code: "es", label: "Español" },
  { code: "it", label: "Italiano" },
];

export default function GoogleTranslate() {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (document.getElementById("google-translate-script")) return;

    window.googleTranslateElementInit = () => {
      new window.google.translate.TranslateElement(
        {
          pageLanguage: "nl",
          includedLanguages: "en,de,fr,es,it",
          layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
          autoDisplay: false,
        },
        "google_translate_element",
      );
    };

    const script = document.createElement("script");
    script.id = "google-translate-script";
    script.src =
      "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function selectLanguage(code) {
    setOpen(false);
    const tryTrigger = (attempts = 0) => {
      const select = document.querySelector(".goog-te-combo");
      if (select) {
        select.value = code;
        const event = new Event("change", { bubbles: true });
        select.dispatchEvent(event);
      } else if (attempts < 20) {
        setTimeout(() => tryTrigger(attempts + 1), 300);
      } else {
        console.error("Google Translate select-element niet gevonden");
      }
    };
    tryTrigger();
  }

  return (
    <div className="relative" ref={ref}>
      {/* Verborgen, echte Google Translate widget */}
      <div
        id="google_translate_element"
        style={{ position: "absolute", top: -9999, left: -9999 }}
      />

      <button
        onClick={() => setOpen(!open)}
        className="text-gray-300 hover:text-white text-sm flex items-center gap-1"
      >
        Selecteer een taal
        <span className="text-xs">▼</span>
      </button>

      {open && (
        <div className="absolute mt-2 bg-[#101828] border border-[#2a3a55] rounded-lg shadow-lg py-1 w-40 z-50">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => selectLanguage(lang.code)}
              className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-[#0a0e1a] hover:text-white"
            >
              {lang.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
