import Sidebar from "@/components/Sidebar";

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <div className="md:flex">
        <Sidebar />
        <article className="min-w-0 flex-1 md:pl-10">{children}</article>
      </div>
    </div>
  );
}
