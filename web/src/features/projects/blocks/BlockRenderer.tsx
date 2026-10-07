'use client';

import type { ProjectBlock } from '@/features/projects/schemas';
import { FacilitiesBlock } from './FacilitiesBlock';
import { FloorPlanBlock } from './FloorPlanBlock';
import GalleryBlock from './GalleryBlock';
import LocationBlock from './LocationBlock';
import PricingBlock from './PricingBlock';
import SalesPolicyBlock from './SalesPolicyBlock';
import TimelineBlock from './TimelineBlock';

export default function BlockRenderer({ blocks }: { blocks: readonly ProjectBlock[] }) {
  if (!blocks || blocks.length === 0) return null;

  return (
    <div className="flex flex-col">
      {blocks.map((block, index) => {
        const key = block.id || `${block.type}-${index}`;

        switch (block.type) {
          case 'IMAGE_GALLERY':
            return <GalleryBlock key={key} data={block.data} />;

          case 'FACILITIES_GRID':
            return <FacilitiesBlock key={key} data={block.data} />;

          case 'LOCATION':
          case 'LOCATION_MAP':
            return <LocationBlock key={key} data={block.data} />;

          case 'FLOOR_PLAN':
            return <FloorPlanBlock key={key} data={block.data} />;

          case 'PRICING_TABLE':
            return <PricingBlock key={key} data={block.data} />;

          case 'SALES_POLICY':
            return <SalesPolicyBlock key={key} data={block.data} />;

          case 'TIMELINE_PROGRESS':
            return <TimelineBlock key={key} data={block.data} />;

          default:
            return null;
        }
      })}
    </div>
  );
}
