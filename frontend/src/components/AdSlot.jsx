/**
 * Placeholder para Google AdSense.
 * Quando a conta AdSense estiver aprovada, substituir o conteúdo interno
 * pelo <ins class="adsbygoogle"> correspondente e carregar o script
 * assíncrono no index.html.
 */
export default function AdSlot({ label = "Anúncio", style = {} }) {
  return (
    <div className="ad-slot" style={{ minHeight: 90, ...style }}>
      {label}
    </div>
  );
}
