'use client';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Image from 'next/image';
import type { PricingBlockData } from "@/features/projects/schemas";

export default function PricingBlock({ data }: { data: PricingBlockData }) {
  const formatPrice = (p: number) => p >= 1000000000 ? `${(p / 1000000000).toFixed(1)} Tỷ` : `${(p / 1000000).toFixed(0)} Tr`;
  const dataSafe = data
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div>
          <h2 className="text-4xl font-serif mb-4">{dataSafe.heading}</h2>
          <p className="text-slate-500 mb-8 font-light">{dataSafe.subHeading}</p>
          
          <div className="border rounded-sm overflow-hidden shadow-sm">
            <Table>
              <TableHeader className="bg-slate-50">
                <TableRow>
                  <TableHead className="text-[10px] uppercase tracking-widest font-bold">Loại hình</TableHead>
                  <TableHead className="text-[10px] uppercase tracking-widest font-bold">Diện tích</TableHead>
                  <TableHead className="text-[10px] uppercase tracking-widest font-bold">Giá từ</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {dataSafe.priceList.map((item, i) => (
                  <TableRow key={i}>
                    <TableCell className="font-medium">{item.unitType}</TableCell>
                    <TableCell className="text-slate-500 text-sm">{item.areaRange}</TableCell>
                    <TableCell className="font-serif text-luxury-bronze">{formatPrice(item.minPrice)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
        
        {dataSafe.image && (
          <div className="relative aspect-square lg:aspect-4/5 overflow-hidden">
            <Image src={dataSafe.image} alt={dataSafe.heading} fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
          </div>
        )}
      </div>
    </section>
  );
}
