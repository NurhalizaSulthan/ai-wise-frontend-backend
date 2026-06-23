import React from 'react';

// Impor ikon yang Anda butuhkan 
import ArrowDownSvg from "./arrow-down.svg";
import ArrowUpSvg from "./arrow-up.svg";
import BoxIconLineSvg from "./box-line.svg";
import GroupSvg from "./group.svg";
import GridSvg from "./grid.svg";
import MoreDotSVG from "./more-dot.svg";
import CalenderSvg from "./calendar.svg";
import UserCircleSvg from "./user-circle.svg";
import TableSvg from "./table.svg";
import HouseSvg from "./house.svg";
import UserHelmetSvg from "./user-helmet-safety.svg";
import ChevronDownSvg from "./chevron-down.svg";
import HorizontalDotsSvg from "./horizontal-dots.svg";

// Wrapper yang aman dan mematuhi aturan TypeScript
const IconWrapper = ({ src, alt, ...props }: React.ImgHTMLAttributes<HTMLImageElement>) => {
  // Kita pastikan 'src' ditangani dengan benar
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const imageSrc = (src as any)?.src || src;
  return <img src={imageSrc} alt={alt} {...props} />;
};

// Ekspor komponen dengan tipe yang spesifik
export const ArrowDownIcon = (props: React.ImgHTMLAttributes<HTMLImageElement>) => <IconWrapper src={ArrowDownSvg} alt="Grid" {...props} />;
export const ArrowUpIcon = (props: React.ImgHTMLAttributes<HTMLImageElement>) => <IconWrapper src={ArrowUpSvg} alt="Grid" {...props} />;
export const BoxIconLine = (props: React.ImgHTMLAttributes<HTMLImageElement>) => <IconWrapper src={BoxIconLineSvg} alt="Grid" {...props} />;
export const GroupIcon = (props: React.ImgHTMLAttributes<HTMLImageElement>) => <IconWrapper src={GroupSvg} alt="Grid" {...props} />;


export const MoreDotIcon = (props: React.ImgHTMLAttributes<HTMLImageElement>) => <IconWrapper src={MoreDotSVG} alt="Grid" {...props} />;
export const CalenderIcon = (props: React.ImgHTMLAttributes<HTMLImageElement>) => <IconWrapper src={CalenderSvg} alt="Grid" {...props} />;
export const UserHelmetIcon = (props: React.ImgHTMLAttributes<HTMLImageElement>) => <IconWrapper src={UserHelmetSvg} alt="Grid" {...props} />;
export const HouseIcon = (props: React.ImgHTMLAttributes<HTMLImageElement>) => <IconWrapper src={HouseSvg} alt="Grid" {...props} />;
export const GridIcon = (props: React.ImgHTMLAttributes<HTMLImageElement>) => <IconWrapper src={GridSvg} alt="Grid" {...props} />;
export const UserCircleIcon = (props: React.ImgHTMLAttributes<HTMLImageElement>) => <IconWrapper src={UserCircleSvg} alt="User" {...props} />;
export const TableIcon = (props: React.ImgHTMLAttributes<HTMLImageElement>) => <IconWrapper src={TableSvg} alt="Table" {...props} />;
export const ChevronDownIcon = (props: React.ImgHTMLAttributes<HTMLImageElement>) => <IconWrapper src={ChevronDownSvg} alt="Chevron" {...props} />;
export const HorizontaLDots = (props: React.ImgHTMLAttributes<HTMLImageElement>) => <IconWrapper src={HorizontalDotsSvg} alt="Dots" {...props} />;