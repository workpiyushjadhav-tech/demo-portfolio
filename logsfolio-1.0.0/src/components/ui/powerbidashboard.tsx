import React from 'react';

export function PowerBiDashboard() {
  return (
    <div className="w-full my-8 flex flex-col items-center justify-center">
      <h2 className="text-2xl font-bold mb-4 text-center">Project Dashboard</h2>
      
      {/* Responsive Wrapper to maintain standard Power BI 16:9 Aspect Ratio */}
      <div className="relative w-full max-w-4xl overflow-hidden rounded-lg border border-border shadow-md aspect-[16/9.96]">
        <iframe
          title="Dashboard"
          className="absolute top-0 left-0 w-full h-full"
          src="https://app.powerbi.com/view?r=eyJrIjoiNjdiMDA4YzctNTY0Yi00NmIzLTk5N2ItODg4OWE2ZjlhNWFhIiwidCI6ImVmOTg4MTgyLTM1M2EtNDIzYS05NDUyLTQ3YTc1ZjVjNmFlNyJ9"
          frameBorder="0"
          allowFullScreen={true}
        />
      </div>
    </div>
  );
}
