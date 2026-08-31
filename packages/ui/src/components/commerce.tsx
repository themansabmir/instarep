import { Badge } from "@repo/ui/components/badge";
import { Button } from "@repo/ui/components/button";
import { MediaThumbnail } from "@repo/ui/components/media";
import { cn } from "@repo/ui/lib/utils";

export interface ProductCardProps {
  className?: string;
  image?: string;
  name: string;
  price: string;
  discount?: string;
  rating?: string;
  affiliate?: boolean;
  brand?: string;
  commission?: string;
  cta?: string;
  onCta?: () => void;
}

function ProductMeta({
  affiliate,
  commission,
  brand,
}: Pick<ProductCardProps, "affiliate" | "commission" | "brand">) {
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {affiliate ? <Badge variant="revenue">Affiliate</Badge> : null}
      {commission ? <span className="text-caption text-muted-foreground">{commission}</span> : null}
      {brand ? <span className="text-caption text-muted-foreground">{brand}</span> : null}
    </div>
  );
}

function ProductCard({
  className,
  image,
  name,
  price,
  discount,
  rating,
  affiliate,
  brand,
  commission,
  cta = "View product",
  onCta,
}: ProductCardProps) {
  return (
    <article
      className={cn("border-border bg-card shadow-xs overflow-hidden rounded-xl border", className)}
    >
      <MediaThumbnail src={image} alt={name} ratio="1/1" />
      <div className="space-y-3 p-4">
        <div>
          <p className="font-medium">{name}</p>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-sm font-semibold">{price}</span>
            {discount ? (
              <span className="text-caption text-muted-foreground line-through">{discount}</span>
            ) : null}
            {rating ? <span className="text-caption text-muted-foreground">{rating}</span> : null}
          </div>
        </div>
        <ProductMeta affiliate={affiliate} commission={commission} brand={brand} />
        <Button size="sm" fullWidth onClick={onCta}>
          {cta}
        </Button>
      </div>
    </article>
  );
}

function ProductMiniCard({
  className,
  image,
  name,
  price,
  commission,
}: Pick<ProductCardProps, "className" | "image" | "name" | "price" | "commission">) {
  return (
    <div
      className={cn(
        "border-border bg-card flex items-center gap-3 rounded-lg border p-2.5",
        className,
      )}
    >
      <MediaThumbnail src={image} alt={name} ratio="1/1" className="size-14 rounded-md" />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">{name}</p>
        <p className="text-caption text-muted-foreground">
          {price}
          {commission ? ` · ${commission}` : ""}
        </p>
      </div>
    </div>
  );
}

function OfferCard(props: ProductCardProps) {
  return <ProductCard {...props} />;
}

function AffiliateCard(props: ProductCardProps) {
  return <ProductCard affiliate {...props} />;
}

function RecommendationCard({
  className,
  reason,
  ...props
}: ProductCardProps & { reason?: string }) {
  return (
    <div className={cn("space-y-2", className)}>
      {reason ? <p className="text-caption text-muted-foreground">{reason}</p> : null}
      <ProductCard {...props} />
    </div>
  );
}

export { ProductCard, ProductMiniCard, OfferCard, AffiliateCard, RecommendationCard };
