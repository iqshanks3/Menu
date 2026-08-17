const KEY = "mzaj-cafe-v2";
const defaultData = {
  site:{name:"مزاج كافيه",title:"مزاجك يبدأ من هنا",desc:"قهوة مختارة، حلويات طازجة، وتفاصيل تخلي كل زيارة تجربة.",currency:"د.ع"},
  code:"2580",
  categories:["الكل","قهوة","بارد","حلويات"],
  products:[
    {id:1,name:"كابتشينو",category:"قهوة",price:3500,emoji:"☕",image:"",desc:"إسبريسو مع حليب ورغوة ناعمة"},
    {id:2,name:"لاتيه",category:"قهوة",price:4000,emoji:"🥛",image:"",desc:"قهوة ناعمة بالحليب المبخر"},
    {id:3,name:"آيس كوفي",category:"بارد",price:4500,emoji:"🧊",image:"",desc:"قهوة باردة منعشة مع الثلج"},
    {id:4,name:"موهيتو",category:"بارد",price:4000,emoji:"🍋",image:"",desc:"ليمون ونعناع وصودا"},
    {id:5,name:"تشيز كيك",category:"حلويات",price:5000,emoji:"🍰",image:"",desc:"قطعة تشيز كيك كريمية"},
    {id:6,name:"براوني",category:"حلويات",price:3500,emoji:"🍫",image:"",desc:"براوني شوكولاتة غني"}
  ]
};

let data = load();
let selectedCategory="الكل", cart=[], loggedIn=false;

const $=s=>document.querySelector(s), $$=s=>document.querySelectorAll(s);
function load(){try{return {...defaultData,...JSON.parse(localStorage.getItem(KEY)||"{}")}}catch{return structuredClone(defaultData)}}
function save(){localStorage.setItem(KEY,JSON.stringify(data))}
function money(n){return Number(n).toLocaleString("ar-IQ")+" "+data.site.currency}
function toast(msg){const t=$("#toast");t.textContent=msg;t.classList.add("show");setTimeout(()=>t.classList.remove("show"),2200)}

function renderSite(){
  $("#brandName").textContent=data.site.name; $("#heroTitle").textContent=data.site.title; $("#heroDesc").textContent=data.site.desc;
  $("#siteName").value=data.site.name; $("#siteTitle").value=data.site.title; $("#siteDesc").value=data.site.desc; $("#siteCurrency").value=data.site.currency;
}
function renderCategories(){
  const cats=data.categories.filter(Boolean);
  $("#categories").innerHTML=cats.map(c=>`<button class="category ${c===selectedCategory?"active":""}" data-cat="${esc(c)}">${esc(c)}</button>`).join("");
  $("#pCategory").innerHTML=cats.filter(c=>c!=="الكل").map(c=>`<option>${esc(c)}</option>`).join("");
  $("#adminCategories").innerHTML=data.categories.filter(c=>c!=="الكل").map(c=>`<div class="admin-category">${esc(c)} <button data-delcat="${esc(c)}">×</button></div>`).join("");
}
function renderProducts(){
  const q=$("#search").value.trim().toLowerCase();
  const list=data.products.filter(p=>(selectedCategory==="الكل"||p.category===selectedCategory)&&(`${p.name} ${p.desc}`.toLowerCase().includes(q)));
  $("#count").textContent=list.length+" منتجات"; $("#empty").classList.toggle("hidden",list.length!==0);
  $("#products").innerHTML=list.map(p=>`<article class="product glass">
    <div class="product-art">${p.image?`<img src="${esc(p.image)}" alt="">`:`<span>${esc(p.emoji||"☕")}</span>`}</div>
    <div class="product-info"><div class="product-row"><h3>${esc(p.name)}</h3><span class="price">${money(p.price)}</span></div>
    <p>${esc(p.desc||"منتج لذيذ من الكافيه")}</p><button class="add" data-add="${p.id}">+ أضف للطلب</button></div></article>`).join("");
}
function renderAdmin(){
  $("#adminProducts").innerHTML=data.products.map(p=>`<div class="admin-item"><span>${esc(p.emoji||"☕")} <b>${esc(p.name)}</b> — ${money(p.price)}</span><div class="actions"><button class="edit" data-edit="${p.id}">تعديل</button><button class="delete" data-delete="${p.id}">حذف</button></div></div>`).join("");
}
function renderCart(){
  $("#cartBadge").textContent=cart.length;
  $("#cartItems").innerHTML=cart.map((p,i)=>`<div class="cart-item"><span>${esc(p.emoji||"☕")} ${esc(p.name)}</span><span>${money(p.price)} <button data-remove="${i}">×</button></span></div>`).join("");
  $("#cartTotal").textContent=money(cart.reduce((s,p)=>s+p.price,0));
}
function refresh(){save();renderSite();renderCategories();renderProducts();renderAdmin();renderCart()}
function esc(v){return String(v??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]))}

$("#search").addEventListener("input",renderProducts);
$("#categories").addEventListener("click",e=>{const b=e.target.closest("[data-cat]");if(!b)return;selectedCategory=b.dataset.cat;renderCategories();renderProducts()});
$("#products").addEventListener("click",e=>{const b=e.target.closest("[data-add]");if(!b)return;const p=data.products.find(x=>x.id==b.dataset.add);if(p){cart.push(p);renderCart();toast("تمت إضافة "+p.name+" إلى الطلب");}});
$("#cartItems").addEventListener("click",e=>{const b=e.target.closest("[data-remove]");if(b){cart.splice(+b.dataset.remove,1);renderCart()}});
$("#cartFab").onclick=()=>$("#cart").classList.add("open"); $("#cartClose").onclick=()=>$("#cart").classList.remove("open");
$("#checkout").onclick=()=>{if(!cart.length)return toast("السلة فارغة");alert("تم تجهيز الطلب. اربط هذا الزر بواتساب أو نظام الطلبات عند النشر.")};

$("#ownerOpen").onclick=()=>{$("#ownerModal").classList.remove("hidden");if(loggedIn)showAdmin();};
$("#ownerClose").onclick=()=>$("#ownerModal").classList.add("hidden");
$("#ownerModal").addEventListener("click",e=>{if(e.target.id==="ownerModal")$("#ownerModal").classList.add("hidden")});
$("#loginBtn").onclick=()=>{if($("#loginCode").value===data.code){loggedIn=true;$("#loginCode").value="";showAdmin();toast("تم الدخول إلى لوحة المالك")}else toast("الرمز السري غير صحيح")};
function showAdmin(){$("#loginView").classList.add("hidden");$("#adminView").classList.remove("hidden");renderAdmin()}
$("#logoutBtn").onclick=()=>{loggedIn=false;$("#adminView").classList.add("hidden");$("#loginView").classList.remove("hidden")};

$$(".tab").forEach(t=>t.onclick=()=>{$$(".tab").forEach(x=>x.classList.remove("active"));$$(".tab-content").forEach(x=>x.classList.add("hidden"));t.classList.add("active");$("#"+t.dataset.tab).classList.remove("hidden")});

$("#productForm").onsubmit=e=>{
 e.preventDefault(); const id=$("#editId").value;
 const obj={id:id?Number(id):Date.now(),name:$("#pName").value.trim(),category:$("#pCategory").value,price:Number($("#pPrice").value),emoji:$("#pEmoji").value.trim()||"☕",image:$("#pImage").value.trim(),desc:$("#pDesc").value.trim()};
 if(id)data.products=data.products.map(p=>p.id===Number(id)?obj:p);else data.products.unshift(obj);
 resetProductForm();refresh();toast(id?"تم تعديل المنتج":"تمت إضافة المنتج");
};
$("#newProduct").onclick=resetProductForm;$("#cancelEdit").onclick=resetProductForm;
function resetProductForm(){$("#editId").value="";$("#pName").value="";$("#pPrice").value="";$("#pEmoji").value="";$("#pImage").value="";$("#pDesc").value="";$("#saveProduct").textContent="إضافة المنتج";$("#cancelEdit").classList.add("hidden")}
$("#adminProducts").addEventListener("click",e=>{
 const edit=e.target.closest("[data-edit]"), del=e.target.closest("[data-delete]");
 if(edit){const p=data.products.find(x=>x.id==edit.dataset.edit);if(!p)return;$("#editId").value=p.id;$("#pName").value=p.name;$("#pCategory").value=p.category;$("#pPrice").value=p.price;$("#pEmoji").value=p.emoji||"";$("#pImage").value=p.image||"";$("#pDesc").value=p.desc||"";$("#saveProduct").textContent="حفظ التعديل";$("#cancelEdit").classList.remove("hidden")}
 if(del&&confirm("حذف المنتج؟")){data.products=data.products.filter(x=>x.id!=del.dataset.delete);refresh();toast("تم حذف المنتج")}
});
$("#addCategory").onclick=()=>{const c=$("#newCategory").value.trim();if(!c)return;if(data.categories.includes(c))return toast("التصنيف موجود");data.categories.push(c);$("#newCategory").value="";refresh();toast("تمت إضافة التصنيف")};
$("#adminCategories").addEventListener("click",e=>{const b=e.target.closest("[data-delcat]");if(!b)return;const c=b.dataset.delcat;if(confirm("حذف التصنيف؟")){data.categories=data.categories.filter(x=>x!==c);data.products.forEach(p=>{if(p.category===c)p.category=data.categories.find(x=>x!=="الكل")||"الكل"});if(selectedCategory===c)selectedCategory="الكل";refresh()}});

$("#siteForm").onsubmit=e=>{e.preventDefault();data.site={name:$("#siteName").value.trim()||"مزاج كافيه",title:$("#siteTitle").value.trim(),desc:$("#siteDesc").value.trim(),currency:$("#siteCurrency").value.trim()||"د.ع"};refresh();toast("تم حفظ إعدادات الموقع")};
$("#securityForm").onsubmit=e=>{e.preventDefault();const old=$("#oldCode").value,n=$("#newCode").value,c=$("#confirmCode").value;if(old!==data.code)return toast("الرمز الحالي غير صحيح");if(n.length<4)return toast("الرمز الجديد قصير");if(n!==c)return toast("تأكيد الرمز غير مطابق");data.code=n;save();e.target.reset();toast("تم تغيير الرمز السري")};

renderSite();renderCategories();renderProducts();renderAdmin();renderCart();