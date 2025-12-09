import React from "react";

interface TableProps {
  revealed: boolean;
  averageVote: string | null;
}

export const Table: React.FC<TableProps> = ({ revealed, averageVote }) => {
  return (
    <div className="w-[600px] h-[300px] bg-blue-900/50 rounded-[100px] border-8 border-blue-900 flex flex-col items-center justify-center shadow-2xl backdrop-blur-sm relative">
      {revealed && averageVote && (
        <div className="absolute top-4 bg-blue-600 px-4 py-2 rounded-full shadow-lg border border-blue-400">
          <span className="text-sm text-blue-100 mr-2">Average:</span>
          <span className="text-2xl font-bold text-white">{averageVote}</span>
        </div>
      )}

      <div className="text-blue-200 text-xl font-medium">
        {revealed ? "Votes Revealed!" : "Pick your cards!"}
      </div>
    </div>
  );
};
