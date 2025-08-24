import Terminal from "@/components/Terminal";

export const metadata = {
  title: "Terminal Demo",
};

export default function TerminalPage() {
  return (
    <div className="section">
      <div className="container max-w-4xl">
        <h1 className="text-2xl font-bold mb-6">واجهة طرفية تفاعلية (تجريبية)</h1>
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">يمكنك تجربة بعض الأوامر مثل: <code className="font-mono">help</code>, <code className="font-mono">ls halls</code>, <code className="font-mono">hall al-yakout</code>, <code className="font-mono">clear</code>.</p>
        <Terminal
          dir="rtl"
          prompt="مستخدم@منصبات:$"
          initial={[{ command: "help", output: "اكتب الأوامر التالية: help, ls halls, hall <slug>, clear" }]}
        />
      </div>
    </div>
  );
}
