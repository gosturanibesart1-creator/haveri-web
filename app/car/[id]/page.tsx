import Link from "next/link";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import ImageGallery from "../../components/ImageGallery";

type Car = {
  id: string;
  title?: string;
  price?: string | number;
  city?: string;
  fuel?: string;
  km?: string | number;
  transmission?: string;
  year?: string | number;
  phone?: string | number;
  images?: unknown;
  imageUrls?: unknown;
  photos?: unknown;
  photoUrls?: unknown;
  image?: unknown;
  sellerName?: string;
  sellerType?: string;
  sellerTypr?: string;
};

const BACK_LINK = "/marketplace";

function textOrDash(value?: string): string {
  return typeof value === "string" && value.trim().length > 0 ? value : "—";
}

function valueToString(value?: string | number): string {
  return value !== undefined && value !== null && String(value).trim().length > 0
    ? String(value)
    : "—";
}

function normalizeAlbaniaKosovoPhone(
  phone?: string | number
): { whatsapp: string; tel: string; raw: string } {
  if (phone === undefined || phone === null) {
    return { whatsapp: "", tel: "", raw: "" };
  }

  const original = String(phone).trim();
  if (!original) {
    return { whatsapp: "", tel: "", raw: "" };
  }

  let raw = original.replace(/[^\d+]/g, "");
  if (!raw) {
    return { whatsapp: "", tel: "", raw: "" };
  }

  // 00355..., 00383...
  if (raw.startsWith("00")) {
    const digits = raw.slice(2).replace(/\D/g, "");
    return {
      whatsapp: digits,
      tel: digits ? `+${digits}` : "",
      raw: original,
    };
  }

  // +355..., +383...
  if (raw.startsWith("+")) {
    const digits = raw.slice(1).replace(/\D/g, "");
    return {
      whatsapp: digits,
      tel: digits ? `+${digits}` : "",
      raw: original,
    };
  }

  const digitsOnly = raw.replace(/\D/g, "");
  if (!digitsOnly) {
    return { whatsapp: "", tel: "", raw: original };
  }

  // Already international without +
  if (digitsOnly.startsWith("355") || digitsOnly.startsWith("383")) {
    return {
      whatsapp: digitsOnly,
      tel: `+${digitsOnly}`,
      raw: original,
    };
  }

  // Albania local numbers usually start with 06...
  if (digitsOnly.startsWith("06")) {
    const international = `355${digitsOnly.slice(1)}`;
    return {
      whatsapp: international,
      tel: `+${international}`,
      raw: original,
    };
  }

  // Kosovo local mobile prefixes
  if (
    digitsOnly.startsWith("044") ||
    digitsOnly.startsWith("045") ||
    digitsOnly.startsWith("048") ||
    digitsOnly.startsWith("049")
  ) {
    const international = `383${digitsOnly.slice(1)}`;
    return {
      whatsapp: international,
      tel: `+${international}`,
      raw: original,
    };
  }

  // Fallback: treat local 0... as Albania
  if (digitsOnly.startsWith("0")) {
    const international = `355${digitsOnly.slice(1)}`;
    return {
      whatsapp: international,
      tel: `+${international}`,
      raw: original,
    };
  }

  // Last fallback: trust as-is
  return {
    whatsapp: digitsOnly,
    tel: `+${digitsOnly}`,
    raw: original,
  };
}

function toStringArray(value: unknown): string[] {
  if (!value) return [];

  if (typeof value === "string" && value.trim().length > 0) {
    return [value.trim()];
  }

  if (Array.isArray(value)) {
    return value.flatMap((item) => {
      if (typeof item === "string" && item.trim().length > 0) {
        return [item.trim()];
      }

      if (item && typeof item === "object") {
        return Object.values(item).filter(
          (v): v is string => typeof v === "string" && v.trim().length > 0
        );
      }

      return [];
    });
  }

  if (typeof value === "object") {
    return Object.values(value).filter(
      (item): item is string =>
        typeof item === "string" && item.trim().length > 0
    );
  }

  return [];
}

function extractImages(car: Car): string[] {
  const candidates = [
    car.images,
    car.imageUrls,
    car.photos,
    car.photoUrls,
    car.image,
  ];

  for (const candidate of candidates) {
    const parsed = toStringArray(candidate);
    if (parsed.length > 0) return parsed;
  }

  return [];
}

async function getCar(id: string): Promise<Car | null> {
  const ref = doc(db, "cars", id);
  const snapshot = await getDoc(ref);

  if (!snapshot.exists()) return null;

  return {
    id: snapshot.id,
    ...snapshot.data(),
  } as Car;
}

export default async function CarPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  if (!id) {
    return (
      <main style={styles.page}>
        <div style={styles.container}>
          <Link href={BACK_LINK} style={styles.backLink}>
            ← Kthehu te makinat
          </Link>
          <h1 style={styles.errorTitle}>ID e makinës mungon</h1>
        </div>
      </main>
    );
  }

  const car = await getCar(id);

  if (!car) {
    return (
      <main style={styles.page}>
        <div style={styles.container}>
          <Link href={BACK_LINK} style={styles.backLink}>
            ← Kthehu te makinat
          </Link>
          <h1 style={styles.errorTitle}>Makina nuk u gjet</h1>
        </div>
      </main>
    );
  }

  const title = textOrDash(car.title);
  const price =
    car.price !== undefined && car.price !== null ? String(car.price) : "Pa çmim";
  const city = textOrDash(car.city);
  const fuel = textOrDash(car.fuel);
  const km = valueToString(car.km);
  const transmission = textOrDash(car.transmission);
  const year = valueToString(car.year);
  const sellerName = textOrDash(car.sellerName);

  const sellerType =
    typeof car.sellerType === "string" && car.sellerType.trim().length > 0
      ? car.sellerType
      : typeof car.sellerTypr === "string" && car.sellerTypr.trim().length > 0
      ? car.sellerTypr
      : "—";

  const phoneString =
    car.phone !== undefined && car.phone !== null ? String(car.phone) : "";

  const phoneParsed = normalizeAlbaniaKosovoPhone(car.phone);
  const cleanPhone = phoneParsed.whatsapp;
  const telPhone = phoneParsed.tel;
  const images = extractImages(car);

  const whatsappMessage = encodeURIComponent(
    `Përshëndetje! Jam i interesuar për makinën "${title}" që pashë te HAVERI. A është ende në dispozicion?`
  );

  const whatsappLink = cleanPhone
    ? `https://wa.me/${cleanPhone}?text=${whatsappMessage}`
    : "";

  const specs = [
    { label: "Qyteti", value: city },
    { label: "Karburanti", value: fuel },
    { label: "Kilometra", value: km },
    { label: "Transmisioni", value: transmission },
    { label: "Viti", value: year },
  ];

  return (
    <main style={styles.page}>
      <div style={styles.container}>
        <Link href={BACK_LINK} style={styles.backLink}>
          ← Kthehu te makinat
        </Link>

        <div className="detail-layout">
          <div className="left-column">
            <section style={styles.galleryCard}>
              <h2 style={styles.sectionTitle}>Fotot</h2>
              <ImageGallery images={images} title={title} />
            </section>
          </div>

          <div className="right-column">
            <section style={styles.heroCard}>
              <p style={styles.eyebrow}>Makina e përzgjedhur</p>
              <h1 className="detail-title" style={styles.title}>
                {title}
              </h1>
              <p style={styles.price}>€ {price}</p>
              <p style={styles.subtext}>
                Kontakto shitësin për më shumë detaje ose për ta parë makinën nga afër.
              </p>
            </section>

            <section className="spec-grid" style={styles.specGrid}>
              {specs.map((spec) => (
                <div key={spec.label} style={styles.specCard}>
                  <p style={styles.specLabel}>{spec.label}</p>
                  <p style={styles.specValue}>{spec.value}</p>
                </div>
              ))}
            </section>

            <section style={styles.card}>
              <h2 style={styles.sectionTitle}>Shitësi</h2>
              <p style={styles.sellerName}>{sellerName}</p>
              <p style={styles.sellerType}>{sellerType}</p>
              {phoneString && <p style={styles.phonePreview}>{phoneString}</p>}
            </section>

            {(telPhone || whatsappLink) && (
              <section className="mobile-cta-card" style={styles.mobileCtaCard}>
                <div style={styles.mobileCtaStack}>
                  {telPhone && (
                    <a href={`tel:${telPhone}`} style={styles.callButton}>
                      📞 Telefono
                    </a>
                  )}

                  {whatsappLink && (
                    <a
                      href={whatsappLink}
                      target="_blank"
                      rel="noreferrer"
                      style={styles.whatsappButton}
                    >
                      💬 Dërgo mesazh në WhatsApp
                    </a>
                  )}
                </div>
              </section>
            )}
          </div>
        </div>
      </div>

      {(telPhone || whatsappLink) && (
        <div className="desktop-cta" style={styles.ctaBar}>
          <div style={styles.ctaInner}>
            {telPhone && (
              <a href={`tel:${telPhone}`} style={styles.callButton}>
                📞 Telefono
              </a>
            )}

            {whatsappLink && (
              <a
                href={whatsappLink}
                target="_blank"
                rel="noreferrer"
                style={styles.whatsappButton}
              >
                💬 Dërgo mesazh në WhatsApp
              </a>
            )}
          </div>
        </div>
      )}

      <style>{`
        .detail-layout {
          display: grid;
          gap: 22px;
        }

        .left-column,
        .right-column {
          display: grid;
          gap: 22px;
          align-content: start;
        }

        .spec-grid {
          grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
        }

        .desktop-cta {
          display: none;
        }

        .mobile-cta-card {
          display: block;
        }

        @media (min-width: 980px) {
          .detail-layout {
            grid-template-columns: minmax(0, 1.08fr) minmax(360px, 0.92fr);
            gap: 22px;
            align-items: start;
          }

          .right-column {
            position: sticky;
            top: 20px;
          }

          .spec-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .desktop-cta {
            display: block;
          }

          .mobile-cta-card {
            display: none;
          }
        }

        @media (max-width: 640px) {
          .detail-title {
            font-size: 28px !important;
            line-height: 1.12 !important;
          }
        }
      `}</style>
    </main>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    background:
      "linear-gradient(180deg, #06101d 0%, #07111f 45%, #020817 100%)",
    color: "white",
    padding: "24px 18px 140px",
  },

  container: {
    maxWidth: "1180px",
    margin: "0 auto",
  },

  backLink: {
    color: "#93c5fd",
    textDecoration: "none",
    display: "inline-block",
    marginBottom: "20px",
    fontWeight: 700,
  },

  errorTitle: {
    fontSize: "32px",
    fontWeight: 800,
  },

  heroCard: {
    background: "rgba(15,23,42,0.96)",
    border: "1px solid rgba(148,163,184,0.14)",
    borderRadius: "22px",
    padding: "22px",
    boxShadow: "0 10px 28px rgba(0,0,0,0.22)",
  },

  card: {
    background: "rgba(15,23,42,0.96)",
    border: "1px solid rgba(148,163,184,0.14)",
    borderRadius: "22px",
    padding: "22px",
    boxShadow: "0 10px 28px rgba(0,0,0,0.22)",
  },

  galleryCard: {
    background: "rgba(15,23,42,0.96)",
    border: "1px solid rgba(148,163,184,0.14)",
    borderRadius: "22px",
    padding: "14px",
    boxShadow: "0 10px 28px rgba(0,0,0,0.22)",
  },

  eyebrow: {
    margin: 0,
    color: "#93c5fd",
    fontSize: "13px",
    fontWeight: 700,
    letterSpacing: "1px",
    textTransform: "uppercase",
  },

  title: {
    fontSize: "34px",
    fontWeight: 800,
    margin: "10px 0",
    lineHeight: 1.1,
  },

  price: {
    fontSize: "32px",
    fontWeight: 800,
    margin: 0,
    color: "#60a5fa",
  },

  subtext: {
    margin: "10px 0 0 0",
    color: "#94a3b8",
    fontSize: "14px",
    lineHeight: 1.6,
  },

  sectionTitle: {
    fontSize: "24px",
    fontWeight: 800,
    margin: "0 0 14px 0",
  },

  specGrid: {
    display: "grid",
    gap: "14px",
  },

  specCard: {
    background: "#111c2f",
    border: "1px solid #1e293b",
    borderRadius: "18px",
    padding: "16px",
  },

  specLabel: {
    margin: "0 0 6px 0",
    color: "#94a3b8",
    fontSize: "12px",
  },

  specValue: {
    margin: 0,
    fontWeight: 700,
    fontSize: "18px",
  },

  sellerName: {
    margin: "0 0 8px 0",
    fontSize: "20px",
    fontWeight: 700,
    color: "white",
  },

  sellerType: {
    margin: 0,
    color: "#94a3b8",
    fontSize: "14px",
    textTransform: "uppercase",
    letterSpacing: "0.6px",
  },

  phonePreview: {
    margin: "14px 0 0 0",
    color: "#cbd5e1",
    fontSize: "14px",
    lineHeight: 1.5,
  },

  mobileCtaCard: {
    background: "rgba(15,23,42,0.96)",
    border: "1px solid rgba(148,163,184,0.14)",
    borderRadius: "22px",
    padding: "16px",
    boxShadow: "0 10px 28px rgba(0,0,0,0.22)",
  },

  mobileCtaStack: {
    display: "grid",
    gap: "10px",
  },

  ctaBar: {
    position: "fixed",
    left: 0,
    right: 0,
    bottom: 0,
    padding: "12px 16px",
    background: "rgba(2,6,23,0.92)",
    backdropFilter: "blur(10px)",
    borderTop: "1px solid rgba(148,163,184,0.14)",
    zIndex: 50,
  },

  ctaInner: {
    maxWidth: "1180px",
    margin: "0 auto",
    display: "flex",
    gap: "12px",
    flexWrap: "wrap",
  },

  callButton: {
    flex: 1,
    minWidth: "180px",
    textAlign: "center",
    padding: "12px 16px",
    borderRadius: "12px",
    background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
    color: "white",
    textDecoration: "none",
    fontWeight: 700,
    fontSize: "15px",
  },

  whatsappButton: {
    flex: 1,
    minWidth: "180px",
    textAlign: "center",
    padding: "12px 16px",
    borderRadius: "12px",
    background: "linear-gradient(135deg, #22c55e, #16a34a)",
    color: "white",
    textDecoration: "none",
    fontWeight: 700,
    fontSize: "15px",
  },
};