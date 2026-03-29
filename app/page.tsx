import Link from "next/link";

export default function LandingPage() {
  return (
    <main style={styles.page}>
      <div style={styles.container}>
        <div style={styles.topLogoWrap}>
          <img src="/logo.png" alt="HAVERI" style={styles.topLogo} />
        </div>

        <section className="landing-hero" style={styles.heroSection}>
          <div className="landing-left" style={styles.leftCard}>
            <p style={styles.eyebrow}>
              Platformë për blerje dhe shitje makinash
            </p>

            <h1 className="landing-title" style={styles.title}>
              HAVERI
            </h1>

            <p className="landing-text" style={styles.description}>
              Gjej makina në Shqipëri dhe Kosovë, krahaso ofertat dhe kontakto
              shitësin direkt. Në website mund të shohësh ofertat, ndërsa për të
              postuar makinën tënde përdor aplikacionin në Android ose iPhone.
            </p>

            <div className="landing-buttons" style={styles.buttonRow}>
              <a
                href="https://play.google.com/store/apps/details?id=com.haveri.app&pcampaignid=web_share"
                target="_blank"
                rel="noreferrer"
                style={styles.playButton}
              >
                🚀 Shkarko në Play Store
              </a>

              <a
                href="https://apps.apple.com/al/app/haveri/id6760816622"
                target="_blank"
                rel="noreferrer"
                style={styles.appStoreButton}
              >
                🍎 Shkarko në App Store
              </a>

              <Link href="/marketplace" style={styles.websiteButton}>
                🌐 Vazhdo në website
              </Link>
            </div>

            <div className="landing-meta" style={styles.metaRow}>
              <span>Android live</span>
              <span>iPhone live</span>
              <span>Shqipëri & Kosovë</span>
              <span>Postimi bëhet në app</span>
            </div>
          </div>

          <div className="landing-right" style={styles.rightCard}>
            <div style={styles.mockupWrap}>
              <img
                src="/haveri-app-preview.png"
                alt="HAVERI app preview"
                style={styles.heroImage}
              />
            </div>
          </div>
        </section>

        <section className="features-grid" style={styles.featuresGrid}>
          {[
            {
              title: "Kërko makina",
              desc: "Gjej makina sipas modelit, çmimit dhe qytetit.",
            },
            {
              title: "Kontakto direkt",
              desc: "Telefono ose shkruaj në WhatsApp pa ndërmjetës.",
            },
            {
              title: "Posto në aplikacion",
              desc: "Postimi i makinave për shitje bëhet në aplikacion, jo në web.",
            },
          ].map((item, i) => (
            <div key={i} style={styles.featureCard}>
              <h2 className="feature-title" style={styles.featureTitle}>
                {item.title}
              </h2>
              <p className="feature-text" style={styles.featureText}>
                {item.desc}
              </p>
            </div>
          ))}
        </section>

        <style>{`
          .landing-buttons a {
            transition: transform 0.2s ease, filter 0.2s ease, box-shadow 0.2s ease;
          }

          .landing-buttons a:hover {
            transform: translateY(-2px);
            filter: brightness(1.05);
          }

          .landing-buttons a:active {
            transform: scale(0.98);
          }

          @media (max-width: 980px) {
            .landing-hero {
              grid-template-columns: 1fr !important;
              gap: 18px !important;
            }

            .landing-left,
            .landing-right {
              padding: 24px !important;
            }

            .landing-buttons {
              flex-direction: column !important;
              align-items: stretch !important;
            }

            .landing-buttons a {
              width: 100% !important;
              box-sizing: border-box !important;
              justify-content: center !important;
              text-align: center !important;
            }

            .landing-meta {
              gap: 10px !important;
              font-size: 13px !important;
            }

            .features-grid {
              grid-template-columns: 1fr !important;
            }
          }

          @media (max-width: 640px) {
            .landing-title {
              font-size: 34px !important;
              line-height: 1.08 !important;
              margin: 14px 0 !important;
            }

            .landing-text {
              font-size: 16px !important;
              line-height: 1.7 !important;
            }

            .feature-title {
              font-size: 22px !important;
              line-height: 1.15 !important;
            }

            .feature-text {
              font-size: 15px !important;
              line-height: 1.65 !important;
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
      "linear-gradient(180deg, #03101f 0%, #07192f 45%, #020b16 100%)",
    color: "white",
    padding: "24px 18px 60px",
  },

  container: {
    maxWidth: "1180px",
    margin: "0 auto",
  },

  topLogoWrap: {
    marginBottom: "30px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  topLogo: {
    width: "220px",
    maxWidth: "70vw",
    objectFit: "contain",
    display: "block",
    filter: "drop-shadow(0 12px 30px rgba(0,0,0,0.35))",
  },

  heroSection: {
    display: "grid",
    gridTemplateColumns: "1.05fr 0.95fr",
    gap: "24px",
    alignItems: "stretch",
    marginBottom: "40px",
  },

  leftCard: {
    padding: "38px 32px",
    borderRadius: "28px",
    background:
      "linear-gradient(135deg, rgba(37,99,235,0.16), rgba(10,25,47,0.96))",
    border: "1px solid rgba(148,163,184,0.14)",
    boxShadow: "0 16px 40px rgba(0,0,0,0.22)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },

  rightCard: {
    padding: "24px",
    borderRadius: "28px",
    background: "rgba(10,25,47,0.96)",
    border: "1px solid rgba(148,163,184,0.14)",
    boxShadow: "0 16px 40px rgba(0,0,0,0.22)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },

  mockupWrap: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "360px",
    background:
      "radial-gradient(circle at center, rgba(37,99,235,0.16), rgba(2,6,23,0.15))",
    borderRadius: "22px",
    padding: "10px",
  },

  eyebrow: {
    margin: 0,
    fontSize: "13px",
    color: "#93c5fd",
    fontWeight: 700,
    letterSpacing: "1px",
    textTransform: "uppercase",
  },

  title: {
    margin: "16px 0 16px 0",
    fontSize: "52px",
    lineHeight: 1.04,
    fontWeight: 800,
  },

  description: {
    margin: 0,
    color: "#dbe4f0",
    fontSize: "18px",
    lineHeight: 1.8,
    maxWidth: "650px",
  },

  buttonRow: {
    display: "flex",
    gap: "12px",
    flexWrap: "wrap",
    marginTop: "28px",
  },

  playButton: {
    padding: "15px 22px",
    borderRadius: "14px",
    background: "linear-gradient(135deg, #22c55e, #16a34a)",
    color: "white",
    textDecoration: "none",
    fontWeight: 800,
    fontSize: "15px",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 12px 28px rgba(34,197,94,0.35)",
  },

  appStoreButton: {
    padding: "15px 22px",
    borderRadius: "14px",
    background: "linear-gradient(135deg, #0f172a, #1e293b)",
    color: "white",
    textDecoration: "none",
    fontWeight: 800,
    fontSize: "15px",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    border: "1px solid rgba(148,163,184,0.2)",
    boxShadow: "0 10px 24px rgba(0,0,0,0.35)",
  },

  websiteButton: {
    padding: "15px 22px",
    borderRadius: "14px",
    background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
    color: "white",
    textDecoration: "none",
    fontWeight: 800,
    fontSize: "15px",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 12px 28px rgba(37,99,235,0.35)",
  },

  metaRow: {
    marginTop: "20px",
    display: "flex",
    gap: "18px",
    flexWrap: "wrap",
    color: "#94a3b8",
    fontSize: "14px",
  },

  heroImage: {
    width: "100%",
    height: "auto",
    maxHeight: "560px",
    objectFit: "contain",
    borderRadius: "20px",
    display: "block",
    margin: "0 auto",
    boxShadow: "0 18px 40px rgba(0,0,0,0.30)",
  },

  featuresGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: "16px",
  },

  featureCard: {
    padding: "24px",
    borderRadius: "22px",
    background: "rgba(10,25,47,0.96)",
    border: "1px solid rgba(148,163,184,0.14)",
    boxShadow: "0 10px 24px rgba(0,0,0,0.12)",
  },

  featureTitle: {
    margin: "0 0 10px 0",
    fontWeight: 800,
    fontSize: "28px",
    lineHeight: 1.1,
  },

  featureText: {
    margin: 0,
    color: "#94a3b8",
    lineHeight: 1.75,
    fontSize: "16px",
  },
};