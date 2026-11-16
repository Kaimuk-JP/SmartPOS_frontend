import Link from "next/link";
import { Kanit, Noto_Serif_Thai } from "next/font/google";
import s from "./landing.module.css";

const display = Kanit({ weight: ["600", "800"], subsets: ["thai", "latin"], variable: "--font-display" });
const serif = Noto_Serif_Thai({ weight: ["400"], subsets: ["thai", "latin"], variable: "--font-serif" });

const img = (name: string) => `/products/${name}.svg`;

const menu = [
  ["latte-iced", "ลาเต้เย็น"],
  ["thai-tea-iced", "ชาไทยเย็น"],
  ["plain-croissant-special", "ครัวซองต์"],
  ["tiramisu-premium", "ทีรามิสุ"],
  ["pad-thai-signature", "ผัดไทย"],
  ["waffle-supreme", "วาฟเฟิล"],
  ["cold-brew-iced", "โคลด์บรูว์"],
  ["macaron-special", "มาการอง"],
  ["espresso-hot", "เอสเพรสโซ"],
  ["lemon-tea-iced", "ชามะนาว"],
];

const week = [
  ["จ", 46], ["อ", 52], ["พ", 49], ["พฤ", 61], ["ศ", 78], ["ส", 100], ["อา", 88],
] as const;

export default function LandingPage() {
  return (
    <div className={`${s.page} ${display.variable} ${serif.variable}`}>
      <header className={s.nav}>
        <Link href="/" className={s.mark}>Smart POS</Link>
        <nav className={s.pill} aria-label="ส่วนต่างๆ ของหน้า">
          <a href="#features">ทำอะไรได้</a>
          <a href="#doors">เข้าใช้งาน</a>
          <Link href="/member/login">สมาชิก</Link>
        </nav>
        <Link href="/login" className={s.enter}>เข้าสู่ระบบร้านค้า</Link>
      </header>

      <main>
        <section className={s.hero}>
          <p className={`${s.lede} ${s.serif}`}>ขายหน้าร้าน สต็อก และสมาชิก ในระบบเดียว</p>
          <h1 className={s.title}>
            <span>ขายทุกแก้ว</span>
            <span className={s.serif}>ให้ลื่นไหล</span>
          </h1>
          <a href="#features" className={`${s.more} ${s.serif}`}>
            ดูว่าทำอะไรได้ <i aria-hidden="true">↓</i>
          </a>

          <div className={s.belt} aria-hidden="true">
            <div className={s.track}>
              {[...menu, ...menu].map(([file, name], i) => (
                <div className={s.dish} key={i}>
                  <img src={img(file)} alt="" width={64} height={64} loading={i < 8 ? "eager" : "lazy"} />
                  {name}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className={s.work} id="features">
          <div className={s.sectionHead}>
            <p className={s.serif}>ตั้งแต่ออเดอร์แรกของวัน จนถึงปิดยอดตอนค่ำ</p>
            <h2>งานร้าน <span className={s.serif}>ครบจบ</span></h2>
          </div>

          <div className={s.stack}>
            <article className={s.card}>
              <div className={s.inner}>
                <div>
                  <h3>แตะเมนู <em className={s.serif}>คิดเงิน</em></h3>
                  <p>หน้าขายแบบแตะรูปสินค้า รวมยอดให้ทันที ออกใบเสร็จได้เลย และมีจอฝั่งลูกค้าให้เห็นรายการไปพร้อมกัน</p>
                </div>
                <div className={s.demo}>
                  <p className={s.demoNote}>ตัวอย่างหน้าขาย</p>
                  <div className={s.tiles}>
                    {[["latte-iced", "ลาเต้เย็น", 65], ["thai-tea-iced", "ชาไทยเย็น", 55], ["plain-croissant-special", "ครัวซองต์", 79]].map(([f, n, p]) => (
                      <div className={s.tile} key={f}>
                        <img src={img(String(f))} alt="" width={120} height={120} loading="lazy" />
                        {n}<small>฿{p}</small>
                      </div>
                    ))}
                  </div>
                  <div className={s.total}><span>3 รายการ</span><span>฿199</span></div>
                </div>
              </div>
            </article>

            <article className={s.card}>
              <div className={s.inner}>
                <div>
                  <h3>ของใกล้หมด <em className={s.serif}>รู้ก่อน</em></h3>
                  <p>สต็อกตัดตามที่ขายจริง ดูของคงเหลือแยกรายการ และมีรายงานสต็อกให้ตรวจย้อนหลัง</p>
                </div>
                <div className={s.demo}>
                  <p className={s.demoNote}>ตัวอย่างสต็อก</p>
                  <div className={s.rows}>
                    {[["cold-brew-iced", "โคลด์บรูว์", 82, 41, false], ["tiramisu-premium", "ทีรามิสุ", 46, 12, false], ["macaron-special", "มาการอง", 12, 3, true]].map(([f, n, pct, left, low]) => (
                      <div className={s.row} key={String(f)}>
                        <img src={img(String(f))} alt="" width={44} height={44} loading="lazy" />
                        <div>{n}<div className={s.bar}><i className={low ? s.low : undefined} style={{ width: `${pct}%` }} /></div></div>
                        <div className={s.qty}>เหลือ {left}{low ? <b>ใกล้หมด</b> : null}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </article>

            <article className={s.card}>
              <div className={s.inner}>
                <div>
                  <h3>ลูกค้าประจำ <em className={s.serif}>ได้แต้ม</em></h3>
                  <p>สมัครสมาชิก สะสมแต้มจากทุกบิล แลกของรางวัลได้เอง และเปิดดูประวัติแต้มได้จากมือถือ</p>
                </div>
                <div className={s.demo}>
                  <p className={s.demoNote}>ตัวอย่างบัตรสมาชิก</p>
                  <div className={s.member}>
                    <small>แต้มสะสม</small>
                    <div className={s.points}>1,240</div>
                    <div className={s.stamps}>{Array.from({ length: 8 }, (_, i) => <i key={i} className={i < 5 ? s.on : undefined} />)}</div>
                  </div>
                  <div className={s.reward}>
                    <img src={img("waffle-supreme")} alt="" width={48} height={48} loading="lazy" />
                    <div>วาฟเฟิล 1 ชิ้น<small>แลกได้ที่ 1,000 แต้ม</small></div>
                  </div>
                </div>
              </div>
            </article>

            <article className={s.card}>
              <div className={s.inner}>
                <div>
                  <h3>ปิดยอด <em className={s.serif}>เห็นภาพ</em></h3>
                  <p>แดชบอร์ดสรุปยอดขาย บิล และสินค้าขายดี ให้เจ้าของร้านดูได้โดยไม่ต้องนั่งรวมตัวเลขเอง</p>
                </div>
                <div className={s.demo}>
                  <p className={s.demoNote}>ตัวอย่างยอดขายรายวัน</p>
                  <div className={s.chart}>
                    {week.map(([d, h]) => (
                      <div key={d}><i className={h === 100 ? s.peak : undefined} style={{ height: `${h}%` }} />{d}</div>
                    ))}
                  </div>
                </div>
              </div>
            </article>
          </div>
        </section>

        <section className={s.doors} id="doors" aria-label="เข้าใช้งาน">
          <Link href="/login" className={`${s.door} ${s.shop}`}>
            <small className={s.serif}>ขายสินค้า จัดการสต็อก และดูรายงาน</small>
            <div>
              <strong><span>สำหรับ</span><span className={s.serif}>ร้านค้า</span></strong>
              <span className={s.go}>เข้าสู่ระบบร้านค้า <i aria-hidden="true">→</i></span>
            </div>
          </Link>
          <Link href="/member/login" className={`${s.door} ${s.club}`}>
            <small className={s.serif}>ดูแต้มสะสม แลกของรางวัล และประวัติการซื้อ</small>
            <div>
              <strong><span>สำหรับ</span><span className={s.serif}>สมาชิก</span></strong>
              <span className={s.go}>เข้าสู่ระบบสมาชิก <i aria-hidden="true">→</i></span>
            </div>
          </Link>
        </section>
      </main>

      <footer className={s.foot}>
        <p className={s.word}>Smart POS</p>
        <div className={s.footRow}>
          <span>© {new Date().getFullYear()} Smart POS Cloud</span>
          <span><Link href="/login">ร้านค้า</Link> &nbsp; <Link href="/member/login">สมาชิก</Link> &nbsp; <Link href="/register">สมัครใช้งาน</Link></span>
        </div>
      </footer>
    </div>
  );
}
