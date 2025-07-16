
'use client'
import Link from "next/link";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
export const DashboardCard = ({ href, title, description }: { href: string; title: string; description: string }) => {
  const handleClick = () => {
    toast.info(`Navigating to ${title}`, {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: "colored",
    });
  };

  return (
    <Link href={href} onClick={handleClick} className="card bg-base-100 shadow-xl hover:bg-base-200 transition-all duration-300 hover:scale-105">
      <div className="card-body">
        <h2 className="card-title text-primary">{title}</h2>
        <p className="text-base-content/70">{description}</p>
        <div className="card-actions justify-end">
          <button className="btn btn-primary btn-sm">View Report</button>
        </div>
      </div>
    </Link>
  );
};
