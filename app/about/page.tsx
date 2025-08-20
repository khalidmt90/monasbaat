import { FadeIn, Stagger, Item } from "@/components/Animated";

export default function AboutPage() {
  return (
    <section className="section">
      <div className="container">
        <FadeIn>
          <h1 className="text-2xl font-bold mb-2">من نحن</h1>
          <p className="text-gray-600 mb-6">منصة سعودية تربط قاعات الأفراح بجميع مزودي الخدمات: الضيافة، الديكور، التصوير، الضيافة الساخنة (قهوة وشاي)، مع تجربة حجز سهلة وشفافة.</p>
        </FadeIn>

        <Stagger>
          <div className="grid-3">
            {[
              {icon:"fa-bolt", title:"سريعة وسلسة", text:"بحث وتصفية واطّلاع على الأسعار بوضوح."},
              {icon:"fa-shield-halved", title:"موثوقة", text:"تحقق إداري، مراجعات بعد المناسبة، وسياسات واضحة."},
              {icon:"fa-chart-line", title:"تنمو معك", text:"حلول للشركات، تقارير، وربط مستقبلي بالمدفوعات."},
            ].map((f,i)=>(
              <Item key={i}>
                <div className="card p-5">
                  <div className="text-2xl"><i className={`fa-solid ${f.icon}`} /></div>
                  <h3 className="font-bold mt-2">{f.title}</h3>
                  <p className="text-gray-600 mt-1">{f.text}</p>
                </div>
              </Item>
            ))}
          </div>
        </Stagger>
      </div>
    </section>
  );
}
