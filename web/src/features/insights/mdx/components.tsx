import { ChartEngine } from "@/features/insights/mdx/components/ChartEngine";
import { ImageGallery } from "@/components/ui/image-gallery";
import { SafeImage } from "@/components/ui/safe-image";
import { ContactCta } from "@/features/insights/mdx/components/ContactCta";
import { DataTable } from "@/features/insights/mdx/components/DataTable";
import { ExpertInsight } from "@/features/insights/mdx/components/ExpertInsight";
import { ProjectHighlight } from "@/features/insights/mdx/components/ProjectHighlight";
import { TwoColumn } from "@/features/insights/mdx/components/TwoColumn";
import { Typography } from "@/features/insights/mdx/components/Typography";

export const mdxComponents = {
  ...Typography,
  ChartEngine,
  DataTable,
  SafeImage,
  ExpertInsight,
  ProjectHighlight,
  ContactCta,
  TwoColumn,
  ImageGallery,
};
