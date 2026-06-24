import React, { useState } from "react";

const ChartTab: React.FC = () => {
  const [selected, setSelected] = useState<
    "optionOne" | "optionTwo" | "optionThree"
  >("optionOne");

  const getButtonClass = (option: "optionOne" | "optionTwo" | "optionThree") =>
    selected === option
      ? "shadow-lg text-primary dark:text-primary bg-primary/40 dark:bg-primary/20"
      : "text-muted dark:text-muted";

  return (
    <div className="flex items-center gap-0.5 rounded-lg bg-muted/5 p-0.5 dark:bg-surface ">
      <button
        onClick={() => setSelected("optionOne")}
        className={`px-3 py-2 font-medium w-full rounded-md text-theme-sm cursor-pointer hover:text-primary hover:bg-primary/10 dark:hover:text-primary ${getButtonClass(
          "optionOne"
        )}`}
      >
        Monthly
      </button>

      <button
        onClick={() => setSelected("optionTwo")}
        className={`px-3 py-2 font-medium w-full rounded-md cursor-pointer hover:text-primary hover:bg-primary/10 dark:hover:text-primary ${getButtonClass(
          "optionTwo"
        )}`}
      >
        Quarterly
      </button>

      <button
        onClick={() => setSelected("optionThree")}
        className={`px-3 py-2 font-medium w-full rounded-md cursor-pointer hover:text-primary hover:bg-primary/10 dark:hover:text-primary ${getButtonClass(
          "optionThree"
        )}`}
      >
        Annually
      </button>
    </div>
  );
};

export default ChartTab;
