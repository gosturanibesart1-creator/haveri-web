import Link from "next/link";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";

type Car = {
  id: string;
  title?: string;
  price?: string | number;
  city?: string;
  fuel?: string;
  km?: string | number;
  transmission?: string;
  phone?: string;
  images?: string[];
  isActive?: boolean;
};

async function getCars(): Promise<Car[]> {
  const carsQuery = query(
    collection(db, "cars"),
    where("isActive", "==", true)
  );

  const snapshot = await getDocs(carsQuery);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Car[];
}

function normalizeCityName(city?: string): string {
  if (!city) return "";

  const cleaned = city.trim().toLowerCase();

  const map: Record<string, string> = {
    tirane: "Tiranë",
    tirana: "Tiranë",
    "tiranë": "Tiranë",

    durres: "Durrës",
    "durrës": "Durrës",
    "durres-trane km.12": "Durrës",
    "durres-trane km12": "Durrës",
    "durres trane km.12": "Durrës",
    "durres trane km12": "Durrës",

    prishtine: "Prishtinë",
    "prishtinë": "Prishtinë",

    vlore: "Vlorë",
    "vlorë": "Vlorë",

    elbasan: "Elbasan",
    fier: "Fier",

    suhareke: "Suharekë",
    "suharekë": "Suharekë",

    tropoj: "Tropojë",
    tropoje: "Tropojë",
    "tropojë": "Tropojë",
  };

  if (map[cleaned]) return map[cleaned];

  return city.trim();
}

function getUniqueCities(cars: Car[]): string[] {
  const seen = new Set<string>();

  return cars
    .map((car) => normalizeCityName(car.city))
    .filter((city) => city.length > 0)
    .filter((city) => {
      const key = city.toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .sort((a, b) => a.localeCompare(b, "sq"));
}

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; city?: string }>;
}) {
  const cars = await getCars();
  const params = await searchParams;

  const q = (params.q || "").trim().toLowerCase();
  const selectedCity = normalizeCityName(params.city || "");

  const filteredCars = cars
    .filter((car) => Array.isArray(car.images) && car.images.length > 0)
    .filter((car) => {
      const title = (car.title || "").toLowerCase();
      const normalizedCarCity = normalizeCityName(car.city);

      const matchesQuery = q ? title.includes(q) : true;
      const matchesCity = selectedCity ? normalizedCarCity === selectedCity : true;

      return matchesQuery && matchesCity;
    });

  const uniqueCities = getUniqueCities(cars);

  return (
    <main style={styles.page}>
      <div style={styles.container}>
        <div className="topbar" style={styles.topBar}>
          <Link href="/" style={styles.backButton}>
            ←
          </Link>

          <div style={styles.logoWrap}>
            <img src="/logo.png" alt="HAVERI" style={styles.logo} />
          </div>

          <div style={styles.topBarSpacer} />
        </div>

        <section className="hero-card" style={styles.heroCard}>
          <p style={styles.eyebrow}>Gjej makinën tënde</p>

          <h1 className="hero-title" style={styles.heroTitle}>
            Makina në shitje nga Shqipëria dhe Kosova
          </h1>

          <p className="hero-text" style={styles.heroText}>
            Shiko ofertat, krahaso çmimet dhe kontakto shitësin direkt te faqja e
            detajeve.
          </p>

          <form method="GET" className="search-form" style={styles.searchForm}>
            <input
              type="text"
              name="q"
              defaultValue={params.q || ""}
              placeholder="🔎 Kërko markë ose model..."
              style={styles.searchInput}
            />

            <select
              name="city"
              defaultValue={selectedCity}
              style={styles.searchSelect}
            >
              <option value="">📍 Të gjitha qytetet</option>
              {uniqueCities.map((cityName) => (
                <option
                  key={cityName}
                  value={cityName}
                  style={{ color: "black" }}
                >
                  {cityName}
                </option>
              ))}
            </select>

            <button type="submit" style={styles.searchButton}>
              Kërko
            </button>

            <Link href="/marketplace" style={styles.clearButton}>
              Pastro
            </Link>
          </form>
        </section>

        <div className="section-header" style={styles.sectionHeader}>
          <div>
            <h2 style={styles.sectionTitle}>Makinat e fundit</h2>
            <p style={styles.sectionText}>
              Zgjidh një makinë dhe shiko detajet
            </p>
          </div>

          <div style={styles.activeBadge}>
            {filteredCars.length} makina aktive
          </div>
        </div>

        {filteredCars.length === 0 ? (
          <div style={styles.emptyState}>
            Nuk u gjet asnjë makinë për këtë kërkim.
          </div>
        ) : (
          <div className="cars-grid" style={styles.carsGrid}>
            {filteredCars.map((car) => (
              <article key={car.id} style={styles.card}>
                <Link href={`/car/${car.id}`} style={styles.cardLink}>
                  <div style={styles.imageWrap}>
                    <img
                      src={car.images?.[0]}
                      alt={car.title || "Makina"}
                      style={styles.cardImage}
                    />

                    <div style={styles.imageBadge}>HAVERI</div>
                  </div>

                  <div style={styles.cardBody}>
                    <h3 className="card-title" style={styles.cardTitle}>
                      {car.title || "Pa titull"}
                    </h3>

                    <p style={styles.cardPrice}>
                      € {car.price || "Pa çmim"}
                    </p>

                    <div style={styles.cardMeta}>
                      <span>{normalizeCityName(car.city) || "Pa qytet"}</span>
                      <span>•</span>
                      <span>{car.fuel || "Pa karburant"}</span>
                    </div>
                  </div>
                </Link>

                <div style={styles.cardFooter}>
                  <Link href={`/car/${car.id}`} style={styles.detailsButton}>
                    Shiko detajet
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}

        <style>{`
          @media (max-width: 900px) {
            .search-form {
              grid-template-columns: 1fr !important;
            }

            .section-header {
              align-items: stretch !important;
            }

            .cars-grid {
              grid-template-columns: 1fr !important;
            }
          }

          @media (max-width: 640px) {
            .hero-title {
              font-size: 28px !important;
              line-height: 1.12 !important;
            }

            .hero-text {
              font-size: 15px !important;
            }

            .card-title {
              font-size: 17px !important;
            }
          }
        `}</style>
      </div>
    </main>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    background:
      "linear-gradient(180deg, #030712 0%, #07111f 35%, #020817 100%)",
    color: "white",
    padding: "20px 16px 40px",
  },

  container: {
    maxWidth: "1240px",
    margin: "0 auto",
  },

  topBar: {
    display: "grid",
    gridTemplateColumns: "auto 1fr auto",
    alignItems: "center",
    marginBottom: "18px",
    padding: "14px 18px",
    borderRadius: "18px",
    background: "rgba(15,23,42,0.72)",
    border: "1px solid rgba(148,163,184,0.12)",
    backdropFilter: "blur(10px)",
    gap: "12px",
  },

  backButton: {
    width: "40px",
    height: "40px",
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#1e293b",
    color: "white",
    textDecoration: "none",
    fontSize: "20px",
    fontWeight: 800,
  },

  logoWrap: {
    display: "flex",
    justifyContent: "center",
  },

  logo: {
    width: "150px",
    objectFit: "contain",
    display: "block",
    filter: "drop-shadow(0 10px 24px rgba(0,0,0,0.28))",
  },

  topBarSpacer: {},

  heroCard: {
    marginBottom: "28px",
    padding: "28px 22px",
    borderRadius: "26px",
    background:
      "linear-gradient(135deg, rgba(37,99,235,0.18), rgba(15,23,42,0.96))",
    border: "1px solid rgba(148,163,184,0.14)",
    boxShadow: "0 16px 40px rgba(0,0,0,0.25)",
  },

  eyebrow: {
    margin: 0,
    fontSize: "11px",
    color: "#93c5fd",
    fontWeight: 700,
    letterSpacing: "1px",
    textTransform: "uppercase",
  },

  heroTitle: {
    margin: "8px 0 10px 0",
    fontSize: "34px",
    lineHeight: 1.08,
    fontWeight: 800,
    maxWidth: "760px",
  },

  heroText: {
    margin: 0,
    color: "#cbd5e1",
    fontSize: "16px",
    lineHeight: 1.7,
    maxWidth: "760px",
  },

  searchForm: {
    marginTop: "20px",
    display: "grid",
    gridTemplateColumns: "1.4fr 1fr auto auto",
    gap: "10px",
    alignItems: "center",
  },

  searchInput: {
    minHeight: "50px",
    padding: "0 14px",
    borderRadius: "14px",
    outline: "none",
    background: "rgba(2,6,23,0.6)",
    border: "1px solid rgba(148,163,184,0.14)",
    color: "white",
    fontSize: "14px",
  },

  searchSelect: {
    minHeight: "50px",
    padding: "0 14px",
    borderRadius: "14px",
    outline: "none",
    background: "rgba(2,6,23,0.6)",
    border: "1px solid rgba(148,163,184,0.14)",
    color: "white",
    fontSize: "14px",
  },

  searchButton: {
    minHeight: "50px",
    padding: "0 20px",
    borderRadius: "14px",
    border: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#2563eb",
    color: "white",
    fontWeight: 800,
    fontSize: "14px",
    cursor: "pointer",
  },

  clearButton: {
    minHeight: "50px",
    padding: "0 18px",
    borderRadius: "14px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "rgba(255,255,255,0.06)",
    color: "#cbd5e1",
    textDecoration: "none",
    fontWeight: 700,
    fontSize: "14px",
    border: "1px solid rgba(148,163,184,0.12)",
  },

  sectionHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginBottom: "16px",
    gap: "12px",
    flexWrap: "wrap",
  },

  sectionTitle: {
    margin: 0,
    fontSize: "28px",
    fontWeight: 800,
  },

  sectionText: {
    margin: "6px 0 0 0",
    color: "#94a3b8",
    fontSize: "15px",
  },

  activeBadge: {
    padding: "10px 14px",
    borderRadius: "12px",
    background: "#1d4ed8",
    color: "white",
    fontWeight: 700,
    fontSize: "14px",
  },

  emptyState: {
    padding: "32px",
    borderRadius: "20px",
    background: "#0f172a",
    border: "1px solid #1e293b",
    textAlign: "center",
    color: "#cbd5e1",
  },

  carsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "18px",
  },

  card: {
    border: "1px solid rgba(148,163,184,0.12)",
    borderRadius: "24px",
    overflow: "hidden",
    background: "rgba(15,23,42,0.96)",
    boxShadow: "0 14px 30px rgba(0,0,0,0.22)",
  },

  cardLink: {
    textDecoration: "none",
    color: "inherit",
    display: "block",
  },

  imageWrap: {
    position: "relative",
  },

  cardImage: {
    width: "100%",
    height: "220px",
    objectFit: "cover",
    display: "block",
  },

  imageBadge: {
    position: "absolute",
    top: "12px",
    left: "12px",
    background: "rgba(2,6,23,0.72)",
    backdropFilter: "blur(6px)",
    color: "#fff",
    padding: "6px 10px",
    borderRadius: "999px",
    fontSize: "11px",
    fontWeight: 700,
    border: "1px solid rgba(255,255,255,0.08)",
  },

  cardBody: {
    padding: "18px",
  },

  cardTitle: {
    fontSize: "18px",
    fontWeight: 800,
    margin: "0 0 10px 0",
    lineHeight: 1.25,
    minHeight: "45px",
    display: "-webkit-box",
    WebkitLineClamp: 2,
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
  } as React.CSSProperties,

  cardPrice: {
    fontSize: "24px",
    fontWeight: 800,
    margin: "0 0 12px 0",
    color: "#60a5fa",
  },

  cardMeta: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    color: "#94a3b8",
    fontSize: "15px",
    flexWrap: "wrap",
  },

  cardFooter: {
    display: "flex",
    gap: "10px",
    padding: "0 18px 18px 18px",
  },

  detailsButton: {
    flex: 1,
    textAlign: "center",
    padding: "12px 16px",
    borderRadius: "14px",
    background: "#2563eb",
    color: "white",
    textDecoration: "none",
    fontWeight: 700,
  },
};