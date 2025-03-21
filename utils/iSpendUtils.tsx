import { SectionData } from "@/src/components/CategoryEditor";

// returns a converted Record<string, string[]> to SectionData[]
export const transformCatsToSectionData = ( categoriesData: Record<string, string[]> ) : SectionData[] => {
    return Object.entries(categoriesData).map(([category, items]) => ({
        title: category,
        data: items.map(item => ({ category, name: item })),
        collapsed: true,
        showFooter: false
    }));
};
  