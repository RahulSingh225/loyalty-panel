// app/components/DashboardStats.tsx
'use client';

import { useEffect } from 'react';
import { toast } from 'react-toastify';

interface DashboardStatsProps {
  total_retailers: number;
  total_distributors: number;
  total_salesperson: number;
  error?: string;
}

export default function DashboardStats({ total_retailers, total_distributors, total_salesperson, error }: DashboardStatsProps) {
  useEffect(() => {
    if (error) {
      toast.error(error, {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: 'colored',
      });
    }
  }, [error]);

  return (
    <div className="stats stats-horizontal bg-base-100 text-base-content shadow rounded-box">
      <div className="stat px-4 py-3 md:px-6 md:py-4 hover:bg-base-200 transition-colors duration-300">
        <div className="stat-title text-sm md:text-base">Total Retailers</div>
        <div className="stat-value text-xl md:text-2xl">{total_retailers.toLocaleString()}</div>
      </div>
      <div className="stat px-4 py-3 md:px-6 md:py-4 hover:bg-base-200 transition-colors duration-300">
        <div className="stat-title text-sm md:text-base">Total Agents</div>
        <div className="stat-value text-xl md:text-2xl">{total_distributors.toLocaleString()}</div>
      </div>
      <div className="stat px-4 py-3 md:px-6 md:py-4 hover:bg-base-200 transition-colors duration-300">
        <div className="stat-title text-sm md:text-base">Total Salesperson</div>
        <div className="stat-value text-xl md:text-2xl">{total_salesperson.toLocaleString()}</div>
      </div>
    </div>
  );
}