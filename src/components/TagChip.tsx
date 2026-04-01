"use client";

import Link from "next/link";
import { getTagColors, getTagIcon } from "@/lib/tag-colors";
import { useState } from "react";

export default function TagChip({
  slug,
  name,
  showIcon = false,
  variant = "default"
}: {
  slug: string;
  name: string;
  showIcon?: boolean;
  variant?: "default" | "solid" | "gradient";
}) {
  const [isHovered, setIsHovered] = useState(false);
  const colors = getTagColors(slug);
  const icon = getTagIcon(slug);

  const getVariantClasses = () => {
    switch (variant) {
      case "solid":
        return `${colors.bgColor} ${colors.textColor} border-transparent`;
      case "gradient":
        return `bg-gradient-to-r ${colors.color} text-white border-transparent`;
      default:
        return `border ${colors.borderColor} ${colors.textColor} hover:${colors.bgColor}`;
    }
  };

  return (
    <Link
      href={`/tags/${slug}`}
      className={`
        inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium
        transition-all duration-200 transform hover:scale-105
        ${getVariantClasses()}
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {showIcon && <span className="text-sm">{icon}</span>}
      #{name}
    </Link>
  );
}
