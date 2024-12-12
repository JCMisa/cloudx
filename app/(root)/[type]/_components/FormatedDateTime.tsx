import { cn, formatDateTime } from "@/lib/utils";
import React from "react";

const FormatedDateTime = ({
  date,
  className,
}: {
  date: string;
  className?: string;
}) => {
  return (
    <p className={cn("body-1 text-gray-400", className)}>
      {formatDateTime(date)}
    </p>
  );
};

export default FormatedDateTime;
