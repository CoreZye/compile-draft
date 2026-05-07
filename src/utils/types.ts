export interface PageProps {
    subMenu?: { id: string; title: string }[];
    activeSub?: string | null;
    onSubChange?: (id: string) => void;
}