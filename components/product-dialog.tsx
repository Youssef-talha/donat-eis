"use client";
import { useEffect, useRef } from "react";
import Image from "next/image";
import {
  allergenDefinitions,
  additiveDefinitions,
  type Locale,
  type MenuItem,
} from "@/lib/menu";
import { formatPrice } from "@/lib/menu-utils";
import { CloseIcon } from "./icons";
export default function ProductDialog({
  item,
  locale,
  onClose,
}: {
  item: MenuItem;
  locale: Locale;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const de = locale === "de";
  useEffect(() => {
    const dialog = ref.current!;
    const trigger = document.activeElement as HTMLElement | null;
    const originalOverflow = document.body.style.overflow;
    dialog.showModal();
    document.body.style.overflow = "hidden";
    return () => {
      dialog.close();
      document.body.style.overflow = originalOverflow;
      trigger?.focus();
    };
  }, []);
  return (
    <dialog
      ref={ref}
      className="product-dialog"
      aria-labelledby="product-title"
      onClose={() => {
        if (!ref.current?.open) onClose();
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="dialog-inner">
        <button
          type="button"
          className="icon-button dialog-close"
          onClick={onClose}
          aria-label={de ? "Schließen" : "Close"}
          autoFocus
        >
          <CloseIcon />
        </button>
        {item.image && (
          <div className="dialog-image">
            <Image
              src={item.image}
              alt={item.imageAlt?.[locale] ?? item.name[locale]}
              width={700}
              height={700}
              sizes="(max-width: 600px) 100vw, 500px"
            />
          </div>
        )}
        <div className="dialog-copy">
          <p className="eyebrow">DONAT EIS</p>
          <h2 id="product-title">{item.name[locale]}</h2>
          {item.servingSize && (
            <p className="serving">{item.servingSize[locale]}</p>
          )}
          {item.description[locale] && (
            <p className="full-description">{item.description[locale]}</p>
          )}
          {item.ingredients[locale].length > 0 && (
            <>
              <h3>{de ? "Zutaten" : "Ingredients"}</h3>
              <p>{item.ingredients[locale].join(" · ")}</p>
            </>
          )}
          {item.allergenCodes.length > 0 && (
            <>
              <h3>{de ? "Allergene" : "Allergens"}</h3>
              <ul>
                {item.allergenCodes.map((code) => (
                  <li key={code}>{allergenDefinitions[code][locale]}</li>
                ))}
              </ul>
            </>
          )}
          {item.additiveCodes.length > 0 && (
            <>
              <h3>{de ? "Zusatzstoffe" : "Additives"}</h3>
              <ul>
                {item.additiveCodes.map((code) => (
                  <li key={code}>{additiveDefinitions[code][locale]}</li>
                ))}
              </ul>
            </>
          )}
          <p className="allergen-note">
            {de
              ? "Bei Fragen zu Allergenen und Zusatzstoffen wenden Sie sich bitte an unser Personal."
              : "Please ask our staff about allergens and additives."}
          </p>
          <div className="dialog-price">
            <span>{de ? "Preis" : "Price"}</span>
            <strong>{formatPrice(item.priceCents, locale)}</strong>
          </div>
        </div>
      </div>
    </dialog>
  );
}
