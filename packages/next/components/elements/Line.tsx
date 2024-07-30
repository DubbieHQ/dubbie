export const Line = ({
  orientation = "horizontal",
  style = {},
  className = "",
}) => {
  const isHorizontal = orientation === "horizontal";
  const classStyle = isHorizontal ? "h-[1px] w-full" : "w-[1px] h-full";

  return (
    <div
      className={`shrink-0 bg-black opacity-5 ${classStyle} ${className}`}
      style={style}
    />
  );
};
