const OverviewCard = (props) => {
  return (
    <div className="bg-white p-5 rounded-[8px] shadow-[0_2px_6px_0_rgba(26,24,30,0.1)] flex flex-col items-start gap-[16px]">
      <h3 className="text-[#4D4D4D] text-[16px] font-normal">{props.title}</h3>
      <p className="text-[#4D4D4D] text-[32px] font-medium">{props.value}</p>
    </div>
  );
};

export default OverviewCard;
