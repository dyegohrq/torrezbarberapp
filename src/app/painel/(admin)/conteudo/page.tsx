import { ContentManager } from "@/app/painel/(admin)/_components/content-manager";
import { getAdminCatalog } from "@/app/painel/(admin)/_data-access/get-admin";

export default async function ConteudoPage() {
  const catalog = await getAdminCatalog();

  if (!catalog.business) {
    return <p className="text-[#9CA3AF]">Não foi possível carregar o conteúdo.</p>;
  }

  return (
    <ContentManager
      catalog={{
        business: catalog.business,
        hours: catalog.hours,
        services: catalog.services,
        products: catalog.products,
        portfolio: catalog.portfolio,
      }}
    />
  );
}
