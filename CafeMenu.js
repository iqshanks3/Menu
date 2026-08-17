use client";

import { useEffect, useMemo, useState } from "react";

const initialProducts = [
  { id: 1, name: "كابتشينو", category: "قهوة", price: 3500, desc: "إسبريسو مع حليب ورغوة ناعمة", emoji: "☕" },
  { id: 2, name: "لاتيه", category: "قهوة", price: 4000, desc: "قهوة ناعمة بالحليب المبخر", emoji: "🥛" },
  { id: 3, name: "آيس كوفي", category: "بارد", price: 4500, desc: "قهوة باردة منعشة مع الثلج", emoji: "🧊" },
  { id: 4, name: "موهيتو", category: "بارد", price: 4000, desc: "ليمون ونعناع وصودا", emoji: "🍋" },
  { id: 5, name: "تشيز كيك", category: "حلويات", price: 5000, desc: "قطعة تشيز كيك كريمية", emoji: "🍰" },
  { id: 6, name: "براوني", category: "حلويات", price: 3500, desc: "براوني شوكولاتة غني", emoji: "🍫" }
];

const categories = ["الكل", "قهوة", "بارد", "حلويات"];

export default function CafeMenu() {
  const [products, setProducts] = useState(initialProducts);
  const [category, setCategory] = useState("الكل");
  const [query, setQuery] = useState("");
  const [cart, setCart] = useState([]);
  const [ownerOpen, setOwnerOpen] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [secret, setSecret] = useState("");
  const [notice, setNotice] = useState("");
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("cafe-products");
      if (saved) setProducts(JSON.parse(saved));
    } catch {}
  }, []);

  useEffect(() => {
    localStorage.setItem("cafe-products", JSON.stringify(products));
  }, [products]);

  const filtered = useMemo(() => {
    return products.filter(p =>
      (category === "الكل" || p.category === category) &&
      `${p.name} ${p.desc}`.toLowerCase().includes(query.toLowerCase())
    );
  }, [products, category, query]);

  const total = cart.reduce((sum, p) => sum + p.price, 0);

  function addToCart(product) {
    setCart(c => [...c, product]);
    setNotice(`تمت إضافة ${product.name} إلى الطلب`);
    setTimeout(() => setNotice(""), 1800);
  }

  function removeFromCart(index) {
    setCart(c => c.filter((_, i) => i !== index));
  }

  function ownerLogin(e) {
    e.preventDefault();
    // Demo only: replace the API auth before production.
    if (secret === "2580") {
      setLoggedIn(true);
      setSecret("");
      setNotice("تم فتح لوحة المالك");
    } else {
      setNotice("الرمز السري غير صحيح");
    }
  }

  function saveProduct(e) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const item = {
      id: editing?.id ?? Date.now(),
      name: f.get("name"),
      category: f.get("category"),
      price: Number(f.get("price")),
      desc: f.get("desc"),
      emoji: f.get("emoji") || "☕"
    };
    setProducts(p => editing ? p.map(x => x.id === editing.id ? item : x) : [item, ...p]);
    setEditing(null);
    e.currentTarget.reset();
  }

  function deleteProduct(id) {
    if (confirm("حذف هذا المنتج؟")) setProducts(p => p.filter(x => x.id !== id));
  }

  return (
    <main>
      <header className="hero">
        <div className="heroInner">
          <div>
            <span className="badge">☕ OPEN DAILY</span>
            <h1>مزاج كافيه</h1>
            <p>قهوة تحلي يومك، وذوق يرجعك مرة ثانية.</p>
          </div>
          <button className="ownerTrigger" onClick={() => setOwnerOpen(true)} aria-label="Owner">
            ⚙
          </button>
        </div>
      </header>

      <section className="toolbar">
        <input
          className="search"
          placeholder="ابحث عن مشروب أو حلو..."
          value={query}
          onChange={e => setQuery(e.target.value)}
        />
        <div className="chips">
          {categories.map(c => (
            <button key={c} className={category === c ? "chip active" : "chip"} onClick={() => setCategory(c)}>
              {c}
            </button>
          ))}
        </div>
      </section>

      <section className="content">
        <div className="sectionTitle">
          <div>
            <small>OUR MENU</small>
            <h2>اختار مزاجك</h2>
          </div>
          <span>{filtered.length} منتجات</span>
        </div>

        <div className="grid">
          {filtered.map(p => (
            <article className="card" key={p.id}>
              <div className="productArt">{p.emoji}</div>
              <div className="cardBody">
                <div className="row">
                  <h3>{p.name}</h3>
                  <strong>{p.price.toLocaleString("ar-IQ")} د.ع</strong>
                </div>
                <p>{p.desc}</p>
                <button className="add" onClick={() => addToCart(p)}>+ أضف للطلب</button>
              </div>
            </article>
          ))}
        </div>
      </section>

      {cart.length > 0 && (
        <aside className="cart">
          <div className="cartHead"><b>طلبك</b><span>{cart.length} قطعة</span></div>
          <div className="cartItems">
            {cart.map((p, i) => (
              <div className="cartItem" key={`${p.id}-${i}`}>
                <span>{p.emoji} {p.name}</span>
                <div><b>{p.price.toLocaleString("ar-IQ")}</b><button onClick={() => removeFromCart(i)}>×</button></div>
              </div>
            ))}
          </div>
          <div className="cartTotal"><span>المجموع</span><b>{total.toLocaleString("ar-IQ")} د.ع</b></div>
          <button className="order" onClick={() => alert("تم تجهيز الطلب — اربط هذا الزر بواتساب أو نظام الطلبات عند النشر.")}>تأكيد الطلب</button>
        </aside>
      )}

      {notice && <div className="toast">{notice}</div>}

      {ownerOpen && (
        <div className="overlay" onClick={() => setOwnerOpen(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            {!loggedIn ? (
              <>
                <div className="modalHead"><h2>دخول المالك</h2><button onClick={() => setOwnerOpen(false)}>×</button></div>
                <p className="muted">هذه المنطقة مخصصة لإدارة المنيو.</p>
                <form onSubmit={ownerLogin}>
                  <input autoFocus type="password" placeholder="الرمز السري" value={secret} onChange={e => setSecret(e.target.value)} />
                  <button className="primary">دخول</button>
                </form>
              </>
            ) : (
              <>
                <div className="modalHead"><h2>لوحة المالك</h2><button onClick={() => setOwnerOpen(false)}>×</button></div>
                <form onSubmit={saveProduct} className="adminForm">
                  <input name="name" required placeholder="اسم المنتج" defaultValue={editing?.name || ""} />
                  <select name="category" defaultValue={editing?.category || "قهوة"}>
                    <option>قهوة</option><option>بارد</option><option>حلويات</option>
                  </select>
                  <input name="price" required type="number" placeholder="السعر" defaultValue={editing?.price || ""} />
                  <input name="emoji" placeholder="إيموجي المنتج" defaultValue={editing?.emoji || ""} />
                  <textarea name="desc" placeholder="الوصف" defaultValue={editing?.desc || ""} />
                  <button className="primary">{editing ? "حفظ التعديل" : "إضافة المنتج"}</button>
                  {editing && <button type="button" className="secondary" onClick={() => setEditing(null)}>إلغاء</button>}
                </form>
                <div className="adminList">
                  {products.map(p => (
                    <div className="adminItem" key={p.id}>
                      <span>{p.emoji} {p.name} — {p.price.toLocaleString("ar-IQ")} د.ع</span>
                      <div>
                        <button onClick={() => setEditing(p)}>تعديل</button>
                        <button className="danger" onClick={() => deleteProduct(p.id)}>حذف</button>
                      </div>
                    </div>
                  ))}
                </div>
                <button className="logout" onClick={() => setLoggedIn(false)}>تسجيل خروج</button>
              </>
            )}
          </div>
        </div>
      )}
    </main>
  );
}