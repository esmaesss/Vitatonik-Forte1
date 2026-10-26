import { useEffect, useRef, useState } from "react";

const PHOTOS = [
  ["veteriner-1.jpg", "Veteriner hekim muayene ederken"],
  ["kedi-1.jpg", "Sağlıklı kedi"],
  ["urun-1.jpg", "Vitatonik Forte şişesi"],
  ["kopek-1.jpg", "Mutlu köpek"],
  ["veteriner-2.jpg", "Veteriner kliniği"],
  ["urun-2.jpg", "Vitamin şişeleri"],
  ["kedi-2.jpg", "Yavru kedi"],
  ["kopek-2.jpg", "Koşan köpek"],
];

const VITAMINS = [
  ["Vitamin A", "15.000 IU/L"], ["Vitamin D3", "3.750 IU/L"], ["Vitamin E", "7.500 mg/L"],
  ["Vitamin B1", "1.000 mg/L"], ["Vitamin B2", "1.000 mg/L"], ["Vitamin B5", "1.500 mg/L"],
  ["Vitamin B6", "1.500 mg/L"], ["Vitamin C", "100 mg/L"], ["Vitamin B12", "0,015 mg/L"],
  ["Vitamin K3", "2.250 mg/L"], ["Vitamin PP", "15.000 mg/L"],
];
const MINERALS = [
  ["Bakır", "250 mg/L"], ["Çinko", "600 mg/L"], ["Demir", "1.500 mg/L"], ["Mangan", "600 mg/L"],
  ["Kalsiyum", "6.700 mg/L"], ["Kobalt", "250 mg/L"], ["Magnezyum", "3.500 mg/L"],
  ["Potasyum", "1.200 mg/L"], ["Selenyum", "50 mg/L"], ["Sodyum", "1.600 mg/L"],
];

// Eleman ekranın ortasındayken büyür, uzaklaştıkça küçülür.
function useScrollScale(min = 0.78, max = 1.04) {
  const ref = useRef(null);
  const [s, setS] = useState(min);
  useEffect(() => {
    let raf;
    const tick = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        if (!ref.current) return;
        const b = ref.current.getBoundingClientRect();
        const d = Math.abs((b.top + b.height / 2) / innerHeight - 0.5);
        setS(Math.max(min, max - d * 0.8));
      });
    };
    tick();
    addEventListener("scroll", tick, { passive: true });
    addEventListener("resize", tick);
    return () => { removeEventListener("scroll", tick); removeEventListener("resize", tick); cancelAnimationFrame(raf); };
  }, [min, max]);
  return [ref, s];
}

function Photo({ file, alt, className = "" }) {
  return (
    <figure className={`photo ${className}`}>
      <img src={`/images/${file}`} alt={alt} loading="lazy" onError={(e) => (e.currentTarget.style.display = "none")} />
    </figure>
  );
}

function ScaleBlock({ children, className = "" }) {
  const [ref, s] = useScrollScale();
  return (
    <div ref={ref} className={className} style={{ transform: `scale(${s})`, opacity: Math.min(1, 0.35 + (s - 0.78) * 2.6) }}>
      {children}
    </div>
  );
}

function Marquee({ reverse }) {
  const items = [...PHOTOS, ...PHOTOS];
  return (
    <div className="marquee">
      <div className={`track ${reverse ? "rev" : ""}`}>
        {items.map(([f, a], i) => <Photo key={i} file={f} alt={a} className="m-item" />)}
      </div>
    </div>
  );
}

function Contact() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [state, setState] = useState({ status: "idle", msg: "" });
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  async function submit() {
    setState({ status: "loading", msg: "" });
    try {
      const r = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error);
      setState({ status: "ok", msg: "Mesajınız gönderildi. En kısa sürede dönüş yapacağız." });
      setForm({ name: "", email: "", phone: "", message: "" });
    } catch (err) {
      setState({ status: "err", msg: err.message || "Gönderilemedi. Lütfen tekrar deneyin." });
    }
  }

  return (
    <div className="form">
      <input placeholder="Ad soyad" value={form.name} onChange={set("name")} />
      <input placeholder="E-posta" type="email" value={form.email} onChange={set("email")} />
      <input placeholder="Telefon (isteğe bağlı)" value={form.phone} onChange={set("phone")} />
      <textarea rows="4" placeholder="Mesajınız" value={form.message} onChange={set("message")} />
      <button onClick={submit} disabled={state.status === "loading"}>
        {state.status === "loading" ? "Gönderiliyor" : "Mesaj gönder"}
      </button>
      {state.msg && <p className={`note ${state.status}`}>{state.msg}</p>}
    </div>
  );
}

export default function App() {
  return (
    <>
      <header className="nav">
        <a href="#top" className="logo"><span className="cross">+</span>Vitatonik</a>
        <nav>
          <a href="#urun">Ürün</a><a href="#kullanim">Kullanım</a>
          <a href="#hakkimizda">Hakkımızda</a><a href="#iletisim" className="pill">İletişim</a>
        </nav>
      </header>

      <section id="top" className="hero">
        <div className="hero-text">
          <p className="tag">Veteriner hekim tavsiyesiyle kullanılır</p>
          <h1>Her damlada<br />güçlü bir<br />başlangıç.</h1>
          <p className="lead">Vitatonik Forte; kedi ve köpekler için mineral, amino asit ve vitamin desteği sağlayan oral çözelti yem premiksidir.</p>
          <div className="cta"><a href="#urun" className="btn">İçeriği incele</a><a href="#iletisim" className="btn ghost">Bize ulaşın</a></div>
        </div>
        <div className="hero-visual">
          <div className="bottle">
            <span>100 ml</span><b>VİTATONİK<br />FORTE</b><small>Likit Mineral · Amino Asit · Vitamin</small>
          </div>
          <Photo file="kopek-1.jpg" alt="Mutlu köpek" className="float f1" />
          <Photo file="kedi-1.jpg" alt="Sağlıklı kedi" className="float f2" />
        </div>
      </section>

      <Marquee />
      <Marquee reverse />

      <section id="urun" className="section">
        <ScaleBlock className="head"><h2>Etiketteki her değer, açıkça.</h2><p>1 litre Vitatonik Forte içeriği:</p></ScaleBlock>
        <div className="cols">
          <ScaleBlock className="card"><h3>Vitaminler</h3>{VITAMINS.map(([n, v]) => <div className="row" key={n}><span>{n}</span><b>{v}</b></div>)}</ScaleBlock>
          <ScaleBlock className="card red"><h3>İz element bileşikleri</h3>{MINERALS.map(([n, v]) => <div className="row" key={n}><span>{n}</span><b>{v}</b></div>)}</ScaleBlock>
          <ScaleBlock className="card"><h3>Amino asitler</h3><p className="small">L-Lysine, DL-Methionine, Cystine, Threonine, Arginine, Serine, Tryptophan, Isoleucine, Phenylalanine, Valine, Glutamic acid, Aspartic acid, Alanine, Glycine, Histidine, Leucine, Tyrosine ve Proline ile tuzları ve analogları.</p><h3>Teknolojik katkı</h3><p className="small">Koruyucu: Fosfor (ortofosforik asit E338), 7.200 mg/L.</p></ScaleBlock>
        </div>
      </section>

      <section id="kullanim" className="section tint">
        <ScaleBlock className="head"><h2>Kullanım</h2></ScaleBlock>
        <div className="cols two">
          <ScaleBlock className="dose"><b>0–5 kg</b><span>2 ml / gün</span></ScaleBlock>
          <ScaleBlock className="dose"><b>5–10 kg</b><span>4 ml / gün</span></ScaleBlock>
        </div>
        <p className="center">Suda kolayca çözünür; her gün taze olarak içme suyuna katılır. Veteriner hekim tavsiyesiyle 3–7 gün sürdürülebilir, ihtiyaç halinde tekrarlanabilir. Serin, kuru ve ışıksız ortamda saklayın (15–25 °C). Işıktan uzakta saklandığında imal tarihinden itibaren 24 ay dayanır.</p>
        <p className="warn">Bu bir ilaç değil, yem premiksidir. Tedavi amacıyla kullanılmaz.</p>
      </section>

      <section id="hakkimizda" className="section about">
        <ScaleBlock className="about-img"><Photo file="veteriner-1.jpg" alt="Veteriner hekim" /></ScaleBlock>
        <ScaleBlock className="about-text">
          <h2>Hakkımızda</h2>
          <p>BİL-YEM Gıda San. ve Tic. Ltd. Şti., Ankara Sincan’daki tesisinde hayvan sağlığına yönelik yem katkı ve premiks ürünleri üretir. Her seri, kayıtlı seri numarası ve son kullanma tarihiyle takip edilir.</p>
          <p>Onay tarihi ve no: 24.07.2012 · TR 0600030</p>
        </ScaleBlock>
      </section>

      <section id="iletisim" className="section">
        <ScaleBlock className="head"><h2>İletişim</h2><p>Bayilik, toplu sipariş ve ürün soruları için yazın.</p></ScaleBlock>
        <div className="cols two">
          <ScaleBlock className="card"><h3>Üretim ve paketleme adresi</h3><p>BİL-YEM GIDA SAN. ve TİC. LTD. ŞTİ.<br />Ayaş yolu 35. km Yenikent, Sincan / ANKARA</p><p className="small">Ticari takdim: 100 ml plastik şişe; 1 lt, 5 lt ve 20 lt bidonlar.</p></ScaleBlock>
          <ScaleBlock><Contact /></ScaleBlock>
        </div>
      </section>

      <footer>© 2026 BİL-YEM Gıda San. ve Tic. Ltd. Şti. Tüm hakları saklıdır.</footer>
    </>
  );
}