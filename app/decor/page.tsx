export default function DecorPage() {
  return (
    <section className="section">
      <div className="container">
        <h2 className="font-bold text-lg mb-1">مزودو الديكور</h2>
        <p className="text-gray-600 mb-4">حزم قاعات ومسرح، رجالي/نسائي.</p>
        <div className="grid-3">
          {["إبداع الديكور","لمسات الورد","خشب وفن"].map((t,i)=>(
            <article key={i} className="card">
              <div className="h-40 bg-center bg-cover" style={{backgroundImage:"url(https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1600&auto=format&fit=crop)"}} />
              <div className="p-4">
                <h3 className="font-bold">{t}</h3>
                <p className="text-gray-500 text-sm mt-1">باقة الورد من 3,800 ر.س</p>
                <a href="#" className="btn btn-ghost mt-3">عرض الباقة</a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
