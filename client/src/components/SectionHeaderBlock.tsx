import React from 'react';

interface SectionHeaderBlockProps {
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
}

export const SectionHeaderBlock: React.FC<SectionHeaderBlockProps> = ({
  title,
  subtitle,
  children,
}) => {
  return (
    <div className="w-full flex flex-col md:flex-row md:items-center justify-between gap-4 border-b-2 border-bismillah-primaryGreen pb-0">
      <div className="min-w-0">
        <div className="bg-bismillah-primaryGreen text-white font-semibold text-lg px-6 py-2 rounded-t-sharp inline-block">
          {title}
        </div>
        {subtitle && (
          <p className="text-xs text-bismillah-textMuted font-medium mt-2">{subtitle}</p>
        )}
      </div>
      {children && (
        <div className="flex flex-wrap items-center gap-3 shrink-0">{children}</div>
      )}
    </div>
  );
};
